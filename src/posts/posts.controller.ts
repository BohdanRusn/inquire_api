import {
  Body,
  ClassSerializerInterceptor,
  Delete,
  Param,
  Post,
  Put,
  Req,
  UseInterceptors,
} from "@nestjs/common";
import { FindPostInput, Post as P } from "./post.entity";
import { PostsService } from "./posts.service";
import { Args, Query, Resolver } from "@nestjs/graphql";

// import { JwtAuthGuard } from "@/api/user/auth/auth.guard";

@Resolver(() => P)
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Query(() => [P])
  async posts(): Promise<P[]> {
    return await this.postService.findAllPosts();
  }

  @Query(() => P)
  async post(@Args("input") { id }: FindPostInput): Promise<P> {
    const post = await this.postService.findOnePost(id);
    if (!post) {
      throw new Error("Post not found");
    } else {
      return post;
    }
  }

  @Post()
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async addPost(@Req() req, @Body() post: P): Promise<P> {
    console.log(req.user);
    return await this.postService.create(req.user.id, post);
  }

  @Put(":id")
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async updatePost(@Param("id") id: number, @Body() post: P): Promise<P> {
    return this.postService.update(id, post);
  }

  //TODO: rewrite this shit
  @Delete(":id")
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async deletePost(@Param("id") id: number): Promise<void> {
    const post = await this.postService.findOnePost(id as any);
    if (!post) {
      throw new Error("Post not found");
    }
    return this.postService.delete(id);
  }
}
