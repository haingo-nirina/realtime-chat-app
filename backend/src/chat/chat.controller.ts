import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';

@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages')
  async getMessages() {
    return this.chatService.getRecentMessages();
  }

  @Post('messages')
  async sendMessage(@Request() req: any, @Body('content') content: string) {
    if (!content?.trim()) {
      throw new BadRequestException('Message content is required.');
    }

    return this.chatService.createMessage(req.user.id, content.trim());
  }
}
