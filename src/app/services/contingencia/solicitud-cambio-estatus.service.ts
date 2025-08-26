import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConexionService, TypeRequest } from '../conexion.service';
import { ConsultaOperacionesRequest, InsCambioEstatusRequest } from 'src/app/bean/solicitud-cambio-estatus.components';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';

@Injectable({
  providedIn: 'root'
})
export class SolicitudCambioEstatusService {

  private url = `${this.getUrl()}`;

  /**
    *Metodo constructor que genera una instancia,
    * se utiliza inicializar la llamadas al un
    * servicio generico de conexion y a la sesion.
    * @author NTTDATA
    * @param {ConexionService} _conectionWS la conexión
    * @param {SesionDataInfo} _session la session
   */
  constructor(private _conectionWS: ConexionService, private http: HttpClient) { }

   /**
     * Metodo para realizar la busqueda de los 
     * estatus por tipo de Operacion
     */
   async findContratoByBuc(buc: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/planCalidad/${buc}`, TypeRequest.GET);
    return response;
  }


  /**
     * Metodo para realizar la busqueda de los 
     * estatus por tipo de Operacion
     */
  async findEstatusByTipoOperacion(tipoOperacion: String) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/planCalidad/estatus/${tipoOperacion}`, TypeRequest.GET);
    return response;
  }

  /**
     * Metodo para realizar la busqueda de los 
     * estatus C por tipo de Operacion
     */
  async findEstatusCByTipoOperacion(tipoOperacion: String) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/planCalidad/estatusC/${tipoOperacion}`, TypeRequest.GET);
    return response;
  }


  /**
  * Metodo para realizar  la consulta de ooperaciones
  */
  async consultarOperaciones(consultaOperacionesRequest: ConsultaOperacionesRequest, paginacion: IPaginationRequest) {
    return this._conectionWS.peticionServicioWs(`${this.url}/planCalidad/consultaOperaciones?size=${paginacion.size}&page=${paginacion.page}`, TypeRequest.POST_VALUES, consultaOperacionesRequest);
  }

  /**
 * Metodo para realizar el cambio de estatus
 */
  async insCambioEstatus(insCambioEstatusRequest: InsCambioEstatusRequest) {
    return this._conectionWS.peticionServicioWs(`${this.url}/planCalidad/insCambioEstatus`, TypeRequest.POST_VALUES, insCambioEstatusRequest);
  }


  /**
     * Metodo para recuperar el valor de la url
    */
  getUrl() {
    return localStorage.getItem('url');
  }
}
