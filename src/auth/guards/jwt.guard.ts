import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import * as process from "process";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") implements CanActivate {
  constructor(private readonly jwtService: JwtService) {
    super();
    this.jwtService = new JwtService();
  }

  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const token = this.extractTokenFromHeader(request as Request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        complete: true,
        secret: process.env.SECRET_KEY,
      });
      request["user"] = payload.payload;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
