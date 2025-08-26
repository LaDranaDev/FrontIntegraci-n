import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';
import { grafEstClienParaRes } from '../../bean/grafEstCliePara.component';

export interface ExportReportParam {
  filtrosBusqueda: {
    codigoCliente: string;
    fechaInicio: string;
    fechaFin: string;
    idStatus: string;
    diaParam: string;
    tipoGrafica: string;
    busquedaFecha: boolean;
  };
  usuario: string;
}

@Injectable({
  providedIn: 'root',
})
export class GraficaEstatusClienteParametrizadaService {
  private url = `${this.getUrl()}`;

  /**
   *Metodo constructor que genera una instancia,
   * se utiliza inicializar la llamadas al un
   * servicio generico de conexion y a la sesion.
   * @author NTTDATA
   * @param {ConexionService} _conectionWS la conexión
   * @param {SesionDataInfo} _session la session
   */

  constructor(
    private _conectionWS: ConexionService,
    private http: HttpClient
  ) {}

  /**
   * @description recupera la funcion el valor de la url
   */
  getUrl() {
    //return 'http://localhost:8080';
    return localStorage.getItem('url');
  }

  async getBusquedaEstatusClientePara(graEstCliePara: grafEstClienParaRes) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(
      `${this.url}/voloper/grafica/estatus-clte-param`,
      TypeRequest.POST_VALUES,
      graEstCliePara
    );
    return response;
  }

  getListaEstatus() {
    let response: any;
    response = this._conectionWS.peticionServicioWs(
      `${this.url}/voloper/grafica/estatus-clte-param/cat-estatus`,
      TypeRequest.GET
    );
    return response;
  }

  async exportReport(request: ExportReportParam): Promise<unknown> {
    const response = this._conectionWS.peticionServicioWs(
      `${this.url}/voloper/grafica/estatus-clte-param/reporte/xls`,
      TypeRequest.POST_VALUES,
      request
    );
    return response;
  }
}
