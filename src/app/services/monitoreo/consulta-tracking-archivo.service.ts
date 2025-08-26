import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { ConexionService, TypeRequest } from '../conexion.service';


@Injectable({
  providedIn: 'root'
})
export class ConsultaTrackingArchivoService {

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
    return localStorage.getItem('url');//'localhost:8081';
    //return 'http://localhost:8087'//return localStorage.getItem('url');
  }

  async getBusquedaConsultaTracking( consultaTracking:any ){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/tracking/conteo`,TypeRequest.POST_VALUES, consultaTracking);
    return response;
  }

  async inicio(){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/tracking/inicio`,TypeRequest.GET);
    return response;
  }

  async detalle(paginacion:IPaginationRequest){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/tracking/obtenerDetalle?page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.GET);
    return response;
  }
  async archivos(data:any){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/tracking/consultaTrackingNivelArchivo?idCliente=${data.codCliente}&cliente=${data.cliente}&estatus=${data.estatus}`,TypeRequest.GET);
    return response;
  }

  async tablaArchivos(data:any ,paginacion:IPaginationRequest){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/tracking/obtenerDetalleNivelArchivo?idCliente=${data.codCliente}&cliente=${data.cliente}&estatus=${data.estatus}&page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.GET);
    return response;
  }

  async iniciaNivelProducto(traking:any ,data:any){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/tracking/iniciaNivelProducto?codCliente=${traking.codCliente}&nomCliente=${traking.cliente}&idArchivo=${data.idArchivo}`,TypeRequest.GET);
    return response;
  }

  async nivelProductoDetalle(data:any, paginacion:IPaginationRequest){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/tracking/nivelProductoDetalle?idArchivo=${data.idArchivo}&page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.GET);
    return response;
  }

  async operaciones(archivo:any, traking:any,  data:any){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/tracking/iniciaNivelOperacion?idArchivo=${archivo.idArchivo}&idProducto=${data.idProducto}&codCliente=${traking.codCliente}&nomCliente=${traking.cliente}&idEstatus=${data.idEstatus}`,TypeRequest.GET);
    return response;
  }

  async totalOperaciones(data:any){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/tracking/iniciaNivelOperacion?idArchivo=${data.idArchivo}&codCliente=${data.codCliente}&nomCliente=${data.cliente}`,TypeRequest.GET);
    return response;
  }

  async tablaOperaciones(data:any, archivo:any, paginacion:IPaginationRequest){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/tracking/nivelOperacionDetalle?idArchivo=${archivo.idArchivo}&idEstatus=${data.idEstatus}&page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.GET);
    return response;
  }

  async tablaTotalOperaciones(data:any, paginacion:IPaginationRequest){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/tracking/nivelOperacionDetalle?idArchivo=${data.idArchivo}&page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.GET);
    return response;
  }

  async iniciaNivelOperacionHistorica(id:any, nombre:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/tracking/iniciaNivelOperacionHist?idReg=${id}&nomCliente=${nombre}`,TypeRequest.GET);
    return response;
  }
  async iniciaNivelOperacionHistoricaTabla(id:any, paginacion:IPaginationRequest){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/tracking/nivelOperacionDetalleHist?idReg=${id}&page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.GET);
    return response;
  }

  
  async buscarCodCliente(codigo:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/tracking/inicio?codCliente=${codigo}`,TypeRequest.GET);
    return response;
  }

  async buscarCodClienteTabla(codigo:any,  paginacion:IPaginationRequest ){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/tracking/obtenerDetalle?codCliente=${codigo}&page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.GET);
    return response;
  }

  async excelTraking(codigo:any,  usuario:any ){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/tracking/xlsGeneral?codCliente=${codigo}&usuario=${usuario}`,TypeRequest.GET);
    return response;
  }

  async excelTrackingArchivo(data:any ,id:any, nombre:any, usuario:any ){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/tracking/xlsArchivo?idCliente=${data.codCliente}&estatus=${id}&cliente=${data.cliente}&nombreArchivo=${nombre}&usuario=${usuario}`,TypeRequest.GET);
    return response;
  }

  async buscarNombreArchivo(data:any ,nombre:any, paginacion:IPaginationRequest ){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/tracking/obtenerDetalleNivelArchivo?idCliente=${data.codCliente}&estatus=${data.estatus}&cliente=${data.cliente}&nombreArchivo=${nombre}&page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.GET);
    return response;
  }

  async buscarId(data:any ,id:any, paginacion:IPaginationRequest ){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/tracking/obtenerDetalleNivelArchivo?idCliente=${data.codCliente}&estatus=${id}&cliente=${data.cliente}&page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.GET);
    return response;
  }

  async buscarProducto(id:any, estatus:any, producto:any,   paginacion:IPaginationRequest ){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/tracking/nivelProductoDetalle?idArchivo=${id}&idEstatus=${estatus}&idProducto=${producto}&page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.GET);
    return response;
  }
  async exportarProducto(id:any, estatus:any, producto:any, cod:any, user:any){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/tracking/xlsProducto?idArchivo=${id}&codCliente=${cod}&usuario=${user}&idEstatus=${estatus}&idProducto=${producto}`,TypeRequest.GET);
    return response;
  }
  async exportarOperacion(id:any, estatus:any, nom:any, user:any, cc:any){    
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/tracking/xlsDetalleOperacion?idArchivo=${id}&idEstatus=${estatus}&nomCliente=${nom}&codCliente=${cc}&usuario=${user}`,TypeRequest.GET);
    return response;
  }
  async exportarOperacionFiltroProducto(id:any, producto: any,estatus:any, nom:any, user:any, cc:any){    
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/tracking/xlsDetalleOperacion?idArchivo=${id}&idProducto=${producto}&idEstatus=${estatus}&nomCliente=${nom}&codCliente=${cc}&usuario=${user}`,TypeRequest.GET);
    return response;
  }
  async buscarOperacion(id:any, estatus:any, nom:any, paginacion:IPaginationRequest){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/tracking/nivelOperacionDetalle?idArchivo=${id}&idEstatus=${estatus}&nomCliente=${nom}&page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.GET);
    return response;
  }  

  async exportarHistorica(id:any, nom:any, user:any){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/tracking/xlsDetalleOperacionHist?idReg=${id}&nomCliente=${nom}&usuario=${user}`,TypeRequest.GET);
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
