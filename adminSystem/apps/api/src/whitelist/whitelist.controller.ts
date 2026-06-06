import {
  Body, Controller, Delete, Get,
  Param, ParseIntPipe, Post, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateWhitelistEntryDto } from './dto/create-entry.dto';
import { WhitelistService } from './whitelist.service';

@Controller('whitelist')
export class WhitelistController {
  constructor(private readonly svc: WhitelistService) {}

  // Public endpoint (called by Next.js middleware from localhost)
  @Get('ips')
  getIps() { return this.svc.getAllIps(); }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() { return this.svc.findAll(); }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateWhitelistEntryDto) { return this.svc.create(dto); }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.svc.remove(id); }
}
