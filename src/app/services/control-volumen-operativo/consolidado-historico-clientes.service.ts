import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
export class ConsolidadoHistoricoClientesService {
  private url = `${this.getUrl()}`;
  constructor(
    private _conectionWS: ConexionService,
  ) { }

  getUrl() {
    // return 'localhost:8080';
    return localStorage.getItem('url');
  }

  graficaConsolClienteBuscar(
    request: any
  ) {
    return this._conectionWS.peticionServicioWs(
      `${this.url}/operativo/consolidado/clientes/graficaConsolClienteBuscar`,
      TypeRequest.POST_VALUES,
      request
    );
  }

}
