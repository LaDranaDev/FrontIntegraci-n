import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { ConexionService, TypeRequest } from '../conexion.service';


@Injectable({
  providedIn: 'root'
})
export class GraficaArchivosClienteService {

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
    //return 'https://lightweight-gateway-mx-h2h-bo-monitoreo-dev.apps.str01.mex.dev.mx1.paas.cloudcenter.corp';
    return localStorage.getItem('url');
    //return 'http://localhost:8080';
  }

  getBusquedaGrafArchClie(datos:any){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/volumen/graficaarchivosclientes?codigoCliente=${datos.codigoCliente}&operaciones=${datos.operaciones}&monto=${datos.monto}&fechaInicio=${datos.fechaInicio}&fechaFin=${datos.fechaFin}`,TypeRequest.GET);
    return response;
  }

  //Endpoint para generar reporte en Excel de la consulta de operaciones
  exportar(datos:any){
    let response:any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/volumen/graficaarchivosclientes/xls?codigoCliente=${datos.codigoCliente}&operaciones=${datos.operaciones}&monto=${datos.monto}&fechaInicio=${datos.fechaInicio}&fechaFin=${datos.fechaFin}`,TypeRequest.GET);
    return response;
  }

}
