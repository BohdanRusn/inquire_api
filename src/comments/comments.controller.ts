import { Body, Controller, Delete, Param, Post } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { Comment } from "./comment.entity";

@Controller("comments")
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Post(":id")
  async addComment(
    @Param("id") id: number,
    @Body() commentData: Comment,
  ): Promise<Comment> {
    return await this.commentService.create(id, commentData);
  }

  @Delete(":id")
  async deleteComment(@Param("id") id: number): Promise<void> {
    const comment = await this.commentService.findOne(id);
    if (!comment) {
      throw new Error("Comment not found");
    }
    return this.commentService.delete(id);
  }
}
