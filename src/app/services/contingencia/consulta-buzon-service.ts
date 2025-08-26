import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BusquedaBuzonRequest } from '../../bean/busqueda-buzon-request.component';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
    providedIn: 'root'
})
export class ConsultaBuzonService {
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
    async findConfigBuzon(request: BusquedaBuzonRequest) {
        let response: any;
        response = await this._conectionWS.peticionServicioWs(`${this.url}/buzon/consultar`, TypeRequest.POST_VALUES, request);
        return response;
    }

    /**
     * Metodo para recuperar el valor de la url
    */
    getUrl() {
        return localStorage.getItem('url');
       
    }
}
