import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Request } from "express";
import { UpdateUserInfo, User } from "./user.entity";

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  async findUserById(id: number): Promise<User> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async updateUser(body: UpdateUserInfo, req: Request): Promise<User> {
    const { id } = <User>req.user;

    await this.repository.update(id, body);
    return await this.repository.findOne({ where: { id } });
  }
}
