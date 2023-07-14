import { Post } from "@/posts/post.entity";
import { Comment } from "@/comments/comment.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Exclude()
  @Column()
  password: string;

  @Field(() => Post)
  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  @Field(() => Comment)
  @OneToMany(() => Comment, comment => comment.author)
  comments: Comment[];

  @Field()
  @Column({ type: "timestamp", nullable: true, default: null })
  public lastLoginAt: Date | null;
}
