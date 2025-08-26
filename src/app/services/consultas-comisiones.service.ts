import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from './conexion.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultasComisionesService {
  
  private url = `${this.getUrl()}`;


  constructor(private _conectionWS: ConexionService) { }
  
  /**Consulta estatus comision. */
  catalogoEstatus(){
    let response:any = this._conectionWS.peticionServicioWs(`${this.url}/comisiones/catalogos/estatusComision`, TypeRequest.GET);
    return response;
  }
  
  /** Consulta productos comision. */
  catalogoProductos(){
    let response:any = this._conectionWS.peticionServicioWs(`${this.url}/comisiones/catalogos/productosComision`, TypeRequest.GET);
    return response;
  }

  consultaComisiones(params:any){
 
    let query = "";
    for (const key in params) {
      if (params[key]) {
        
        query += this.evaluate(key, params)
      }
    }
    let response:any = this._conectionWS.peticionServicioWs(`${this.url}/comisiones/consultas/comisiones/?${query.toString()}`, TypeRequest.GET);
    return response;
  }

  modificaCuentaCobro(request: any) {
    return this._conectionWS.peticionServicioWs(`${this.url}/comisiones/modificaCuentaCobro`, TypeRequest.POST_VALUES, request);
  }

  reporteComisiones(usuario: string, formato: string, params: any) {
    const query = new URLSearchParams();
    for (const key in params) {
      if (params[key]) query.set(key, params[key]);
    }
    return this._conectionWS.peticionServicioWs(`${this.url}/comisiones/reportes/${usuario}/comisiones/${formato}?${query.toString()}`, TypeRequest.GET);
  }

  anularComisionFiltro(filtro: any) {
    return this._conectionWS.peticionServicioWs(`${this.url}/comisiones/anularComisionFiltro`, TypeRequest.POST_VALUES, filtro);
  }

  anularCobroComisionIds(ids: number[]) {
    return this._conectionWS.peticionServicioWs(`${this.url}/comisiones/anularCobroComisionIds`, TypeRequest.POST_VALUES, ids);
  }

  getUrl() {
    return localStorage.getItem('url');
  }

  evaluate(key: any, params: any){
    let query = "";
    var dateParts;
    let value;
    return query += `&${key}=${encodeURI(params[key])}`;
 
  }

}
