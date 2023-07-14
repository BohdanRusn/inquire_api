import { Controller } from "@nestjs/common";
import { AppService } from "./app.service";
import { Query } from "@nestjs/graphql";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Query(() => String)
  getHello(): string {
    return this.appService.getHello();
  }
}
