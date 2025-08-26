import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';

@Injectable({
  providedIn: 'root',
})
export class ConsultaDocumentosCFDIService {
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
    private _conectionWS: ConexionService,
    private http: HttpClient
  ) {}

  /**
   * Metodo para exportar la información del documento
   */
  consultaDoc(documento: {
    contratoConfirmingCfdi: string;
    fechaInicioCfdi: string;
    fechaFinCfdi: string;
  }): Promise<unknown> {
    /* const response = this._conectionWS.peticionServicioWs(
      `${this.url}/cfdi/consultadocs/`,
      TypeRequest.POST_VALUES,
      documento
    ); */
    const response = [
      {
        numDocumentoClienteCfdi: '1',
        bucCliente: '087615',
        proveedor: 'Juan Pérez',
        importe: '10000000',
        fechavencimiento: '30/09/2023',
        fechaEmi: '01/01/2020',
        estatus: 'ACTIVO',
      },
      {
        numDocumentoClienteCfdi: '1',
        bucCliente: '087615',
        proveedor: 'Juan Pérez',
        importe: '10000000',
        fechavencimiento: '30/09/2023',
        fechaEmi: '01/01/2020',
        estatus: 'ACTIVO',
      },
      {
        numDocumentoClienteCfdi: '1',
        bucCliente: '087615',
        proveedor: 'Juan Pérez',
        importe: '10000000',
        fechavencimiento: '30/09/2023',
        fechaEmi: '01/01/2020',
        estatus: 'ACTIVO',
      },
    ];
     return Promise.resolve(response);
  }

  /**
   * Metodo para la pantalla de detalle
   * format dates YYYY-MM-DD
   */
  consultaDetalle(
    request:{
      contratoConfirmingCfdi: string,
      fechaInicioCfdi: string | Date,
      fechaFinCfdi: string | Date,
      numDocumentoClienteCfdi: string,
    }
  ) {

    const response = this._conectionWS.peticionServicioWs(
      `${this.url}/cfdi/consultadocs/detalle`,
      TypeRequest.POST_VALUES,
      request
    );
    return response;
  }

  /**
   * Metodo para encontrar y pintar los contratos confirming de un contrato H2H en el select
   */
  contratoConfirming(confirmingNumber: any) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(
      `${this.url}/cfdi/consultadocs/detalle/${confirmingNumber}`,
      TypeRequest.GET
    );
    return response;
  }

  /**
   * Metodo para exportar la información en formato pdf o excel
   */
  async exportarInformacion(
    format: string,
    request: {
      contratoConfirmingCfdi: string;
      fechaInicioCfdi: string;
      fechaFinCfdi: string;
      numDocumentoClienteCfdi: string;
    }
  ) {
    const response = await this._conectionWS.peticionServicioWs(
      `${this.url}/cfdi/consultadocs/reporte/${format}`,
      TypeRequest.POST_VALUES,
      request
    );
    return response;
  }

  /**
   * @description Método para recuperar el valor de la url
   */
  getUrl() {
    return localStorage.getItem('url');
    //return 'http://localhost:8080';
  }
}
