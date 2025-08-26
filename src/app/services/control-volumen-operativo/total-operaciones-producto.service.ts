import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
export class TotalOperacionesProductoService {

  constructor(private _conectionWS: ConexionService) { }

  async getOpByProduct(request: any): Promise<unknown>{
   return await this._conectionWS.peticionServicioWs(`${this.getUrl()}/contratos/operativo/totalOperacionesProducto`, TypeRequest.POST_VALUES, request);
  }

  async getReport(request: any): Promise<unknown>{
   return await this._conectionWS.peticionServicioWs(`${this.getUrl()}/contratos/operativo/totalOperacionesProducto/xls`, TypeRequest.POST_VALUES, request);
  }

  async product(): Promise<unknown>{
    return await this._conectionWS.peticionServicioWs(`${this.getUrl()}/contratos/operativo/listaEstatusCbo`, TypeRequest.GET);
   }


  /**
   * @description recupera la funcion el valor de la url
  */
  getUrl() {
    //return 'http://localhost:8083';
    return localStorage.getItem('url');
  }
}
