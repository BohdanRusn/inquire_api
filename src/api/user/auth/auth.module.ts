import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@/api/user/user.entity";
import { AuthController } from "./auth.controller";
import { AuthHelper } from "./auth.helper";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./auth.strategy";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt", property: "user" }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: "dev",
        signOptions: { expiresIn: "10d" },
      }),
    }),
    TypeOrmModule.forFeature([ User ]),
  ],
  controllers: [ AuthController ],
  providers: [ AuthService, AuthHelper, JwtStrategy ],
})
export class AuthModule {
}
