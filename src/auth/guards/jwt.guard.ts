import {
  CanActivate,
  ExecutionContext,
  Inject,
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
    super(); // Add a super() call to the parent class constructor
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
      const decodedToken = this.jwtService.decode(token, { complete: true });
      console.log(decodedToken);
      const payload = await this.jwtService.verifyAsync(token, {
        complete: true,
        secret: "test123",
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      console.log(payload, "RRRRR");
      request["user"] = payload;
      console.log(request, "LLLLLLLL");
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
