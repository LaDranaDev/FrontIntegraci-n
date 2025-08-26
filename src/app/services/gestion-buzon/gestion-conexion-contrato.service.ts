import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPaginationRequest } from 'src/app/pages/administracion/gestion-alarma/request/i-pagination-request';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
export class GestionConexionContratoService {

  constructor(
    private _conectionWS: ConexionService,private http: HttpClient
  ) { }

  private url = `${this.getUrl()}`;

  /**
   * @description recupera la funcion el valor de la url
  */
  getUrl() {
    
    return localStorage.getItem('url');
  }

  /**
    * @description Asigna la data temporal
    * @returns  
    * @memberOf parametrosService
    */
  setSaveLocalStorage(key:string,item:any) {
    localStorage.setItem(key,JSON.stringify(item));
  }

  /**
      * @description Obtiene la data temporal
      * @returns  
      * @memberOf parametrosService
      */
  getSaveLocalStorage(key:string) {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  async exportarGestionConexionContrato(tipo:string, request: any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/conexion-contratos/${tipo}`,TypeRequest.POST_VALUES, request);
    return response;
  }

  async gestionConexionContrato(conexionContratos:any, paginacion:IPaginationRequest){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/conexion-contratos?page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.POST_VALUES,conexionContratos);
    return response;
  }

  async conexionProtocolos(conexionProtocolo:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/conexion-contratos/conexion-protocolos`,TypeRequest.POST_VALUES,conexionProtocolo);
    return response;
  }

  async putGet(putget:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/conexion-contratos/inicio-put-get`,TypeRequest.POST_VALUES,putget);
    return response;
  }

  async check(check:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/conexion-contratos/actualizar-estado-registro`,TypeRequest.POST_VALUES,check);
    return response;
  } 
  async checkConfi(check:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/conexion-contratos/activa-desactiva-put-get`,TypeRequest.POST_VALUES,check);
    return response;
  } 

  async modificar(modifica:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/conexion-contratos/editar-parametros-contrato`,TypeRequest.POST_VALUES,modifica);
    return response;
  }

  async protocolo(protocolo:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/conexion-contratos/consultar-protocolos`,TypeRequest.POST_VALUES,protocolo);
    return response;
  }

  async guardar(guardar:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/conexion-contratos/guardar-parametros-protocolo`,TypeRequest.POST_VALUES,guardar);
    return response;
  }

  async configurar(configuracion:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/conexion-contratos/ver-agrega-put-get`,TypeRequest.POST_VALUES,configuracion);
    return response;
  }

  async nuevo(nev:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/conexion-contratos/guardar-put-get`,TypeRequest.POST_VALUES,nev);
    return response;
  }
}
