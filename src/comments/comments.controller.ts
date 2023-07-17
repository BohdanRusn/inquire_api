import {
  ClassSerializerInterceptor,
  Req,
  UseInterceptors,
} from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { Comment, CreateCommentInput } from "./comment.entity";
import { Args, Mutation, Resolver } from "@nestjs/graphql";

@Resolver(() => Comment)
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Mutation(() => Comment)
  @UseInterceptors(ClassSerializerInterceptor)
  async addComment(
    @Req() req,
    @Args("newComment") { postId, content }: CreateCommentInput,
  ): Promise<Comment> {
    console.log(req);
    return await this.commentService.create(postId, 1, content);
  }

  @Mutation(() => Comment, { nullable: true })
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteComment(@Args("id") id: number): Promise<void> {
    const comment = await this.commentService.findOne(id);
    if (!comment) {
      throw new Error("Comment not found");
    }
    return this.commentService.delete(id);
  }
}
