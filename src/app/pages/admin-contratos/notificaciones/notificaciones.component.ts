import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { Router } from '@angular/router';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PerfilamientoService } from 'src/app/services/perfilamiento.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css'],
})
export class NotificacionesComponent implements OnInit, OnDestroy {
  notificacionList: any;
  checkbox: boolean = false;
  datos = {
    numContrato: '',
    bucCliente: '',
    descEstatus: '',
    nombreCompleto: '',
    personalidad: '',
    cuentaEje: '',
    idContrato: '',
    razonSocial: '',
  };
  exportDisable = true;
  usuarioActual: string | null = '';
  perfilamiento: any;
  ActivacionCorreo: boolean = false;
  constructor(
    private globals: Globals,
    private router: Router,
    private serviceCommon: ComunesService,
    private service: NotificacionesService,
    private fc: FuncionesComunesComponent,
    public dialog: MatDialog,
    private translateService: TranslateService,
    public perfila: PerfilamientoService,
  ) {
    this.inicio()
    this.usuarioActual = localStorage.getItem('UserID');
  }
  clickSuscliption: Subscription | undefined;

  async ngOnInit() {
    this.clickSuscliption = this.serviceCommon.clickAtion.subscribe(async (resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 5) {
        /*this.perfilamiento = this.serviceCommon.getSaveLocalStorage('perfilamiento');
        const usu = {
            "usuario": this.perfilamiento.usuario,
            "diferenciador": this.perfilamiento.diferenciador,
            "perfil": this.perfilamiento.perfil,
        }
    
        const perfil = {
          'perfilamientoUsuario': usu,
          "url" : "/contratos/vistaNotificacionesContrato.do",
          "componente": "ACTIVAR"
        }

        try {
            await this.perfila.accion(perfil).then(
              async(result: any) => {
            if(result.message === 'La operacion es valida'){*/
        this.ActivacionCorreo = true
        this.initForm();
        /*}
        
      }
      )
    }catch{
      this.globals.loaderSubscripcion.emit(false);
      this.open(this.translateService.instant('modals.moduloAdministracion.consultasBics.error.consulta'), '', 'error', '', '');
 
    }*/
      }
    });
  }
  async inicio() {

  }

  initForm() {
    this.datos = this.serviceCommon.getDatos();
    this.consultaNotificaciones();
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }

  async consultaNotificaciones() {
    this.exportDisable = true;
    try {
      await this.service
        .notificacionesPorContrato(this.datos.idContrato)
        .then(async (resp: any) => {
          this.notificacionList = resp.notificaciones;
          resp.notificaciones.map((noti: any) => {
            if (noti.bandCliente == 'A' || noti.bandOpCaptacion == 'A') {
              this.exportDisable = false;
            }
          });
          await this.globals.loaderSubscripcion.emit(false);
        });
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        'Error',
        this.translateService.instant('pantalla.configNotificaciones.error.consultar'),
        'error'
      );
    }
  }

  async habilitarCamposCliente(reg: any, event: any, constData: any) {
    let activateCheck = false;
    reg.bandEnvAreaCent = reg.bandOpCaptacion;
    reg.bandEnvCte = reg.bandCliente;

    let request = {
      bandCliente: reg.bandCliente == 'A' ? 'I' : 'A',
      idNotiCntr: reg.idNotiCntr,
      bandOpCaptacion: reg.bandOpCaptacion,
      idCntr: reg.idCntr,
      idNoti: reg.idNoti,
      bandEnvAreaCent: reg.bandEnvAreaCent,
      bandEnvCte: reg.bandCliente == 'A' ? 'I' : 'A',
    };
    await this.service
      .listaDestinatarios(reg.idNotiCntr, constData)
      .then(async (resp: any) => {
        this.globals.loaderSubscripcion.emit(false);
        if (resp.notificaciones.length > 0) {
          activateCheck = true;
        }
      });
    if (!activateCheck) {
      event.preventDefault();
      await this.consultaNotificaciones();
      this.open(this.translateService.instant('modals.catalogoDin.alerta'), this.translateService.instant('notificaciones.contrato.msjAgregueCorreos'), 'alert');
      this.checkbox = false;
    } else {
      let contenido: string = ""
      var ckCliente: any = document.getElementById("ckCliente" + reg.idNoti);
      if (ckCliente.checked) {
        contenido = this.translateService.instant('pantalla.configNotificaciones.habilitar');
      } else {
        contenido = this.translateService.instant('pantalla.configNotificaciones.deshabilitar');
      }
      const dialogo = this.dialog.open(ModalInfoComponent, {
        data: new ModalInfoBeanComponents(this.translateService.instant('pantalla.configNotificaciones.confirmar'), contenido, "yesNo"), hasBackdrop: true
      });
      dialogo.afterClosed().subscribe((result) => {
        if (result === 'si') {
          this.updateEstatusNotificacion(request);
        }
      });
    }
  }

  async updateEstatusNotificacion(request: any) {
    try {
      await this.service
        .actualizaEstatusNotificaciones(request)
        .then(async (resp: any) => {
          await this.consultaNotificaciones();
          this.globals.loaderSubscripcion.emit(false);
          this.open(this.translateService.instant('parametros.contrato.msjINF004Titulo'),
            '',
            'info',
            'INF004',
            ''
          );
        });
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        'Error',
        this.translateService.instant('pantalla.configNotificaciones.error.actualizar'),
        'error'
      );
    }
  }

  async habilitarCamposCatalogo(reg: any, event: any, constData: any) {
    let activateCheck = false;
    reg.bandEnvAreaCent = reg.bandOpCaptacion;
    reg.bandEnvCte = reg.bandCliente;
    let request = {
      bandCliente: reg.bandCliente,
      idNotiCntr: reg.idNotiCntr,
      bandOpCaptacion: reg.bandOpCaptacion == 'A' ? 'I' : 'A',
      idCntr: reg.idCntr,
      idNoti: reg.idNoti,
      bandEnvAreaCent: reg.bandOpCaptacion == 'A' ? 'I' : 'A',
      bandEnvCte: reg.bandCliente,
    };
    await this.service
      .listaDestinatarios(reg.idNotiCntr, constData)
      .then(async (resp: any) => {
        this.globals.loaderSubscripcion.emit(false);
        if (resp.notificaciones.length > 0) {
          activateCheck = true;
        }
      });
    if (!activateCheck) {
      event.preventDefault();
      await this.consultaNotificaciones();
      this.open(this.translateService.instant('modals.catalogoDin.alerta'), this.translateService.instant('notificaciones.contrato.msjAgregueCorreos'), 'alert');

      this.checkbox = false;
    } else {
      let contenido: string = ""
      var ckAreas: any = document.getElementById("ckAreas" + reg.idNoti);
      if (ckAreas.checked) {
        contenido = this.translateService.instant('pantalla.configNotificaciones.habilitar');
      } else {
        contenido = this.translateService.instant('pantalla.configNotificaciones.deshabilitar');
      }
      const dialogo = this.dialog.open(ModalInfoComponent, {
        data: new ModalInfoBeanComponents(this.translateService.instant('pantalla.configNotificaciones.confirmar'), contenido, "yesNo"), hasBackdrop: true
      });
      dialogo.afterClosed().subscribe(async (result) => {
        if (result === 'si') {
          this.updateEstatusNotificacion(request);
        }else{
          await this.consultaNotificaciones();
        }
      });
    }
  }

  irCuentas(constData: string, reg: any) {
    reg['constData'] = constData;
    reg['idCntrRoot'] = this.datos.idContrato;
    this.router.navigateByUrl(
      `/admin-contratos/notificaciones/destinatarios/${btoa(
        JSON.stringify(reg)
      )}`
    );
  }

  export() {
    const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
    dialogo.afterClosed().subscribe((formato) => {
      if (formato) {
        let envio = {
          numeroContrato: this.datos.numContrato,
          idCntr: this.datos.idContrato,
          usuario: this.usuarioActual,
        };
        this.generateReporte(formato, envio);
      }
    });
  }

  generateReporte(formato: string, envio: any) {
    if (formato === 'xlsx') {
      this.reportXls(envio);
    } else if (formato === 'csv') {
      this.reportCsv(envio);
    } else {
      this.reportPdf(envio);
    }
  }

  async reportPdf(envio: any) {
    try {
      await this.service.reportePdf(envio).then(async (result: any) => {
        if (result.data) {
          /** Se manda la informacion para realizar la descarga del archivo */
          this.fc.convertBase64ToDownloadFileInExport(result);
        } else {
          if (result.code === '404') {
            this.open('Error', result.message, 'error');
          } else {
            this.open(
              'Error',
              this.translateService.instant('modals.error.exportacion'),
              'error'
            );
          }
        }
        this.globals.loaderSubscripcion.emit(false);
      });
    } catch {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        'Error',
        this.translateService.instant('modals.error.exportacion'),
        'error'
      );
    }
  }

  async reportXls(envio: any) {
    try {
      await this.service.reporteXls(envio).then(async (result: any) => {
        if (result.data) {
          /** Se manda la informacion para realizar la descarga del archivo */
          this.fc.convertBase64ToDownloadFileInExport(result);
        } else {
          if (result.code === '404') {
            this.open('Error', result.message);
          } else {
            this.open(
              'Error',
              this.translateService.instant('modals.error.exportacion'),
            );
          }
        }
        this.globals.loaderSubscripcion.emit(false);
      });
    } catch {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        'Error',
        this.translateService.instant('modals.error.exportacion'),
        'error'
      );
    }
  }

  async reportCsv(envio: any) {
    try {
      await this.service.reportCsv(envio).then(async (result: any) => {
        if (result.data) {
          /** Se manda la informacion para realizar la descarga del archivo */
          this.fc.convertBase64ToDownloadFileInExport(result);
        } else {
          if (result.code === '404') {
            this.open('Error', result.message);
          } else {
            this.open(
              'Error',
              this.translateService.instant('modals.error.exportacion'),
              'error'
            );
          }
        }
        this.globals.loaderSubscripcion.emit(false);
      });
    } catch {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        'Error',
        this.translateService.instant('modals.error.exportacion'),
        'error'
      );
    }
  }

  /**
   * @description evento para poder levantar el modal para
   * mostrar los mensajes de sucess o error
   * @param titulo indica si se ejecutara para error o success
   * @param contenido mensaje que se mostrara en el modal
   */
  open(
    titulo: String,
    contenido: String,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    code?: string,
    sugerencia?: string
  ) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        contenido,
        type,
        code,
        sugerencia
      ), hasBackdrop: true
    });
  }
}
