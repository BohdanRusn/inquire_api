import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const UserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    console.log(request, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
    return ctx.getContext().req.user.payload.id;
  },
);
