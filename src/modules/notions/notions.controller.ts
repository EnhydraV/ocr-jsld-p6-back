import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { NotionsService } from './notions.service';
import { CreateNotionDto } from './dto/create-notion.dto';
import { UpdateNotionDto } from './dto/update-notion.dto';
import { ParseObjectIdPipe } from '@core/pipes/parse-object-id.pipe';

@Controller('api/notions')
export class NotionsController {
  constructor(private readonly notionsService: NotionsService) {}

  @Post()
  create(@Body() createNotionDto: CreateNotionDto) {
    return this.notionsService.create(createNotionDto);
  }

  @Get()
  findAll() {
    return this.notionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.notionsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateNotionDto: UpdateNotionDto,
  ) {
    return this.notionsService.update(id, updateNotionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.notionsService.remove(id);
  }
}
