import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { Subscription } from "rxjs";
import { Globals } from "src/app/bean/globals-bean.component";
import { ComunesService } from "src/app/services/comunes.service";
import { GestionParametrosCanalService, Canal } from "src/app/services/gestion-buzon/gestion-parametros-canal.service";

@Component({
  selector: 'app-gestion-parametros-canal',
  templateUrl: './gestion-parametros-canal.component.html'
})
export class GestionParametrosCanalComponent implements OnInit, OnDestroy {
  /** Variable para indicar en que pagina se encuentra */
  page: number = 0;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalItems: number = 0;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  itemsPerPage: number = 5;

  /**
  * Datos para llenar la tabla
  */
  items: Canal[];

  constructor(
    private globals: Globals,
    private router: Router,
    private service: GestionParametrosCanalService,
    private comunService: ComunesService,
  ) {}

  clickSuscliption: Subscription | undefined;

  ngOnInit(){
    //this.initForm();
    
    this.clickSuscliption = this.comunService.clickAtion.subscribe(async (resp:any) => {
      const { codeMenu } = resp;
      if (codeMenu === 2) {
        this.initForm();
      }
    });
  }

  async initForm(){
    try {
      let response = await this.service.getChannels(this.page, this.itemsPerPage);
      this.items = response.content;
      this.totalItems = response.totalElements;
      this.globals.loaderSubscripcion.emit(false);

    } catch (error) {
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }

  openChannel(item: Canal) {
    this.router.navigate(['/gestionBuzon/gestionParametrosCanal', item.idChannel]);
  }

  async pageChanged(event: PageChangedEvent) {
    this.page = event.page - 1;
    let response = await this.service.getChannels(this.page, this.itemsPerPage);
    this.items = response.content;
    this.totalItems = response.totalElements;
    this.globals.loaderSubscripcion.emit(false);
  }

}
