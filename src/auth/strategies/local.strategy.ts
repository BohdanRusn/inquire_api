import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { User } from "@/user/user.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    // @Inject(forwardRef(() => AuthModule))
    private authService: AuthService,
  ) {
    super({
      usernameField: "email",
    });
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(email, password);
    console.log(9999);
    if (!user) {
      throw new UnauthorizedException("Wrong login or password");
    }

    return user;
  }
}
