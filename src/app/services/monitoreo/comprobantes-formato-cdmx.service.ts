import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';
import { IPaginationRequest } from 'src/app/bean/i-pagination-request';

@Injectable({
  providedIn: 'root'
})

export class ComprobanteFormatoCDMXService {
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
    //return 'http://localhost:8087';
  }

  //Obtiene la lista de los select
  getListaSelect(){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/monitoreo/vouchers-cdmx/find-vouchers-cdmx`,TypeRequest.GET);
    return response;
  }

  //Realiza la busqueda de los comprbantes conforme a los atributos
  async getBusquedaComprobantes(comprobante:any){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/monitoreo/vouchers-cdmx/find-operations-monitor`,TypeRequest.POST_VALUES, comprobante);
    return response;
  }

  //Obtiene la lista de los totales
  getCalculoTotales(comprobante:any){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/monitoreo/vouchers-cdmx/find-total`,TypeRequest.POST_VALUES, comprobante);
    return response;
  }

  //Obtiene el detalle de la operacion
  consultaDetalle(comprobante:any){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/monitoreo/vouchers-cdmx/detalle-operaciones`,TypeRequest.POST_VALUES, comprobante);
    return response;
  }

  //Manda a la pantalla de historial al apretar el botón
  obtieneHistorial(comprobante:any){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/monitoreo/vouchers-cdmx/historial-operacion/${comprobante.idOperacion}`,TypeRequest.GET);
    return response;
  }

  //Endpoint para consultar el concepto valor
  obtieneValor(lineaCaptura:any){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/monitoreo/vouchers-cdmx/concepto-valor/${lineaCaptura}`,TypeRequest.GET);
    return response;
  }


  //Endpoint para generar reporte en Excel de la consulta de operaciones
  exportar(comprobante:any){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/monitoreo/vouchers-cdmx/exportar-operaciones`,TypeRequest.POST_VALUES, comprobante);
    return response;
  }


  /**
  * @description Obtiene la data temporal
  * @returns
  * @memberOf ComprobanteFormatoCDMXService
  */
  getSaveLocalStorage(key:string) {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  /**
  * @description Asigna la data temporal
  * @returns
  * @memberOf ComprobanteFormatoCDMXService
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

    if(objectLocalStorage.hasOwnProperty('comprobante')){
      banderaExist = true;
    }

    return banderaExist;
  }

  /**
  * @description Elimina la date guardada temporalmente
  * @memberOf ComprobanteFormatoCDMXService
  */
  removeSaveLocalStorage(key:string) {
    localStorage.removeItem(key);
  }

  createVaucher(payload: any) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/monitoreo/vouchers-cdmx/exportar-operaciones/reporte/pdf`, TypeRequest.POST_VALUES, payload);
    return response;
  }

}
