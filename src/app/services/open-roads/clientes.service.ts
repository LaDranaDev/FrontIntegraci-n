import {Injectable} from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {Clientes} from '../../models/clientes';
import {ArchivoDiario} from '../../models/archivodiario';
import {HttpClient, JsonpClientBackend} from '@angular/common/http';
import { ConexionService, TypeRequest } from '../conexion.service';
import { HttpHeaders } from '@angular/common/http';
import { clienteTransformacion } from '../../models/clienteTransformacion';


@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private url = `${this.getUrl()}`;
  //private url = `localhost:8086`;
  cliente!:Clientes[];
  archivodiario!:ArchivoDiario[];
  // Temporarily stores data from dialogs
  
  id!: number;
  nombre!: string;
  descripcion!: string;
  numboc!: string;
  identificador!: number;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'my-auth-token'
    })
  };


  constructor (private _conectionWS: ConexionService,private httpClient: HttpClient) {}

  /**
   * @description recupera la funcion el valor de la url
   */
  getUrl() {
    return localStorage.getItem('url');
  }

  //Obtiene los clientes
  async obtenerLista(){
    //return this.httpClient.get<Clientes[]>(`${this.url}/cliente`);
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/cliente`,TypeRequest.GET);
    return response;
  }

  //obtiene el formato origen
  async obtenerFormatoO(){
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/mapa/formato-origen`,TypeRequest.GET);
    return response;
    //return this.httpClient.get<any[]>(`${this.url}/mapa/formato-origen`);
  }

  //obtiene el formato destino (FLAW)    ///////////////////////////////////////////////////
  async obtenerFormatoD(id:number){
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/mapa/formato-destino/${id}`,TypeRequest.GET);
    return response;  
  }

   //obtiene el canal
   async obtenerCanal(){
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/canal`,TypeRequest.GET);
    return response;
    //return this.httpClient.get<any[]>(`${this.url}/canal`);
  }

  //añade transformaciones al cliente
  //añadir Clientes Transformaciones (FLAW)   ///////////////////////////////////////////////
  public async addClientTransformacion(idorigen:number,iddestino:number,cliente: clienteTransformacion){
    //return this.httpClient.post<clienteTransformacion>(`${this.url}/cliente-transformacion/origen=${idorigen}/destino=${iddestino}`, cliente, this.httpOptions);
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/cliente-transformacion/origen=${idorigen}/destino=${iddestino}`, TypeRequest.POST_VALUES, cliente);
    return response;
  }

  //editar Clientes Transformaciones (FLAW)   //////////////////////////////////////////////
  async editarClientTransformacion(idClienteTransformacion:number,idorigen:number,iddestino:number,cliente: clienteTransformacion){
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/cliente-transformacion/cliente=${idClienteTransformacion}/origen=${idorigen}/destino=${iddestino}`, TypeRequest.POST_TEXT, cliente);
    return response;
  }

  //eliminar clientes Transformaciones
  async deleteClientTreansformaciones(id:number){
    let response: any;
    response = await  this._conectionWS.peticionServicioWs(`${this.url}/cliente-transformacion/eliminar/${id}`,TypeRequest.DELETE);
    return response;
    //return this.httpClient.delete<void>(`${this.url}/cliente-transformacion/eliminar/${id}`, this.httpOptions);
  }

  //obtiene transforaciones por cliente
  async obtenerTransfCliente(id:string){
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/cliente-transformacion/cliente=${id}`,TypeRequest.GET);
    return response;
    //return this.httpClient.get<any[]>(`${this.url}/cliente-transformacion/cliente=${id}`);
  }

  //Obtiene falso o verdadero si el cliente tiene transformaciones
  async obtenerTieneTransformaciones(id:number){
    //return this.httpClient.get<Clientes[]>(`${this.url}/cliente`);
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/cliente/buscarClienteTransformacion=${id}`,TypeRequest.GET);
    return response;
  }

  //Obtiene falso o verdadero si la transformacion tiene archivos relacionados
  async obtenerTieneArchivos(idTransformacion:number){
    //return this.httpClient.get<Clientes[]>(`${this.url}/cliente`);
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/cliente-transformacion/buscarCliTransfArchivo=${idTransformacion}`,TypeRequest.GET);
    return response;
  }

  //Obtiene los clientes (FLAW)    ///////////////////////////////////////////
  async obtenerBusqueda(cliente: Clientes){
      if(cliente.TXT_NMBR_CLTE.trim()==''){
      cliente.TXT_NMBR_CLTE="";
      }
      if(cliente.NUM_BUC.trim()==''){
        cliente.NUM_BUC="";
      }
      let response: any;
      response = await this._conectionWS.peticionServicioWs(`${this.url}/cliente/buscar/nombreCliente=${cliente.TXT_NMBR_CLTE}/numBuc=${cliente.NUM_BUC}`,TypeRequest.GET);
      return response;
      //return this.httpClient.get<Clientes[]>(`${this.url}/cliente/buscar/${cliente.TXT_NMBR_CLTE}/${cliente.NUM_BUC}`, this.httpOptions);
  }

  //añadir Clientes
  async addClient(cliente: Clientes){
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/cliente`,TypeRequest.POST_VALUES,cliente);
    return response;
    //return this.httpClient.post<Clientes>(`${this.url}/cliente`, cliente);
  }

  //editar clientes
  async editClient(id:string,cliente: Clientes){
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/cliente/${id}`,TypeRequest.POST_TEXT,cliente);
    return response;
    //return this.httpClient.post<Clientes>(`${this.url}/cliente/${id}`, cliente);
  }

  //eliminar clientes
  public async deleteClient(id:number){
    let response: any;
    response = await this._conectionWS.peticionServicioWs(`${this.url}/cliente/eliminar/${id}`,TypeRequest.DELETE);
    return response;
    //return this.httpClient.delete<void>(`${this.url}/cliente/eliminar/${id}`, this.httpOptions);
  }
  //////////////////////////////////////////////////////////// MONITORIZACIÓN (DEBERÍA ESTAR SEPARADO)
  //obtiene el formato salida

  getDialogData() {
    return this.nombre,this.descripcion,this.numboc;
  }

  updateIssue (nombre:string,descripcion:string,numboc:string): void {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.numboc = numboc;
  } 

  detailsClients (id:number,nombre:string,descripcion:string,identificador:number): void {
    this.id=id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.identificador = identificador;
  }

  deleteIssue (id: number): void {
  }
}

