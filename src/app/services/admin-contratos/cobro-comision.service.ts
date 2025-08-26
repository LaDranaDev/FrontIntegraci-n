import { Injectable } from "@angular/core";
import { ConexionService, TypeRequest } from "../conexion.service";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class CobroComisionService {

  private url = `${this.getUrl()}`;

  constructor(
    private ws: ConexionService,
    private http: HttpClient
  ) { }

  getUrl() {
    //return 'http://localhost:8084'
    return localStorage.getItem('url');
  }

  getData(numContrato: string) {
    return this.ws.peticionServicioWs(`${this.url}/cobroComisiones/${numContrato}`, TypeRequest.GET);
  }

  put(request: any) {
    return this.ws.peticionServicioWs(`${this.url}/cobroComisiones/guardar`, TypeRequest.POST_VALUES, request);
  }

  reporte(numContrato: string, formato: string, usuario: string) {
    return this.ws.peticionServicioWs(`${this.url}/cobroComisiones/${numContrato}/reporte/${formato}?usuario=${usuario}`, TypeRequest.GET);
  }

}
