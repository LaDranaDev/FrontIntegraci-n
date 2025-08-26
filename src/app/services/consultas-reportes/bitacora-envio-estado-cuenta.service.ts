import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class BitacoraEnvioEstadoCuentaService {
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
        private _conectionWS: ConexionService
    ) { }

    /**
     * @description recupera la funcion el valor de la url
    */
    getUrl() {
        // return 'http://localhost:8080';
        return localStorage.getItem('url');
    }

    /**
        * @description Obtiene las opciones para Tipos de estado de cuenta
    */
    async getTipoEdoCuenta() {
        let urlRequest = `${this.url}/bitacora/estadoscuenta/tiposEdosCuenta`;
        const response = await this._conectionWS.peticionServicioWs(urlRequest, TypeRequest.GET);
        return response;
    }

    /**
        * @description se obtienen los Edos. de Cuenta de la tabla principal
    */
    async getBitacoraEdoCuenta(body: any) {
        let urlRequest = `${this.url}/bitacora/estadoscuenta/envios`;
        const response = await this._conectionWS.peticionServicioWs(urlRequest, TypeRequest.POST_VALUES, body);
        return response;    
    }

    /**
        * @description se obtienen los datos para la descarga de ZIP 
    */
    async getZIP(body: any) {
        let urlRequest = `${this.url}/bitacora/estadoscuenta/exportar`;
        const response = await this._conectionWS.peticionServicioWs(urlRequest, TypeRequest.POST_VALUES, body);
        return response;
    }
}
