import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { ConexionService, TypeRequest } from '../conexion.service';
import { AltaBackend } from "../../bean/alta-gestion-backend.component";
import { CambioBackend } from "../../bean/cambio-gestion-backend.component";

@Injectable({
  providedIn: 'root'
})
export class GestionBackendService {


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
    private _conectionWS: ConexionService,private http: HttpClient
  ) { }

  /**
   * @description recupera la funcion el valor de la url
  */
  getUrl() {
    //return 'http://localhost:8082';
    return localStorage.getItem('url');
  }

  async   getListaBackend(backends:any, paginacion:IPaginationRequest){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/backends?page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.GET,backends);
    return response;
  }

  async getBusquedaBackend(backend:any, nombre:string,paginacion:IPaginationRequest){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/backends/busqueda?page=0&size=10&nombre=${nombre}`,TypeRequest.GET, backend);
    return response;
  }

  async saveBackend(altaBackend:AltaBackend){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/backends`,TypeRequest.POST_VALUES,altaBackend);
    return response;
  }

  getListaProtocolo(){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/administracion/backends/consultaProtocolosAct`,TypeRequest.GET);
    return response;
  }

  async putBackend( updateBackend:any ){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/backends`,TypeRequest.PUT,updateBackend);
    return response;
  }

  async exportarBackend(usuario:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/backends/xls?nombre=&usuario=${usuario}`,TypeRequest.GET);
    return response;
  }  

  async idBack(id: any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/busquedaIdBack/${id}`,TypeRequest.GET);
    return response;
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
  * @description Obtiene la data temporal
  * @returns  
  * @memberOf CatalogoDinamico
  */
   getSaveLocalStorage(key:string) {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  
}
