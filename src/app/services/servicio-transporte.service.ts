import { Injectable } from '@angular/core';
import { CredencialesLogin } from './sesion.service';

export class DatosPortalizacion {
  applicationKey?: string;
    userId?: string;
    department?: string;
    userName?: string;
    idPerfil?: string;
    nombreSucursal?: string;
    cookieBKS?: string;
  }

@Injectable()
export class ServicioTransporteDatos {
  datos: DatosPortalizacion = new DatosPortalizacion;
  pixel: string = "";
  datosSession: CredencialesLogin = new CredencialesLogin;

  getDatosSession(): CredencialesLogin {
    this.datosSession = JSON.parse(localStorage.getItem('datosSession') || "");
    return this.datosSession;
  }

  setDatosSession(datosSession: CredencialesLogin) {
    localStorage.setItem('datosSession', JSON.stringify(datosSession));
    this.datosSession = datosSession;
  }

  getDatosPortal(): DatosPortalizacion {
    this.datos = JSON.parse(localStorage.getItem('datoPortal') || "");
    return this.datos;
    }

    setDatosProtal(datos: DatosPortalizacion) : void{
      localStorage.setItem('datoPortal',JSON.stringify(datos));
      this.datos = datos;
    }

    getPixel(): string {
      this.pixel = JSON.parse(localStorage.getItem('pixel') || "");
      return this.pixel;
    }

    setPixel(pixel: string) : void{
      localStorage.setItem('pixel',JSON.stringify(pixel));
      this.pixel = pixel;
    }
}
