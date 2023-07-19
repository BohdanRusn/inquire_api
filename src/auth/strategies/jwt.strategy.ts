import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "@/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
    });
  }
  async validate(payload: { id: string }) {
    const user = await this.userService.findUserById(+payload.id);
    if (!user) {
      throw new UnauthorizedException("No access!");
    }

    return {
      id: user.id,
    };
  }
}
