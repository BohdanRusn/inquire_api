import {
  Body,
  Controller,
  forwardRef,
  Inject,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local.guard";
import { CreateUser, LoginUser, User } from "@/user/user.entity";
import { Args, Mutation, Resolver } from "@nestjs/graphql";

@Resolver(() => User)
@Controller()
export class AuthController {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Mutation(() => User, { nullable: true })
  async login(@Args("user") user: LoginUser) {
    console.log(this.authService, "authService");
    return this.authService.logIn(user);
  }

  @Mutation(() => User, { nullable: true })
  async register(@Args("user") user: CreateUser) {
    return this.authService.register(user);
  }
}
