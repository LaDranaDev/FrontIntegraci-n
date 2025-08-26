import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from './conexion.service';
import { StartupConfigService } from './wsconfig/startup-config.service';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private url = `${this.getUrl()}`;
  response: boolean | undefined;
  datosContrato: any;

  constructor(private _conectionWS: ConexionService, private config: StartupConfigService) { }

  /**
   * @description recupera la funcion el valor de la url
   */
  getUrl() {
    //return 'http://localhost:8083'
    return localStorage.getItem('url');
  }


  notificacionesPorContrato(id_cntr: String) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/notificaciones/consulta/${id_cntr}`, TypeRequest.GET);
    return response;
  }

  listaDestinatarios(idNotiCntr: String, kindDest: String) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/notificaciones/destinatarios/consulta/${idNotiCntr}/${kindDest}`, TypeRequest.GET);
    return response;
  }

  eliminaDestinatarios(idNotiCntr: String, email: String) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/notificaciones/elimina/${idNotiCntr}/${email}`, TypeRequest.GET);
    return response;
  }

  agregaDestinatarios(request: any) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/notificaciones/agrega`, TypeRequest.POST_VALUES, request);
    return response;
  }

  actualizaDestinatarios(request: any) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/notificaciones/modifica`, TypeRequest.POST_VALUES, request);
    return response;
  }

  agregaNotificaciones(request: any) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/notificaciones/notificacion-band/agrega`, TypeRequest.POST_VALUES, request);
    return response;
  }

  actualizaNotificaciones(request: any) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/notificaciones/notificacion-band/modifica`, TypeRequest.POST_VALUES, request);
    return response;
  }

  actualizaEstatusNotificaciones(request: any) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/notificaciones/notificacion-band/modificaEstatus`, TypeRequest.POST_VALUES, request);
    return response;
  }

  reportePdf(envio: any) {
    let query = "";
    for (const key in envio) {
      if (envio[key]) {
        query += `&${key}=${encodeURI(envio[key])}`;
      }
    }
    return this._conectionWS.peticionServicioWs(`${this.url}/notificaciones/pdf?${query}`, TypeRequest.GET);
  }

  reporteXls(envio: any) {
    let query = "";
    for (const key in envio) {
      if (envio[key]) {
        query += `&${key}=${encodeURI(envio[key])}`;
      }
    }
    return this._conectionWS.peticionServicioWs(`${this.url}/notificaciones/xls?${query}`, TypeRequest.GET);
  }

  reportCsv(envio: any) {
    let query = "";
    for (const key in envio) {
      if (envio[key]) {
        query += `&${key}=${encodeURI(envio[key])}`;
      }
    }
    return this._conectionWS.peticionServicioWs(`${this.url}/notificaciones/csv?${query}`, TypeRequest.GET);
  }

  datosContratoObtenido(valor: boolean) {
    this.response = valor
  }

  datos(valor: any) {
    this.datosContrato = valor
  }

  getDatos() {
    return this.datosContrato;
  }

}
