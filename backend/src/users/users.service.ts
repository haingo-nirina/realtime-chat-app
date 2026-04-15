import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByGoogleId(googleId: string) {
    return this.prisma.user.findUnique({
      where: { googleId },
    });
  }

  async createLocalUser(data: {
    username: string;
    email: string;
    password: string;
  }) {
    return this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: data.password,
      },
    });
  }

  async createGoogleUser(data: {
    username: string;
    email: string;
    googleId: string;
  }) {
    return this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        googleId: data.googleId,
      },
    });
  }

  async attachGoogleId(userId: string, googleId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { googleId },
    });
  }
}
