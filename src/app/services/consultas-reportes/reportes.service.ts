import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ReportesService {
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
        private _conectionWS: ConexionService, private http: HttpClient
    ) { }

    /**
     * @description recupera la funcion el valor de la url
    */
    getUrl() {
        // return 'http://localhost:8080';
        return localStorage.getItem('url');
    }

    /**
     * @description se obtienen los archivos 
    */
    async obtenerArchivos(body: any, page: number, size: number) {
        let urlRequest = `${this.url}/reportes/captacion/consulta?page=${page}&size=${size}`;
        const response = await this._conectionWS.peticionServicioWs(urlRequest, TypeRequest.POST_VALUES, body);
        return response;
    }

    /**
     * @description se obtienen los datos para la descarga de ZIP 
    */
    async obtenerZIP(body: any) {
        let urlRequest = `${this.url}/reportes/captacion/descarga`;
        const response = await this._conectionWS.peticionServicioWs(urlRequest, TypeRequest.POST_VALUES, body);
        return response;
    }
}