import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ConexionService, TypeRequest } from '../conexion.service';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';

@Injectable({
  providedIn: 'root'
})
export class MonitorOperacionesService {

  private url = `${this.getUrl()}`;

  constructor(private http: HttpClient,
    private _conectionWS: ConexionService) {}

  async consultar(monitorOperaciones:any, paginacion:IPaginationRequest){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/monitorOperaciones/consulta?page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.POST_VALUES,monitorOperaciones);
    return response;
  }
  async operacionesTotales(monitorOperaciones:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/monitorOperaciones/total`,TypeRequest.POST_VALUES,monitorOperaciones);
    return response;
  }

  async exportar(tipo:any,repor:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/monitorOperaciones/reporte/${tipo}`,TypeRequest.POST_VALUES,repor);
    return response;
  }

  async catalogos(){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/monitorOperaciones/catalogos`,TypeRequest.GET);
    return response;
  }

  async comprobante(tipo:any, comprobante:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/monitorOperaciones/comprobantes/${tipo}`,TypeRequest.POST_VALUES,comprobante);
    return response;
  }

  async detalles(detalle:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/monitorOperaciones/detalle`,TypeRequest.POST_VALUES,detalle);
    return response;
  }
  async historial(id:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/monitorOperaciones/historial/${id}`,TypeRequest.GET);
    return response;
  }
  async cambiarEstatusOperacion(data:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/monitorOperaciones/cambiarEstatus`,TypeRequest.POST_VALUES, data );
    return response;
  }
  async horario(producto:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/monitorOperaciones/consultarHorario/${producto}`,TypeRequest.GET);
    return response;
  }
  async generarXML(data:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/monitorOperaciones/generaxml`,TypeRequest.POST_VALUES, data);
    return response;
  }

  generaXMLExpMon(data:any){
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.getUrl()}/monitorOperaciones/generaxmlExp`,TypeRequest.POST_VALUES, data);
    return response;
  }

  async ruta(idProducto:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/monitorOperaciones/detalle/${idProducto}`,TypeRequest.GET);
    return response;
  }
  async exportarHistorial(id:any, user:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/monitorOperaciones/historial/${id}/reporte?&usuario=${user}`,TypeRequest.GET);
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


  getUrl() {
    //return 'http://localhost:8080'
    return localStorage.getItem('url');
  }
}
