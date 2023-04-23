import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "./comment.entity";
import { Repository } from "typeorm";
import { Post } from "@/posts/post.entity";
import { User } from "@/api/user/user.entity";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
  }

  async findOne(id: number): Promise<Comment> {
    return await this.commentRepository.findOne({ where: { id } });
  }

  async create(
    postId: number,
    userId: number,
    commentData: Comment,
  ): Promise<Comment> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const comment = new Comment();
    comment.content = commentData.content;
    comment.post = post;
    comment.author = user;
    return await this.commentRepository.save(comment);
  }

  async delete(id: number): Promise<void> {
    await this.commentRepository.delete(id);
  }
}
