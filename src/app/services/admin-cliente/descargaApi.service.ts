import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Service que define las operaciones de la Alta de Contratos
 * 
 */
export class DescargaApiService {

  /** Url del servicio */
  private url = `${this.getUrl()}`;

  constructor(private conexionWS: ConexionService) { }

  async descargaApi() {
    let response: any;
    response = await this.conexionWS.peticionServicioWs(`${this.url}/clientes/descargaApi`, TypeRequest.GET);
    return response;
  }

  /**
   * Metodo que recupera el valor de la url
  */
  getUrl() {
    //return 'http://localhost:8088'
    return localStorage.getItem('url'); 
  }
}
