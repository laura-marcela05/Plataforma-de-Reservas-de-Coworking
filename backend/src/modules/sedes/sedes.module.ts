import { Module } from '@nestjs/common';
import { SedesController } from './sedes.controller';
import { SedesService } from './sedes.service';
import { SedesRepository } from './sedes.repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SedesController],
  providers: [SedesService, SedesRepository],
})
export class SedesModule {}
