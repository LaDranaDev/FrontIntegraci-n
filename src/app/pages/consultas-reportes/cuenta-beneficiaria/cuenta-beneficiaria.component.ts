import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { CuentaBeneficiariaService } from 'src/app/services/consultas-reportes/cuentabeneficiaria.service';

@Component({
  selector: 'app-cuenta-beneficiaria',
  templateUrl: './cuenta-beneficiaria.component.html',
  styleUrls: ['./cuenta-beneficiaria.component.css']
})
export class CuentaBeneficiariaComponent implements OnInit, OnDestroy {

  showEmailAddMod = false;
  disabledFormItem = true;
  emails: { email: string; id: string; selected?: boolean }[] = [];
  emailsSelected: { email: string; id: string; selected?: boolean }[] = [];
  email: { email: string; id: string } = { email: '', id: '' };
  showConsultResult = false;
  clickSuscliption: Subscription | undefined;
  clickSuscliptionGraph: Subscription | undefined;
  datos: any;
  objPageable: IPaginationRequest;
  objPageable2: IPaginationRequest;
  page: number = 1;
  page2: number = 1;
  rowsPorPagina: number = 10;
  rowsPorPagina2: number = 10;
  cuentas: any[] = [];
  totalElements: any;
  banderaHasRows: boolean = false;
  banderaHasRows2: boolean = false;
  showBoundaryLinksCu: boolean = true;
  showDirectionLinksCU: boolean = true;
  showBoundaryLinksCo: boolean = true;
  showDirectionLinksCo: boolean = true;
  correo: any = '';
  correoAnterior: string;
  totalElements2: any;
  bloqNumContrato: boolean = false;
  bloqNumCuenta: boolean = false;
  codCliente: any = '';
  razonSocial: any = '';
  numContrato: any = '';
  numCuenta: any = '';
  usuarioActual: string | null ="";

  constructor(
    private fc: FuncionesComunesComponent,
    public dialog: MatDialog,
    private translateService: TranslateService,
    private globals: Globals,
    private comunService: ComunesService,
    private cuentabeneficiariaservice: CuentaBeneficiariaService
  ) {
    this.usuarioActual = localStorage.getItem('UserID');
    this.objPageable = {
      page: this.page,
      size: this.rowsPorPagina,
      ruta: ''
    }
    this.objPageable2 = {
      page: this.page2,
      size: this.rowsPorPagina2,
      ruta: ''
    }
  }

