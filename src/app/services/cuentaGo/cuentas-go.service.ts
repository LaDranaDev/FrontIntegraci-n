import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
export class CuentasGoService {
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
    private _conectionWS: ConexionService
  ) { }

  /**
  * @description recupera la funcion el valor de la url
  */
  getUrl() {
    return localStorage.getItem('url');
  }


  /**
   * Realiza la busqueda de los comprbantes conforme a los atributos
   * @param comprobante 
   * @returns comprobante
   */
  async consultar(comprobante: any) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/adminStockSG/buscarStockSCG`, TypeRequest.POST_VALUES, comprobante);
    return response;
  }


  /**
   * Metodo para obtener el detalle de la Remesa
   * 
   * @param comprobante
   * @returns comprobante
   */
  async getDetalleRemesa(comprobante: any) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/adminStockSG/detalleRemesaStock`, TypeRequest.POST_VALUES, comprobante);
    return response;
  }

  
  /**
   * Exportamos la informacion de lista de Remesa.
   */
  async exportRemesas(comprobante: any) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/adminStockSG/exportarStockSCG/`, TypeRequest.POST_VALUES, comprobante);
    return response;
  }

  
  /**
   * Exportamos la informacion del detalle de Remesa.
   */
  async exportarDetalleRemesa(comprobante: any) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/adminStockSG/exportarDetalleRemesas`, TypeRequest.POST_VALUES, comprobante);
    return response;
  }



  // Consulta del contrato por Buc del cliente.
  async getDataCliente(buc: string) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/adminStockSG/findContrato/${buc}`, TypeRequest.GET);
    return response;
  }

  // Metodo para llamar a la cancelacion de datos
  async cancelRemesa(comprobante: any) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/adminStockSG/cancelarStockSCG`, TypeRequest.PUT, comprobante);
    return response;
  }


  // Metodo para llamar a la cancelacion de datos
  async aceptRemesa(comprobante: any) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/adminStockSG/aceptarStockSCG`, TypeRequest.PUT, comprobante);
    return response;
  }


  // Metodo para llamar a la cancelacion de una tarjeta
  async cancelTarjeta(comprobante: any) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.url}/adminStockSG/cancelarTarjeta`, TypeRequest.PUT, comprobante);
    return response;
  }
}
