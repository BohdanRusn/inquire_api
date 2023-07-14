import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseInterceptors,
} from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { Comment } from "./comment.entity";
import { Resolver } from "@nestjs/graphql";

// import { JwtAuthGuard } from "@/api/user/auth/auth.guard";

// @Controller("comments")
@Resolver(of => Comment)
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Post(":id")
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async addComment(
    @Req() req,
    @Param("id") id: number,
    @Body() commentData: Comment,
  ): Promise<Comment> {
    return await this.commentService.create(id, req.user.id, commentData);
  }

  @Delete(":id")
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteComment(@Param("id") id: number): Promise<void> {
    const comment = await this.commentService.findOne(id);
    if (!comment) {
      throw new Error("Comment not found");
    }
    return this.commentService.delete(id);
  }
}
