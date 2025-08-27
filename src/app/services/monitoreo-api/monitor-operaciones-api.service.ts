import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ConexionService, TypeRequest } from '../conexion.service';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { PagoRequest } from '../../models/pago-request.module';

@Injectable({
  providedIn: 'root'
})
export class MonitorOperacionesApiService {

  private url = `${this.getUrl()}`;

  constructor(private http: HttpClient,
    private _conectionWS: ConexionService) {}

  async consultar(request:any, paginacion:IPaginationRequest){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/api/pagos/detalle?page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.POST_VALUES,request);
    return response;
  }

   async operacionesTotales(request: PagoRequest){
     let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/api/pagos/detalle/totales`,TypeRequest.POST_VALUES,request);
    return response;
  }

async catalogos(){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/api/catalogos/filtros`,TypeRequest.GET);
    return response;
  }

  /**
  * @description Asigna la data temporal
  * @returns
  * @memberOf GestionBancosService
  */
  setSaveLocalStorage(key:string,item:any) {
    localStorage.setItem(key,JSON.stringify(item));
  }

   /**
  * @description Obtiene la data temporal
  * @returns
  * @memberOf CatalogoDinamico
  */
   getSaveLocalStorage(key:string) {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }


  getUrl() {
    return 'localhost:8080'
    //return localStorage.getItem('url');
  }
}
