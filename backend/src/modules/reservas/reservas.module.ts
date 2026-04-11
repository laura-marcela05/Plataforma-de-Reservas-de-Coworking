import { Module } from '@nestjs/common';
import { ReservasController } from './controller/reservas.controller';
import { ReservasService } from './service/reservas.service';
import { ReservasRepository } from './repository/reservas.repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReservasController],
  providers: [ReservasService, ReservasRepository],
})
export class ReservasModule {}
