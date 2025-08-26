/**
 * Clase de configuracion global para paginados, calendarios
 * y aquellos componenentes que requieran un estandar en toda la aplicacion
 *
 * @Author emendoza
 * @Date 12/04/2023
 */
import { Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root',
})
export class GlobalConfig {
  /**
   * Variable para identificar el usuario que viene de l portal
   */
  private _portalUser!: string;

  /**
   * Variable para almacenamiento el perfil del usuario
   */
  private _userProfile: any;

  /**
   * Variable para usuario que inicia sesion
   */
  private _userSession: any;

  /**
   * Variable que contiene el perfilamiento del usuario
   */
  private _userProfiling: any;

  /**
   * Variable para el almacenamiento de la cookie aplicativa
   */
  private _appCookieValue!: string;

  /**
   * Variable que contendra la url para el refresco de sesion
   */
  private _urlRefreshSession!: string;

  /**
   * Nombre de la cookie aplicativa
   */
  private _appCookieName!: string;

  /**
   * Nombre del id del usuario
   */
   private _idUser!: string;

  /**
  * Dirección ip del usuario
  */
  private _ipAddress!: string;

  /**
   * Numero de registros por pagina
   */
  readonly pageSize: number = 10;

  /**
   * Pagina inicial
   */
  public page: number = 1;

  /**
   * numero maximo de paginas a mostrar inicial
   */
  readonly maxPageButtons: number = 10;

  /**
   * Locale para los calendarios del sistema
   */
  readonly locale: any = {
    firstDayOfWeek: 0,
    dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    dayNamesShort: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
    dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
    monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septimbre", "Octubre", "Noviembre", "Diciembre"],
    monthNamesShort: ["Ene", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dic"],
    today: 'Hoy',
    clear: 'Limpiar',
    dateFormat: 'dd/mm/yyyy',
    weekHeader: 'Sm'
  };

  /**
   * Tiempo default de la session cuando se
   * loggea un usuario
   */
  readonly sessionTime: number = 100;

  /**
   * Metdo para obtener el valor del usuario del portal
   * @returns string con nombre de usuario del portal
   */
  get portalUser(): string {
    return this._portalUser;
  }

  /**
   * Metodo para setear el valor de usaurio de portal
   * @param value - valor nuevo para el usuario del portal
   */
  set portalUser(value: string) {
    this._portalUser = value;
  }

  /**
  * Metdo para obtener el valor del perfil del usuario en sesion
  * @returns ProfileModel con los datos del perfil del usuario
  */
  get userProfile(): any {
    return this._userProfile;
  }

  /**
   * Metodo para setear el valor para el perfil del usuario
   * @param value - valor nuevo para el perfil del usuario
   */
  set userProfile(value: any) {
    this._userProfile = value;
  }

  /**
  * Metdo para obtener el valor del usuario en sesion
  * @returns UserModel - usuario en sesion
  */
  get userSession(): any {
    return this._userSession;
  }

  /**
   * Metodo para setear el el usuario en sesion
   * @param value - valor nuevo para el usuario del portal
   */
  set userSession(value: any) {
    this._userSession = value;
  }

  /**
  * Metdo para obtener el perfilamiento del usuario
  * @returns array con el perfilamiento del usuario
  */
  get userProfiling(): any {
    return this._userProfiling;
  }

  /**
   * Metodo para setear el perfilamiento del usuario
   * @param value - valor nuevo para el perfilamiento del usuario
   */
  set userProfiling(value: any) {
    this._userProfiling = value;
  }

  /**
  * Metdo para obtener el valor de la cookie aplicativa
  * @returns cookie aplicativa generada por el portal
  */
  get appCookieValue(): string {
    return this._appCookieValue;
  }

  /**
   * Metodo para setear el valor de usaurio de portal
   * @param value - valor nuevo para la cookie aplicativa
   */
  set appCookieValue(value: string) {
    this._appCookieValue = value;
  }

  /**
  * Metdo para obtener el valor de la url para refrescar sesion
  * @returns url para refresh de sesion
  */
  get urlRefreshSession(): string {
    return this._urlRefreshSession;
  }

  /**
   * Metodo para setear el valor de url de refresh de sesion
   * @param value - valor nuevo de url de refresh de sesion
   */
  set urlRefreshSession(value: string) {
    this._urlRefreshSession = value;
  }

  /**
   * Metdo para obtener el valor de la url para refrescar sesion
   * @returns url para refresh de sesion
   */
  get appCookieName(): string {
    return this._appCookieName;
  }

  /**
   * Metodo para setear el valor de url de refresh de sesion
   * @param value - valor nuevo de url de refresh de sesion
   */
  set appCookieName(value: string) {
    this._appCookieName = value;
  }

  /**
   * Metodo para obtener el valor del id del usuario en sesion
   * @returns id del usuario
   */
   get userId(): string {
    return this._idUser;
  }

  /**
   * Metodo para setear el valor del id del usuario 
   * @param value - valor nuevo del id del usuario
   */
  set userId(value: string) {
    this._idUser = value;
  }

  /**
   * Metodo para obtener el valor de la ip del usuario
   * @returns ip del usuario
   */
   get ipAddress(): string {
    return this._ipAddress;
  }

  /**
   * Metodo para setear el valor de la ip del usuario
   * @param value - valor nuevo de la ip del usuario
   */
  set ipAddress(value: string) {
    this._ipAddress = value;
  }
}