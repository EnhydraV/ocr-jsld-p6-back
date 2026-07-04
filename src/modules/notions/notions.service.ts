import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notion, NotionDocument } from './schemas/notion.schema';
import { CreateNotionDto } from './dto/create-notion.dto';
import { UpdateNotionDto } from './dto/update-notion.dto';

@Injectable()
export class NotionsService {
  constructor(
    @InjectModel(Notion.name) private notionModel: Model<NotionDocument>,
  ) {}

  async create(createNotionDto: CreateNotionDto): Promise<NotionDocument> {
    return this.notionModel.create(createNotionDto);
  }

  async findAll(): Promise<NotionDocument[]> {
    return this.notionModel.find().exec();
  }

  async findOne(id: string): Promise<NotionDocument> {
    const notion = await this.notionModel.findById(id).exec();
    if (!notion) {
      throw new NotFoundException(`Notion with id "${id}" not found`);
    }
    return notion;
  }

  async update(
    id: string,
    updateNotionDto: UpdateNotionDto,
  ): Promise<NotionDocument> {
    const notion = await this.notionModel
      .findByIdAndUpdate(id, updateNotionDto, { new: true, runValidators: true })
      .exec();
    if (!notion) {
      throw new NotFoundException(`Notion with id "${id}" not found`);
    }
    return notion;
  }

  async remove(id: string): Promise<void> {
    const result = await this.notionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Notion with id "${id}" not found`);
    }
  }
}
