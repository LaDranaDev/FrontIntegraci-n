import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from './conexion.service';
import { StartupConfigService } from './wsconfig/startup-config.service';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';

@Injectable({
  providedIn: 'root'
})
export class MonitorArchivosEnCurso {

  private url = `${this.getUrl()}`;
  response: boolean | undefined;
  datosContrato: any;


  constructor(private _conectionWS: ConexionService, private config: StartupConfigService) { }


  /**
   * @description recupera la funcion el valor de la url
   */
  getUrl() {
    return localStorage.getItem('url');
  }


  async consultaMonitorArchivosEnCurso(request: any) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/monitoreo/archivosEnCurso/consulta`,TypeRequest.POST_VALUES, request);  
    return response
  }

  async consultar(monitorOperaciones:any, paginacion:IPaginationRequest){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/monitoreo/archivosEnCurso/consulta?page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.POST_VALUES,monitorOperaciones);
    return response;
  }

  async consultaNivelProducto(idArchivo: string, idProducto: number, idEstatus: number) {
    if(idProducto === null || Number.isNaN(idProducto)){
      idProducto = 0;
    }
    if(idEstatus === null || Number.isNaN(idEstatus)){
      idEstatus = 0;
    }
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/monitoreo/archivosEnCurso/nivelProducto/${idArchivo}/${idProducto}/${idEstatus}`, TypeRequest.GET);
    return response;
  }

  async consultaNivelOperacion(idArchivo: string, idProducto: number, idEstatus: number) {
    if(idProducto === null || Number.isNaN(idProducto)){
      idProducto = 0;
    }
    if(idEstatus === null || Number.isNaN(idEstatus)){
      idEstatus = 0;
    }
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/monitoreo/archivosEnCurso/nivelOperacion/${idArchivo}/${idProducto}/${idEstatus}`, TypeRequest.GET);
    return response;
  }

  async consultaNivelOperacionHistorico(idReg: number) {
    if(idReg === null || Number.isNaN(idReg)){
      idReg = 0;
    }
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/monitoreo/archivosEnCurso/nivelOperacionHistorica/${idReg}`, TypeRequest.GET);
    return response;
  }

  async consultaCatEstatus() {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/monitoreo/archivosEnCurso/catEstatus`, TypeRequest.GET);
    return response;
  }

  async consultaCatProducto() {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/monitoreo/archivosEnCurso/catProductos`, TypeRequest.GET);
    return response;
  }

  async consultaCatEstatusProd() {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/monitoreo/archivosEnCurso/catEstatusProd`, TypeRequest.GET);
    return response;
  }

  async consultaCatProductoProd() {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/monitoreo/archivosEnCurso/catProductosProd`, TypeRequest.GET);
    return response;
  }

  
  async  exportMonitorArchivos(request: any) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/monitoreo/archivosEnCurso/xlsArchivosEnCurso`,TypeRequest.POST_VALUES, request);  
    return response;
  }

  datosContratoObtenido(valor: boolean) {
    this.response = valor
  }

  datos(valor: any) {
    this.datosContrato = valor
  }

  getDatos() {
    return this.datosContrato;
  }

}
