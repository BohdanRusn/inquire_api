import * as bcrypt from "bcrypt";
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "@/user/user.service";
import { CreateUser, LoginUser } from "@/user/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUser) {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const { password, ...createdUser } = await this.usersService.create({
        ...dto,
        password: hashedPassword,
      });
      const token = this.jwtService.sign({
        id: createdUser.id,
        email: createdUser.email,
      });

      return { ...createdUser, token };
    } catch (error) {
      throw new ForbiddenException("Failed registration!");
    }
  }

  async logIn(loginUser: LoginUser) {
    try {
      const user = await this.usersService.findByEmail(loginUser.email);
      const isValidPass = await bcrypt.compare(
        loginUser.password,
        user.password,
      );
      if (!isValidPass) throw true;
      const { password, ...result } = user;
      const token = this.jwtService.sign({
        id: result.id,
        email: result.email,
      });
      return { ...result, token };
    } catch {
      throw new HttpException(
        "Not valid login or password!",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
