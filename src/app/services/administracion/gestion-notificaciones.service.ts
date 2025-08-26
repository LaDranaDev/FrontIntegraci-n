import { Injectable } from '@angular/core';
import { ConexionService, TypeRequest } from '../conexion.service';
import { NotificacionesModel } from 'src/app/interface/gestionNotificaciones.interface';
import { IPaginationRequest } from 'src/app/bean/i-pagination-request';

interface Receivers {
  idDestinatario: number | null;
  idNotificacion: number | undefined;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class GestionNotificacionesService {
  private url = `${this.getUrl()}`;

  catDestType = [
    { value: 'A', label: 'Ambos' },
    { value: 'C', label: 'Clientes' },
    { value: 'O', label: 'Area Central' },
  ] as { value: string; label: string }[];

  catNotiType = [
    { value: 'N', label: 'Notificacion' },
    { value: 'A', label: 'Alarma' },
  ] as { value: string; label: string }[];
  constructor(private _conectionWS: ConexionService) {}

  async getNotification(name: any, clave: any,  paginacion:IPaginationRequest) {
    const request = {
      nombNotiSes: name ? name : '',
      claveTempl: clave ? clave : '',
    };
    const response = await this._conectionWS.peticionServicioWs(`${this.url}/contratos/administracion/notificaciones/consultanotificaciones?page=${paginacion.page}&size=${paginacion.size}`,
      TypeRequest.POST_VALUES,
      request
    );
    return response;
  }

  async addNotify(requestNoti: any): Promise<unknown> {
    const response = await this._conectionWS.peticionServicioWs(
      `${this.url}/contratos/administracion/notificaciones/agregarNotificacion`,
      TypeRequest.POST_VALUES,
      requestNoti
    );
    return response;
  }

  async editNotify(requestNoti: any): Promise<unknown> {
    const response = await this._conectionWS.peticionServicioWs(
      `${this.url}/contratos/administracion/notificaciones/editarNotificacion`,
      TypeRequest.POST_VALUES,
      requestNoti
    );
    return response;
  }

  async getReceiver(idNotificacion: string): Promise<unknown> {
    const response = await this._conectionWS.peticionServicioWs(
      `${this.url}/contratos/administracion/notificaciones/consultaDestinatarios`,
      TypeRequest.POST_VALUES,
      {
        idNotificacion,
      }
    );
    return response;
  }

  async editAddReceiver(requestAddEdit: Receivers): Promise<unknown> {
    const actionUrl = requestAddEdit.idDestinatario
      ? 'editarDestinatario'
      : 'agregaDestinatario';
    const response = await this._conectionWS.peticionServicioWs(
      `${this.url}/contratos/administracion/notificaciones/${actionUrl}`,
      TypeRequest.POST_VALUES,
      requestAddEdit
    );
    return response;
  }

  async deleteReceiver(requestAddEdit: Receivers): Promise<unknown> {
    const response = await this._conectionWS.peticionServicioWs(
      `${this.url}/contratos/administracion/notificaciones/eliminaDestinatario`,
      TypeRequest.POST_VALUES,
      requestAddEdit
    );
    return response;
  }

  async exportNotify(): Promise<unknown> {
    const response = await this._conectionWS.peticionServicioWs(
      `${this.url}/contratos/administracion/notificaciones/reporte/xls`,
      TypeRequest.POST_VALUES,
      {
        nombNotiSes: '',
        claveTempl: '',
      }
    );
    return response;
  }

  getUrl() {
    //return 'http://localhost:8083';
    return localStorage.getItem('url');
  }
}
