import { Module } from "@nestjs/common";
import { ReportesController } from "./controller/reportes.controller";
import { ReportesService } from "./service/reportes.service";
import { ReportesRepository } from "./repository/reportes.repository";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
  imports: [PrismaModule], // Necesitamos PrismaModule para usar PrismaService
  controllers: [ReportesController], // Registramos el controller
  providers: [ReportesService, ReportesRepository], // Registramos service y repository
})
export class ReportesModule {}
