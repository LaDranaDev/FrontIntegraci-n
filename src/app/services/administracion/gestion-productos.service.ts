import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AltaGestionProducto } from 'src/app/bean/alta-gestionProducto.component';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
export class GestionProductosService {

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
    //return 'http://localhost:8083';
    return localStorage.getItem('url');
  }

  async getListaProductos(producto: any, paginacion: IPaginationRequest) {
    let query = "";
    for (const key in producto) {
      if (producto[key]) {
        query += `&${key}=${encodeURI(producto[key])}`;
      }
    }
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/gestion-productos/consulta?sort=cveProd&page=${paginacion.page}&size=${paginacion.size}${query}`, TypeRequest.GET);
    return response;

  }

  async getProductoById(idProduct: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/gestion-productos/consulta/${idProduct}`, TypeRequest.GET);
    return response;

  }

  async gestListaCatalogoBackend() {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/gestion-productos/catalogo-backend/consulta`, TypeRequest.GET);
    return response;
  }

  async saveProducto(altaGestionProducto: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/gestion-productos/agrega`, TypeRequest.POST_VALUES, altaGestionProducto);
    return response;
  }

  async updateProducto(altaGestionProducto: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/gestion-productos/modifica`, TypeRequest.POST_VALUES, altaGestionProducto);
    return response;
  }

  async gesperiodosId(id: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/gestion-productos/periodos/consulta/${id}`, TypeRequest.GET);
    return response;
  }

  async savePeriodo(altaPeriodo: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/gestion-productos/periodos/agrega`, TypeRequest.POST_VALUES, altaPeriodo);
    return response;
  }

  async updatePeriodo(altaPeriodo: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/gestion-productos/periodos/modifica`, TypeRequest.POST_VALUES, altaPeriodo);
    return response;
  }

  async deletePeriodo(idProd: number, dia: number) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/gestion-productos/periodos/elimina/${idProd}/${dia}`, TypeRequest.GET);
    return response;
  }

  async getContingenciaId(id: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/gestion-productos/periodos/contingencia/consulta/${id}`, TypeRequest.GET);
    return response;
  }

  async updatePeriodoContingencia(altaPeriodo: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/gestion-productos/periodos/contingecia/modifica`, TypeRequest.POST_VALUES, altaPeriodo);
    return response;
  }

  reporteXls(producto: any, user: any) {
    let query = "";
    for (const key in producto) {
      if (producto[key]) {
        query += `&${key}=${encodeURI(producto[key])}`;
      }
    }
    return this._conectionWS.peticionServicioWs(`${this.url}/gestion-productos/xls?${query}&user=${user}`, TypeRequest.GET);
  }
}
