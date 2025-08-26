import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AltaBuzon } from "../../bean/alta-vigencia-buzon.component";
import { IDownloadArchivoRequest } from "../../pages/contingencia/request/idownloadarchivo-request.component";
import { IGenerateXmlFileRequest } from "../../pages/contingencia/request/igeneratexmlfile-request.component";
import { ISearchArchivoRequest } from "../../pages/contingencia/request/isearcharchivo-request.component";
import { IPaginationRequest } from "../../pages/contingencia/request/pagination-request.component";
import { ConexionService, TypeRequest } from "../conexion.service";

@Injectable({
    providedIn: 'root'
})
export class ContingenciaService{
    private url = `${this.getUrl()}`;

    /**
    * Metodo constructor que genera una instancia,
    * se utiliza inicializar la llamadas al un
    * servicio generico de conexion y a la sesion.
    * @author Felipe Cazarez
    * @param {ConexionService} _conectionWS
    * @param {SesionDataInfo} _session
    * @memberof StatusService
    */
    constructor(private _conectionWS: ConexionService,private http: HttpClient) { }

    async getistBuzones(paginacion:IPaginationRequest){
        let response:any;
        response = await this._conectionWS.peticionServicioWs(`${this.url}/buzon?page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.GET);
        return response;
    }

    async getListBuzonesWithWord(paginacion:IPaginationRequest){
        let response:any;
        response = await this._conectionWS.peticionServicioWs(`${this.url}/buzon/ruta?page=${paginacion.page}&size=${paginacion.size}&ruta=${paginacion.ruta}`,TypeRequest.GET);
        return response;
    }

    async deleteBuzon(idBuzonDelete:number){
        let response:any;
        response = await this._conectionWS.peticionServicioWs(`${this.url}/buzon/${idBuzonDelete}`,TypeRequest.DELETE);
        return response;
    }

    async saveBuzon(altaBuzon:AltaBuzon){
        let response:any;
        response = await this._conectionWS.peticionServicioWs(`${this.url}/buzon`,TypeRequest.POST_VALUES,altaBuzon);
        return response;
    }

    async actualizarBuzon(altaBuzon:AltaBuzon){
        let response:any;
        response = await this._conectionWS.peticionServicioWs(`${this.url}/buzon/${altaBuzon.id}`,TypeRequest.PUT,altaBuzon);
        return response;
    }

    async getListDownloadFiles(objSearchFiles:ISearchArchivoRequest){
        let response:any;
        response = await this._conectionWS.peticionServicioWs(`${this.url}/descargarchivos`,TypeRequest.POST_VALUES,objSearchFiles);
        return response;
    }

    async consultCreateFileXml(objGenXmlFile:IGenerateXmlFileRequest){
        let response:any;
        response = await this._conectionWS.peticionServicioWs(`${this.url}/descargarchivos/crearxml`,TypeRequest.POST_VALUES,objGenXmlFile);
        return response;
    }

    async getDownloadFile(listDownloadFilesRar:IDownloadArchivoRequest[]){
        let response:any;
        response = await this._conectionWS.peticionServicioWs(`${this.url}/descargarchivos/downloadfile`,TypeRequest.POST_VALUES,listDownloadFilesRar);
        return response;
    }

    /**
     * @description recupera la funcion el valor de la url
    */
    getUrl() {
        return localStorage.getItem('url');
       
    }

    /**
    * @description Asigna la data temporal
    * @returns  
    * @memberOf BuzonesService
    */
    setSaveLocalStorage(key:string,item:any) {
        localStorage.setItem(key,JSON.stringify(item));
    }

    /**
    * @description Obtiene la data temporal
    * @returns  
    * @memberOf BuzonesService
    */
    getSaveLocalStorage(key:string) {
        return JSON.parse(localStorage.getItem(key) || '{}');
    }

    /**
    * @description Valida si existe la propiedad en el localstorage
    * @param key valor que indica como se guardo en el localstorage
    */
    validatePropertyExisteInLocalStorage(key:string){
        let banderaExist = false;
        let objectLocalStorage = this.getSaveLocalStorage(key);

        if(objectLocalStorage.hasOwnProperty('id')){
            banderaExist = true;
        }

        return banderaExist;
    }

    /**
    * @description Elimina la date guardada temporalmente
    * @memberOf BuzonesService
    */
    removeSaveLocalStorage(key:string) {
        localStorage.removeItem(key);
    }
}