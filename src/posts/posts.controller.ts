import {
  ClassSerializerInterceptor,
  Req,
  UseInterceptors,
} from "@nestjs/common";
import { CreatePostInput, Post, PostBody } from "./post.entity";
import { PostsService } from "./posts.service";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

@Resolver(() => Post)
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Query(() => [Post], { nullable: true })
  async posts(): Promise<Post[]> {
    return await this.postService.findAllPosts();
  }

  @Query(() => Post, { nullable: true })
  async post(@Args("postId") id: number): Promise<Post> {
    const post = await this.postService.findOnePost(id);
    if (!post) {
      throw new Error("Post not found");
    } else {
      return post;
    }
  }

  @Mutation(() => Post)
  @UseInterceptors(ClassSerializerInterceptor)
  async addPost(
    @Req() req,
    @Args("newPost") post: CreatePostInput,
  ): Promise<Post> {
    console.log(req);
    return await this.postService.create(1, post);
  }

  @Mutation(() => Post, { nullable: true })
  @UseInterceptors(ClassSerializerInterceptor)
  async updatePost(@Args("post") post: PostBody): Promise<Post> {
    return this.postService.update(post.id, post.newPost);
  }

  @Mutation(() => Post, { nullable: true })
  @UseInterceptors(ClassSerializerInterceptor)
  async deletePost(@Args("postId") id: number): Promise<void> {
    const post = await this.postService.findOnePost(id);
    if (!post) {
      throw new Error("Post not found");
    }
    return this.postService.delete(id);
  }
}
