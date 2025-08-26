import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { ConexionService, TypeRequest } from '../conexion.service';
import { AltaSucursal } from 'src/app/bean/alta-gestion-sucursal.component';


@Injectable({
  providedIn: 'root'
})
export class GestionSucursalesService {
  /** Url del servicio de Gestion de Sucursales */
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
    return localStorage.getItem('url');//'localhost:8081';
    //return 'http://localhost:8082'
  }

  /** 
   * Obtiene todas las sucursales disponibles 
   * 
   * @param paginacion Datos de la paginacion
   */
  async getAllSucursales(paginacion: IPaginationRequest) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/sucursales/getall?page=${paginacion.page}&size=${paginacion.size}`, TypeRequest.GET,);
    return response;
  }

  /** 
 * Obtiene todas las sucursales en base a la sucursal y/o cp
 * 
 * @param suscursales Lista de sucursales
 * @param sucursal Sucursal
 * @param cp Codigo postal
 */
  async getSucursalesByFiltro(sucursal: string, cp: string) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/sucursales/getbyfiltro?page=0&size=10&sucursal=${sucursal}&cp=${cp}`, TypeRequest.GET,);
    return response;
  }

  /** Guarda los datos de una nueva sucursal
   * 
   * @param altaSucursal Datos de la sucursal
   */
  async saveSucursal(altaSucursal: AltaSucursal) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/sucursales`, TypeRequest.POST_VALUES, altaSucursal);
    return response;
  }

  /** Modifica los datos una sucursal existente
   * 
   * @param altaSucursal Datos de la sucursal
   */
  async updateSucursal(altaSucursal: AltaSucursal) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/sucursales`, TypeRequest.PUT, altaSucursal);
    return response;
  }

  /** Elimina las sucursales
   * 
   * @param ids Identificadores de sucursales a eliminar
   */
  async deleteSucursal(ids: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/sucursales/${ids}`, TypeRequest.DELETE);
    return response;
  }

  /** 
   * Exporta las sucursales a formato PDF
   * 
   * @param sucursal Sucursal
   * @param cp Codigo postal
   */
  async exportSucursales(sucursal: string, cp: string, tipo:string) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/sucursales/reporte/${tipo}?sucursal=${sucursal}&cp=${cp}`, TypeRequest.GET);
    return response;
  }
  /**
  * @description Elimina la date guardada temporalmente
  * @memberOf parametrosService
  */
  removeSaveLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  /**
  * @description Asigna la data temporal
  * @returns  
  * @memberOf parametrosService
  */
  setSaveLocalStorage(key: string, item: any) {
    localStorage.setItem(key, JSON.stringify(item));
  }

  /**
    * @description Valida si existe la propiedad en el localstorage
    * @param key valor que indica como se guardo en el localstorage
    */
  validatePropertyExisteInLocalStorage(key: string) {
    let banderaExist = false;
    let objectLocalStorage = this.getSaveLocalStorage(key);

    if (objectLocalStorage.hasOwnProperty('sucursal')) {
      banderaExist = true;
    }

    return banderaExist;
  }

  /**
    * @description Obtiene la data temporal
    * @returns  
    * @memberOf parametrosService
    */
  getSaveLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

}
