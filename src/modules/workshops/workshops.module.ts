import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkshopsController } from './workshops.controller';
import { WorkshopsService } from './workshops.service';
import { Workshop, WorkshopSchema } from './schemas/workshop.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workshop.name, schema: WorkshopSchema },
    ]),
  ],
  controllers: [WorkshopsController],
  providers: [WorkshopsService],
  exports: [WorkshopsService],
})
export class WorkshopsModule {}
