import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const UserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    console.log(ctx.getContext().req, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
    return ctx.getContext().req.user;
  },
);
