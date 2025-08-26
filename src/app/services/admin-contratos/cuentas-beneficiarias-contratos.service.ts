import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';

@Injectable({
    providedIn: 'root'
})

export class CuentasBeneficiariasContratosService {
  private url = `${this.getUrl()}`;

  /**
  * Metodo constructor que genera una instancia,
  * se utiliza inicializar la llamadas al un
  * servicio generico de conexion y a la sesion.
  * @author NTTDATA
  * @param {ConexionService} _conectionWS la conexión
  * @param {SesionDataInfo} _session la session
  */
  constructor(private _conectionWS: ConexionService) { }

 
  /**
  * Metodo para realizar la busqueda de las 
  * cuenta beneficiarias de los contratos
  */
  async findCuentasBeneficiariasContratos(busquedaCuentasBeneficiarias: any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contratos/ctasBeneficiariosCto`, TypeRequest.POST_VALUES, busquedaCuentasBeneficiarias);
    return response;
  }

  async getListaCuenta(cuentas:any, paginacion:IPaginationRequest){
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contratos/ctasBeneficiariosCto?page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.POST_VALUES,cuentas);
    return response;
  }


  /**
  * Metodo para exportar la información en formato pdf.
  */
  async exportarInformacion( tipo: any , exportar:any) {
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/contratos/ctasBeneficiariosCto/reporte/${tipo}`, TypeRequest.POST_VALUES, exportar);
    return response;
  }

  /**
  * @description Método para recuperar el valor de la url
  */
  getUrl() {
    return localStorage.getItem('url');
  }


}
