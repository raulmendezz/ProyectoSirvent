import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const SELECT = { id: true, email: true, role: true, createdAt: true, updatedAt: true };

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({ select: SELECT, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: SELECT });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async create(dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('El email ya está en uso');
    const password = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: { email: dto.email, password, role: dto.role },
      select: SELECT,
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);
    const data: Record<string, unknown> = { ...dto };
    if (dto.password) data.password = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.update({ where: { id }, data, select: SELECT });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.user.delete({ where: { id } });
    return { message: 'Usuario eliminado' };
  }
}
