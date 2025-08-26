import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { GestionProtocolos } from 'src/app/interface/gestionProtocoloRespuesta.interface';

@Injectable({
  providedIn: 'root'
})

export class GestionProtocolosService {
  private url = `${this.getUrl()}`;
  currentPage: any = 1;

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
    //return 'http://localhost:8083';
    }
  
  getListaProtocolos(protocolo:any, paginacion:IPaginationRequest){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/protocolos/get-all-protocols?name=${protocolo.nombre}&pageNo=${paginacion.page}&pageSize=${paginacion.size}`,TypeRequest.GET);
    return response;
  }

  saveInformacionProtocolo(objProtocolo:GestionProtocolos){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/protocolos/add-protocol`,TypeRequest.POST_VALUES, objProtocolo);
    return response;
  }

  updateInformacionProtocolo(objProtocolo:GestionProtocolos){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/protocolos/update-protocol`,TypeRequest.POST_VALUES, objProtocolo);
    return response;
  }

  getBusquedaProtocolo(protocolo:any, paginacion:IPaginationRequest){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/protocolos/get-all-protocols?name=${protocolo.nombre}&pageNo=${paginacion.page}&pageSize=${paginacion.size}`,TypeRequest.GET);
    return response;
  }

  exportarTodo(request: any){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/protocolos/xls`,TypeRequest.POST_VALUES, request);
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
  * @memberOf GestionProtocoloService
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

  getCurrentPage(){
    return this.currentPage;
  }

  setCurrentPage(page: any){
    return this.currentPage = page;
  }

}
