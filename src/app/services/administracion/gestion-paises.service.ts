import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaisRespuesta } from 'src/app/interface/paisRespuesta.interface';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
export class GestionPaisesService {
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
  
  async exportarPaises(tipo:string, request: any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/paises/${tipo}`,TypeRequest.POST_VALUES, request);
    return response;
  }

  async getListaPaises(paises:any, paginacion:IPaginationRequest){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/paises?page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.POST_VALUES,paises);
    return response;
  }

}
