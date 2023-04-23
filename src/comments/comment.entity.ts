import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "@/posts/post.entity";
import { User } from "@/api/user/user.entity";


@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Post, post => post.comments, {
    onDelete: "CASCADE",
  })
  post: Post;

  @ManyToOne(() => User, user => user.comments, {
    onDelete: "CASCADE",
  })
  author: User;
}
