import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "./comment.entity";
import { Repository } from "typeorm";
import { Post } from "../posts/post.entity";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async findOne(id: number): Promise<Comment> {
    return await this.commentRepository.findOne({ where: { id } });
  }

  async create(id: number, commentData: Comment): Promise<Comment> {
    const post = await this.postRepository.findOne({ where: { id } });
    const comment = new Comment();
    comment.content = commentData.content;
    comment.post = post;
    return await this.commentRepository.save(comment);
  }

  async delete(id: number): Promise<void> {
    await this.commentRepository.delete(id);
  }
}
