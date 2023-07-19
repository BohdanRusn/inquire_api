import { Post } from "@/posts/post.entity";
import { Comment } from "@/comments/comment.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Trim } from "class-sanitizer";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

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

  @Field()
  @IsOptional()
  token: string;

  @Field(() => Post, { nullable: true })
  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  @Field(() => Comment, { nullable: true })
  @OneToMany(() => Comment, comment => comment.author)
  comments: Comment[];

  @Field(() => Date, { nullable: true })
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

@InputType()
export class CreateUser {
  @Trim()
  @IsEmail()
  @Field(() => String)
  name: string;

  @IsString()
  @MinLength(8)
  @Field(() => String)
  email: string;

  @IsString()
  @Field(() => String)
  password: string;
}

@InputType()
export class LoginUser {
  @IsString()
  @MinLength(8)
  @Field(() => String)
  email: string;

  @IsString()
  @Field(() => String)
  password: string;
}
