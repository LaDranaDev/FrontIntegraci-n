import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultaContratosUsuarioService {
  private url = `${this.getUrl()}`;

  /**
   *Metodo constructor que genera una instancia,
   * se utiliza inicializar la llamadas al un
   * servicio generico de conexion y a la sesion.
   * @author NTTDATA
   * @param {ConexionService} _conectionWS la conexión
   * @param {SesionDataInfo} _session la session
  */

  constructor(
    private _conectionWS: ConexionService) { }

  /**
   * @description recupera la funcion el valor de la url
  */
  getUrl() {
    return localStorage.getItem('url');
    //return 'http://localhost:8082'
  }
  async exportarContratoUsuario(tipo:string, data:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contratos/consulta-contratos-usuarios/${tipo}`,TypeRequest.POST_VALUES, data);
    return response;
  }
  async consultaContratos(data:any){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contratos/consulta-contratos-usuarios`,TypeRequest.POST_VALUES,data);
    return response;
  }

}
