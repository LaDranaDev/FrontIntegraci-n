import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';
import { IPaginationRequest } from 'src/app/bean/i-pagination-request';

@Injectable({
  providedIn: 'root'
})
export class AutorizacionEnrolamientoService {
  private url = `${this.getUrl()}`;
  update: boolean = false;

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
    //return 'http://localhost:8083';
    return localStorage.getItem('url');
  }

  /**
   * Busca los datos del contrato en base al buc
   * 
   * @param buc Codigo del cliente
   */
  async cargaDatos(buc: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/autorizacionEnrolamiento/${buc}`, TypeRequest.GET);
    return response;
  }

  /**
   * Busca la lista de solicitudes de enrolamiento
   * 
   * @param paginacion Detalles de la paginacion
   * @param request Datos de la consulta
   */
  async consultaSolicitudes(paginacion: IPaginationRequest, request: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/autorizacionEnrolamiento/consultaSolicitudes?page=${paginacion.page}&size=${paginacion.size}`, TypeRequest.POST_VALUES, request);
    return response;
  }

  /**
   * Actualiza el estatus de la solicitud de enrolamiento
   * 
   * @param request Datos de la modificacion
   */
  async modificaSolicitud(request: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/autorizacionEnrolamiento/modificaSolicitud`, TypeRequest.POST_VALUES, request);
    return response;
  }

  /**
   * Exporta en formato CSV, PDF o EXCEL la lista de solicitudes
   * 
   * @param formato Formato de exportacion
   * @param paginacion Detalles de la paginacion
   * @param request Datos de la exportacion
   */
  async exportaSolicitudes(formato: any, paginacion: IPaginationRequest, request: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/autorizacionEnrolamiento/exportaSolicitudes/${formato}?page=${paginacion.page}&size=${paginacion.size}`, TypeRequest.POST_VALUES, request);
    return response;
  }

}
