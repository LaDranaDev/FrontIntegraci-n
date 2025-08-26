import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';
import { RequestSvaeConfigIntradia } from 'src/app/models/reports-intradia';
import { SesionDataInfo } from '../sesion.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigReporCobranzaIntradiaService {
  private url = `${this.getUrl()}`;

  /**
   *Metodo constructor que genera una instancia,
   * se utiliza inicializar la llamadas al un
   * servicio generico de conexion y a la sesion.
   * @author NTTDATA
   * @param {ConexionService} _conectionWS la conexión
   * @param {SesionDataInfo} _session la session
   */

  constructor(private _conectionWS: ConexionService) {}

  /**
   * @description recupera la funcion el valor de la url
   */
  getUrl() {
    //return 'http://localhost:8084';
    return localStorage.getItem('url');
  }

  async getConfigReport(idContrato: string): Promise<unknown> {
    return await this._conectionWS.peticionServicioWs(
      `${this.url}/contratos/cobranza-intradia/${idContrato}`,
      TypeRequest.GET
    );
  }

  async getCuentas(idContrato: String, page: 0): Promise<unknown> {
    return await this._conectionWS.peticionServicioWs(
      `${this.url}/contratos/cobranza-intradia/cuentas/${idContrato}?page=${page}`,
      TypeRequest.GET
    );
  }

  async uploadAccounts(idContrato: String, archivo: any): Promise<unknown> {
    return await this._conectionWS.peticionServicioWs(
      `${this.url}/contratos/cobranza-intradia/cuentas/carga/${idContrato}`,
      TypeRequest.POST_VALUES,
      archivo
    );
  }

  async saveConfigCobranza(
    request: RequestSvaeConfigIntradia
  ): Promise<unknown> {
    return await this._conectionWS.peticionServicioWs(
      `${this.url}/contratos/cobranza-intradia`,
      TypeRequest.POST_VALUES,
      request
    );
  }

  async getReportDetailChargeAccounts(idContrato: String): Promise<unknown> {
    return await this._conectionWS.peticionServicioWs(
      `${this.url}/contratos/cobranza-intradia/cuentas/xls/${idContrato}`,
      TypeRequest.GET
    );
  }
  async getDetailAccountCharged(idContrato: String): Promise<unknown> {
    return await this._conectionWS.peticionServicioWs(
      `${this.url}/contratos/cobranza-intradia/cuentas/detalle-carga/xls/${idContrato}`,
      TypeRequest.GET
    );
  }

  async getExportFormat(
    type: string,
    request: {
      idContrato: String;
      numeroContrato: String;
      usuario: string;
    }
  ): Promise<unknown> {
    return await this._conectionWS.peticionServicioWs(
      `${this.url}/contratos/cobranza-intradia/${type}`,
      TypeRequest.POST_VALUES,
      request
    );
  }
}
