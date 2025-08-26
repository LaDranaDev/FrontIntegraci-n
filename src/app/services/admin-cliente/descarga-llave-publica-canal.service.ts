import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
export class DescargaLlavePublicaCanalService {
  private url = `${this.getUrl()}`;

  /** *Metodo constructor que genera una instancia,
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
    //return 'http://localhost:8088';
    return localStorage.getItem('url');
  }

  /**
   * Busca los datos del contrato en base al buc
   * 
   * @param buc Codigo del cliente
   */
  async findContratoByBuc(buc: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/clientes/descargaLlavePublicaCanal/${buc}`, TypeRequest.GET);
    return response;
  }

  /**
  * Consulta la lista de llaves publicas del contrato
  * 
  * @param numContrato Numero de contrato
  */
  async findLlavesPub(numContrato: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/clientes/descargaLlavePublicaCanal/findLlavesPub/${numContrato}`, TypeRequest.GET);
    return response;
  }

  /**
  * Descarga la llave publica del contrato
  * 
  * @param numContrato Numero de contrato
  * @param fecha Fecha de creacion
  */
  async dowloadLlavePub(numContrato: any, fecha: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/clientes/descargaLlavePublicaCanal/downloadLlavesPub?numContrato=${numContrato}&fecha=${fecha}`, TypeRequest.GET);
    return response;
  }
}
