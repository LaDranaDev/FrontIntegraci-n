import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
export class SolicitudEdoCtaService {
  constructor(
    private _conectionWS: ConexionService, private http: HttpClient

  ) { }

  private url = `${this.getUrl()}`;
  getUrl() {
    //Los servicios se encuentran alojados en el microservicio de h2h-admon-contratos-service
    return localStorage.getItem('url');
  }

  getFrecuencyList(datos: any): any {
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/estadocuenta/contingencia/obtenFrecuenciasEdoCta`, TypeRequest.POST_VALUES, datos);
  }

  getChannelFormatList(datos: any): any {
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/estadocuenta/contingencia/obtenCanalesFormatos`, TypeRequest.POST_VALUES, datos);
  }

  getCtaFrecs(datos: any): any {
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/estadocuenta/contingencia/obtenCtasFrecs`, TypeRequest.POST_VALUES, datos);
  }

  subeInstruccionesEdoCta(datos: any, usuario: string | null): any {
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/estadocuenta/contingencia/subeInstruccionesEdoCta/${usuario}`, TypeRequest.POST_VALUES, datos);
  }

}
