import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ContratosService } from './services/admin-contratos/contratos.service';
import { CookieService } from 'ngx-cookie-service';
import { StartupConfigService } from './services/wsconfig/startup-config.service';
import { ComunesService } from './services/comunes.service';
import { parametrosService } from './services/contingencia/parametros.service';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators'
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PerfilamientoService } from './services/perfilamiento.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  header: HeaderstCustomList[] = [];

  constructor(private service: ContratosService, private cookie: CookieService, private startupService: StartupConfigService,
    private comun: ComunesService, private parametros: parametrosService, private router: Router, private translate: TranslateService,
    private activatedRoute: ActivatedRoute, private perfilamiento: PerfilamientoService) {

    this.router.events.pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd)).subscribe(event => {
      if (event.id === 1 && event.url === event.urlAfterRedirects) {
        this.router.navigate(['']);
      }
    })

    this.startupService.load();

    var cokie = this.cookie.getAll();
    if (cokie['DataCookie'] !== undefined) {
      localStorage.setItem('UserID', cokie['DataCookie']);
    }

    //LFER azure
    this.activatedRoute.queryParams.subscribe(params => {
      try {
        if (params['user']) {
          let userCode = params['user'];

          if (userCode !== undefined) {
            localStorage.setItem('UserID', userCode);
          }
          let tknVal = params['tokenVal'];
          if (tknVal !== undefined) {
            localStorage.setItem('tknVal', tknVal);
          }
        } else {
          console.log('no hay user en parametros...');
          let userlocal = localStorage.getItem('UserID');
          //let userlocal = 'D681657';
          if (userlocal !== undefined) {
            console.log('userlocal: ' + userlocal);
            localStorage.setItem('UserID', userlocal ?? '');
          } else {
            console.log('no hay user en localstorage...');
          }
        }
      } catch (e) {
        console.log("Error al obtener User: " + e);
      }
    });

    this.service.obtenerDatosYml().subscribe((response) => {
      try {
        localStorage.setItem('url', response.propertySources[0].source.url);
        localStorage.setItem('urlRdFront', response.propertySources[0].source.urlRdFront);
        this.comun.setUrl(response.propertySources[0].source.url);
        this.perfilamiento.setUrl(response.propertySources[0].source.url);
        this.comun.setUrlFront(response.propertySources[0].source.urlRdFront);
        this.parametros.setUrl(response.propertySources[0].source.url);
        this.comun.setUrlLogAzure(response.propertySources[0].source.urlLogAzure);
        localStorage.setItem('logAzure', response.propertySources[0].source.urlLogAzure);
      } catch (e) {
        console.log("Error al obtener los datos del yml" + e);
      }
    });
  }
}

export class HeaderstCustomList {
  headerName: any;
  headerValue: any;
}
