import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostsModule } from "./posts/posts.module";
import * as process from "process";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import * as dotenv from "dotenv";
import { CommentsModule } from "@/comments/comments.module";
import { UserModule } from "@/user/user.module";
import { AuthModule } from "@/auth/auth.module";

dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: "postgres",
        host: process.env.PG_HOST,
        port: parseInt(process.env.PG_PORT),
        username: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DB,
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        autoLoadEntities: true,
        synchronize: true,
        keepConnectionAlive: true,
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      nodeEnv: `.${process.env.NODE_ENV}.env`,
      autoSchemaFile: "schema.gql",
      driver: ApolloDriver,
    }),
    PostsModule,
    CommentsModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
