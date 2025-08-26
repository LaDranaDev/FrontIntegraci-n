import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConexionService, TypeRequest } from '../conexion.service';
import { environment } from '../../../environments/environment';

export class Contrato{
  numCuenta?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContratosService {

  private url = `${this.getUrl()}`;

  /**
   * Metodo para recuperar el valor de la url
  */
 getUrl() {
  return localStorage.getItem('url');
}

obtenUrl() {
  if(this.url===null || this.url===undefined){
    return this.url;
  }else{
    this.getUrl();
    return this.url;
  }
  
}
  datos?: Contrato;

  /**
   * Metodo constructor que genera una instancia,
   * se utiliza inicializar la llamadas al un
   * servicio generico de conexion y a la sesion.
   * @author jlopezg
   * @param {ConexionService} _conectionWS
   * @param {SesionDataInfo} _session
   * @memberof StatusService
   */
  constructor(private _conectionWS: ConexionService,private http: HttpClient) { }

  async obtenerDatos(idContrato: any, idFrecuencia: any){
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.obtenUrl()}/admoncontratos/contratos/${idContrato}/${idFrecuencia}`, TypeRequest.GET);
    return response;
  }

  async obtDatCta(numContrato: String){
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.obtenUrl()}/admoncontratos/contratos/${numContrato}`,TypeRequest.GET);
    return response;
  }

  generaXML(datos:any){
    let response: any;
    response = this._conectionWS.peticionServicioWs(`${this.obtenUrl()}/admoncontratos/generaXML`, TypeRequest.PUT, datos);
    return response;
  }

  /**
   * @description Obtiene la configuracion del yml cargada en el servicio de Configuracion
   */
   obtenerDatosYml(): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({'Content-Type' : 'application/json'});
    return this.http.get(environment.url, { 'headers': headers }).pipe(

    );
  }
   /**Consulta catalogos de tipo de cobro. */
   catalogoTipoDeCobro(){
    let response:any = this._conectionWS.peticionServicioWs(`${this.obtenUrl()}/comisiones/catalogos/tiposCobro`, TypeRequest.GET);
    return response;
  }

  /**Consulta el tipo de cobro configurado */
  consultaTipodeCobro(numContrato: String){
    let response:any = this._conectionWS.peticionServicioWs(`${this.obtenUrl()}/comisiones/contratos/${numContrato}/tipoCobro`,TypeRequest.GET);
    return response;
  }

  /** Obtiene reporte tipo de cobro */
  obtieneReporte(usuario:any,numContrato:string,formato:string){ 
    let response:any = this._conectionWS.peticionServicioWs(`${this.obtenUrl()}/comisiones/reportes/${usuario}/${numContrato}/tipoCobro/${formato}`,TypeRequest.GET);
    return response;
  }

  /** Alta de tipo de Cobro */
  altaTipoDeCobro(parametros:any){
    let response:any = this._conectionWS.peticionServicioWs(`${this.obtenUrl()}/comisiones/contratos/tipoCobro`,TypeRequest.PUT,parametros);
    return response;
  }

  /**Actualiza la informacion del tipo de cobro. */
  actualizaTipoDeCobro(numContrato:String,idTipoCobroCntr:Number,parametros:any){
    let response:any = this._conectionWS.peticionServicioWs(`${this.obtenUrl()}/comisiones/contratos/${numContrato}/tipoCobro/${idTipoCobroCntr}`,TypeRequest.PUT,parametros);
    return response;
  }

  /** Guarda las ordenates dadas de alta */
  guardaOrdenantes(numContrato:String,idSubsidiaria:Number,parametros:any){
    let response:any = this._conectionWS.peticionServicioWs(`${this.obtenUrl()}/comisiones/subsidiarias/${numContrato}/subsidiarias/${idSubsidiaria}/cuentas`,TypeRequest.PUT,parametros);
    return response;
  }

  /**Actualiza la subsidiaria */
  actualizaSubsidiaria(numContrato:String,idSubsidiaria:Number,parametros:any){ 
    let response:any = this._conectionWS.peticionServicioWs(`${this.obtenUrl()}comisiones/subsidiarias/${numContrato}/actualizar/${idSubsidiaria}`,TypeRequest.PUT,parametros);
    return response;
  }

  /** Guarda la subsidiaria */
  guardaSubsidiaria(parametros:any){
    let response:any = this._conectionWS.peticionServicioWs(`${this.obtenUrl()}/comisiones/subsidiarias/guardar`,TypeRequest.POST_VALUES,parametros);
    return response;
  }

  /**Elimina el BUC */
  eliminaBUC(numContrato:String,idSubsidiaria:Number){
    let response:any = this._conectionWS.peticionServicioWs(`${this.obtenUrl()}/comisiones/subsidiarias/${numContrato}/eliminar/${idSubsidiaria}`,TypeRequest.DELETE);
    return response;
  }

  /**Metodo que consulta la informacion de la BUC (Hardcode). */
  informacionBUC(request:any){
    let response:any = this._conectionWS.peticionServicioWs(`${this.obtenUrl()}/administracion/usuariosOperantes/recuperarDatosDeBuc`, TypeRequest.POST_VALUES, request);
    return response;
  }

   /**Consulta catalogo de las cuentas comision */
   catalogoCuentasComision(numContrato: String){
    let response:any = this._conectionWS.peticionServicioWs(`${this.obtenUrl()}/comisiones/catalogos/${numContrato}/cuentasComision`,TypeRequest.GET);
    return response;
  }

  /**Consulta catalogo de las cuentas ordenantes */
  catalogoCuentasOrdenantes(numContrato: String){
    let response:any = this._conectionWS.peticionServicioWs(`${this.obtenUrl()}/comisiones/catalogos/${numContrato}/cuentasSubsidiarias`,TypeRequest.GET);
    return response;
  }

  /** Consulta las subsidiarias del contrato */
  consultaSubsidiarias(numContrato:String): any{
    let response:any = this._conectionWS.peticionServicioWs(`${this.obtenUrl()}/comisiones/subsidiarias/${numContrato}/subsidiarias`,TypeRequest.GET);
    return response;
  }

  /** Obtiene las operaciones libres */
  operacionesLibres(numContrato:String){
    let response:any = this._conectionWS.peticionServicioWs(`${this.obtenUrl()}/comisiones/consultas/${numContrato}/operacionesLibres`,TypeRequest.GET);
    return response;
  }

  /** Guarda los porcentajes */
  guardaPorcentajes(numContrato:String,parametros:any){
    let response:any = this._conectionWS.peticionServicioWs(`${this.obtenUrl()}/comisiones/subsidiarias/${numContrato}/subsidiarias`,TypeRequest.PUT,parametros);
    return response;
  }

}