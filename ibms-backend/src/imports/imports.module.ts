import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { ImportsController } from './imports.controller';
import { ImportsService } from './imports.service';
import { AnonymisationService } from './anonymisation.service';
import { RuleBasedMapperService } from './services/rule-based-mapper.service';
import { GeminiMapperService } from './services/gemini-mapper.service';
import { MappingOrchestratorService } from './services/mapping-orchestrator.service';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [ImportsController],
  providers: [
    ImportsService,
    AnonymisationService,
    RuleBasedMapperService,
    GeminiMapperService,
    MappingOrchestratorService,
  ],
  exports: [ImportsService],
})
export class ImportsModule {}
