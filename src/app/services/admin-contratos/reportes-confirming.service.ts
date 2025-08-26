import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';

@Injectable({
  providedIn: 'root'
})
export class ReportesConfirmingService {
  private url = `${this.getUrl()}`;
  constructor(private _conectionWS: ConexionService) { }

  getUrl() {
    //return localStorage.getItem('url');//'localhost:8081';
    return localStorage.getItem('url');
  }

  async inicioGetConfirming(numContrato:any){    
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contratos/confirming/ReportConfirming/${numContrato}`,TypeRequest.GET);
    return response;
  }

  async cargaComboCanales(centroId:any){    
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contratos/confirming/confirming/comboCanal/${centroId}`,TypeRequest.GET);
    return response;
  }

  async guardarReporteConfirming(request:any){
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/confirming/guardarReporteConfirming`,TypeRequest.POST_VALUES,request);;
  }

  async exportarPdf(request:any){
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/confirming/reporte/pdf`,TypeRequest.POST_VALUES,request);;
  }

  async exportarXls(request:any){
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/confirming/reporte/xls`,TypeRequest.POST_VALUES,request);;
  }

  async exportarCsv(request:any){
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/confirming/reporte/csv`,TypeRequest.POST_VALUES,request);;
  }

}
