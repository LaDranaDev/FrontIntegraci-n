import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
export class EdoCuentaService {
  private url = `${this.getUrl()}`;

  constructor(private http: HttpClient,
    private _conectionWS: ConexionService,) {}

  async getConsolidado(numContrato:any, idTabla:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contratos/estadocuentaconsolidado/listaConfigEstadosCuentaConsolidado?numeroContrato=${numContrato}&idTabla=${idTabla}`,TypeRequest.GET);
    return response;
  }
  async exportarConsolidado(formato: any, numContrato:any, user:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contratos/estadocuentaconsolidado/reporte?formato=${formato}&numeroContrato=${numContrato}&usuario=${user}`,TypeRequest.GET);
    return response;
  }
  async getIntradia(numContrato:any, idTabla:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contratos/estadocuentaconsolidado/listaConfigEstadosCuentaIntradia?numeroContrato=${numContrato}&idTabla=${idTabla}`,TypeRequest.GET);
    return response;
  }
  async exportarIntradia(formato: any, numContrato:any, user:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contratos/estadocuentaconsolidado/reporte/intradia?formato=${formato}&numeroContrato=${numContrato}&usuario=${user}`,TypeRequest.GET);
    return response;
  }

  async guardar(data:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contratos/estadocuentaconsolidado/guardaConfigEstadosCuentaConsolidado`,TypeRequest.POST_VALUES, data);
    return response;
  }

  async guardaintradia(data:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contratos/estadocuentaconsolidado/guardaConfigEstadosCuentaIntradia`,TypeRequest.POST_VALUES, data);
    return response;
  }

  async paginacionIntradia(data:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contratos/estadocuentaconsolidado/consultaCuentasPagIntradia`,TypeRequest.POST_VALUES, data);
    return response;
  }

  async paginacionconsolidado(data:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contratos/estadocuentaconsolidado/consultaCuentasPagConsolidado`,TypeRequest.POST_VALUES, data);
    return response;
  }
  




  getUrl() {
    //return 'http://localhost:8083'
    return localStorage.getItem('url');
  }
}
