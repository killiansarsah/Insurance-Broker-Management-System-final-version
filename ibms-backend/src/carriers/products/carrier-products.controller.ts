import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CarrierProductsService } from './carrier-products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import type { AuthenticatedRequest as RequestWithUser } from '../../common/types/request.types.js';

@Controller('carriers/:carrierId/products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CarrierProductsController {
  constructor(private readonly productsService: CarrierProductsService) {}

  @Post()
  @Roles('ADMINISTRATOR')
  create(
    @Request() req: RequestWithUser,
    @Param('carrierId') carrierId: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(
      req.user.tenantId,
      req.user.sub,
      carrierId,
      createProductDto,
    );
  }

  @Get()
  @Roles('ADMINISTRATOR', 'AGENT', 'SUPERVISOR', 'MANAGER')
  findAll(
    @Request() req: RequestWithUser,
    @Param('carrierId') carrierId: string,
    @Query() query: ProductQueryDto,
  ) {
    return this.productsService.findAll(req.user.tenantId, carrierId, query);
  }

  @Patch(':id')
  @Roles('ADMINISTRATOR')
  update(
    @Request() req: RequestWithUser,
    @Param('carrierId') carrierId: string,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(
      req.user.tenantId,
      req.user.sub,
      carrierId,
      id,
      updateProductDto,
    );
  }
}
