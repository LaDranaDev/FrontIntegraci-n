import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
    providedIn: 'root'
})
export class EsquemaComisionDefaultService {

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
        // return 'http://localhost:8080'
        return localStorage.getItem('url');
    }

    async getEsquemaComisionDefault() {
        let urlRequest = `${this.url}/contratos/esquemaComision/InicioEsquemaComisiones/0`;
        return await this._conectionWS.peticionServicioWs(urlRequest, TypeRequest.GET);
    }

    async exportarArchivo(body: any) {
        const type = body.formato.includes('xls') ? 'xls':body.formato;
        let urlRequest = `${this.url}/contratos/esquemaComision/reporteEsquemaComisiones/${body.hdnContratoFolio}/reporte/${type}?usuario=${body.usuario}`;
        return await this._conectionWS.peticionServicioWs(urlRequest, TypeRequest.GET);
    }
}
