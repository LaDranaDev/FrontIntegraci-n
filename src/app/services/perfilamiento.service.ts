import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from './conexion.service';
import { ContratosService } from './admin-contratos/contratos.service';
import { ComunesService } from './comunes.service';

@Injectable({
  providedIn: 'root'
})
export class PerfilamientoService {
  constructor(private _conectionWS: ConexionService, private _contratos: ContratosService, private comun: ComunesService) { }
  public url = '';

  async perfilamiento(buc:any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/perfilamiento/${buc}`, TypeRequest.GET);
    return response;
  }
  async inicio(buc:any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/registro/inicio?user=${buc}`, TypeRequest.POST);
    return response;
  }
  async salir(buc:any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/registro/fin?user=${buc}`, TypeRequest.POST);
    return response;
  }
  async menus(data:any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/perfilamiento/menus`, TypeRequest.POST_VALUES, data);
    return response;
  }
  async accion(data:any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/perfilamiento/accion`, TypeRequest.POST_VALUES, data);
    return response;
  }

  async accesos(data:any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/perfilamiento/accion`, TypeRequest.POST_VALUES, data);
    return response;
  }

  setUrl(url: string) {
    this.url = url;
  }


}
