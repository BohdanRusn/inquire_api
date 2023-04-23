import { IsString } from "class-validator";

export class UpdateNameDto {
  @IsString()
  public readonly name: string;
}
