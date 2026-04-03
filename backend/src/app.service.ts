import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getHello(): Promise<string> {
    const usersCount = await this.prisma.user.count();
    return `Hello World! DB connected (users: ${usersCount})`;
  }
}
