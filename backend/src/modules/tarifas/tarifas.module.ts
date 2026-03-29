import { Module } from '@nestjs/common';
import { TarifasController } from './tarifas.controller';
import { TarifasService } from './tarifas.service';
import { TarifasRepository } from './tarifas.repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TarifasController],
  providers: [TarifasService, TarifasRepository],
})
export class TarifasModule {}
