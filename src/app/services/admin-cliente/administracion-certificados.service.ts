import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
export class AdministracionCertificadosService {
  /** Url del servicio */
  private url = `${this.getUrl()}`;

  constructor(private conexionWS: ConexionService) { }

  async obtenerCertificado(data: any) {
    let response: any;
    response = await this.conexionWS.peticionServicioWs(`${this.url}/adminCertificados/consultaCert`, TypeRequest.POST_VALUES, data);
    return response;
  }
  async descargar(data: any) {
    let response: any;
    response = await this.conexionWS.peticionServicioWs(`${this.url}/adminCertificados/descargaCert`, TypeRequest.POST_VALUES, data);
    return response;
  }

  async consultaInformacionCliente(buc: any) {
    let response: any;
    response = await this.conexionWS.peticionServicioWs(`${this.url}/adminCertificados/${buc}`, TypeRequest.GET);
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
