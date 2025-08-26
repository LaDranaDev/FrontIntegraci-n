import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Service que define las operaciones de la Productos del Contrato
 * 
 */
export class ProductosContratoService {

  /** Url del servicio */
  private url = `${this.getUrl()}`;

  constructor(private conexionWS: ConexionService) { }

  /**
   * Metodo que realiza la busqueda de los productos de un contrato especifico
   * 
   * @param numContrato Numero de contrato
   * @param buc Codigo de cliente
   * @return Datos del contrato
   */
  async findProductos(numContrato: any, buc: any) {
    let response: any;
    response = await this.conexionWS.peticionServicioWs(`${this.url}/contratos/productos/${numContrato}/${buc}`, TypeRequest.GET);
    return response;
  }

    /**
   * Metodo para obtener el reporte de los productos del contrato en formato PDF
   * 
   * @param numContrato Numero de contrato
   * @param usuario Usuario de la sesion actual
   * @return Datos del contrato
   */
  async getReporte(numContrato: any, usuario: any, tipo:string) {
    let response: any;
    response = await this.conexionWS.peticionServicioWs(`${this.url}/contratos/productos/reporte/${tipo}?numContrato=${numContrato}&usuario=${usuario}`, TypeRequest.GET);
    return response;
  }
  async getEstatusContrato() {
    let response: any;
    response = await this.conexionWS.peticionServicioWs(`${this.url}/contratos/alta/getestatuscontrato`, TypeRequest.GET);
    return response;
  }



  async guardarProductos(request: any) {
   return this.conexionWS.peticionServicioWs(`${this.url}/contratos/productos/save`, TypeRequest.POST_VALUES,request);
  }

  async validaCtaConfirming(numCta: any, buc: any) {
    return this.conexionWS.peticionServicioWs(`${this.url}/contratos/productos/validatectaconf/${numCta}/${buc}`, TypeRequest.GET);
   }

  /**
   * Metodo que recupera el valor de la url
  */
  getUrl() {
    return localStorage.getItem('url'); 
//    return 'http://localhost:8083'
  }
}
