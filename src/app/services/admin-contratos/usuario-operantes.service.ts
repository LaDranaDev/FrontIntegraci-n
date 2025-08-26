/**
 * Banco Santander (Mexico) S.A., Institucion de Banca Multiple, Grupo Financiero Santander Mexico
 * Todos los derechos reservados
 * datoscuentas.components.ts
 * Control de versiones:
 * Version  Date/Hour               By                   Company     Description
 * -------  ----------     -------------------------     --------    ----------------------------------------------
 * 1.0      21/06/2022     Orlando Michael Mujica Garcia  TATA SFW    Creacion de service para la pantalla de usuarios operantes
 * 1.1.1    15/01/2025     C368734 - LFER                 SANTANDER   modificacion usuarios operantes consultas
 */

import { Injectable } from "@angular/core";
import { ConexionService, TypeRequest } from "../conexion.service";
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
  * Consulta los intervinientes de un contrato H2H
  * 
  * @param request Peticion con el filtro de la consulta
  * @returns Respuesta con los datos del contrato consultado
  */
  consultaODH3(request: any) {
    return this._conectionWS.peticionServicioWs(`${this.url}/administracion/usuariosOperantes/consulta`, TypeRequest.POST_VALUES, request);
  }

  /**
  * Consulta de todos los intervinientes de un contrato H2H
  * 
  * @param request Peticion con el filtro de la consulta
  * @returns Respuesta con los datos del contrato consultado
  */
  consultaMasivaODH3(request: any) {
    return this._conectionWS.peticionServicioWs(`${this.url}/administracion/usuariosOperantes/consultaMasiva`, TypeRequest.POST_VALUES, request);
  }

  /**
   * Guardar en BD y asociar con la transaccion ODH2 el contrato con el usuario
   * 
   * @param request Peticion con los datos del usuario para guardar
   */
  guardarUsuarioOperante(request: any) {
    return this._conectionWS.peticionServicioWs(`${this.url}/administracion/usuariosOperantes/`, TypeRequest.POST_VALUES, request);
  }

  /**
   * Modificar en BD el contrato con el usuario
   * 
   * @param request Peticion con los datos del usuario para modificar
   */
  modificarUsuarioOperante(request: any) {
    return this._conectionWS.peticionServicioWs(`${this.url}administracion/usuariosOperantes`, TypeRequest.PUT, request);
  }

  /**
   * Modify rol by user config
   * 
   * @param request Peticion con los datos del usuario para modificar
   */
  editOperantUser(request: {
    roles: string[],
    "buc":string,
    "contrato":string
  }) {
    return this._conectionWS.peticionServicioWs(`${this.url}administracion/usuariosOperantesPerfil/editarRoles`, TypeRequest.POST_VALUES, request);
  }

  /**
   * Metodo para elimicar en BD el contrato con el usuario y llamar la transaccion ODH2
   * 
   * @param request Peticion con los datos del usuario para eliminar
   */
  eliminarUsuarioOperante(request: any) {
    return this._conectionWS.peticionServicioWs(`${this.url}/administracion/usuariosOperantes/eliminar`, TypeRequest.POST_VALUES, request);
  }

  /**
  * Recuperar los datos de una BUC determinada
  * 
  * @param request Peticion con el buc del cliente que se quieren consultar los datos
  * @returns Respuesta con los datos del buc consultado
  */
  recuperarDatosDeBucODH1(request: any) {
    return this._conectionWS.peticionServicioWs(`${this.url}/administracion/usuariosOperantes/recuperarDatosDeBuc`, TypeRequest.POST_VALUES, request);
  }

  /**
   * Descripcion : Metodo que realiza el consumo del servicio para generar Reporte
   * @param datos objeto que contiene la informacion del request
   * @returns retorna archivo en base 64
   */
  generaReporte(datos: any) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/usuarios/exportarUsuarioOperante`, TypeRequest.POST_VALUES, datos);
    return response;
  }

  exportReport(datos: any) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/administracion/usuariosOperantes/reporte`, TypeRequest.POST_VALUES, datos);
    return response;
  }

  exportReportPerfil(datos: any) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/administracion/usuariosOperantesPerfil/reporte`, TypeRequest.POST_VALUES, datos);
    return response;
  }

  getRolPerfil(datos: {
    buc: string,
    contrato: String
  }) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}administracion/usuariosOperantesPerfil/roles`, TypeRequest.POST_VALUES, datos);
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
  public stringBase64toBlob(b64Data: any, contentType: any, sliceSize: any) {
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
