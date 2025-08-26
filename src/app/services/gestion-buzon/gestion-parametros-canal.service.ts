import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
export class GestionParametrosCanalService {

  private url = `${this.getUrl()}`;
  
  constructor(private _conectionWS: ConexionService) {}

  async getChannels(page: number, pageSize: number) {
    return await this._conectionWS.peticionServicioWs(`${this.url}/gestionCanal/canales`, TypeRequest.GET);
  }

  async getChannel(idChannel: number) {
    return await this._conectionWS.peticionServicioWs(`${this.url}/gestionCanal/canal/${idChannel}`, TypeRequest.GET);
  }

  async getProtocols() {
    return await this._conectionWS.peticionServicioWs(`${this.url}/gestionCanal/protocolos`, TypeRequest.GET);
  }

  getUrl() {
    //return 'http://localhost:8083';
    return localStorage.getItem('url');
  }

  async putParrams(idChannel: number, params: any[]) {
    return await this._conectionWS.peticionServicioWs(`${this.url}/gestionCanal/canal/${idChannel}/parametros`, TypeRequest.POST_VALUES, params);
  }

  async updateParramsStatus(reg: number, type: string, status: string) {
    return await this._conectionWS.peticionServicioWs(`${this.url}/gestionCanal/parametrosEstatus`, TypeRequest.POST_VALUES, {
      idReg: reg,
      patternType: type,
      patternStatus: status
    });
  }

}

export interface Canal {
  idChannel: number;
  name: string;
  description: string;
  status: boolean;
}
