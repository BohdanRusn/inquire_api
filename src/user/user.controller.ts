import {
  ClassSerializerInterceptor,
  Inject,
  UseInterceptors,
} from "@nestjs/common";
import { UpdateUserInfo, User } from "./user.entity";
import { UserService } from "./user.service";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserId } from "@/decorators/user-id.decorator";

@Resolver(() => User)
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Query(() => User, { nullable: true })
  async getUser(@Args("userId") id: number): Promise<User> {
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
    @UserId() userId: number,
  ): Promise<User> {
    return this.userService.updateUser(body, userId);
  }
}
