/**
 * Banco Santander (Mexico) S.A., Institucion de Banca Multiple, Grupo Financiero Santander Mexico
 * Todos los derechos reservados
 *
 * globals.ts
 *
 * Control de versiones:
 *
 * Version  Date/Hour               By                  Company     Description
 * -------  -------------------     ----------------    --------    -----------------------------------------------------------------
 * 1.0    23/04/2018                RMH                 TCS SFW     Constantes y configuracion Global
 */

import { Injectable, EventEmitter } from '@angular/core';
import { SessionBeanComponent } from './session-bean.component';

@Injectable()
export class Globals {
  public languajeDefault = 'es';
  public language = '';
  /* Mensaje de error */
  public errorMessage = '';
  /* Valor de la cookie */
  public cookieValue = '';
  /*Atributo que define variable para guardar el menu*/
  public menuvigente = '';
  /* Titulo aplicacion */
  public title: '' = "";
  /* Nombre de la cookie aplicativa */
  public static get cookieAplicativa(): string { return 'token'; }
  /* Indica si se mostrara la aplicacion */
  public showApp = false;
  /* Contendra las etiquetas internacionalizadas */
  public labels = {};
  /* Booleano para indicar si se debe mostrar el PopUp de si desea renovar la sesion*/
  public popUpSessionExpirar = true;
  /* Tamaño de pagina */
  public static get pageSize(): number { return 100; }
  /* Tamaño de pagina en modulos de valores */
  public static get pageSizeValores(): number { return 100; }
  /* Valor de la cookie en ambiente desarrollo */
  public static get cookieDevValue(): string { return ''; }
  /* Indica si se obtendra la cookie del response (true) o se emplea una de prueba (false) */
  public static get obtenerCookie(): boolean { return true; }
  // URL de Servidor de configuracion
  public static get urlConfigServer(): string { return 'config.json'; }
  // URL to web api Catalogos
  public static get urlCatalogos(): string { return 'api/catalogos/'; }
  /** Datos empleado firmado */
  public modalStringLabel = '';
    /** Define el numero de peticiones que se estan procesando */
  public requestCount!: number;

  /** Propiedad para el control del loader */
  public loaderSubscripcion = new EventEmitter<boolean>();
  /* Atributo que corresponde a los valores de la session*/
  public sessionBean: SessionBeanComponent = new SessionBeanComponent;
}

