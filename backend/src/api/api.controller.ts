import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller()
export class ApiController {
  constructor(private readonly svc: ApiService) {}

  @Get('resumo')
  async resumo() {
    return this.svc.resumoPorLista();
  }

  @Get('top-operadores')
  async topOperadores() {
    return this.svc.topOperadores(10);
  }

  @Get('top-listas')
  async topListas() {
    return this.svc.topListas(10);
  }

  @Get('top-campanhas')
  async topCampanhas() {
    return this.svc.topCampanhas(10);
  }
}