  async ngOnInit() {
    this.clickSuscliption = this.comunService.clickAtion.subscribe(async (resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 1) {
        this.codCliente = '';
        this.numContrato = '';
        this.razonSocial = '';
        this.numCuenta = '';
        this.bloqNumContrato = false;
        this.showConsultResult = false;
        this.showEmailAddMod = false;
      }
    });
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }

  validateOnlyNumeros(event: KeyboardEvent) {
    this.fc.numberOnly(event);
  }

  completaBuc(event: any) {
    let buc = event.target.value;
    let tamanio = buc.length;
    let relleno = 8 - tamanio;
    this.codCliente = tamanio > 0 ? new Array(relleno + 1).join('0') + buc : buc;
  }

  pasteOnlyNumeros(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let element of textPasted) {
      if (!this.fc.numberOnlyForPasteEvent(element.charCodeAt(0))) {
        flag = false;
      }
    }
    return flag;
  }

  async buscaContrato() {
    try {
      await this.cuentabeneficiariaservice.buscaContrato(this.codCliente).then(
        async (resp: any) => {
          if (resp.numeroContrato) {
            this.numContrato = resp.numeroContrato;
            this.razonSocial = resp.razonSocial;
          } else {
            this.numContrato = '';
            this.razonSocial = '';
            this.noInfoModal();
          }
          this.globals.loaderSubscripcion.emit(false);
          this.bloqNumContrato = true;
        });
    } catch (e) {
      this.open(
        'Error',
        this.translateService.instant('contingencia.msjERR002Observacion'),
        'error'
      );
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  async buscaCliente() {
    try {
      await this.cuentabeneficiariaservice.buscaCliente(this.numContrato).then(
        async (resp: any) => {
          if (resp.buc) {
            this.codCliente = resp.buc;
            this.razonSocial = resp.razonSocial;
          } else {
            this.codCliente = '';
            this.numContrato = '';
            this.razonSocial = '';
            this.noInfoModal();
          }
          this.globals.loaderSubscripcion.emit(false);
          this.bloqNumContrato = true;
        });
    } catch (e) {
      this.open(
        'Error',
        this.translateService.instant('contingencia.msjERR002Observacion'),
        '',
        'error'
      );
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  async correos() {
    const numCntr = this.numContrato
    const numCta = this.numCuenta
    try {
      await this.cuentabeneficiariaservice.consuCorreo(numCntr, numCta, this.fillObjectPag2(this.page2, this.rowsPorPagina2)).then(
        async (resp: any) => {
          this.globals.loaderSubscripcion.emit(false);
          this.resultRequest2(resp);
        });
    } catch (e) {
      this.datos = {};
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        'Error',
        this.translateService.instant('consultaTracking.noResultTraking'),
        '',
        'error'
      );
    }
  }

  showDetailEmails(data: any): void {
    this.showEmailAddMod = true;
    this.numCuenta = data.numCta
    this.correos()
    this.bloqNumCuenta = true;
    //TODO: PATCH VALUE ACCOUNT FORM BACK SERVICE SERVICE
  }

  getCuentasBeneficiarias(): void {
    if ((!this.codCliente && !this.numCuenta) || !this.razonSocial) {
      this.open(
        this.translateService.instant(
          'traking.cuenta.beneficiaria.num.cuenta.Titulo'
        ),
        this.translateService.instant(
          'traking.cuenta.beneficiaria.num.cuenta.sugerencia'
        ),
        this.translateService.instant(
          'traking.cuenta.beneficiaria.num.cuenta.observacion'
        ),
        'error',
        this.translateService.instant('contingencia.msjERR003Codigo')
      );
      this.codCliente = '';
      this.numContrato = '';
      this.razonSocial = '';
      this.numCuenta = '';
    } else {
      this.showConsultResult = true;
      this.obtenerDatos()
    }
  }

  exportarCorreos() {
    const data = {
      usuario: this.usuarioActual,
      razonSocial : this.razonSocial,
      buc: this.codCliente,
      numCntr: this.numContrato,
      numCta: this.numCuenta
    }
    this.cuentabeneficiariaservice.reporteCorreos(data)
      .then((result: any) => {
        if (result.data) {
          /** Se manda la informacion para realizar la descarga del archivo */
          this.fc.convertBase64ToDownloadFileInExport(result);
          this.globals.loaderSubscripcion.emit(false);
        } else {
          if (result.code === '404') {
            this.openModalError('Error', result.message, 'error');
            this.globals.loaderSubscripcion.emit(false);
          } else {
            this.openModalError(
              'Error',
              this.translateService.instant('modals.gestionAlarma.error.exportacion"'),
              '',
              'error'
            );
            this.globals.loaderSubscripcion.emit(false);
          }
        }
      });
  }

  exportarCuentas() {
    const data = {
      buc: this.codCliente,
      numCntr: this.numContrato,
      numCta: this.numCuenta,
      usuario: this.usuarioActual,
      razonSocial: this.razonSocial
    }
    this.cuentabeneficiariaservice.reporteCuentas(data)
      .then((result: any) => {
        if (result.data) {
          /** Se manda la informacion para realizar la descarga del archivo */
          this.fc.convertBase64ToDownloadFileInExport(result);
          this.globals.loaderSubscripcion.emit(false);
        } else {
          if (result.code === '404') {
            this.openModalError('Error', result.message, 'error');
            this.globals.loaderSubscripcion.emit(false);
          } else {
            this.openModalError(
              'Error',
              this.translateService.instant('modals.gestionAlarma.error.exportacion"'),
              '',
              'error'
            );
            this.globals.loaderSubscripcion.emit(false);
          }
        }
      });
  }

  openModalError(
    titulo: String,
    contenido: String,
    type?: any,
    errorCode?: string,
    sugerencia?: string
  ) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        contenido,
        type,
        errorCode,
        sugerencia
      ),
    });
  }

  private fillObjectPag(numPage: number, totalItemsPage: number) {
    this.objPageable.page = numPage - 1,
      this.objPageable.size = totalItemsPage;
    return this.objPageable;
  }

  private fillObjectPag2(numPage: number, totalItemsPage: number) {
    this.objPageable2.page = numPage - 1,
      this.objPageable2.size = totalItemsPage;
    return this.objPageable2;
  }

  async obtenerDatos() {
    const data = {
      buc: this.codCliente,
      numCntr: this.numContrato,
      numCta: this.numCuenta
    }
    // Se reinicia la consulta al pulsar el boton de Consultar
    this.page = 0;
    try {
      await this.cuentabeneficiariaservice.cuentas(data, this.fillObjectPag(this.page, this.rowsPorPagina)).then(
        async (resp: any) => {
          this.globals.loaderSubscripcion.emit(false);
          this.cuentas = []
          this.resultRequest(resp);
          if (resp.totalElements == 0) {
            this.noInfoModal();
          }
        });
    } catch (e) {
      this.datos = {};
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        'Error',
        this.translateService.instant('consultaTracking.noResultTraking'),
        '',
        'error'
      );
    }

  }

  async onPageChanged(event: any) {
    const data = {
      buc: this.codCliente,
      numCntr: this.numContrato,
      numCta: this.numCuenta
    }
    this.page = event.page;
    this.cuentas = [];
    this.cuentabeneficiariaservice.cuentas(data, this.fillObjectPag(this.page, this.rowsPorPagina)).then((tab: any) => {
      this.resultRequest(tab);
      this.globals.loaderSubscripcion.emit(false);
    });
  }

  async onPageChangedCorreo(event: any) {
    const numCntr = this.numContrato
    const numCta = this.numCuenta
    try {
      this.page2 = event.page;
      this.emails = [];
      await this.cuentabeneficiariaservice.consuCorreo(numCntr, numCta, this.fillObjectPag2(this.page2, this.rowsPorPagina2)).then(
        async (resp: any) => {
          this.resultRequest2(resp);
          this.globals.loaderSubscripcion.emit(false);
        });
    } catch (e) {
      this.datos = {};
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        'Error',
        this.translateService.instant('consultaTracking.noResultTraking'),
        '',
        'error'
      );
    }
  }

  resultRequest(result: any) {
    result.content.forEach((t: { fechAlta: string; }) => {
      t.fechAlta = t.fechAlta.split('.')[0];
    })
    this.cuentas = result.content;
    this.totalElements = result.totalElements;
    if (this.totalElements > 0) {
      this.banderaHasRows = true;
      this.showConsultResult = true;
    } else {
      this.banderaHasRows = false;
      this.showConsultResult = false;
    }
  }

  resultRequest2(result: any) {
    this.emails = result.content
    this.totalElements2 = result.totalElements;
    if (this.totalElements2 > 0) {
      this.banderaHasRows2 = true;
    } else {
      this.banderaHasRows2 = false;
    }
  }

  isSelectedEmail(
    event: any,
    email: { email: string; id: string; selected?: boolean }
  ): void {
    email = { ...email, selected: event.target.checked };
    console.log(email);
    if (event.target.checked) {
      this.emailsSelected.push(email);
    } else {
      this.emailsSelected.splice(
        this.emailsSelected.findIndex((e) => e.id === email.id),
        1
      );
    }
    this.correoAnterior = this.emailsSelected[0].email
    this.emailsSelected.length > 0 && this.emailsSelected.length <= 1
      ? (this.email = this.emailsSelected[0])
      : (this.email = { email: '', id: '' });
  }

  addModifyEmail(): void {
    if (this.email) {
      if (this.esEmailValido(this.email.email)) {
        const isEdit = this.emailsSelected.length > 0;
        const confirmModal = this.dialog.open(ModalInfoComponent, {
          disableClose: true,
          data: new ModalInfoBeanComponents(
            this.translateService.instant('planCalidad.msjCNF000Titulo'),
            '',
            'confirm',
            this.translateService.instant('notificaciones.msjTRA005Codigo'),
            this.translateService.instant('notificaciones.msjTRA005Observacion')
          ),
        });
        confirmModal.afterClosed().subscribe(async (r) => {
          if (r === 'ok') {
            !isEdit
              ? this.agregarEmal(isEdit)
              : null;
            if (isEdit) {
              this.emails.forEach((s) => (s.selected = false));
              await this.actualizar(isEdit)
              this.emailsSelected = [];
            }
            this.email.email = ''
          }
        });
      } else {
        this.open(
          this.translateService.instant('notificaciones.msjTRA006Titulo'),
          this.translateService.instant('notificaciones.msjTRA006Observacion'),
          this.translateService.instant('notificaciones.msjTRA006Sugerencia'),
          'error',
          this.translateService.instant('notificaciones.msjTRA006Codigo')
        );
      }
    } else {
      this.open(
        this.translateService.instant('notificaciones.msjTRA006Titulo'),
        this.translateService.instant('notificaciones.msjTRA008Observacion'),
        this.translateService.instant('notificaciones.msjTRA008Sugerencia'),
        'error',
        this.translateService.instant('notificaciones.msjTRA008Codigo')
      );
    }
  }

  async actualizar(isEdit: any) {
    const data = {
      correoAnterior: this.correoAnterior,
      correoActual: this.emailsSelected[0].email,
      contrato: this.numContrato,
      cuenta: this.numCuenta
    }
    try {
      await this.cuentabeneficiariaservice.agregarEmail(data).then(
        async (tab: any) => {
          this.globals.loaderSubscripcion.emit(false);
          this.open(
            isEdit
              ? this.translateService.instant(
                'notificaciones.tracking.msjINF004Titulo'
              )
              : this.translateService.instant(
                'notificaciones.contrato.msjINF001Titulo'
              ),
            isEdit
              ? this.translateService.instant(
                'notificaciones.tracking.msjINF004Observacion'
              )
              : this.translateService.instant(
                'notificaciones.contrato.msjINF001Observacion'
              ),
            '',
            'info',
            isEdit
              ? this.translateService.instant(
                'notificaciones.tracking.msjINF004Codigo'
              )
              : this.translateService.instant(
                'notificaciones.contrato.msjINF001Codigo'
              )
          );
          this.correos()
        }
      )
    } catch (e) {
      this.open(
        this.translateService.instant('modal.msjERRGEN0001Titulo'),
        this.translateService.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translateService.instant('modal.msjERRGEN0001Codigo'),
        ''
      );
      this.globals.loaderSubscripcion.emit(false);
    }

  }

  async agregarEmal(isEdit: any) {
    const data = {
      correoAnterior: '',
      correoActual: this.email.email,
      contrato: this.numContrato,
      cuenta: this.numCuenta
    }

    try {
      await this.cuentabeneficiariaservice.agregarEmail(data).then(
        async (tab: any) => {
          this.globals.loaderSubscripcion.emit(false);
          if (tab.code == "ERR011") {
            this.open(
              'Error',
              tab.message,
              '',
              'error',
              ''
            );
            return
          }
          this.open(
            isEdit
              ? this.translateService.instant(
                'notificaciones.tracking.msjINF004Titulo'
              )
              : this.translateService.instant(
                'notificaciones.contrato.msjINF001Titulo'
              ),
            isEdit
              ? this.translateService.instant(
                'notificaciones.tracking.msjINF004Observacion'
              )
              : this.translateService.instant(
                'notificaciones.contrato.msjINF001Observacion'
              ),
            '',
            'info',
            isEdit
              ? this.translateService.instant(
                'notificaciones.tracking.msjINF004Codigo'
              )
              : this.translateService.instant(
                'notificaciones.contrato.msjINF001Codigo'
              )
          );
          this.correos()
        }
      )
    } catch (e) {
      this.open(
        this.translateService.instant('modal.msjERRGEN0001Titulo'),
        this.translateService.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translateService.instant('modal.msjERRGEN0001Codigo'),
        ''
      );
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  back(): void {
      this.numCuenta = '';
    this.showEmailAddMod = false;
    this.bloqNumCuenta = false;
    this.emailsSelected = [];
    this.emails = [];
    this.page = 1
    this.page2 = 1
  }

  deleteEmails() {
    if (this.emailsSelected.length <= 0) {
      this.open(
        this.translateService.instant('notificaciones.msjTRA009Titulo'),
        this.translateService.instant('notificaciones.msjTRA009Observacion'),
        '',
        'error',
        this.translateService.instant('notificaciones.msjTRA009Codigo')
      );
    } else {
      const confirmDeleteModal = this.dialog.open(ModalInfoComponent, {
        disableClose: true,
        data: new ModalInfoBeanComponents(
          this.translateService.instant('notificaciones.msjTRA009Titulo'),
          '',
          'confirm',
          this.translateService.instant('notificaciones.msjTRA007Codigo'),
          this.translateService.instant('notificaciones.msjTRA007Observacion')
        ),
      });
      confirmDeleteModal.afterClosed().subscribe((res) => {
        if (res === 'ok')
          this.eliminar()
      });
    }
  }

  correoEliminar: any[] = []
  async eliminar() {
    this.emailsSelected.forEach((value: any) => {
      this.correoEliminar.push(value.email)
    });
    const data = {
      listaCorreos: this.correoEliminar,
      numCuenta: this.numCuenta,
      contrato: this.numContrato,
    }
    try {
      await this.cuentabeneficiariaservice.eliminarEmail(data).then(
        async (tab: any) => {
          this.globals.loaderSubscripcion.emit(false);

          this.correos()
          this.open(
            this.translateService.instant(
              'notificaciones.tracking.msjINF006Titulo'
            ),
            '',
            this.translateService.instant(
              'notificaciones.tracking.msjINF006Observacion'
            ),
            'info',
            this.translateService.instant(
              'notificaciones.tracking.msjINF006Codigo'
            )
          );
          this.email = { email: '', id: '' };

          this.emailsSelected = [];
        }
      )
    } catch (e) {
      this.open(
        this.translateService.instant('modal.msjERRGEN0001Titulo'),
        this.translateService.instant('modal.msjERRGEN0001Observacion'),
        '',
        'error',
        this.translateService.instant('modal.msjERRGEN0001Codigo'),
      );
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  noInfoModal(): void {
    this.open(
      this.translateService.instant(
        'pantalla.monitor.validacion.noInformacion.Observacion'
      ),
      '',
      this.translateService.instant(
        'pantalla.monitor.validacion.noInformacion.Observacion'
      ),
      'info',
      this.translateService.instant('modals.usuarioOperantes.codigo')
    );
  }

  esEmailValido(email: string): boolean {
    let mailValido = false;
    var EMAIL_REGEX =
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.match(EMAIL_REGEX)) {
      mailValido = true;
    }
    return mailValido;
  }

  open(
    titulo: String,
    sugerencia: string,
    contenido: String,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    code?: string
  ): MatDialogRef<ModalInfoComponent, any> {
    return this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        contenido,
        type,
        code,
        sugerencia
      ),
      hasBackdrop: true,
    });
  }
}
