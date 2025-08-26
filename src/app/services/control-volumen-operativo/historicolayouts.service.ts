import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
export class HistoricolayoutsService {
  /** Url del servicio */
  private url = `${this.getUrl()}`;

  constructor(private conexionWS: ConexionService) { }

  async historico() {
    let response: any;
    response = await this.conexionWS.peticionServicioWs(`${this.url}/operativo/consolidado/layout/historico`, TypeRequest.GET);
    return response;
  }

  async top() {
    let response: any;
    response = await this.conexionWS.peticionServicioWs(`${this.url}/operativo/consolidado/layout/top`, TypeRequest.GET);
    return response;
  }
  async details(idLayout: any, fechaLayout: any) {
    let response: any;
    response = await this.conexionWS.peticionServicioWs(`${this.url}/operativo/consolidado/layout/detail/${idLayout}/${fechaLayout}`, TypeRequest.GET);
    return response;
  }
  
  async obtenerArchivoHistorico() {
    let urlRequest = `${this.url}/operativo/consolidado/layout/reporte/historico`;
    const response = await this.conexionWS.peticionServicioWs(urlRequest, TypeRequest.GET);
    return response;
  }
  async obtenerArchivoTop() {
    let urlRequest = `${this.url}/operativo/consolidado/layout/reporte/top`;
    const response = await this.conexionWS.peticionServicioWs(urlRequest, TypeRequest.GET);
    return response;
  }

  async obtenerArchivoTopDetalle(id:any,fecha:any) {
    let urlRequest = `${this.url}/operativo/consolidado/layout/reporte/detail/${id}/${fecha}`;
    const response = await this.conexionWS.peticionServicioWs(urlRequest, TypeRequest.GET);
    return response;
  }

  



   /**
    * Metodo que recupera el valor de la url
   */
   getUrl() {
     //return 'http://localhost:8080'
     return localStorage.getItem('url'); 
   }
}
