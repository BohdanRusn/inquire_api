import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { UserModule } from "@/user/user.module";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get("SECRET_KEY"),
          signOptions: { expiresIn: configService.get("EXPIRES_IN") },
        };
      },
    }),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy, AuthController],
  exports: [AuthService],
})
export class AuthModule {}
