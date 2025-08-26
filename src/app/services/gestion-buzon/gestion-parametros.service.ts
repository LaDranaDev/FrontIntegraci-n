import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { GestionParametros } from 'src/app/interface/gestionParametroRespuesta.interface';

@Injectable({
  providedIn: 'root'
})

export class GestionParametrosdelProtocoloService {
  private url = `${this.getUrl()}`;
  currentPageParam: any = 1;

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
  
  getListaParametro(ptd:any, paginacion:IPaginationRequest){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/protocolos/get-params-by-protocol?ptd=${ptd}&pageNo=${paginacion.page}&pageSize=${paginacion.size}`,TypeRequest.GET);
    return response;
  }

  saveInformacionParametro(objParametro:GestionParametros){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/protocolos/add-param`,TypeRequest.POST_VALUES,objParametro);
    return response;
  }

  updateInformacionParametro(clave:String, objParametro:GestionParametros){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/protocolos/update-param`,TypeRequest.POST_VALUES,objParametro);
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
  * @memberOf GestionParametrosService
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

  getCurrentPageParam(){
    return this.currentPageParam;
  }

  setCurrentPageParam(page: any){
    return this.currentPageParam = page;
  }

}
