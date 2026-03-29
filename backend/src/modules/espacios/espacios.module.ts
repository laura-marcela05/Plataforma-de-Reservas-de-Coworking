import { Module } from '@nestjs/common';
import { EspaciosController } from './espacios.controller';
import { EspaciosService } from './espacios.service';
import { EspaciosRepository } from './espacios.repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EspaciosController],
  providers: [EspaciosService, EspaciosRepository],
})
export class EspaciosModule {}
