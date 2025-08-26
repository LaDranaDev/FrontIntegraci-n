import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';
import { HttpClient } from '@angular/common/http';
import { IPaginationRequest } from 'src/app/bean/i-pagination-request';

@Injectable({
  providedIn: 'root'
})
export class GestionLayoutsService {
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
    // return 'http://localhost:8083';
    return localStorage.getItem('url');
  }

  /**
   * @description se obtienen todos los registros de Layouts 
  */
  async getAllLayouts(paginacion: IPaginationRequest) {
    let urlRequest = `${this.url}/administracion/layout/consulta?page=${paginacion.page}&size=${paginacion.size}&nomLayout=`;
    const response = await this._conectionWS.peticionServicioWs(urlRequest, TypeRequest.GET);
    return response;
  }

  /**
   * @description se obtienen los datos por nombre de Layout 
  */
  async getLayoutByName(name: string, paginacion: IPaginationRequest) {
    let urlRequest = `${this.url}/administracion/layout/consulta?size=${paginacion.size}page=${paginacion.page}&nomLayout=${name}`;
    const response = await this._conectionWS.peticionServicioWs(urlRequest, TypeRequest.GET);
    return response;
  }

  /**
   * @description se obtienen el catálogo de Origenes
  */
  async getOriginCatalog(idLayout: number) {
    let urlRequest = `${this.url}/administracion/layout/consultaCongLay/${idLayout}`;
    const response = await this._conectionWS.peticionServicioWs(urlRequest, TypeRequest.GET);
    return response;
  }

  /**
   * @description Guardar datos de layout
  */
  async saveLayout(body: { nombre: string, origen: string, bandActivo: boolean, extension: string, formato: string }) {
    let urlRequest = `${this.url}/administracion/layout/registrarLayout`;
    const response = await this._conectionWS.peticionServicioWs(urlRequest, TypeRequest.POST_VALUES, body);
    return response;
  }

  /**
    * @description Guardar datos de layout
  */
  async updateLayout(body: { id: number, nombre: string, origen: string, bandActivo: boolean, extension: string, formato: string }) {
    let urlRequest = `${this.url}/administracion/layout/guardarLayout`;
    const response = await this._conectionWS.peticionServicioWs(urlRequest, TypeRequest.POST_VALUES, body);
    return response;
  }

  /**
    * @description eliminar layouts
  */
  async deleteLayouts(body: { idsBaja: number[] }) {
    let urlRequest = `${this.url}/administracion/layout/eliminarLayout`;
    const response = await this._conectionWS.peticionServicioWs(urlRequest, TypeRequest.POST_VALUES, body);
    return response;
  }

  /**
    * @description guardar productos disponibles
  */
  async saveAvailableProducts(body: { listConf: any[] }) {
    let urlRequest = `${this.url}/administracion/layout/actualizarConfigur`;
    const response = await this._conectionWS.peticionServicioWs(urlRequest, TypeRequest.POST_VALUES, body);
    return response;
  }

  /**
   * @description se obtienen los datos para la generación del XLS 
  */
  async getFile(body:any,claveUsuario:any) {
    let urlRequest = `${this.url}/administracion/layout/obtenerReporte/xls?usuario=`+claveUsuario;
    const response = await this._conectionWS.peticionServicioWs(urlRequest, TypeRequest.POST_VALUES, body);
    return response;
  }
}
