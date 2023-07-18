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

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    const isValidPass = await bcrypt.compare(password, user.password);

    if (!isValidPass) {
      throw new HttpException(
        "Not valid login or password!",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (isValidPass) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

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
      console.log(error);
      throw new ForbiddenException("Failed registration!");
    }
  }

  async logIn(user: LoginUser) {
    try {
      const userEntity = await this.usersService.findByEmail(user.email);
      const { password, ...result } = userEntity;
      const token = this.jwtService.sign({
        id: result.id,
        email: result.email,
      });

      if (!result) {
        throw new HttpException("User not found!", HttpStatus.NOT_FOUND);
      }

      return { ...result, token };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException("Failed login!");
    }
  }
}
