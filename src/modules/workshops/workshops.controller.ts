import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { WorkshopsService } from './workshops.service';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import { ParseObjectIdPipe } from '@core/pipes/parse-object-id.pipe';

@Controller('api/workshops')
export class WorkshopsController {
  constructor(private readonly workshopsService: WorkshopsService) {}

  @Post()
  create(@Body() createWorkshopDto: CreateWorkshopDto) {
    return this.workshopsService.create(createWorkshopDto);
  }

  @Get()
  findAll() {
    return this.workshopsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.workshopsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateWorkshopDto: UpdateWorkshopDto,
  ) {
    return this.workshopsService.update(id, updateWorkshopDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.workshopsService.remove(id);
  }
}
