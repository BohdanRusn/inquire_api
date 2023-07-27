import { forwardRef, Inject } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUser, LoginUser, User } from "@/user/user.entity";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

@Resolver(() => User)
export class AuthController {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => User, { nullable: true })
  async login(@Args("user") user: LoginUser) {
    return this.authService.logIn(user);
  }

  @Mutation(() => User, { nullable: true })
  async register(@Args("user") user: CreateUser) {
    return this.authService.register(user);
  }

  @Query(() => User, { nullable: true })
  async getCurUser(@Args("token") token: string) {
    return this.authService.fetchCurrentUser(token);
  }
}
