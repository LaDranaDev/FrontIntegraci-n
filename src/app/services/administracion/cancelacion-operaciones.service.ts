import { Injectable } from '@angular/core';
import { IPaginationRequest } from 'src/app/bean/i-pagination-request';
import { ConexionService, TypeRequest } from '../conexion.service';
import { RequestBuscarArchivo, RequestCancelOpe } from 'src/app/interface/cancelOpeSearch.interface';

@Injectable({
  providedIn: 'root'
})
export class CancelacionOperacionesService {

  /** Url del servicio */
  private url = `${this.getUrl()}`;

  constructor(private conexionWS: ConexionService) { }

  
  async getContratoByBuc(buc: any) {
    let response: any;
    response = await this.conexionWS.peticionServicioWs(`${this.url}/adminCertificados/${buc}`, TypeRequest.GET);
    return response;
  }

  async getlistasEstatusContratos() {
    let response: any;
    response = await this.conexionWS.peticionServicioWs(`${this.url}/cancelarOperaciones/listaEstatusCentro`, TypeRequest.GET);
    return response;
  }

  async getlistasEstatus() {
    let response: any;
    response = await this.conexionWS.peticionServicioWs(`${this.url}/cancelarOperaciones/listaEstatusCmb`, TypeRequest.GET);
    return response;
  }

  async consultar(buscar:any) {
    let response: any;
    response = await this.conexionWS.peticionServicioWs(`${this.url}/cancelarOperaciones/buscarArchivo`, TypeRequest.POST_VALUES, buscar);
    return response;
  }

  async cancelar(data:any, idOper:any) {
    let response: any;
    response = await this.conexionWS.peticionServicioWs(`${this.url}/cancelarOperaciones/cancelaOperaciones/${idOper}`, TypeRequest.PUT, data);
    return response;
  }

  /**
   * Metodo que recupera el valor de la url
  */
  getUrl() {
    // return 'https://lightweight-gateway-mx-h2h-bo-monitoreo-dev.apps.str01.mex.dev.mx1.paas.cloudcenter.corp';
    return localStorage.getItem('url');
  }
}
