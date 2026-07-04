import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotionsController } from './notions.controller';
import { NotionsService } from './notions.service';
import { Notion, NotionSchema } from './schemas/notion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notion.name, schema: NotionSchema }]),
  ],
  controllers: [NotionsController],
  providers: [NotionsService],
  exports: [NotionsService],
})
export class NotionsModule {}
