import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TotalOperacionesClienteService {
  private url = `${this.getUrl()}`;

  /**
   * Metodo constructor que genera una instancia,
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
    // return 'http://localhost:8082';
    return localStorage.getItem('url');
  }

  /**
   * @description se obtienen los productos por monto u operación 
  */
  async obtenerOperacionesCliente(body: any) {
    let urlRequest = `${this.url}/contratos/operativo/totalOperacionesCliente`;
    const response = await this._conectionWS.peticionServicioWs(urlRequest, TypeRequest.POST_VALUES, body);
    return response;
  }

  /**
   * @description se obtienen los datos para la generación del XLS 
  */
  async obtenerExcel(body: any) {
    let urlRequest = `${this.url}/contratos/operativo/totalOperacionesCliente/xls`;
    const response = await this._conectionWS.peticionServicioWs(urlRequest, TypeRequest.POST_VALUES, body);
    return response;
  }
}
