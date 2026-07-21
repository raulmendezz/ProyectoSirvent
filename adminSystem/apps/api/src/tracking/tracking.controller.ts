import { Controller, Get, Header, Query } from '@nestjs/common';
import { TrackingService } from './tracking.service';

// Endpoint PÚBLICO: lo llama la web pública (heladossirvent.es) en cada visita.
// Es el único endpoint de la API abierto al exterior (ver IpWhitelistMiddleware).
@Controller('track')
export class TrackingController {
  constructor(private tracking: TrackingService) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  async hit(
    @Query('ref') ref?: string,
    @Query('path') path?: string,
    @Query('ua') ua?: string,
    @Query('nuevo') nuevo?: string,
  ) {
    // No esperamos al registro para no bloquear al visitante.
    void this.tracking.record({ ref, path, ua, nuevo });
    return 'ok';
  }
}
