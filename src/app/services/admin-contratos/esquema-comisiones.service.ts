import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
export class EsquemaComisionesService {

  private url = `${this.getUrl()}`;

  constructor(private _conectionWS: ConexionService) { }

  /**Obtiene los catalogo*/
  catalogos() {
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/esquemaComision/catalogos`, TypeRequest.GET);
  }

  /*Obtiene la configuracion de esquemas por contrato */
  configuracioneEsquema(numContrato: string) {
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/esquemaComision/datosInicioEsquemaComisiones/${numContrato}`, TypeRequest.GET);
  }

  /** Actualiza Esquemas */
  actualizaEsquema(numContrato: String, parametros: any) {
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/esquemaComision/guardarEsquemaComisiones/${numContrato}`, TypeRequest.POST_VALUES, parametros);
  }

  actualizaEsquemaDefault(numContrato: String, parametros: any) {
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/esquemaComision/guardarEsquemaComisiones/${numContrato}`, TypeRequest.POST_VALUES, parametros);
  }

  /** Obtiene reporte de esquemas */
  obtieneReporte(body: any) {
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/esquemaComision/reporteEsquemaComisiones/${body.numContrato}/reporte/${body.formato}?usuario=${body.usuario}`, TypeRequest.GET);
  }

  obtenerConfiguracionAnual(idCodigoCntr: string) {
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/ConfiguraAnualidad/InitConfigAnualidad/${idCodigoCntr}`, TypeRequest.GET);
  }

  guardarConfiguracionAnual(body: any[], idContrato: string) {
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/ConfiguraAnualidad/guardarConfigAnualidad/${idContrato}`, TypeRequest.PUT, body);
  }

  obtieneReporteConfigAnual(body: any) {
    console.log('body', body);
    let url = `${this.url}/contratos/ConfiguraAnualidad/reporteConfigAnualidad/${body.numCuenta}/reporte/${body.formato}?`
    url += `usuario=${body.usuario}`
    if (body.idContrato) {
      url += `&idContrato=${body.idContrato}`
    }
    return this._conectionWS.peticionServicioWs(url, TypeRequest.GET);
  }

  /**
  * @description recupera la funcion el valor de la url
  */
  getUrl() {
    // return 'http://localhost:8080';
    return localStorage.getItem('url');
  }

}
