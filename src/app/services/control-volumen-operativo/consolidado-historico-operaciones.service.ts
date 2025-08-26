import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConsolidadoHistoricoOperacionesService {
  private url = `${this.getUrl()}`;

  /**
   * Metodo constructor que genera una instancia,
   * se utiliza inicializar la llamadas al un
   * servicio generico de conexion y a la sesion.
   * @author NTTDATA
   * @param {ConexionService} _conectionWS la conexión
   * @param {SesionDataInfo} _session la session
  */

  constructor(
    private _conectionWS: ConexionService, private http: HttpClient
  ) { }

  /**
   * @description recupera la funcion el valor de la url
  */
  getUrl() {
    //return 'http://localhost:8080';
    return localStorage.getItem('url');
  }

  /**
   * @description se obtiene la información del año actual
  */
  async obtenerOperacionesAnioActual() {
    let date = new Date();
    let anio = date.getFullYear();
    let urlRequest = `${this.url}/operativo/consolOpeBuscar/${anio}`;
    const response = await this._conectionWS.peticionServicioWs(urlRequest, TypeRequest.GET);
    return response;
  }

  /**
   * @description se obtiene la información del año anterior
  */
  async obtenerOperacionesAnioAnterior() {
    let urlRequest = `${this.url}/operativo/consolOpeBuscar/anterior`;
    const response = await this._conectionWS.peticionServicioWs(urlRequest, TypeRequest.GET);
    return response;
  }

  /**
   * @description se obtiene el detalle de la fecha seleccionada
  */
  async obtenerDetalleOperacion(fecha: string) {
    let urlRequest = `${this.url}/operativo/consolOpeBuscar/detalleOpe/${fecha}`;
    const response = await this._conectionWS.peticionServicioWs(urlRequest, TypeRequest.GET);
    return response;
  }

  /**
   * @description se obtiene el reporte en formato xlsx de la información del año actual 
  */
  async obtenerReportOperacionesAnioActual(tipoBusqueda: string) {
    let date = new Date();
    let anio = date.getFullYear();
    let fecha = 'current';
    if( tipoBusqueda === 'last') {
      anio = anio-1;
      fecha = "anterior";
    }
    let urlRequest = `${this.url}/operativo/consolOpeBuscar/descargar/${fecha}`;
    const response = await this._conectionWS.peticionServicioWs(urlRequest, TypeRequest.GET);
    return response;
  }

  /**
   * @description se obtiene el reporte en formato xlsx del detalle de la fecha seleccionada
  */
  async obtenerReportDetalleOperacion(fecha: string) {
    let urlRequest = `${this.url}/operativo/consolOpeBuscar/descargarDet/${fecha}`;
    const response = await this._conectionWS.peticionServicioWs(urlRequest, TypeRequest.GET);
    return response;
  }

  setSaveLocalStorage(key:string,item:any) {
    localStorage.setItem(key,JSON.stringify(item));
  }

   getSaveLocalStorage(key:string) {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }


}
