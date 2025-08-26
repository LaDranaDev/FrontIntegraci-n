import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})

export class TipoCambioService {
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
    private _conectionWS: ConexionService,private http: HttpClient
  ) { }

  /**
  * @description recupera la funcion el valor de la url
  */
  getUrl() {
    return localStorage.getItem('url');
}
 
  getListaCambio(cambios: any, paginacion:IPaginationRequest){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/tipocambio/0`,TypeRequest.GET);
    return response;
  }

  getBusquedaCambio(cambio: any){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/tipocambio`,TypeRequest.POST_VALUES, cambio);
    return response;
  }

  /**
  * @description Obtiene la data temporal
  * @returns  
  * @memberOf CatalogoDinamico
  */
  getSaveLocalStorage(key:string) {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  /**
  * @description Asigna la data temporal
  * @returns  
  * @memberOf GestionbuzonesService
  */
  setSaveLocalStorage(key:string,item:any) {
    localStorage.setItem(key,JSON.stringify(item));
  }

  /**
   * @description Valida si existe la propiedad en el localstorage
   * @param key valor que indica como se guardo en el localstorage
  */
  validatePropertyExisteInLocalStorage(key:string){
    let banderaExist = false;
    let objectLocalStorage = this.getSaveLocalStorage(key);

    if(objectLocalStorage.hasOwnProperty('clave')){
      banderaExist = true;
    }

    return banderaExist;
  }

  /**
  * @description Elimina la date guardada temporalmente
  * @memberOf CatalogoDinamico
  */
  removeSaveLocalStorage(key:string) {
    localStorage.removeItem(key);
  }

}
