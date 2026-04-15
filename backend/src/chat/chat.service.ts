import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(senderId: string, content: string) {
    return this.prisma.message.create({
      data: { senderId, content },
      include: {
        sender: { select: { id: true, username: true, avatar: true } },
      },
    });
  }

  async getRecentMessages(take = 50) {
    return this.prisma.message
      .findMany({
        orderBy: { createdAt: 'desc' },
        take,
        include: {
          sender: { select: { id: true, username: true, avatar: true } },
        },
      })
      .then((msgs) => msgs.reverse());
  }
}
