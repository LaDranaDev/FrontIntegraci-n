/**
 * Clase service para generica para obtener la configuracion de las URL
 * a donde seran redireccionadas las peticiones
 *
 * @Author Everis
 * @Date 12/04/2023
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { GlobalConfig } from '../wsconfig/global.config';


@Injectable({
  providedIn: 'root',
})
export class StartupConfigService {
  /**
   * Objeto que almacenara la configuracion
   */
  private configuration: any;



  /**
   * Constructor de la clase
   * @param http - Cliente http
   * @param globalConfig
   * @param cookieService
   * @param authenticationService - servicio para logueo y verificacion de sesion
   * @param router - Objeto para manejo de rutas
   */
  constructor(private http: HttpClient,
    private globalConfig: GlobalConfig
    ) {
  }

  /**
   * Metodo para obtener la url mendiante una llave
   *
   * @param key - parametro que indica el elemento a obtener de la
   * configuracion
   */
  public getValue(key: string, json: any) {
    return this.getConfig(json)[key];
  }

  /**
   * Obtiene la instancia de la configuracion
   */
  public getConfig(json: any): any {
    return json;
  }

  /**
   * Metodo para realizar la carga del archivo de rutas donde
   * se encuentran configuradas las URL
   * Carga de inicio de sesion de usuario y registro de parametros
   * globales
   */
  public load(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.get(environment.url).subscribe((json) => {
        //Se cargan los valores del json a una varible para almacenamiento en memoria
        this.configuration = json;
      
     
        
        // Se otiene el perfilado del usuario
        this.globalConfig.userId = this.globalConfig.portalUser;
        
      });
    });
  }

}
