import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(user: User) {
    try {
      const insert = await this.prisma.user.create({
        data: {
          userName: user.userName,
          name: user.name,
          passwordHash: user.passwordHash,
        },
      });
      return insert;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code == 'P2002') {
          throw new HttpException('User already exists', 409);
        }
      }
      throw e;
    }
  }

  findOne(userName: string) {
    return this.prisma.user.findUnique({
      where: {
        userName,
      },
    });
  }

  async getUser(userName: string) {
    const user = await this.findOne(userName);
    return {
      userName: user.userName,
      name: user.name,
    };
  }
}
