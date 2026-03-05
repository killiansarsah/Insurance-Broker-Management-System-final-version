import { Module } from '@nestjs/common';
import { CarriersService } from './carriers.service';
import { CarriersController } from './carriers.controller';
import { CarrierProductsService } from './products/carrier-products.service';
import { CarrierProductsController } from './products/carrier-products.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CarriersController, CarrierProductsController],
  providers: [CarriersService, CarrierProductsService],
  exports: [CarriersService, CarrierProductsService],
})
export class CarriersModule {}
