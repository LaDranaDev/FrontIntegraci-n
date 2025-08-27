import { Injectable } from '@angular/core';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { ConexionService, TypeRequest } from '../conexion.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PagoRequest } from '../../models/pago-request.module';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaTrackingApiService {


  private url = `${this.getUrl()}`;


  /**
   *Metodo constructor que genera una instancia,
   * se utiliza inicializar la llamadas al un
   * servicio generico de conexion y a la sesion.
   * @author NTTDATA
   * @param {ConexionService} _conectionWS la conexión
   * @param {SesionDataInfo} _session la session
  */

  constructor(
    private _conectionWS: ConexionService,private http: HttpClient
  ) { }

  /**
   * @description recupera la funcion el valor de la url
  */
  getUrl() {
    return 'localhost:8080';
    //return 'http://localhost:8087'//return localStorage.getItem('url');
  }

  async pagos(request: PagoRequest,paginacion:IPaginationRequest){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/api/pagos/resumen?page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.POST_VALUES,request);
    return response;
  }

  async obtenerCatalogos(){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/api/catalogos/filtros`,TypeRequest.GET);
    return response;
  }

  async buscarProductoDivisa(request:any,paginacion:IPaginationRequest){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/api/pagos/resumen?page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.POST_VALUES ,request);
    return response;
  }

  /**
  * @description Asigna la data temporal
  * @returns
  * @memberOf GestionBancosService
  */
  setSaveLocalStorage(key:string,item:any) {
    localStorage.setItem(key,JSON.stringify(item));
  }

   /**
  * @description Obtiene la data temporal
  * @returns
  * @memberOf CatalogoDinamico
  */
   getSaveLocalStorage(key:string) {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }
}
