import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './schemas/chat.schema';
import { SendMessageDto } from './dto/send-message.dto';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    private readonly aiService: AiService
  ) {}

  async create(sendMessageDto: SendMessageDto): Promise<Chat> {
    const createdChat = new this.chatModel(sendMessageDto);
    const savedChat = await createdChat.save();

    // Generate AI response
    const aiResponse = await this.aiService.getOpenAiResponse(sendMessageDto.message);

    // Save AI response as a chat message
    const aiChat = new this.chatModel({ sender: 'AI', message: aiResponse });
    await aiChat.save();

    return savedChat;
  }

  async findAll(): Promise<Chat[]> {
    return this.chatModel.find().sort({ createdAt: 1 }).exec(); // Sorting by createdAt in ascending order
  }
}
