import { UseGuards } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { Comment, CreateCommentInput } from "./comment.entity";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { JwtAuthGuard } from "@/auth/guards/jwt.guard";
import { UserId } from "@/decorators/user-id.decorator";

@UseGuards(JwtAuthGuard)
@Resolver(() => Comment)
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Mutation(() => Comment)
  async addComment(
    @UserId() userId: number,
    @Args("newComment") { postId, content }: CreateCommentInput,
  ): Promise<Comment> {
    return await this.commentService.create(postId, userId, content);
  }

  @Mutation(() => Comment, { nullable: true })
  async deleteComment(@Args("id") id: number): Promise<void> {
    const comment = await this.commentService.findOne(id);
    if (!comment) {
      throw new Error("Comment not found");
    }
    return this.commentService.delete(id);
  }
}
