import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';
import { IPaginationRequest } from 'src/app/bean/i-pagination-request';

@Injectable({
  providedIn: 'root'
})
export class CuentasOrdenantesService {

  constructor(
    private _conectionWS: ConexionService, private http: HttpClient,
  ) { }

  private url = `${this.getUrl()}`;
  private getUrl() {
    return localStorage.getItem('url');
  }

  consultaCuentas(datos: any, paginacion: IPaginationRequest): any {
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/cuentas-ordenantes/consulta-cuentas?page=${paginacion.page}&size=${paginacion.size}`, TypeRequest.POST_VALUES, datos);
  }

  validaCuenta(datos: any): any {
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/cuentas-ordenantes/valida-cuenta`, TypeRequest.POST_VALUES, datos);
  }

  eliminarCuentas(datos: any): any {
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/cuentas-ordenantes/eliminar-cuentas`, TypeRequest.POST_VALUES, datos);
  }

  validaCuentaContrato(datos: any): any {
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/cuentas-ordenantes/valida-cuenta-contrato`, TypeRequest.POST_VALUES, datos);
  }

  vistaCuentaContrato(datos: any): any {
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/cuentas-ordenantes/vista-cuenta-contrato`, TypeRequest.POST_VALUES, datos);
  }

  altaMasiva(datos: any): any {
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/cuentas-ordenantes/alta-masiva`, TypeRequest.POST_VALUES, datos);
  }

  exportFile(datos: any, usuario: string | null): any {
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/cuentas-ordenantes/exportar-cuentas/${usuario}`, TypeRequest.POST_VALUES, datos);
  }

  generarRespuestas(idCargaMasiva: string) : any{
    return this._conectionWS.peticionServicioWs(`${this.url}/contratos/cuentas-ordenantes/exportar-respuesta/${idCargaMasiva}`, TypeRequest.GET);  
  }

}
