import { Module } from '@nestjs/common';
import { ReservasController } from './reservas.controller';
import { ReservasService } from './reservas.service';
import { ReservasRepository } from './reservas.repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReservasController],
  providers: [ReservasService, ReservasRepository],
})
export class ReservasModule {}
