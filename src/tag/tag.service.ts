import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.tag.findMany({
      orderBy: { id: 'desc' },
    });
  }

}
