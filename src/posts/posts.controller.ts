import {
  Body,
  ClassSerializerInterceptor,
  Delete,
  Param,
  Put,
  Req,
  UseInterceptors,
} from "@nestjs/common";
import { CreatePostInput, FindPostInput, Post } from "./post.entity";
import { PostsService } from "./posts.service";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

// import { JwtAuthGuard } from "@/api/user/auth/auth.guard";

@Resolver(() => Post)
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return await this.postService.findAllPosts();
  }

  @Query(() => Post)
  async post(@Args("input") { id }: FindPostInput): Promise<Post> {
    const post = await this.postService.findOnePost(id);
    if (!post) {
      throw new Error("Post not found");
    } else {
      return post;
    }
  }

  // @UseGuards(JwtAuthGuard)
  @Mutation(() => Post)
  @UseInterceptors(ClassSerializerInterceptor)
  async addPost(
    @Req() req,
    @Args("input") post: CreatePostInput,
  ): Promise<Post> {
    console.log(req);
    return await this.postService.create(1, post);
  }

  @Put(":id")
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async updatePost(@Param("id") id: number, @Body() post: Post): Promise<Post> {
    return this.postService.update(id, post);
  }

  //TODO: rewrite this shit
  @Delete(":id")
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async deletePost(@Param("id") id: number): Promise<void> {
    const post = await this.postService.findOnePost(id);
    if (!post) {
      throw new Error("Post not found");
    }
    return this.postService.delete(id);
  }
}
