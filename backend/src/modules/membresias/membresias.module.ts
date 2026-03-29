import { Module } from '@nestjs/common';
import { MembresiasController } from './membresias.controller';
import { MembresiasService } from './membresias.service';
import { MembresiasRepository } from './membresias.repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MembresiasController],
  providers: [MembresiasService, MembresiasRepository],
})
export class MembresiasModule {}
