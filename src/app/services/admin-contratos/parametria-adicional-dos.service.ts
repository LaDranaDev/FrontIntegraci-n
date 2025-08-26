import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAdditionalEnviromentDosRequest } from '../../pages/admin-contratos/parametria-adicional-dos/request/iadditional-enviroment-dos-request';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
export class ParametriaAdicionalDosService {
  private url = `${this.getUrl()}`;

  /**
    * Metodo constructor que genera una instancia,
    * se utiliza inicializar la llamadas al un
    * servicio generico de conexion y a la sesion.
    * @author Felipe Cazarez
    * @param {ConexionService} _conectionWS
    * @param {SesionDataInfo} _session
    * @memberof StatusService
    */
  constructor(private _conectionWS: ConexionService,private http: HttpClient) { }

  /**
   * @description recupera la funcion el valor de la url
  */
  getUrl() {
    return localStorage.getItem('url');
    //return 'http://localhost:8083'
  }

  /**
   * Metodo para realizar el preload de la informacion de parametria adicional
   */
  async getPreloadInformacionSPEIByNumContrato(request:IAdditionalEnviromentDosRequest) {
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contratos/parametrosadicionalesdos/preLoad`, TypeRequest.POST_VALUES, request);
    return response;
  }

  /**
   * Metodo para poder realizar la peticion del guardado
   */
  async saveParametrosDosSPEI(request:IAdditionalEnviromentDosRequest) {
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contratos/parametrosadicionalesdos/guardar`, TypeRequest.POST_VALUES, request);
    return response;
  }

  /**
   * Metodo para poder realizar la peticion del guardado de chequera seguridad
   */
  async saveParametrosDosChqSeg(request:IAdditionalEnviromentDosRequest) {
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contratos/parametrosadicionalesdos/guardarcqhseg`, TypeRequest.POST_VALUES, request);
    return response;
  }

}
