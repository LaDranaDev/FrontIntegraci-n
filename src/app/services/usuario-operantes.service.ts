/**
 * Banco Santander (Mexico) S.A., Institucion de Banca Multiple, Grupo Financiero Santander Mexico
 * Todos los derechos reservados
 * datoscuentas.components.ts
 * Control de versiones:
 * Version  Date/Hour               By                   Company     Description
 * -------  ----------     -------------------------     --------    ----------------------------------------------
 * 1.0      21/06/2022     Orlando Michael Mujica Garcia  TATA SFW    Creacion de service para la pantalla de usuarios operantes
 */

import { Injectable } from "@angular/core";
import { ConexionService, TypeRequest } from "./conexion.service";
import * as FileSaver from 'file-saver';

@Injectable({
    providedIn: 'root'
  })
  export class UsuarioOperanteService {
    /**
     * 
     * @param _conectionWS objeto que contiene la logica del consumo de los servicios
     */
    constructor(private _conectionWS: ConexionService) { }
    
    /***Se recuperar la url del gateway */
    private url = `${this.getUrl()}`;

    /**
   * @description recupera la funcion el valor de la url
   */
   getUrl() {
    return localStorage.getItem('url');
   }
   /**
    * Descripcion : Metodo que realiza el consumo del servicio para generar Reporte
    * @param datos objeto que contiene la informacion del request
    * @returns retorna archivo en base 64
    */
   generaReporte(datos:any){
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}usuarios/exportarUsuarioOperante`, TypeRequest.POST_VALUES, datos);
    return response;
  }

     /* Descarga archivo
    * @param fileName: string
    * @param data: Response
    */
    downloadXLSFile(fileName: string, data: any): void {
    const blob = this.stringBase64toBlob(data, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 512);
    FileSaver.saveAs(blob, fileName);
    }

    /* Descarga archivo
    * @param fileName: string Nombre del archivo
    * @param data: Cadena Base64
    */
    downloadPDFFile(fileName: string, data: string): void {
    const base64 = data;
    const blob = this.stringBase64toBlob(base64, 'application/pdf', 0);
    FileSaver.saveAs(blob, fileName);
    }

    /**
   * Convierte una cadena base64 a un tipo de dato Blob segun el valor de b64Data y el tipo de contenido
   * @param b64Data Cadena base64
   * @param contentType el tipo de contenido (application/pdf - application/vnd.ms-excel)
   * @param sliceSize Porcion o tamanio de bytes que se procesan en cada iteracion
   * @return Blob
   */
     public stringBase64toBlob(b64Data:any, contentType:any, sliceSize:any) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
      }
    
  }