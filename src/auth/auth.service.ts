import * as bcrypt from "bcrypt";
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
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
      const user = await this.usersService.findByEmail(dto.email);
      if (user) {
        throw new Error();
      }
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
      throw new ForbiddenException(
        "User already exists. Please choose a different username or email!",
      );
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

  async fetchCurrentUser(token: string) {
    try {
      const verifiedUser = await this.jwtService.verifyAsync(token);
      if (verifiedUser) {
        return await this.usersService.findByEmail(verifiedUser.email);
      }
      throw new Error();
    } catch (e) {
      throw new UnauthorizedException("ReAuth");
    }
  }
}
