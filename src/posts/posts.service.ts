import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FindPostInput, Post } from "./post.entity";
import { User } from "@/api/user/user.entity";
import { Args, Query } from "@nestjs/graphql";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Query(() => [Post])
  async findAllPosts(): Promise<Post[]> {
    return await this.postRepository.find({
      relations: ["comments", "author"],
    });
  }

  @Query(() => Post)
  async findOnePost(@Args("input") { id }: FindPostInput): Promise<Post> {
    return await this.postRepository.findOne({
      where: { id },
      relations: ["comments.author", "author"],
    });
  }

  async create(userId: number, postData: Post): Promise<Post> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const newPost = new Post();
    newPost.content = postData.content;
    newPost.title = postData.title;
    newPost.author = user;
    return await this.postRepository.save(newPost);
  }

  async update(id: number, post: Post): Promise<Post> {
    await this.postRepository.update(id, post);
    return await this.postRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }
}
