import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from './conexion.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})



export class ComunesService {
  response: boolean | undefined;
  responseOtro: boolean | undefined;
  datosContrato: any;
  private clickOnCurrentPage: any = new BehaviorSubject(false);
  private clickReloadGraph: any = new BehaviorSubject(false);
  public readonly clickAtion: Observable<boolean> = this.clickOnCurrentPage.asObservable();
  public readonly clickReloadGp: Observable<boolean> = this.clickReloadGraph.asObservable();
  constructor(private _conectionWS: ConexionService) { }
  public url = ''; //http://localhost:8083
  public urlFront = '';
  public urlLogAzure = '';
  clickMenu: boolean = false;
  public bandAltaContrato = false;

  setUrl(url: string) {
    this.url = url;
  }

  setUrlFront(url: string) {
    this.urlFront = url;
  }

  setUrlLogAzure(urlLogAzure: string) {
    this.urlLogAzure = urlLogAzure;
  }
  /**
   * Descripcion: Funcion que realiza la consulta de la informcion del cliente por buc
   * @param buc atributo que almacena el buc del cliente
   * @param idEstatus atributo que almacena el identificador del estatus
   * @param cuentaEje atributo que almacena la cuenta eje
   * @returns retorna objeto con la informacion del cliente
   */
  async consultaInformacionContrato(buc: any, idEstatus: any, cuentaEje: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contratos/alta/getcontratobyfiltros/${buc}/${idEstatus}/${cuentaEje}`, TypeRequest.GET);
    return response;
  }

  /**
  * Descripcion: Funcion que realiza la consulta de la informcion del cliente por buc
  * @param numCliente atributo que almacena el buc del cliente
  * @returns retorna objeto con la informacion del cliente
  */
  async consultaInformacionCliente(numCliente: String) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/adminCertificados/${numCliente}`, TypeRequest.GET);
    return response;
  }

  /***Funcion que realiza la consulta de los complementos de Facturas de CFDI*/
  async consultaComplementoFacturas(data: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/consultascfdi/facturas_cfdi?fechaInicial=${data.fechaInicial}&fechaFinal=${data.fechaFinal}&numContrato=${data.numContrato}&uuidPaginador=${data.uuidPaginador}`, TypeRequest.GET);
    return response;
  }

  /***Fuhcion que realiza la invocacion del metodo para descargar la factura en xml */
  async descargarDocumentosxml(uiidFactura: string) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/consultascfdi/descargas_facturas_cfdi?uuid=${uiidFactura}`, TypeRequest.GET);
    return response;
  }

  /**
   * Descripcion: Funcion que realiza la consulta de la informcion del cliente por fecha
   * @param fechaInicio atributo que da una cota inferior de busqueda
   * @param fechaFin atributo que da una cota superior de busqueda
   * @returns retorna objeto con la informacion del cliente
   */
  async consultaInformacionClientesGen(request: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/convenios/contratos-fecha`, TypeRequest.POST_VALUES, request);
    return response;
  }

  async consultaConveniosPorCliente(id_cntr: String) {
    id_cntr = this.datosContrato.idContrato;
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/convenios/consulta/${id_cntr}`, TypeRequest.GET);
    return response;
  }

  async consultaConveniosDisponibles(clve_serv: String, desr: String) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/convenios/consultaConveniosDisponibles/${clve_serv}/${desr}`, TypeRequest.GET);
    return response;
  }

  async insertaConvenio(id_cntr: String, claveServicio: any) {
    id_cntr = this.datosContrato.idContrato;
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/convenios/agrega/${id_cntr}/${claveServicio}`, TypeRequest.GET);
    return response;
  }

  async eliminaConvenio(id_cntr: string, claveServicio: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/convenios/elimina/${id_cntr}/${claveServicio}`, TypeRequest.GET);
    return response;
  }

  async reportPdfConvDisponibles(envio: any) {
    let query = "";
    for (const key in envio) {
      if (envio[key]) {
        query += `&${key}=${encodeURI(envio[key])}`;
      }
    }
    return await this._conectionWS.peticionServicioWs(`${this.url}/convenios/disponibles/pdf?${query}`, TypeRequest.GET);
  }

  async reportePdf(envio: any) {
    let query = "";
    for (const key in envio) {
      if (envio[key]) {
        query += `&${key}=${encodeURI(envio[key])}`;
      }
    }
    return await this._conectionWS.peticionServicioWs(`${this.url}/convenios/pdf?${query}`, TypeRequest.GET);
  }

  async reporteXls(envio: any) {
    let query = "";
    for (const key in envio) {
      if (envio[key]) {
        query += `&${key}=${encodeURI(envio[key])}`;
      }
    }
    return await this._conectionWS.peticionServicioWs(`${this.url}/convenios/xls?${query}`, TypeRequest.GET);
  }

  async reporteCsv(envio: any) {
    let query = "";
    for (const key in envio) {
      if (envio[key]) {
        query += `&${key}=${encodeURI(envio[key])}`;
      }
    }
    return await this._conectionWS.peticionServicioWs(`${this.url}/convenios/contratos/csv?${query}`, TypeRequest.GET);
  }

  async reporteContratosXls(envio: any) {
    return await this._conectionWS.peticionServicioWs(`${this.url}/convenios/contratos/xls`, TypeRequest.POST_VALUES, envio);
  }

  async reporteContratosPdf(envio: any) {
    return await this._conectionWS.peticionServicioWs(`${this.url}/convenios/contratos/pdf`, TypeRequest.POST_VALUES, envio);
  }

  async reporteContratosCSV(envio: any) {
    return await this._conectionWS.peticionServicioWs(`${this.url}/convenios/contratos/csv`, TypeRequest.POST_VALUES, envio);
  }

  async getEstatusContrato() {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contratos/alta/getestatuscontrato`, TypeRequest.GET);
    return response;
  }


  datosContratoObtenido(valor: boolean) {
    this.response = valor
  }
  otro(valor: boolean) {
    this.responseOtro = valor
  }

  datos(valor: any) {
    this.datosContrato = valor
  }

  getDatos() {
    return this.datosContrato;
  }
  /**
 * @description Obtiene la data temporal
 * @returns
 * @memberOf CatalogoDinamico
 */
  getSaveLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  /**
  * @description Asigna la data temporal
  * @returns
  * @memberOf GestionBancosService
  */
  setSaveLocalStorage(key: string, item: any) {
    localStorage.setItem(key, JSON.stringify(item));
  }

  eventClickOnCurrentPage(codeMenu: number): void {
    this.clickMenu = true;
    this.clickOnCurrentPage.next({ codeMenu });
  }

  eventClickReloadGraph(flag: boolean): void {
    this.clickReloadGraph.next(flag);
  }

  redirect() {
    localStorage.clear();
    window.location.href = this.urlLogAzure;
  }

  getUrl() {
    return this.url;
  }

  getUrlFront() {
    return this.urlFront;
  }

  getBandAltaContrato(): any{
    return this.bandAltaContrato;
  }

  setBandAltaContrato(band: any) {
    this.bandAltaContrato = band;
  }
}
