import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IPaginationRequest } from '../../pages/contingencia/request/pagination-request.component';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
    providedIn: 'root'
})

export class parametrosService {
    bandera: boolean = false;

    /**
    *Metodo constructor que genera una instancia,
    * se utiliza inicializar la llamadas al un
    * servicio generico de conexion y a la sesion.
    * @author NTTDATA
    * @param {ConexionService} _conectionWS la conexión
    * @param {SesionDataInfo} _session la session
    */
    constructor(private _conectionWS: ConexionService, private http: HttpClient) {
    }

    public url = '';

    setUrl(url: string) {
        this.url = url;
    }

    async getistParametros(paginacion: IPaginationRequest) {
        let response: any;
        response = await this._conectionWS.peticionServicioWs(`${this.url}/parametros?page=${paginacion.page}&size=999999`, TypeRequest.GET);
        return response;
    }

    async saveParametro(altaParametro: any) {
        let response: any;
        response = await this._conectionWS.peticionServicioWs(`${this.url}/parametros`, TypeRequest.POST_VALUES, altaParametro);
        return response;
    }

    async actualizarParametro(edicionParametro: any, idParametro: number) {
        let response: any;
        response = await this._conectionWS.peticionServicioWs(`${this.url}/parametros/${idParametro}`, TypeRequest.PUT, edicionParametro);
        return response;
    }

    /**
    * @description Obtiene la data temporal
    * @returns  
    * @memberOf parametrosService
    */
    getSaveLocalStorage(key: string) {
        return JSON.parse(localStorage.getItem(key) || '{}');
    }

    /**
    * @description Valida si existe la propiedad en el localstorage
    * @param key valor que indica como se guardo en el localstorage
    */
    validatePropertyExisteInLocalStorage(key: string) {
        let banderaExist = false;
        let objectLocalStorage = this.getSaveLocalStorage(key);

        if (objectLocalStorage.hasOwnProperty('id')) {
            banderaExist = true;
        }

        return banderaExist;
    }

    /**
    * @description Elimina la date guardada temporalmente
    * @memberOf parametrosService
    */
    removeSaveLocalStorage(key: string) {
        localStorage.removeItem(key);
    }

    /**
    * @description Asigna la data temporal
    * @returns  
    * @memberOf parametrosService
    */
    setSaveLocalStorage(key: string, item: any) {
        localStorage.setItem(key, JSON.stringify(item));
    }

    setShowParametros(band: boolean) {
        this.bandera = band;
    }

    isShowParametros() {
        return this.bandera;
    }
}
