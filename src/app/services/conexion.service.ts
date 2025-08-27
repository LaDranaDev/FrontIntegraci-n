import { Injectable, SecurityContext } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpXsrfTokenExtractor
} from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ServicioTransporteDatos } from './servicio-transporte.service';


@Injectable()
export class ConexionService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  private HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  headers: HttpHeaders = new HttpHeaders();
  ERROR = new ErrorServiceWs();
  constructor(
    private tokenExtractor: HttpXsrfTokenExtractor,
    private transporte: ServicioTransporteDatos,
    private _http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  /**
   * @description Metodo para consumir Servicios Web

   * @param url URL de consumo de servicio
   * @param metodoEnvio Se especifica si el metodo de envio es GET,PUT,POST o DELETE
   * @param parametros Si el consumo es PUT o POST el cuerpo se incluira en el envio (Opcional)
   * @param header Si el servicio necesita llevar parametros en los headers (Opcional)
   *
   * @returns Promise<JSON> Respuesta del servicio
   */
  async peticionServicioWs(
    url: string,
    metodoEnvio: TypeRequest,
    parametros?: object
  ): Promise<any> {
    let urlFinal = '';
    const headers = new HttpHeaders()
      .set('Content-Type', metodoEnvio === 8 ? 'multipart/form-data': 'application/json')
    //AGREGAR HTTPS
    if (url.includes('http://')) {
      urlFinal = url;
    } else {
      urlFinal = 'http://' + url;
    }

    let valid = this.whiteList(urlFinal);
    if (valid) {
      switch (metodoEnvio) {
        case 1:
          return this._http.get(encodeURI(urlFinal), { headers })
            .map((response: any) => { if (response !== null) { return response; } })
            .catch(this.errorHandler).toPromise();
        case 2:
          return this._http.post(encodeURI(urlFinal), null, { 'headers': this.headers })
            .map((response: any) => { if (response !== null) { return response; } })
            .catch(this.errorHandler).toPromise();
        case 3:
          if (!parametros) {
            return Promise.reject(this.ERROR.PARAMETROS_NO_INFORMADOS);
          }
          return this._http.post(encodeURI(urlFinal), parametros, { 'headers': this.headers })
            .map((response: any) => { if (response !== null) { return response; } })
            .catch(this.errorHandler).toPromise();
        case 4:
          return this._http.put(urlFinal, parametros, { headers })
            .map((response: any) => { if (response !== null) { return response; } })
            .catch(this.errorHandler).toPromise();
        case 6:
          return this._http.delete(encodeURI(urlFinal), { headers })
            .map((response: any) => { if (response !== null) { return response; } })
            .catch(this.errorHandler).toPromise();
      }
    }
  }

  errorHandler(error: HttpErrorResponse) {
    return ErrorObservable.create(error);
  }

  /**
   * Lista Blanca de urls.
   * @param url confiable.
   */
  whiteList(url: string) {
    let flag = true;

    let verifyUrl = [
      "<a>", "</a>", "<A>", "</A>", "<script>", "</script>", "<SCRIPT>", "</SCRIPT>", "<", ">", "tcp:",
      "go=", "return=", "r_url=", "returnUrl=", "returnUri=", "locationUrl=", "goTo=", "return_url=", "return_uri=", "ref=",
      "referrer=", "backUrl=", "returnTo=", "successUrl=", "href=", "HREF=", "site:", "inurl:"
    ];

    let verifyCount = 0;
    let verifyLetter = 0;

    verifyUrl.forEach(key => {
      if (url.includes(key)) {
        verifyCount = verifyCount + 1;
        if ((url.match(new RegExp(key, "g")) || []).length > 1) {
          verifyLetter = verifyLetter + 1;
        }
      }
    });

    let urlValid = this.sanitizer.sanitize(SecurityContext.URL, url);

    if (urlValid?.includes('unsafe:') || verifyCount > 0 || verifyLetter > 0 || (url.match(new RegExp("https:", "g")) || []).length > 1) {
      flag = false;
    }

    return flag;
  }

  /* Coloca en la cabecera de la peticion el header 'cookie-aplicativa'
   * @param options RequestOptions
   */
  setHeaderData(options: any) {
    // if (Globals.obtenerCookie) {
    //   this.log('Colocando cookieAplicativa: ' + Globals.cookieAplicativa);
    //   options.headers = options.headers.append(Globals.cookieAplicativa, this.globals.cookieValue);
    // } else {
    //   options.headers = options.headers.set(Globals.cookieAplicativa, Globals.cookieDevValue);
    // }
    options.withCredentials = true;
  }

  /**
  * @description Metodo que analiza y regresa los headers informados por el usuario
  * @param header Lista de headers informados por el usuario
  */
  tratadoHeaders(header: HeaderstCustomList[], dato: boolean): HttpHeaders {
    let headers: HttpHeaders = new HttpHeaders();
    if (header != null) {
      header.push({ headerName: 'Content-Type', headerValue: 'application/json' });
      if (dato) {
        header.push({ headerName: 'Accept', headerValue: 'application/pdf' });
      }
      for (const headerInfo of header) {
        headers = headers.append(headerInfo.headerName, headerInfo.headerValue);
      }
    } else {
      headers = headers.append('Content-Type', 'application/json');
      if (this.transporte.getDatosSession() !== null) {
        headers = headers.append('cookieAplicativa', `${this.transporte.getDatosSession().tokenCookie}`);
      }
      if (dato) {
        headers = headers.append('Accept', '*/*');
      }
    }
    return headers;
  }
}

export class HeaderstCustomList {
  headerName: any;
  headerValue: any;
}

export enum TypeRequest {
  GET = 1,
  POST = 2,
  POST_VALUES = 3,
  PUT = 4,
  PUT_VALUES = 5,
  DELETE = 6,
  POST_TEXT = 7,
  POST_MULTI = 8
}

class ErrorServiceWs {
  METHODO_NO_ENCONTRADO = {
    notifications: [
      {
        code: 'EXC.AC.02',
        description: 'metodo',
        level: 'Critical',
        message: 'Metodo de consumo no econtrado',
        moreInfo: 'Angular Client no found method'
      }
    ]
  };
  PARAMETROS_NO_INFORMADOS = {
    notifications: [
      {
        code: 'EXC.AC.01',
        description: 'Parametros',
        level: 'Critical',
        message: 'Parametros de envio no informados',
        moreInfo: 'Angular Client Json parse null'
      }
    ]
  };
}
