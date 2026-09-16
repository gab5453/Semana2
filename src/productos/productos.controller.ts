import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { CrearProductoDto } from './dto/crear-producto.dto.js';
import { ProductosService } from './productos.service.js';
import { Patch, Put } from '@nestjs/common';
import { ActualizarPrecioDto } from './dto/actualizar-precio.dto.js';
import { Delete } from '@nestjs/common';
import { Query } from '@nestjs/common';

@Controller('api/v1/productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
listar(@Query('nombre') nombre?: string) {
  return this.productosService.findAll(nombre);
}

  @Get(':id')
  obtener(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }
  @Post()
@HttpCode(HttpStatus.CREATED)
async crear(@Body() dto: CrearProductoDto, @Res({ passthrough: true }) res: Response) {
  const nuevo = await this.productosService.crear(dto);
  res.setHeader('Location', `/api/v1/productos/${nuevo.id}`);
  return nuevo;
}
@Put(':id')
@HttpCode(HttpStatus.NO_CONTENT)
async reemplazar(@Param('id', ParseIntPipe) id: number, @Body() dto: CrearProductoDto) {
  await this.productosService.reemplazar(id, dto); // 204: sin cuerpo
}

@Patch(':id')
async actualizarPrecio(@Param('id', ParseIntPipe) id: number, @Body() dto: ActualizarPrecioDto) {
  return this.productosService.actualizarPrecio(id, dto); // 200: devolvemos el recurso
}

@Delete(':id')
@HttpCode(HttpStatus.NO_CONTENT)
async eliminar(@Param('id', ParseIntPipe) id: number) {
  await this.productosService.eliminar(id);
}
}