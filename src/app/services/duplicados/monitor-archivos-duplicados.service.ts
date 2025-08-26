import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';
import { HttpClient } from '@angular/common/http';
import { IPaginationRequest } from 'src/app/bean/i-pagination-request';
import { DatosRequest } from 'src/app/bean/archivos-duplicados-bean.components';
// import { IPaginationRequest } from 'src/app/bean/i-pagination-request';

@Injectable({
  providedIn: 'root'
})
export class MonitorArchivosDuplicadosService {

  private url = `${this.getUrl()}`;

   /**
   * Metodo constructor que genera una instancia,
   * se utiliza inicializar la llamadas al un
   * servicio generico de conexion y a la sesion.
   * @author NTTDATA
   * @param {ConexionService} _conectionWS la conexión
   * @param {SesionDataInfo} _session la session
  */
  constructor(private _conectionWS: ConexionService, private http: HttpClient) { }

  /**
   * @description recupera la funcion el valor de la url
  */
   getUrl() {
   return localStorage.getItem('url');
 }

  /**
   * @description se obtienen todos los registros de Layouts
  */
  getListProducts() {
    return  this._conectionWS.peticionServicioWs(`${this.url}/monitorArchivoDuplicados/catalogos`, TypeRequest.GET);
  }

  consultar(payload:any) {
    return this._conectionWS.peticionServicioWs(`${this.url}/monitorArchivoDuplicados/consulta`, TypeRequest.POST_VALUES, payload);
  }

  setMotivoRechazo(idArchivo: string, motivoRechazo:string) {
    return this._conectionWS.peticionServicioWs(`${this.url}/monitorArchivoDuplicados/motivoRechazo/${idArchivo}`, TypeRequest.POST_VALUES, { motivoRechazo });
  }

  async getFiles(body: DatosRequest) {
    let urlR = `${this.url}/monitorArchivoDuplicados/reporte/${body.extension}`;
    const response = this._conectionWS.peticionServicioWs(urlR, TypeRequest.POST_VALUES, body);
    return response;
  }

   iniciaNivelProducto( data: any) {
     return this._conectionWS.peticionServicioWs(`${this.url}/tracking/iniciaNivelProducto?codCliente=${data.buc}&nomCliente=${data.cliente}&idArchivo=${data.idArchivo}`, TypeRequest.GET);
  }

   nivelProductoDetalle(data: any, paginacion: IPaginationRequest) {
     return this._conectionWS.peticionServicioWs(`${this.url}/tracking/nivelProductoDetalle?idArchivo=${data.idArchivo}&page=${paginacion.page}&size=${paginacion.size}`, TypeRequest.GET);
  }


}
