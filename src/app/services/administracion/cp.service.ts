import { Injectable } from '@angular/core';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { ConexionService, TypeRequest } from '../conexion.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CpService {

  private url = `${this.getUrl()}`;

  constructor(
    private _conectionWS: ConexionService,
    private http: HttpClient
  ) { }
  
  /**
   * @description recupera la funcion el valor de la url
  */
  getUrl() {
    //return localStorage.getItem('url');//'localhost:8081';
    return localStorage.getItem('url');
  }
  consultaCp(cp:any, suc:any,paginacion:IPaginationRequest){     
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/administracion/codigopostal/getbyfiltro?page=${paginacion.page}&size=${paginacion.size}&cp=${cp}&suc=${suc}`,TypeRequest.GET);
    return response;
  }

  consultaTodosCP(paginacion:IPaginationRequest){     
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/administracion/codigopostal/getall?page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.GET);
    return response;
  }

  guardarCp(cp:any){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/administracion/codigopostal`,TypeRequest.POST_VALUES, cp);
    return response;
  }

  exportarCp(tipo: any, cp:any, su:any, user:any){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/administracion/codigopostal/reporte/${tipo}?cp=${cp}&suc=${su}&user=${user}`,TypeRequest.GET);
    return response;
  }

  updateCp(cp:any){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/administracion/codigopostal`,TypeRequest.PUT, cp);
    return response;
  }

  actCalculo(valor:any,cp:any){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/administracion/codigopostal/${valor}?cp=${cp}`,TypeRequest.PUT);
    return response;
  }

  /**
  * @description Obtiene la data temporal
  * @returns  
  * @memberOf CatalogoDinamico
  */
  getSaveLocalStorage(key:string) {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  /**
  * @description Asigna la data temporal
  * @returns  
  * @memberOf GestionBancosService
  */
  setSaveLocalStorage(key:string,item:any) {
    localStorage.setItem(key,JSON.stringify(item));
  }
}