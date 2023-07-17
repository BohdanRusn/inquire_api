import { Post } from "@/posts/post.entity";
import { Comment } from "@/comments/comment.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { Field, InputType, ObjectType } from "@nestjs/graphql";

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

  @Field(() => Post, { nullable: true })
  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  @Field(() => Comment, { nullable: true })
  @OneToMany(() => Comment, comment => comment.author)
  comments: Comment[];

  @Field()
  @Column({ type: "timestamp", nullable: true, default: null })
  public lastLoginAt: Date | null;
}

@InputType()
export class UpdateUserInfo {
  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;
}
