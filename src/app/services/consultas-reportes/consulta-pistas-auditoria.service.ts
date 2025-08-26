import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultaPistasAuditoriaService {
  private url = `${this.getUrl()}`;
  constructor(
    private _conectionWS: ConexionService,
  ) { }

  getUrl() {
    // return 'localhost:8085';
    return localStorage.getItem('url');
  }

  inicioPistas(
  ): Promise<any> {
    return this._conectionWS.peticionServicioWs(
      `${this.url}/pistasAuditoria/inicio`,
      TypeRequest.GET
    );
  }

  consultaPistasAuditoria(request: any) {
    return this._conectionWS.peticionServicioWs(
      `${this.url}/pistasAuditoria/consultaPistasAuditoria`,
      TypeRequest.POST_VALUES,
      request
    );
  }

  exportarPistasAuditoria(request: any) {
    return this._conectionWS.peticionServicioWs(
      `${this.url}/pistasAuditoria/exportarPistasAuditoria`,
      TypeRequest.POST_VALUES,
      request
    );
  }
}
