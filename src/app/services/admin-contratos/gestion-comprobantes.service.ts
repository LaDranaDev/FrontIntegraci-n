import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GestionComprobantesRequest } from 'src/app/bean/gestion-comprobantes-request.component';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
export class GestionComprobantesService {
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
   * Metodo para realizar la busqueda de la 
   * configuracion de los contratos y sus productos.
   */
  async findConfiguracion(numContrato: String) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/gestioncomprobantes/${numContrato}`, TypeRequest.GET);
    return response;
  }

  /**
   * Metodo para realizar el guardado de la 
   * configuracion de los contratos y sus productos.
   */
  async saveConfiguracion(gestionComprobantesRequest: GestionComprobantesRequest) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/gestioncomprobantes`, TypeRequest.POST_VALUES, gestionComprobantesRequest);
    return response;
  }

  /**
   * Metodo para exportar la información en formato excel.
   */
  async exportarInformacionCatalogo(numContrato: String, usuario: string, tipo:string) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/gestioncomprobantes/reporte/${tipo}/${numContrato}/${usuario}`, TypeRequest.GET);
    return response;
  }

  /**
   * Metodo para exportar la información en formato pdf.
   */
  async exportarInformacionCatalogoPDF(numContrato: string, usuario: string) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/gestioncomprobantes/reporte/pdf/${numContrato}/${usuario}`, TypeRequest.GET);
    return response;
  }

  /**
   * Metodo para recuperar el valor de la url
  */
  getUrl() {
    //return 'http://localhost:8083'
    return localStorage.getItem('url');
  }
}
