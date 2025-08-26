import { Injectable, ViewChild, OnInit, EventEmitter, Output } from '@angular/core';

export class CredencialesLogin {
    perfil: string = "";
    mailUsuario: string = "";
    nombreUsr?: number;
    tokenCookie: string = "";
    fechaUltimaConexion: string = "";
    ultimoAcceso?: boolean;
  }

  @Injectable()
/** Clase contenedora de todo los metodos y atributos de sesion y configuracion inicial */
export class SesionDataInfo {
    
}