import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';

@Injectable({
  providedIn: 'root',
})
export class GraficaClienteService {
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
    //return 'http://localhost:8080';
    return localStorage.getItem('url');
  }

  getListaGraficas(graficas: any) {
    const response = this._conectionWS.peticionServicioWs(
      `${this.url}/volumen/graficaclientes?codigoCliente=${graficas.codigoCliente}&operaciones=${graficas.operaciones}&monto=${graficas.monto}&fechaInicio=${graficas.fechaInicio}&fechaFin=${graficas.fechaFin}`,
      TypeRequest.GET
    );
    return response;
  }
  getExcel(graficas: any) {
    const response = this._conectionWS.peticionServicioWs(
      `${this.url}/volumen/graficaclientes/xls?codigoCliente=${graficas.codigoCliente}&operaciones=${graficas.operaciones}&monto=${graficas.monto}&fechaInicio=${graficas.fechaInicio}&fechaFin=${graficas.fechaFin}`,
      TypeRequest.GET
    );
    return response;
  }

  getBusquedaGrafica(graficas: any, paginacion: IPaginationRequest) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(
      `${this.url}/volumen/graficaclientes?codigoCliente=${graficas.codigoCliente}&operaciones=${graficas.operaciones}&monto=${graficas.monto}&fechaInicio=${graficas.fechaInicio}&fechaFin=${graficas.fechaFin}`,
      TypeRequest.GET
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
   * @memberOf GestiongraficasService
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
