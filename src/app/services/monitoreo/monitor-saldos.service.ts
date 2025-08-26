import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ConexionService, TypeRequest } from '../conexion.service';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';

@Injectable({
  providedIn: 'root'
})
export class MonitorSaldosService {

  constructor(
    private http: HttpClient,
    private _conectionWS: ConexionService
  ) { }

  private url = `${this.getUrl()}`;

  getUrl() {
    //return 'http://localhost:8086'
    return localStorage.getItem('url');
  }


  async catalogo(){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/monsaldos/catalogo/productos`,TypeRequest.GET);
    return response;
  }

  async obtenerSaldos(saldos:any, paginacion:IPaginationRequest){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/saldos?page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.POST_VALUES,saldos);
    return response;
  }

  async exportar(request:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/saldos/reporte/xlsx`,TypeRequest.POST_VALUES, request);
    return response;
  }

}