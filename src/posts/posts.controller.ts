import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseInterceptors,
} from "@nestjs/common";
import { Post as P } from "./post.entity";
import { PostsService } from "./posts.service";
import { Query } from "@nestjs/graphql";

// import { JwtAuthGuard } from "@/api/user/auth/auth.guard";

@Controller("posts")
export class PostsController {
  constructor(private readonly postService: PostsService) {}
  @Get()
  async findAll(): Promise<P[]> {
    return await this.postService.findAllPosts();
  }

  @Get(":id")
  async findPost(@Param("id") id: number): Promise<P> {
    const post = await this.postService.findOnePost(id as any);
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
