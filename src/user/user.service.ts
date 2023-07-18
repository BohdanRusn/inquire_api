import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Request } from "express";
import { CreateUser, UpdateUserInfo, User } from "./user.entity";

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  async findUserById(id: number): Promise<User> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.repository.findOneBy({
      email,
    });
  }

  create(dto: CreateUser) {
    return this.repository.save(dto);
  }

  async updateUser(body: UpdateUserInfo, req: Request): Promise<User> {
    const { id } = <User>req.user;

    await this.repository.update(id, body);
    return await this.repository.findOne({ where: { id } });
  }
}
