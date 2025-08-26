import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { ConexionService, TypeRequest } from '../conexion.service';
import { CierreProductoRespuesta } from 'src/app/interface/cierreProductoRespuesta.interface';


@Injectable({
  providedIn: 'root'
})
export class CierreProductosService {

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
    //return localStorage.getItem('url');//'localhost:8081';
    return localStorage.getItem('url');
  }

  async getListacierreProd(paginacion: IPaginationRequest) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contingencia/cierreProductos`, TypeRequest.GET);
    return response;
  }

  async updateCierreProd(producto: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contingencia/cierreProductos/${producto}`, TypeRequest.PUT);
    return response;
  }

}
