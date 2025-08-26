import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
export class EnvioArchivosService {
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
    //return 'http://localhost:8086';
    return localStorage.getItem('url');
  }

  /**
   * Busca los datos del contrato en base al buc
   * 
   * @param buc Codigo del cliente
   */
  async findContratoByBuc(buc: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contingencia/envioArchivos/${buc}`, TypeRequest.GET);
    return response;
  }

  /**
  * Envia el archivo de cuentas ordenantes
  * 
  * @param datosContrato Datos del contrato
  * @param archivo Archivo de cuentas ordenantes
  * 
  */
  async uploadArchivo(datosContrato: any, archivo: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contingencia/envioArchivos/${datosContrato.bucCliente}/${datosContrato.idContrato}/${datosContrato.numContrato}/${datosContrato.razonSocial}`, TypeRequest.POST_VALUES, archivo);
    return response;
  }
}
