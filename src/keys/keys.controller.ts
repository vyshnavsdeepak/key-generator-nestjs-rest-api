import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KeysService } from './keys.service';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';

@Controller('keys')
export class KeysController {
  constructor(private readonly keysService: KeysService) {}

  @Post()
  create(@Body() createKeyDto: CreateKeyDto) {
    return this.keysService.create(createKeyDto);
  }

  @Get()
  findAll() {
    const userName = '';
    return this.keysService.findAll(userName);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKeyDto: UpdateKeyDto) {
    return this.keysService.update(id, updateKeyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.keysService.remove(id);
  }
}
