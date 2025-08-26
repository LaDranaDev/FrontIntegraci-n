import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { ConexionService, TypeRequest } from '../conexion.service';


@Injectable({
  providedIn: 'root'
})
export class GraficaEstatusClienteService {

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
    private _conectionWS: ConexionService, private http: HttpClient
  ) { }

  /**
   * @description recupera la funcion el valor de la url
  */
  getUrl() {
    //return 'http://localhost:8080';
    return localStorage.getItem('url');
  }

  async getBusquedaEstatusCliente(graEstClie: any, requireFilter?: boolean) {
    let urlRequest = `${this.url}/volumen/graficaEstatusCliente/`;
    requireFilter ? urlRequest = `${urlRequest}filtro` : urlRequest;
   const response = await this._conectionWS.peticionServicioWs(urlRequest, TypeRequest.POST_VALUES, graEstClie);
    return response;
  }

  async postExportarDatos(request: any, requireFilter?: boolean) {
    let urlRequest = `${this.url}/volumen/graficaEstatusCliente/`;
    requireFilter ? urlRequest = `${urlRequest}filtro/` : urlRequest;
   const response = await this._conectionWS.peticionServicioWs(`${urlRequest}xls`, TypeRequest.POST_VALUES, request);
    return response;
  }

}
