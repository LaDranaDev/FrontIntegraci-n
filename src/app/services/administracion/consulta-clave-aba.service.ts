import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultaClaveAbaService {
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
      //return 'http://localhost:8082';
    }
  
  getListaClaves(clave:any, paginacion:IPaginationRequest){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/administracion/paises/bic-aba?page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.POST_VALUES,clave);
    return response;
  }

  /**
   * Metodo para poder generar el reporte de excel 
   */
  async getReporteExcel(request: any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/paises/aba/reporte/csv`,TypeRequest.POST_VALUES,request);
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
  * @memberOf GestionBancosService
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
