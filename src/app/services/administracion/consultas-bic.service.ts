import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultasBicService {

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
    }

    getListaBics(bic:any, paginacion:IPaginationRequest){
      let response:any;
      response = this._conectionWS.peticionServicioWs(`${this.url}/administracion/paises/bic-aba?page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.POST_VALUES,bic);
      return response;
    }

    exportBicXls(bic:any){
      let response:any;
      response = this._conectionWS.peticionServicioWs(`${this.url}/administracion/paises/bic-aba/reporte/csv`,TypeRequest.POST_VALUES,bic);
      return response;
    }
}
