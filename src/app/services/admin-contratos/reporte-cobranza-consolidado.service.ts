import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
export class ReporteCobranzaConsolidadoService {

  constructor(
    private _conectionWS: ConexionService, private http: HttpClient,
  ) { }

  private url = `${this.getUrl()}`;
  getUrl() {
    //Los servicios se encuentran alojados en el microservicio de h2h-admon-contratos-service
    return localStorage.getItem('url');
  }

  getConfRepCob(idContrato: string): any {
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/cobranza-consolidado/${idContrato}`, TypeRequest.GET);
  }

  getCtaCob(idContrato: string, page: number): any {
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/cobranza-consolidado/cuentas/${idContrato}?page=${page}`, TypeRequest.GET);
  }

  getXlsCtaCob(idContrato: string): any {
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/cobranza-consolidado/cuentas/xls/${idContrato}`, TypeRequest.GET);
  }

  saveConf(datos: any): any {
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/cobranza-consolidado/guardar`, TypeRequest.POST_VALUES, datos);
  }

  getRepFile(datos: any, format: string): any {
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/cobranza-consolidado/${format}`, TypeRequest.POST_VALUES, datos);
  }

  loadFile(idContrato: string, datos: any): any {
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/cobranza-consolidado/cuentas/carga/${idContrato}`, TypeRequest.POST_VALUES, datos);
  }

  getDetailCta(idContrato: string): any {
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/cobranza-consolidado/cuentas/detalle-carga/xls/${idContrato}`, TypeRequest.GET);
  }



}
