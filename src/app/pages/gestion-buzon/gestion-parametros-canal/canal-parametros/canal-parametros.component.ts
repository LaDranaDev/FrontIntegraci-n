import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Globals } from "src/app/bean/globals-bean.component";
import { ModalInfoBeanComponents } from "src/app/bean/modal-info-bean.component";
import { ModalConfirmComponent } from "src/app/components/modals/modal-confirm/modal-confirm.component";
import { ModalInfoComponent } from "src/app/components/modals/modal-info/modal-info.component";
import { GestionParametrosCanalService } from "src/app/services/gestion-buzon/gestion-parametros-canal.service";

@Component({
  selector: 'app-canal-parametros',
  templateUrl: './canal-parametros.component.html'
})
export class CanalParametrosComponent implements OnInit {

  idChannel: number;
  idProtocol: number;
  idReg: number;
  channelName: string;
  protocols: any[];
  paramNames: string[] = [];
  paramsGet: any[] = [];
  paramsPut: any[] = [];

  constructor(
    private globals: Globals,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private service: GestionParametrosCanalService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadData(params['id'], params['idReg']);
    })
  }

  async loadData(idChannel: string, idReg: string) {
    this.idChannel = parseInt(idChannel);
    this.idReg = isNaN(parseInt(idReg)) ? 0 : parseInt(idReg);
    this.protocols = await this.service.getProtocols();

    const channelData = JSON.parse(sessionStorage.getItem("channelData") || "{}");
    sessionStorage.removeItem("channelData");
    
    this.channelName = channelData.name;

    for (const protocol of (channelData.protocols || [])) {
      const params = (protocol.paramsGet || []).concat(protocol.paramsPut || []);

      for (const paramGet of params) {
        if (paramGet.idReg === this.idReg) {
          this.changeProtocol(protocol);
          break;
        }
      }

      if (this.idProtocol) break;
    }

    this.globals.loaderSubscripcion.emit(false);
  }

  selectProtocol(event: any) {
    const idProtocol = event.target.value;
    for (const protocol of this.protocols) {
      if (idProtocol == protocol.idProtocol) {
        this.changeProtocol2(protocol);
        return;
      }
    }
    this.paramNames = [];
    this.paramsGet = [];
    this.paramsPut = [];
  }

  changeProtocol2(protocol: any) {
    this.idProtocol = protocol.idProtocol;
    this.paramNames = protocol.paramNames;
    this.paramsGet = protocol.paramsGet
    this.paramsPut = protocol.paramsPut
  }

  changeProtocol(protocol: any) {
    this.idProtocol = protocol.idProtocol;
    this.paramNames = protocol.paramNames;
    this.paramsGet = (protocol.paramsGet || []).filter((p: any) => p.idReg === this.idReg);
    this.paramsPut = (protocol.paramsPut || []).filter((p: any) => p.idReg === this.idReg);
  }
  cancelar() {
    this.router.navigate([`/gestionBuzon/gestionParametrosCanal/${this.idChannel}`]);
  }

  guardar() {
    const params = (this.paramsGet || []).concat(this.paramsPut || []);
    if (params.some(p => p.paramIsMandatory == 1 && !p.patternValue)) {
      this.openDialog("Error",this.translate.instant('obligarotio.azul') ,'error','VAL001','');
      return;
    }
     const dialogo = this.dialog.open(ModalInfoComponent, {
       data: new ModalInfoBeanComponents( 
        this.translate.instant('administracion.general.tituloConfirmacion'), 
        this.translate.instant('administracion.general.mensajeConfirmacion'),
        "confirm"), hasBackdrop: true
     });
     dialogo.afterClosed().subscribe(result => {
       if (result) {
        this.service.putParrams(this.idChannel, params).then( _ => {
          this.router.navigate([`/gestionBuzon/gestionParametrosCanal/${this.idChannel}`]);
          this.openDialog(
            this.translate.instant('administracion.gestionCanales.EXGC001.Titulo'),
            this.translate.instant('administracion.gestionCanales.EXGC001.Observacion'),
            'info',
            this.translate.instant('administracion.gestionCanales.EXGC001.Codigo'),
            ''
          );
        })
       }
     });
   
  }

  limpiar() {
    for (let paramGet of this.paramsGet) {
      paramGet.patternValue = '';
    }
    for (let paramPut of this.paramsPut) {
      paramPut.patternValue = '';
    }
  }

  validarParametro(event: KeyboardEvent) {
    var valida = "/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzñÑ1234567890-_*. ";
    return valida.indexOf(event.key) >= 0;
  }

  openDialog(titulo: string, contenido: string, type?:any, errorCode?:string, sugerencia?:string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido,type,errorCode,sugerencia), hasBackdrop: true
    });
  }

}
