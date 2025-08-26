import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { ConexionService, TypeRequest } from '../conexion.service';
import { IDatosContrato } from '../../pages/admin-contratos/parametria-adicional/request/idatos-contrato';

@Injectable({
  providedIn: 'root'
})
export class GestionMensajeErrorService {

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

  getTablaMensajeError(codigo:any, mensaje:any, paginacion:IPaginationRequest){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/administracion/mensajes-error?codigoError=${codigo}&mensaje=${mensaje}&page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.GET);
    return response;
  }

  idMensaje(id:number){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/administracion/mensajes-error/${id}`,TypeRequest.GET);
    return response;
  }
   
  
  put(id:number, error:any){
    let response:any;
    response= this._conectionWS.peticionServicioWs(`${this.url}/administracion/mensajes-error/${id}`,TypeRequest.PUT,error);
    return response;
  }

  guardar( error:any){
    let response:any;
    response= this._conectionWS.peticionServicioWs(`${this.url}/administracion/mensajes-error`,TypeRequest.POST_VALUES,error);
    return response;
  }

  xls(exportar:any){
    let response:any;
    response= this._conectionWS.peticionServicioWs(`${this.url}/administracion/mensajes-error/xls`,TypeRequest.POST_VALUES,exportar);
    return response;
  }

  backend(){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/administracion/backends/lista`,TypeRequest.GET);
    return response;
  }
}
