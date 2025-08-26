import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPaginationRequest } from '../../pages/administracion/gestion-alarma/request/i-pagination-request';
import { IAlarmIdsRequest } from '../../pages/administracion/gestion-alarma/request/ialarm-ids-request';
import { IAlarmaFilterRequest } from '../../pages/administracion/gestion-alarma/request/ialarma-filter-request';
import { ConexionService, TypeRequest } from '../conexion.service';
import { ComunesService } from '../comunes.service';

@Injectable({
  providedIn: 'root'
})
export class GestionAlarmaService {
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
  constructor(private _conectionWS: ConexionService,private http: HttpClient, private comun: ComunesService) { }

  /**
   * @description recupera la funcion el valor de la url
   */
  getUrl() {
    //return 'http://localhost:8082'
    return this.comun.getUrl();
  }
   
  /**
   * Metodo para realizar la peticion de la consulta de alarmas
   */
  async getListGestionAlarmas(request:IAlarmaFilterRequest,pagination:IPaginationRequest){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(
      `${this.url}/administracion/alarmas?page=${pagination.page}&size=${pagination.size}&idTipoCat=${request.idTipoCat}&estatus=${request.estatus}&fechaGeneracion=${request.fechaGenerada}&fechaAtencion=${request.fechaAtencion}`
      ,TypeRequest.GET);
    return response;
  }

  /**
   * Metodo para realizar la peticion de la consulta de alarmas atendias
   */
   async getListGestionAlarmasAtendidas(pagination:IPaginationRequest){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(
      `${this.url}/administracion/alarmas/atendida?page=${pagination.page}&size=${pagination.size}`
      ,TypeRequest.GET);
    return response;
  }

  /**
   * Metodo para realizar la peticion de la consulta de alarmas historicas
   */
  async getLlistadoAlarmasHistorica(){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(
      `${this.url}/administracion/alarmas/atendida`
      ,TypeRequest.GET);
    return response;
  }

  /**
   * Metodo para poder realizar la peticion para 
   * atender los ids
   */
  async atenderIds(objetoListAdenter:IAlarmIdsRequest){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/alarmas/pendiente`,TypeRequest.PUT,objetoListAdenter);
    return response;
  }

  /**
   * Metodo para poder generar el reporte de excel o csv
   */
  async getReporteNormal(request:IAlarmaFilterRequest, tipo:string){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/alarmas/reporte/${tipo}`,TypeRequest.POST_VALUES,request);
    return response;
  }


  /**
   * Metodo para poder generar el reporte de excel o csv historico
   */
  async getReporteHistory(tipo:string){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/alarmas/reporte/historico/${tipo}`,TypeRequest.GET);
    return response;
  }
  
    /**
   * Metodo para realizar la peticion de la consulta de alarmas Pendientes
   */
    async getAlarmasPendientes(buc:any, url: any){
      let response:any;
      response = await this._conectionWS.peticionServicioWs(
        `${url}/administracion/alarmas/pendientes?us=`+buc
        ,TypeRequest.GET);
      return response;
    }
}
