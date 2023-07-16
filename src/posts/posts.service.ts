import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePostInput, Post } from "./post.entity";
import { User } from "@/api/user/user.entity";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAllPosts(): Promise<Post[]> {
    return await this.postRepository.find({
      relations: ["comments", "author"],
    });
  }

  async findOnePost(id: number): Promise<Post> {
    return await this.postRepository.findOne({
      where: { id },
      relations: ["comments.author", "author"],
    });
  }

  async create(userId: number, postData: CreatePostInput): Promise<Post> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const newPost = new Post();
    newPost.content = postData.content;
    newPost.title = postData.title;
    newPost.author = user;
    return await this.postRepository.save(newPost);
  }

  async update(id: number, post: CreatePostInput): Promise<Post> {
    await this.postRepository.update(id, post);
    return await this.postRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }
}
