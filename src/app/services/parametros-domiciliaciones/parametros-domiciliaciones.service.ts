import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import {EmisoraRequest} from 'src/app/bean/parametros-domiciliaciones.component';

@Injectable({
  providedIn: 'root'
})
export class ParametrosDomiciliacionesService {

  private url = `${this.getUrl()}`;

  constructor(private _conectionWS: ConexionService) { }

   /**
   * @description recupera la funcion el valor de la url
   */
   getUrl() {
    // return 'https://lightweight-gateway-mx-h2h-bo-monitoreo-dev.apps.str01.mex.dev.mx1.paas.cloudcenter.corp';
    return localStorage.getItem('url');
  }

/**
   * Realiza la consulta paginada de cuentas con el filtro
   * @param emisoraRequest datos de consulta
   * @param paginacion datos de paginacion
   * @returns retorna objeto con la informacion aconsultar
   */
async consultarEmisoras(emisoraRequest: EmisoraRequest,paginacion: IPaginationRequest) {
  return this._conectionWS.peticionServicioWs(`${this.url}/parametrosDomi/consulta?size=${paginacion.size}&page=${paginacion.page}`,TypeRequest.POST_VALUES, emisoraRequest);  
}

/**
   * Realiza la consulta de si el producto esta activo en la aplicacion
	 * y verifica si el producto esta asociado al contrato ingresado
	 * regresando un mensaje segun sea el caso
   * @param numContrato cadena de condicion
   * @returns retorna codigo de consulta
   */
async verificaProducto(numContrato : string) {
  return this._conectionWS.peticionServicioWs(`${this.url}/parametrosDomi/verificaProducto/${numContrato}`,TypeRequest.GET);  
}

/**
   * Realiza la consulta a la transaccion
   * @param emisora String
   * @returns retorna con el resultado de la consulta
   */
async consultarO401(emisora : string) {
  return this._conectionWS.peticionServicioWs(`${this.url}/parametrosDomi/consultarO401/${emisora}`,TypeRequest.GET);  
}

/**
   * Funcion que devuelve el numero de contrato 
	 * o 0 sino existe la emisora activa en el contrato
	 * o -1 si existe algun error en la consulta
   * @param emisoraRequest datos de consulta
   * @returns retorna objeto con la informacion aconsultar
   */
async existeEmisoraContrato(emisoraRequest: EmisoraRequest) {
  return this._conectionWS.peticionServicioWs(`${this.url}/parametrosDomi/existeEmisoraContrato`,TypeRequest.POST_VALUES, emisoraRequest);  
}

/**
   * Realiza la para el registro de Emisora
   * @param emisoraRequest datos de consulta
   * @returns retorna objeto con la informacion aconsultar
   */
async registrarEmisora(emisoraRequest: EmisoraRequest) {
  return this._conectionWS.peticionServicioWs(`${this.url}/parametrosDomi/registrarEmisora?size=10&page=0`,TypeRequest.POST_VALUES, emisoraRequest);  
}

/**
   * Consulta el reporte de parametros domiciliaciones xml
   * @param emisoraRequest datos de consulta
   * @returns retorna reporte base 64
   */
async getReport(emisoraRequest: EmisoraRequest, paginacion: any): Promise<unknown>{
  return await this._conectionWS.peticionServicioWs(`${this.url}/parametrosDomi/obtenerReporte/xls?size=${paginacion.size}&page=${paginacion.page}`, TypeRequest.POST_VALUES, emisoraRequest);
}


/**
   * guarda emisora
   * @param emisoraRequest datos de consulta
   * @returns retorna datos
   */
async actualizaEmisora(emisoraRequest: any): Promise<unknown>{
  return await this._conectionWS.peticionServicioWs(`${this.url}/parametrosDomi/actualizaEmisora`, TypeRequest.POST_VALUES, emisoraRequest);
}

}
