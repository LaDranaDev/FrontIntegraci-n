import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest} from '../conexion.service';

@Injectable({
  providedIn: 'root'
})

export class VisualizacionLayoutService {
  private url = `${this.getUrl()}`;

  /**
   * Metodo constructor que genera una instancia,
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
    return localStorage.getItem('url');
    //return 'localhost:8083';
  }

  async proLayout(archivo: any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/administracion/visualizacionLayout/`,TypeRequest.POST_VALUES, archivo);
    return response;
  }
 
}
