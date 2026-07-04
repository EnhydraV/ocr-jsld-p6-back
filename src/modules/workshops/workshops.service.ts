import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Workshop, WorkshopDocument } from './schemas/workshop.schema';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';

@Injectable()
export class WorkshopsService {
  constructor(
    @InjectModel(Workshop.name)
    private workshopModel: Model<WorkshopDocument>,
  ) {}

  async create(
    createWorkshopDto: CreateWorkshopDto,
  ): Promise<WorkshopDocument> {
    const workshop = await this.workshopModel.create(createWorkshopDto);
    return workshop.populate('notions');
  }

  async findAll(): Promise<WorkshopDocument[]> {
    return this.workshopModel.find().populate('notions').exec();
  }

  async findOne(id: string): Promise<WorkshopDocument> {
    const workshop = await this.workshopModel
      .findById(id)
      .populate('notions')
      .exec();
    if (!workshop) {
      throw new NotFoundException(`Workshop with id "${id}" not found`);
    }
    return workshop;
  }

  async update(
    id: string,
    updateWorkshopDto: UpdateWorkshopDto,
  ): Promise<WorkshopDocument> {
    const workshop = await this.workshopModel
      .findByIdAndUpdate(id, updateWorkshopDto, {
        new: true,
        runValidators: true,
      })
      .populate('notions')
      .exec();
    if (!workshop) {
      throw new NotFoundException(`Workshop with id "${id}" not found`);
    }
    return workshop;
  }

  async remove(id: string): Promise<void> {
    const result = await this.workshopModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Workshop with id "${id}" not found`);
    }
  }
}
