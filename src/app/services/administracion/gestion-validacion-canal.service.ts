import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { SaveValidationField } from 'src/app/interface/consultaValidacionesCanal.interface';

@Injectable({
  providedIn: 'root',
})
export class GestionValidacionCanalService {
  private url = `${this.getUrl()}`;
  dataSelectedGestion: { product: string; layout: string; assigned: string };
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

  getListaCanales(canales: any, paginacion: IPaginationRequest) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(
      `${this.url}/?page=${paginacion.page}&size=${paginacion.size}`,
      TypeRequest.GET
    );
    return response;
  }

  async validacionesCanal(
    producto: any,
    layout: any,
    size?: number,
    paginacion?: number,
  ): Promise<unknown> {
    let response: any;
    if (producto === null) {
      response = await this._conectionWS.peticionServicioWs(
        `${this.url}/administracion/validacionescanal/getvalidaciones?producto=&layout=`,
        TypeRequest.GET
      );
    } else {
      response = await this._conectionWS.peticionServicioWs(
        `${this.url}/administracion/validacionescanal/getvalidaciones?producto=${producto}&layout=${layout}&page=${paginacion}&size=${size}`,
        TypeRequest.GET
      );
    }
    return response;
  }

  async getValidacionesCampo() {
    const response = this._conectionWS.peticionServicioWs(
      `${this.url}/administracion/validacionescanal/getvalidacionescampo`,
      TypeRequest.GET
    );
    return response;
  }

  async getLayouts(): Promise<unknown> {
    const response = this._conectionWS.peticionServicioWs(
      `${this.url}/administracion/validacionescanal/getlayouts`,
      TypeRequest.GET
    );
    return response;
  }

  getProductos() {
    let response: any;
    response = this._conectionWS.peticionServicioWs(
      `${this.url}/administracion/validacionescanal/getproductos`,
      TypeRequest.GET
    );
    return response;
  }
  CE() {
    let response: any;
    response = this._conectionWS.peticionServicioWs(
      `${this.url}/administracion/validacionescanal/getmensajeserror`,
      TypeRequest.GET
    );
    return response;
  }
  getAsignados(id: any): Promise<unknown> {
    let response: any;
    response = this._conectionWS.peticionServicioWs(
      `${this.url}/administracion/validacionescanal/getasignados/${id}`,
      TypeRequest.GET
    );
    return response;
  }
  guardarAsignado(data: any) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(
      `${this.url}/administracion/validacionescanal`,
      TypeRequest.POST_VALUES,
      data
    );
    return response;
  }
  guardarValidacion(data: any, isNew: boolean) {
    let response: any;
    response = this._conectionWS.peticionServicioWs(
      `${this.url}/administracion/validacionescanal/validacion`,
      isNew ? TypeRequest.POST_VALUES : TypeRequest.PUT,
      data
    );
    return response;
  }

  async getType(): Promise<unknown> {
    const response = await this._conectionWS.peticionServicioWs(
      `${this.url}/administracion/validacionescanal/gettipos`,
      TypeRequest.GET
    );
    return response;
  }

  async saveValidationFiel(
    data: SaveValidationField,
    isNew: boolean
  ): Promise<unknown> {
    const response = await this._conectionWS.peticionServicioWs(
      `${this.url}/administracion/validacionescanal/campo`,
      isNew ? TypeRequest.POST_VALUES : TypeRequest.PUT,
      data
    );
    return response;
  }

  async deleteValidacion(id: string): Promise<unknown> {
    const response = await this._conectionWS.peticionServicioWs(
      `${this.url}/administracion/validacionescanal/${id}`,
      TypeRequest.DELETE
    );
    return response;
  }

  async getExport(
    typeDoc: string,
    idProduct: string,
    idLayout: string
  ): Promise<unknown> {
    const response = await this._conectionWS.peticionServicioWs(
      `${this.url}/administracion/validacionescanal/reporte/${typeDoc}?producto=${idProduct}&layout=${idLayout}`,
      TypeRequest.GET
    );
    return response;
  }

  setDataToAddField(product: string, layout: string, assigned: string) : void {
    this.dataSelectedGestion = {
      product: product,
      layout: layout,
      assigned: assigned,
    };
  }

  /**
   * @description Método para recuperar el valor de la url
   */
  getUrl() {
    //return 'https://lightweight-gateway-mx-h2h-bo-monitoreo-dev.apps.str01.mex.dev.mx1.paas.cloudcenter.corp/';
    return localStorage.getItem('url');
  }
}
