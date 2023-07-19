import { UseGuards } from "@nestjs/common";
import { CreatePostInput, Post, PostBody } from "./post.entity";
import { PostsService } from "./posts.service";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserId } from "@/decorators/user-id.decorator";
import { JwtAuthGuard } from "@/auth/guards/jwt.guard";

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

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post)
  async addPost(
    @UserId() userId: number,
    @Args("newPost") post: CreatePostInput,
  ): Promise<Post> {
    return await this.postService.create(userId, post);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post, { nullable: true })
  async updatePost(@Args("post") post: PostBody): Promise<Post> {
    return this.postService.update(post.id, post.newPost);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post, { nullable: true })
  async deletePost(@Args("postId") id: number): Promise<void> {
    const post = await this.postService.findOnePost(id);
    if (!post) {
      throw new Error("Post not found");
    }
    return this.postService.delete(id);
  }
}
