import { Module } from "@nestjs/common";
import { get, set } from "lodash";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostsModule } from "./posts/posts.module";
import * as process from "process";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { decode } from "@/utils/jwt.utils";
import * as dotenv from "dotenv";
import { CommentsModule } from "@/comments/comments.module";
import { UserModule } from "@/user/user.module";

dotenv.config();
@Module({
  imports: [
    // ConfigModule.forRoot(),
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
      context: ({ req, res }) => {
        // Get the cookie from request
        console.log(req.headers.authorization);
        const token = req.headers.authorization;

        console.log({ token });
        // Verify the cookie

        const user = token ? decode(token) : null;

        // Attach the user object to the request object
        if (user) {
          set(req, "user", user);
        }

        return { res };
      },
    }),
    PostsModule,
    CommentsModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
