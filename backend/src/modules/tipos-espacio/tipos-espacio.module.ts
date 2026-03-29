import { Module } from '@nestjs/common';
import { TiposEspacioController } from './tipos-espacio.controller';
import { TiposEspacioService } from './tipos-espacio.service';
import { TiposEspacioRepository } from './tipos-espacio.repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TiposEspacioController],
  providers: [TiposEspacioService, TiposEspacioRepository],
})
export class TiposEspacioModule {}
