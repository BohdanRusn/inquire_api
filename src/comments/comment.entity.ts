import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "@/posts/post.entity";
import { User } from "@/user/user.entity";
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity()
export class Comment {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  content: string;

  @Field(() => Post)
  @ManyToOne(() => Post, post => post.comments, {
    onDelete: "CASCADE",
  })
  post: Post;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, user => user.comments, {
    onDelete: "CASCADE",
  })
  author: User;
}

@InputType()
export class CreateCommentInput {
  @Field(() => Int)
  postId: number;

  @Field(() => String)
  content: string;
}
