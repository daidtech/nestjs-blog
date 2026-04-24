import { Body, Controller, Get, Post } from "@nestjs/common";
import { TagService } from "./tag.service";
import { CreateTagDto } from './dto/create-tag.dto';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Post()
  create(@Body() body: CreateTagDto) {
    return this.tagService.create(body);
  }
}