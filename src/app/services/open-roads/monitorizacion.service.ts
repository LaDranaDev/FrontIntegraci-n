import {Injectable} from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {ArchivoDiario} from 'src/app/models/archivodiario';
import {HttpClient} from '@angular/common/http';
import { ConexionService,TypeRequest } from 'src/app/services/conexion.service';

@Injectable({
  providedIn: 'root'
})
export class MonitorizacionService {
   //private url = 'localhost:8086';}
   private url = `${this.getUrl()}`;

   archivodiario:ArchivoDiario[];

   constructor (private _conectionWS: ConexionService,private httpClient: HttpClient) {}
   /**
  * @description recupera la funcion el valor de la url
  */
 getUrl() {
   return localStorage.getItem('url');
 }

   //obtiene el formato origen
   async obtenerFormatoO(){
   let response: any;
   response = await this._conectionWS.peticionServicioWs(`${this.url}/mapa/formato-origen`,TypeRequest.GET);
   return response;
   //return this.httpClient.get<any[]>(`http://localhost:8080/mapa/formato-origen`);
 }

   //obtiene el formato salida
   async obtenerFormatoS(){
   let response: any;
   response = await this._conectionWS.peticionServicioWs(`${this.url}/mapa/formato-salida`,TypeRequest.GET);
   return response;
   //return this.httpClient.get<any[]>(`http://localhost:8080/mapa/formato-salida`);
 }

 //obtiene el formato cliente
 async obtenerclientes(){
   let response: any;
   response = await this._conectionWS.peticionServicioWs(`${this.url}/cliente`,TypeRequest.GET);
   return response;
   //return this.httpClient.get<any[]>(`http://localhost:8080/cliente`);
 }

 //obtiene el formato canal
 async obtenercanal(){
   let response: any;
   response = await this._conectionWS.peticionServicioWs(`${this.url}/canal`,TypeRequest.GET);
   return response;
   //return this.httpClient.get<any[]>(`http://localhost:8080/canal`);
 }

 //obtiene el formato estado
 async obtenerestado(){
   let response: any;
   response = await this._conectionWS.peticionServicioWs(`${this.url}/estado`,TypeRequest.GET);
   return response;
   //return this.httpClient.get<any[]>(`http://localhost:8080/estado`);
 }

 //Obtiene los Archivo Diario
 async obtenerListaArchivoDiario(){
   let response: any;
   response = await this._conectionWS.peticionServicioWs(`${this.url}/archivo-diario`,TypeRequest.GET);
   return response;
   //return this.httpClient.get<ArchivoDiario[]>(`${this.URLArchivoDiario}`);
 }

 //Obtiene los clientes
 async obtenerArchivoDiario(ArchivoDiario: ArchivoDiario){
   let response: any;
   response = await this._conectionWS.peticionServicioWs(`${this.url}/archivo-diario/buscar/nombre-archivo=${ArchivoDiario.TXT_NMBR_ARCH}/canal=${ArchivoDiario.CANAL}/sentido=${ArchivoDiario.SENTIDO}/cliente=${ArchivoDiario.CLIENTE}/formato-entrada=${ArchivoDiario.DESC_MAPA_IN}/formato-salida=${ArchivoDiario.DESC_MAPA_OUT}/estado=${ArchivoDiario.ESTADO}`,TypeRequest.GET);
   return response;
   //return this.httpClient.get<ArchivoDiario[]>(`http://localhost:8080/archivo-diario/buscar/nombre-archivo=${ArchivoDiario.TXT_NMBR_ARCH}/canal=${ArchivoDiario.CANAL}/sentido=${ArchivoDiario.SENTIDO}/cliente=${ArchivoDiario.CLIENTE}/formato-entrada=${ArchivoDiario.DESC_MAPA_IN}/formato-salida=${ArchivoDiario.DESC_MAPA_OUT}/estado=${ArchivoDiario.ESTADO}`);
 } 
}