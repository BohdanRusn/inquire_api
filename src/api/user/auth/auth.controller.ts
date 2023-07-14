import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Inject,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { User } from "@/api/user/user.entity";
import { LoginDto, RegisterDto } from "./auth.dto";
import { AuthService } from "./auth.service";
import { Request } from "express";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
  @Inject(AuthService)
  private readonly service: AuthService;

  @Post("register")
  @UseInterceptors(ClassSerializerInterceptor)
  private register(@Body() body: RegisterDto): Promise<User | never> {
    return this.service.register(body);
  }

  @Post("login")
  private login(
    @Body() body: LoginDto,
  ): Promise<{ user: Omit<User, "password">; token: string }> {
    return this.service.login(body);
  }

  @Post("refresh")
  @UseGuards(AuthGuard("jwt"))
  private refresh(
    @Req() { user }: Request,
  ): Promise<{ user: Omit<User, "password">; token: string }> {
    return this.service.refresh(<User>user);
  }
}
