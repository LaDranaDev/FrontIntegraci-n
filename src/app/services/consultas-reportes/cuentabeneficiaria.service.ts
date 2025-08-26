import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';
import { HttpClient } from '@angular/common/http';
import { IPaginationRequest } from 'src/app/bean/i-pagination-request';

@Injectable({
  providedIn: 'root'
})
export class CuentaBeneficiariaService {
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
    private _conectionWS: ConexionService, private http: HttpClient
  ) { }

  /**
   * @description recupera la funcion el valor de la url
  */
  getUrl() {
    
    //return 'https://lightweight-gateway-mx-h2h-clientes-dev.apps.str01.mex.dev.mx1.paas.cloudcenter.corp/'
    //return 'http://localhost:8080';
    return localStorage.getItem('url');
  }


  async cuentas(data:any ,paginacion:IPaginationRequest){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/gestiontraking/cuentas?page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.POST_VALUES, data);
    return response;
  }

  async buscaContrato(buc:any){
    console.log("busca contrato")     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/gestiontraking/contrato/buc/${buc}`,TypeRequest.GET);
    return response;
  }

  async buscaCliente(numContrato:any){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/gestiontraking/contrato/${numContrato}`,TypeRequest.GET);
    return response;
  }

  async agregarEmail(data:any){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/gestiontraking/contrato/correo/guardar`,TypeRequest.POST_VALUES, data);
    return response;
  }
  async eliminarEmail(data:any){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/gestiontraking/contrato/correo/eliminar`,TypeRequest.POST_VALUES, data);
    return response;
  }

  async reporteCorreos(data:any){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/gestiontraking/contrato/correo/xls`,TypeRequest.POST_VALUES, data);
    return response;
  }

  async reporteCuentas(data:any){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/gestiontraking/contrato/cuentas/xls`,TypeRequest.POST_VALUES, data);
    return response;
  }

  async consuCorreo(numContrato:any ,cuenta:any, paginacion:IPaginationRequest){     
    let response:any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/gestiontraking/contrato/correos/${numContrato}/${cuenta}?page=${paginacion.page}&size=${paginacion.size}`,TypeRequest.GET);
    return response;
  }

   

}