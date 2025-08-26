import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { ConexionService, TypeRequest } from '../conexion.service';

export interface CatalogsCanal {
  idProducto: string;
  idLayout: string;
  filtrosAux: {
    idNumeroCampo: string;
    idNombreCampo: string;
  };
}

export interface GenericResponseCatalogs {
  idCatalogo: number;
  descripcionCatalogo: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConsultaValidacionesCanalService {
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
    private _conectionWS: ConexionService,
    private http: HttpClient
  ) {}

  /**
  * @description recupera la funcion el valor de la url
  */
    getUrl() {
      //return 'http://localhost:8083';
      return localStorage.getItem('url');
    }
  
  getListaClaves(paginacion:IPaginationRequest){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/administracion/validaciones-canal/?page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.GET);
    return response;
  }

  getBusquedaClaves(canal: any, page?: number) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(
      `${this.url}/administracion/validaciones-canal?page=${page ? page : 0}`,
      TypeRequest.POST_VALUES,
      canal
    );
    return response;
  }

  async exportarClaves(request: any, typeDocument?: 'xls' | 'pdf' | 'csv'): Promise<unknown> {
    const response = await this._conectionWS.peticionServicioWs(
      `${this.url}/administracion/validaciones-canal/${typeDocument ? typeDocument : 'pdf'}`,
      TypeRequest.POST_VALUES,
      request
    );
    return response;
  }

  async getProductos(): Promise<unknown> {
    const response = this._conectionWS.peticionServicioWs(
      `${this.url}/administracion/validaciones-canal/catalogos/productos`,
      TypeRequest.GET
    );
    return response;
  }

  async getLayouts(CatProductos: any): Promise<unknown> {
    const response = this._conectionWS.peticionServicioWs(
      `${this.url}/administracion/validaciones-canal/catalogos/layout?idProducto=${CatProductos}`,
      TypeRequest.GET
    );
    return response;
  }

  async getnumCampo(CatProductos: any, CatLayout: any): Promise<unknown> {
    const response = this._conectionWS.peticionServicioWs(
      `${this.url}/administracion/validaciones-canal/catalogos/numero-campo?idProducto=${CatProductos}&idLayout=${CatLayout}`,
      TypeRequest.GET
    );
    return response;
  }

  async getnombreCampo(CatProductos: any, CatLayout: any): Promise<unknown> {
    const response = this._conectionWS.peticionServicioWs(
      `${this.url}/administracion/validaciones-canal/catalogos/nombre-campo?idProducto=${CatProductos}&idLayout=${CatLayout}`,
      TypeRequest.GET
    );
    return response;
  }

  /**
   * @description Obtiene la data temporal
   * @returns
   * @memberOf ConsultaValidacionesCanalService
   */
  getSaveLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  /**
   * @description Asigna la data temporal
   * @returns
   * @memberOf ConsultaValidacionesCanalService
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

    if (objectLocalStorage.hasOwnProperty('clave')) {
      banderaExist = true;
    }

    return banderaExist;
  }

  /**
   * @description Elimina la date guardada temporalmente
   * @memberOf ConsultaValidacionesCanalService
   */
  removeSaveLocalStorage(key: string) {
    localStorage.removeItem(key);
  }
}
