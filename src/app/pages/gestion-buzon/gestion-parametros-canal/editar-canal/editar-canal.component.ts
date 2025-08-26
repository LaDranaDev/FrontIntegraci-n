import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { map, switchMap } from "rxjs/operators";
import { Globals } from "src/app/bean/globals-bean.component";
import { ModalInfoBeanComponents } from "src/app/bean/modal-info-bean.component";
import { ModalConfirmComponent } from "src/app/components/modals/modal-confirm/modal-confirm.component";
import { ModalInfoComponent } from "src/app/components/modals/modal-info/modal-info.component";
import { GestionParametrosCanalService } from "src/app/services/gestion-buzon/gestion-parametros-canal.service";

@Component({
  selector: 'app-editar-canal',
  templateUrl: './editar-canal.component.html',
  styleUrls: ['./editar-canal.component.css']
})
export class EditarCanalComponent implements OnInit {

  /** Identificador del canal. */
  idChannel: number;
  /** Nombre del canal. */
  name: string = "";
  /** Descripcion del canal. */
  description: string = "";
  /**
   * Lista de protocolos asociados al canal
   */
  protocols: any[];
  /**
   * Datos del canal
   */
  channelData: any;

  regs: any[] = [];

  constructor(
    private globals: Globals,
    private route: ActivatedRoute,
    private router: Router,
    private service: GestionParametrosCanalService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
      map(params => parseInt(params['id'])),
      switchMap(idChannel => this.service.getChannel(idChannel)),
    ).subscribe(response => {
      this.channelData = response;
      this.idChannel = response.idChannel;
      this.name = response.name;
      this.description = response.description;
      this.protocols = response.protocols;
      if (this.protocols && this.protocols.length > 0) {
        this.getRegs();
      }
      this.globals.loaderSubscripcion.emit(false);
    });
  }

  getRegs() {
    const idRegsSet = new Set<number>();
    const protocol = this.protocols[0];
    const params = (protocol.paramsGet || []).concat(protocol.paramsPut || []);
    for (const param of params) {
      idRegsSet.add(param.idReg);
    }
    const idRegs = Array.from(idRegsSet);
    idRegs.sort();
    const regsMap: any = {};
    for (const idReg of idRegs) {
      regsMap[idReg] = {
        idReg: idReg,
        paramsGet: [],
        paramsPut: []
      };
    }
    for (const param of protocol.paramsGet) {
      regsMap[param.idReg].paramsGet.push(param);
    }
    for (const param of protocol.paramsPut) {
      regsMap[param.idReg].paramsPut.push(param);
    }
    this.regs = [];
    for (const idReg of idRegs) {
      this.regs.push(regsMap[idReg]);
    }
  }

  back() {
    this.router.navigate(['/gestionBuzon/gestionParametrosCanal']);
  }

  addParams() {
    sessionStorage.setItem("channelData", JSON.stringify(this.channelData));
    this.router.navigate([`/gestionBuzon/gestionParametrosCanal/${this.idChannel}/nuevo`]);
  }

  editParams(idReg: number) {
    sessionStorage.setItem("channelData", JSON.stringify(this.channelData));
    this.router.navigate([`/gestionBuzon/gestionParametrosCanal/${this.idChannel}/${idReg}`]);
  }

  updateParramStatus(parram: any, event: any) {
    event.preventDefault();
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents( 
        this.translate.instant('administracion.general.tituloConfirmacion'), 
        this.translate.instant('administracion.general.mensajeConfirmacion'),
        "confirm"), hasBackdrop: true
    }).afterClosed().subscribe(result => {
      if (result) {
        parram.patternStatus = parram.patternStatus === 'A' ? 'I' : 'A';
        this.service.updateParramsStatus(parram.idReg, parram.patternType, parram.patternStatus).then(_ => {
          this.globals.loaderSubscripcion.emit(false);
        });
      }
    });
  }

}
