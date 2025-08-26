import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AltaCatalogo } from "../../bean/alta-catalogo-dinamico.component";
import { IConsultaCatalogo } from "../../bean/iconsulta-catalogo-dinamico.component";
import { IPaginationRequest } from "../../pages/contingencia/request/pagination-request.component";
import { ConexionService, TypeRequest } from "../conexion.service";

@Injectable({
  providedIn: 'root'
})
export class CatalogoDinamicoService {
  private url = `${this.getUrl()}`;
  bandera: boolean = false;

  /**
   *Metodo constructor que genera una instancia,
   * se utiliza inicializar la llamadas al un
   * servicio generico de conexion y a la sesion.
   * @author NTTDATA
   * @param {ConexionService} _conectionWS la conexión
   * @param {SesionDataInfo} _session la session
  */
  constructor(private _conectionWS: ConexionService,private http: HttpClient) { }

  async getistCatalogos(paginacion:IPaginationRequest){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/catalogo-dinamico?page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.GET);
    return response;
  }

  async saveCatalogo(altaCatalogo:AltaCatalogo){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/catalogo-dinamico`,TypeRequest.POST_VALUES,altaCatalogo);
    return response;
  }

  async actualizarCatalogo(idCatalogoSelected:string,altaCatalogo:AltaCatalogo){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/catalogo-dinamico/${idCatalogoSelected}`,TypeRequest.PUT,altaCatalogo);
    return response;
  }

  async getInformacionSubCatalogo(idCatalogoSelected:string,paginacion:IPaginationRequest){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/catalogo-dinamico/sfg/regi/cata/${idCatalogoSelected}?page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.GET);
    return response;
  }

  async saveInformacionSubCatalogo(objSubCatalogo:IConsultaCatalogo){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/catalogo-dinamico/sfg/regi`,TypeRequest.POST_VALUES,objSubCatalogo);
    return response;
  }

  async updateInformacionSubCatalogo(idCatRegi:number,objSubCatalogo:IConsultaCatalogo){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/catalogo-dinamico/sfg/regi/${idCatRegi}`,TypeRequest.PUT,objSubCatalogo);
    return response;
  }

  async deleteInformacionSubCatalogo(idCatRegi:number){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/catalogo-dinamico/sfg/regi/${idCatRegi}`,TypeRequest.DELETE);
    return response;
  }

  async exportarInformacionCatalogo(idCatRegi:number, tipo:string){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/catalogo-dinamico/reporte/${tipo}/${idCatRegi}`,TypeRequest.GET);
    return response;
  }

  /**
   * @description recupera la funcion el valor de la url
  */
  getUrl() {
    //return 'http://localhost:8082'
    return localStorage.getItem('url');
  }

  /**
   * @description Asigna la data temporal
   * @returns  
   * @memberOf BuzonesService
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

  /**
   * @description Valida si existe la propiedad en el localstorage
   * @param key valor que indica como se guardo en el localstorage
  */
  validatePropertyExisteInLocalStorage(key:string){
    let banderaExist = false;
    let objectLocalStorage = this.getSaveLocalStorage(key);

    if(objectLocalStorage.hasOwnProperty('idReg')){
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

  setShowButtonModificar(band: boolean) {
    this.bandera = band;
  }

  isShowButtonModificar() {
    return this.bandera;
  }

}
