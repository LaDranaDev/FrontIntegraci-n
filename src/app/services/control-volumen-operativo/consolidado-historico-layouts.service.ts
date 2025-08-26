import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConsolidadoHistoricoLayoutsService {
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
    //return 'https://lightweight-gateway-mx-h2h-bo-monitoreo-dev.apps.str01.mex.dev.mx1.paas.cloudcenter.corp';
    return localStorage.getItem('url');
  }

  /**
   * @description Obtiene layout histórico
  */
  async obtenerMasUsadoConsolidado() {
    let urlRequest = `${this.url}/operativo/consolidado/layout/historico`;
    const response = await this._conectionWS.peticionServicioWs(urlRequest, TypeRequest.GET);
    return response;
  }

  /**
   * @description Obtiene layout top
  */
  async obtenerTopConsolidado() {
    let urlRequest = `${this.url}/operativo/consolidado/layout/top`;
    const response = await this._conectionWS.peticionServicioWs(urlRequest, TypeRequest.GET);
    return response;
  }

  /**
   * @description Obtiene layout detail
  */
  async obtenerDetailConsolidado(idLayout: number, fecha: string) {
    let urlRequest = `${this.url}/operativo/consolidado/layout/detail/${idLayout}/${fecha}`;
    const response = await this._conectionWS.peticionServicioWs(urlRequest, TypeRequest.GET);
    return response;
  }


   /**
   * @description Obtiene reporte historico o top
  */
  async exportarHistoricoOrTopLayout(isByTop: boolean) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/operativo/consolidado/layout/reporte/${isByTop ? 'top': 'historico'}`, TypeRequest.GET);
    return response;
  }

   /**
   * @description Obtiene reporte detalle
  */
  async exportarDetalleLayout(idDetail: number, dateString: string) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/operativo/consolidado/layout/reporte/detail/${idDetail}/${dateString}`, TypeRequest.GET);
    return response;
  }
}
