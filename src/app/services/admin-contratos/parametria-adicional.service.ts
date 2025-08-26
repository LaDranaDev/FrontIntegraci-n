import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAdditionalEnviromentRequest } from '../../pages/admin-contratos/parametria-adicional/request/iadditional-enviroment-request';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
export class ParametriaAdicionalService {
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
   * Metodo para realizar el preload de la informacion
   * de parametria adicional
   */
  async getPreloadInformacionByNumContrato(request:IAdditionalEnviromentRequest){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contratos/parametrosadicionales/preLoad`,TypeRequest.POST_VALUES,request);
    return response;
  }

  /**
   * Metodo para poder realizar la peticion del guardado
   */
  async saveParametriaAdicional(request:IAdditionalEnviromentRequest){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contratos/parametrosadicionales/guardar`,TypeRequest.POST_VALUES,request);
    return response;
  }

  /**
   * Metodo para poder realizar la obtencion del archivo pdf
   */
  async getReporte(request:IAdditionalEnviromentRequest, tipo:string){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contratos/parametrosadicionales/reporte/${tipo}`,TypeRequest.POST_VALUES,request);
    return response;
  }
}
