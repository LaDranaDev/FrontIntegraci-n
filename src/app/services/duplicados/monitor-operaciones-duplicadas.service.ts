import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';
import { IPaginationRequest } from 'src/app/bean/i-pagination-request';

@Injectable({
  providedIn: 'root'
})
export class MonitorOperacionesDuplicadasService {
  private url = `${this.getUrl()}`;

  constructor(
    private _conectionWS: ConexionService,
  private http: HttpClient
  ) { }

  getUrl() {
    return localStorage.getItem('url');
  }

  /**
   * @description se obtienen todos los registros de Layouts
  */
  catalogos() {
    return this._conectionWS.peticionServicioWs(`${this.url}/monitorOperacionesDuplicadas/catalogos`, TypeRequest.GET);
  }

  async consultar(monitorOperaciones: any, paginacion: IPaginationRequest) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/monitorOperacionesDuplicadas/consulta?page=${paginacion.page}&size=${paginacion.size}`, TypeRequest.POST_VALUES,monitorOperaciones);
    return response;
  }

  async operacionesTotales(monitorOperaciones: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/monitorOperacionesDuplicadas/totales`, TypeRequest.POST_VALUES, monitorOperaciones);
    return response;
  }

  getFile(payload: any, format: string,paginacion: IPaginationRequest) {
    payload.pagina = paginacion.page;
    payload.tamanioPagina = paginacion.size;

    return this._conectionWS.peticionServicioWs(`${this.url}/monitorOperacionesDuplicadas/reporte/${format}`, TypeRequest.POST_VALUES, payload);
  }

  getSaveLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  setSaveLocalStorage(key: string, item: any) {
    localStorage.setItem(key, JSON.stringify(item));
  }
}
