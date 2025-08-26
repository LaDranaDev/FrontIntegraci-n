import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Service que define las operaciones de la Alta de Contratos
 * 
 */
export class AltaContratosService {

  /** Url del servicio */
  private url = `${this.getUrl()}`;

  constructor(private conexionWS: ConexionService) { }

  /**
   * Metodo que realiza la busqueda de estatus de los contratos
   * 
   * @return Datos del contrato
   */
  async getEstatusContrato() {
    let response: any;
    response = await this.conexionWS.peticionServicioWs(`${this.url}/contratos/alta/getestatuscontrato`, TypeRequest.GET);
    return response;
  }

  /**
   * Metodo para obtener los datos del contrato mediante el Codigo de Cliente.
   * 
   * @param buc Codigo del cliente
   * @return Datos del contrato
   */
  async getContratoByBuc(buc: any) {
    let response: any;
    response = await this.conexionWS.peticionServicioWs(`${this.url}/contratos/alta/getcontratobybuc/${buc}`, TypeRequest.GET);
    return response;
  }

  /**
  * Metodo para obtener los datos del contrato mediante la Cuenta Eje y el Codigo de Cliente.
  * 
  * @param cuentaEje Cuenta eje
  * @return Datos del contrato
  */
  async getContratoByCuentaEje(cuentaEje: any, buc: any) {
    let response: any;
    response = await this.conexionWS.peticionServicioWs(`${this.url}/contratos/alta/getcontratobycuentaeje/${cuentaEje}/${buc}`, TypeRequest.GET);
    return response;
  }

  /**
  * Metodo para obtener los datos del contrato mediante el Numero de Contrato.
  * 
  * @param numContrato Numero de contrato
  * @param buc Codigo del cliente
  * @return Datos del contrato
  */
  async getContratoByNumContrato(numContrato: any) {
    let response: any;
    response = await this.conexionWS.peticionServicioWs(`${this.url}/contratos/alta/getcontratobynumcontrato/${numContrato}`, TypeRequest.GET);
    return response;
  }

  /**
   * Metodo que recupera el valor de la url
  */
  getUrl() {
    //return 'http://localhost:8083'
    return localStorage.getItem('url'); 
  }
}
