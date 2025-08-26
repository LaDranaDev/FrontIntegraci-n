import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
export class ParametrosDelContratoService { 

  private url = `${this.getUrl()}`;
  constructor(private http: HttpClient,
    private _conectionWS: ConexionService,) {}

    async parametrosContrato(numContrato:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/parametroscontrato/contratoResponse?numeroContrato=${numContrato}`,TypeRequest.GET);
    return response;
  }

  async actualizarParametrosContrato(data:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/parametroscontrato/guardaParametros`,TypeRequest.PUT, data);
    return response;
  }

 /**
   * Metodo para exportar la información en formatos de documentos.
   */
 async exportarInformacion(formato: any, numContrato:any, user:any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/parametroscontrato/xls?formato=${formato}&numeroContrato=${numContrato}&user=${user}`, TypeRequest.GET);
    return response;
  }

  getUrl() {
    //return 'http://localhost:8082'
    return localStorage.getItem('url');
  }

}
