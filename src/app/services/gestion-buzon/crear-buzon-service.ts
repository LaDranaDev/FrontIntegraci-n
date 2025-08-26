import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
    providedIn: 'root'
})
export class CrearBuzonService {
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
     * Metodo para realizar la busqueda de la 
     * configuracion del buzon.
     */
    async findBuzon(numContrato: String) {
        let response: any;
        response = await this._conectionWS.peticionServicioWs(`${this.url}/buzon/crear/${numContrato}`, TypeRequest.GET);
        return response;
    }

    /**
     * Metodo para realizar la creación o actualización de la configuracion del buzon
     */
    async createOrUpdateBuzon(numContrato: String, protocolo: String, operacion: String, archivo: any) {
        let response: any;
        response = await this._conectionWS.peticionServicioWs(`${this.url}/buzon/crear/${numContrato}/${protocolo}/${operacion}`, TypeRequest.POST_VALUES, archivo);
        return response;
    }

    /**
  * Metodo para obtener la vigencia de buzon-contrato.
  * 
  * @param numContrato Numero de contrato
  * @param tipoArchivo Tipo de Archivo
  * @return Datos de la vigencia
  */
  async getVigenciaBuzonContrato(numContrato: any,tipoArchivo: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/buzon/crear/${numContrato}/${tipoArchivo}`, TypeRequest.GET);
    return response;
  }

   /**
   * Descripcion: Funcion que realiza la consulta de la informcion de admin buzon
   * @param fechaInicio atributo que da una cota inferior de busqueda
   * @param fechaFin atributo que da una cota superior de busqueda
   * @returns retorna objeto con la informacion del cliente
   */
   async consultaInformacionAdminBuzon(request: any) {
    let response: any;
    response = await  this._conectionWS.peticionServicioWs(`${this.url}/buzon/consultar/adminBuzon`, TypeRequest.POST_VALUES, request);
    return response;
  }

    /**
     * Metodo para recuperar el valor de la url
    */
    getUrl() {
        return localStorage.getItem('url');
        
    }
}
