import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
export class SolicitudEdoCuentaServiceService {

  private url = `${this.getUrl()}`;

  constructor(private _conectionWS: ConexionService) { }

  /**
   * @description recupera la funcion el valor de la url
   */
  getUrl() {
  //  return 'http://localhost:8082'
    return localStorage.getItem('url');
  }

  async findContratoByBuc(buc: any) {
    return this._conectionWS.peticionServicioWs(`${this.url}/edoCuenta/porDemanda/${buc}`, TypeRequest.GET);
  }

  async getCuentasOrdenantes(idContrato: number, numFrec: number) {
    return this._conectionWS.peticionServicioWs(`${this.url}/edoCuenta/porDemanda/cuentas/${idContrato}/${numFrec}`, TypeRequest.GET);
  }

  async getFormatosArchivo() {
    return this._conectionWS.peticionServicioWs(`${this.url}/edoCuenta/porDemanda/formatoArchivos`, TypeRequest.GET);
  }

  async getDatosFrecuencias(idContrato: number, numFrec: number) {
    return this._conectionWS.peticionServicioWs(`${this.url}/edoCuenta/porDemanda/frecuenciasAlmacenadas/${idContrato}/${numFrec}`, TypeRequest.GET);
  }

  async getConfEstadoCuenta(idContrato: number, numFrec: number) {
    return this._conectionWS.peticionServicioWs(`${this.url}/edoCuenta/porDemanda/confEstadoCuenta/${idContrato}/${numFrec}`, TypeRequest.GET);
  }

  async getIndicador(numCont : String, idContrato: number, numFrec: number) {
    return this._conectionWS.peticionServicioWs(`${this.url}/edoCuenta/porDemanda/indicador/${numCont}/${idContrato}/${numFrec}`, TypeRequest.GET);
  }

  async generarEstadoCuenta(request: any) {
    let response: any;
    response = await  this._conectionWS.peticionServicioWs(`${this.url}/edoCuenta/porDemanda/generaEstadoCuenta`, TypeRequest.POST_VALUES, request);
    return response;
  }

}
