import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { Post as P } from "./post.entity";
import { PostsService } from "./posts.service";

@Controller("posts")
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  async findAll(): Promise<P[]> {
    return await this.postService.findAll();
  }

  @Get(":id")
  async findPost(@Param("id") id: number): Promise<P> {
    const post = await this.postService.findOne(id);
    if (!post) {
      throw new Error("Post not found");
    } else {
      return post;
    }
  }

  @Post()
  async addPost(@Body() post: P): Promise<P> {
    return await this.postService.create(post);
  }

  @Put(":id")
  async updatePost(@Param("id") id: number, @Body() post: P): Promise<P> {
    return this.postService.update(id, post);
  }

  @Delete(":id")
  async deletePost(@Param("id") id: number): Promise<void> {
    const post = await this.postService.findOne(id);
    if (!post) {
      throw new Error("Post not found");
    }
    return this.postService.delete(id);
  }
}
