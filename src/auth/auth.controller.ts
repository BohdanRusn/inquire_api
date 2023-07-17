import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local.guard";
import { CreateUser, User } from "@/user/user.entity";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Request() req) {
    return this.authService.login(req.user as User);
  }

  @Post("/register")
  register(@Body() dto: CreateUser) {
    return this.authService.register(dto);
  }
}
