import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, Request } from '@nestjs/common';
import { CarrierProductsService } from './carrier-products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

interface RequestWithUser {
    user: {
        tenantId: string;
        sub: string;
        role: string;
    };
}

@Controller('api/v1/carriers/:carrierId/products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CarrierProductsController {
    constructor(private readonly productsService: CarrierProductsService) { }

    @Post()
    @Roles('ADMIN', 'TENANT_ADMIN')
    create(@Request() req: RequestWithUser, @Param('carrierId') carrierId: string, @Body() createProductDto: CreateProductDto) {
        return this.productsService.create(req.user.tenantId, req.user.sub, carrierId, createProductDto);
    }

    @Get()
    @Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'COMPLIANCE_OFFICER', 'FINANCE_MANAGER', 'AGENT', 'UNDERWRITER')
    findAll(@Request() req: any, @Param('carrierId') carrierId: string, @Query() query: ProductQueryDto) {
        return this.productsService.findAll(req.user.tenantId, carrierId, query);
    }

    @Patch(':id')
    @Roles('ADMIN', 'TENANT_ADMIN')
    update(@Request() req: RequestWithUser, @Param('carrierId') carrierId: string, @Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(req.user.tenantId, req.user.sub, carrierId, id, updateProductDto);
    }
}
