import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPaginationRequest } from '../../pages/contingencia/request/pagination-request.component';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
export class RecargaCatalogosSFGService {
  private url = `${this.getUrl()}`;

  /**
   *Metodo constructor que genera una instancia,
   * se utiliza inicializar la llamadas al un
   * servicio generico de conexion y a la sesion.
   * @author NTTDATA
   * @param {ConexionService} _conectionWS la conexión
   * @param {SesionDataInfo} _session la session
  */
  constructor(private _conectionWS: ConexionService, private http: HttpClient) { }

  /**
   * Metodo para consulta la información de recarga del catalogo sfg.
  */
  async findRecargaSFG() {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/recargacatsfg/catini`, TypeRequest.GET);
    return response;
  }

  /**
   * Metodo para enviar archivo xml de la recarga del catalogo sfg.
  */
  async sendFileRecargaSFG(idMensaje: string) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/recargacatsfg/crearxml/${idMensaje}`, TypeRequest.POST);
    return response;
  }

  /**
   * Metodo para recuperar el valor de la url
  */
  getUrl() {
    //return localStorage.getItem('url');
    return localStorage.getItem('url');
  }
}
