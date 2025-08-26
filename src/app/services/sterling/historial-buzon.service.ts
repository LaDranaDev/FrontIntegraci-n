import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root',
})
export class GraficaHistorialBuzonService {
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
  ) { }

  /**
   * @description recupera la funcion el valor de la url
   */
  getUrl() {
    //return 'localhost:8080';
    return localStorage.getItem('url');
  }

  async getListaBuzon(
    buzones?: any,
    paginacion?: IPaginationRequest
  ): Promise<unknown> {
    let response: any;
    if (paginacion) {
      response = this._conectionWS.peticionServicioWs(
        `${this.url}/voloper/historialbuzon/page=${paginacion.page}&size=${paginacion.size}`,
        TypeRequest.GET
      );
    } else {
      response = this._conectionWS.peticionServicioWs(
        `${this.url}/voloper/historialbuzon`,
        TypeRequest.GET
      );
    }
    return response;
  }

  getBusquedaBuzon(
    buzones: any, paginacion: IPaginationRequest
  ) {
    const response = this._conectionWS.peticionServicioWs(
      `${this.url}/voloper/historialbuzon/buscar/&page=${paginacion.page}&size=${paginacion.size}`,
      TypeRequest.GET
    );
    return response;
  }

  getBusquedaBuzonAnual(
    mailbox: string,
    size: boolean,
    total: boolean,
    anio: number
  ): Promise<unknown> {
    const response = this._conectionWS.peticionServicioWs(
      `${this.url}/voloper/historialbuzon/buscar?buzon=${mailbox}&tamano=${size}&total=${total}&cmbAnual=${anio}`,
      TypeRequest.GET
    );
    return response;
  }

  exportGraph(
    mailbox: string,
    size: boolean,
    total: boolean,
    anio: string,
    usuario:string | null
  ): Promise<unknown> {
    const response = this._conectionWS.peticionServicioWs(
      `${this.url}/voloper/historialbuzon/xls?buzon=${mailbox}&tamano=${size}&total=${total}&cmbAnual=${anio}&usuario=${usuario}`,
      TypeRequest.GET
    );
    return response;
  }

  getBusquedaHistorialBuzon(buzon: any) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(
      `${this.url}/volumen/graficaTamanoBuzon/puntosBuzon`,
      TypeRequest.POST_VALUES,
      buzon
    );
    return response;
  }

  getXlsHistorialBuzon(request: any) {
    let response: any;

    response = this._conectionWS.peticionServicioWs(
      `${this.url}/volumen/graficaTamanoBuzon/xls`,
      TypeRequest.POST_VALUES,
      request
    );

    return response;
  }

  /**
   * @description Obtiene la data temporal
   * @returns
   * @memberOf CatalogoDinamico
   */
  getSaveLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  /**
   * @description Asigna la data temporal
   * @returns
   * @memberOf GestionbuzonesService
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
   * @memberOf CatalogoDinamico
   */
  removeSaveLocalStorage(key: string) {
    localStorage.removeItem(key);
  }
}
