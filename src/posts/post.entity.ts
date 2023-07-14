import { User } from "@/api/user/user.entity";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comment } from "@/comments/comment.entity";
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity()
export class Post {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  content: string;

  @Field(() => Comment)
  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];

  @Field(() => User)
  @ManyToOne(() => User, user => user.posts, {
    onDelete: "CASCADE",
  })
  author: User;
}

@InputType()
export class FindPostInput {
  @Field(() => Int)
  id: number;
}

@InputType()
export class CreatePostInput {
  @Field()
  title: string;

  @Field()
  content: string;
}
