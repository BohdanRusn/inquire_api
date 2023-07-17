import {
  ClassSerializerInterceptor,
  Inject,
  Req,
  UseInterceptors,
} from "@nestjs/common";
import { Request } from "express";
import { UpdateUserInfo, User } from "./user.entity";
import { UserService } from "./user.service";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

@Resolver(() => User)
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Query(() => User, { nullable: true })
  async post(@Args("userId") id: number): Promise<User> {
    const post = await this.userService.findUserById(id);
    if (!post) {
      throw new Error("User not found");
    } else {
      return post;
    }
  }

  @Mutation(() => User)
  @UseInterceptors(ClassSerializerInterceptor)
  private updateUser(
    @Args("userInfo") body: UpdateUserInfo,
    @Req() req: Request,
  ): Promise<User> {
    return this.userService.updateUser(body, req);
  }
}
