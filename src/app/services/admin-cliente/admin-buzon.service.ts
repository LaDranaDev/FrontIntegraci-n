import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';
import { HttpClient } from '@angular/common/http';
import { IPaginationRequest } from 'src/app/bean/i-pagination-request';

@Injectable({
    providedIn: 'root'
})
export class AdminBuzonService {
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
     * @description se obtienen los datos del cliente
    */
    async getDatosCliente(buc: string) {
        let response: any;
        response = await this._conectionWS.peticionServicioWs(`${this.url}/clientes/admonBuzon/validaBucBuzon/${buc}`, TypeRequest.GET);
        return response;
    }

    /**
        * @description se obtienen los datos de la tabla
    */
    async consultaAdmonBuzon(body: any, paginacion: IPaginationRequest) {
        let response: any;
        response = await this._conectionWS.peticionServicioWs(`${this.url}/clientes/admonBuzon/consultaAdmonBuzon?page=${paginacion.page}&size=${paginacion.size}`, TypeRequest.POST_VALUES, body);
        return response;
    }

    /**
        * @description se genera el excel
    */
    async exportarExcel(body: any, usuario: string | null) {
        let response: any;
        response = await this._conectionWS.peticionServicioWs(`${this.url}/clientes/admonBuzon/generaExcel/${usuario}`, TypeRequest.POST_VALUES, body);
        return response;
    }

    /**
        * @description se genera el archivo seleccionado
    */
    async solicitarArchivo(body: any) {
        let response: any;
        response = await this._conectionWS.peticionServicioWs(`${this.url}/clientes/admonBuzon/descargaArchBuzon`, TypeRequest.POST_VALUES, body);
        return response;
    }
    async descargaArchivo(body: any) {
        let response: any;
        response = await this._conectionWS.peticionServicioWs(`${this.getUrl()}/clientes/admonBuzon/iniciaDescarga`, TypeRequest.POST_VALUES, body);
        return response;
    }
}
