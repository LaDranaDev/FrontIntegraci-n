import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ComunesService } from 'src/app/services/comunes.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { AutorizacionEnrolamientoService } from 'src/app/services/administracion/autorizacion-enrolamiento.service';
import { IPaginationRequest } from 'src/app/bean/i-pagination-request';
import { format, parse } from 'date-fns';
import { ModalInfoBeanCorreoComponents } from 'src/app/bean/modal-info-bean-correo.component';
import { ModalMtvoRechazoComponent } from 'src/app/components/modals/modal-mtvo-rechazo/modal-mtvo-rechazo.component';

@Component({
  selector: 'app-autorizacion-enrolamiento',
  templateUrl: './autorizacion-enrolamiento.component.html',
  styleUrls: ['./autorizacion-enrolamiento.component.css']
})
export class AutorizacionEnrolamientoComponent implements OnInit {
  /**Se inicializa componente de los datos del contrato*/
  datos: any = {
    numContrato: "", bucCliente: "", razonSocial: ""
  };
  fechasForm!: FormGroup;
  datePickerConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-red',
    showWeekNumbers: false,
    isDisabled: true,
    adaptivePosition: true
  };
  estatus: any;
  estatusEnrol: any;
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;
  /** Variable para indicar en que pagina se encuentra */
  page: number = 1;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 10;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinks: boolean = true;
  showDirectionLinks: boolean = true;
  solicitudes: any;
  banderaShowListaSol: boolean = true;
  objPageable: IPaginationRequest;
  currentRecord: any;
  constructor(private fc: FuncionesComunesComponent,
    private formBuilder: FormBuilder,
    private globals: Globals,
    private service: AutorizacionEnrolamientoService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private comunService: ComunesService) {
    this.fechasForm = this.formBuilder.group({
      /** Se inicializa el formulario para validar el search */
      fecRegistro: new FormControl(
        { value: '', disabled: false },
        Validators.required
      ),
      fecAutorizacion: new FormControl(
        { value: '', disabled: false },
        Validators.required
      ),
    });

    //Se inicializa el objeto pageable
    this.objPageable = {
      page: this.page - 1,
      size: this.rowsPorPagina,
    }
  }

  clickSuscliption: Subscription | undefined;

  ngOnInit(): void {
    this.clickSuscliption = this.comunService.clickAtion.subscribe((resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 14) {
        this.clearScreen();
      }
    });
  }

  /**
 * Metodo para poder realizar la obtencion de la informacion
 * del contato en base al codigo del cliente
 */
  async cargaDatos() {
    try {
      await this.service.cargaDatos(this.datos.bucCliente).then(
        async (resp: any) => {
          if (resp.codError === 'OK00000') {
            this.datos.bucCliente = resp.clienteId;
            this.datos.numContrato = resp.numContrato;
            this.datos.razonSocial = resp.razonSocial;
          } else if (resp.codError === 'ERROR01') {
            this.showModalMsg(
              this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE01Titulo'),
              this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE01Sugerencia'),
              'alert',
              '',
              this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE01Observacion')
            );
            this.clearContrato();
          } else if (resp.codError === 'ER002') {
            this.showModalMsg(
              this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE01Titulo'),
              this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE01Sugerencia'),
              'alert',
              '',
              this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE02Observacion')

            );
            this.clearContrato();
          }
          this.globals.loaderSubscripcion.emit(false);
        });
    } catch (e) {
      this.showModalMsg(
        this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE04Titulo'),
        this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE02Sugerencia'),
        'error',
        '',
        this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE03Observacion')
      );
      this.globals.loaderSubscripcion.emit(false);
      this.clearContrato();
    }
  }

  /**
   * Metodo que realiza la limpieza del objeto
   * que contendra la informacion del contrato del cliente
   */
  clearContrato() {
    this.datos = {
      numContrato: '',
      buc: '',
      razonSocial: '',
    };
  }

  /**
   * Metodo que realiza la limpieza de los campos de la pantalla
   */
  clearScreen() {
    this.clearContrato();
    this.fechasForm.get("fecRegistro")?.setValue('')
    this.fechasForm.get("fecAutorizacion")?.setValue('')
    this.estatus = '';
    this.banderaShowListaSol = false;
    this.banderaHasRows = false;
    this.page = 1;
  }

  /**
  * Metodo que valida que se ingresen solo numero, en caso de que se quieran ingresar datos diferentes no se permitira
  */
  validateOnlyNumeros(event: KeyboardEvent) {
    this.fc.numberOnly(event);
  }

  /**
   * Metodo que valida que se peguen solo numeros en los inputs
   */
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

  /**
   * Metodo para levantar el modal para
   * mostrar los mensajes de sucess o error
   * 
   * @param titulo indica si se ejecutara para error o success
   * @param contenido mensaje que se mostrara en el modal
   */
  showModalMsg(
    titulo: string,
    obser: string,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    errorCode?: string,
    sugerencia?: string
  ) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        obser,
        type,
        errorCode,
        sugerencia
      ), hasBackdrop: true
    });
  }

  /** Metodo para validar la longitud del buc ingresado */
  validateBuc() {
    var buc = this.datos.bucCliente;
    var regEx = "^[0-9]{8}$";
    if (buc !== '') {
      if (!buc.match(regEx)) {
        this.showModalMsg(
          this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE07Titulo'),
          '',
          'alert',
          '',
          this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE12Observacion')
        );
        return;
      } else {
        if (buc.length < 8) {
          //rellenamos si tiene algun valor
          //rellenar ala izquierda
          this.datos.bucCliente = this.rellenarIzq(buc);
        }
        this.cargaDatos();
      }
    }
  }

  rellenarIzq(buc: any) {
    if (buc != '') {
      if (buc.length < 8) {
        for (var i = buc.length; i < 8; i = buc.length) {
          buc = '0' + buc;
        }
      }
    }
    return buc;
  }

  /**
  * @descripcion Metodo para poder generar y regresar el objeto con la paginacion
  *
  * @param numPage valor para indicar el numero de la pagina
  * @param totalItemsPage valor para indicar el total de elementos que se mostraran en la pagina
 */
  fillObjectPag(numPage: number, totalItemsPage: number) {
    this.objPageable.page = numPage - 1,
      this.objPageable.size = totalItemsPage;
    return this.objPageable;
  }

  /** Metodo para realizar la consulta de solicitudes de enrolamiento */
  async findSolicitudes() {
    const request = this.getRequest();
    try {
      await this.service
        .consultaSolicitudes(this.fillObjectPag(this.page, this.rowsPorPagina), request).then(
          async (result: any) => {
            if (result.content.length > 0) {
              this.resultRequest(result);
            } else {
              this.showModalMsg(
                this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE03Titulo'),
                this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE03Sugerencia'),
                'info',
                '',
                this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE05Observacion')
              );
              this.banderaShowListaSol = false;
              this.banderaHasRows = false;
              this.page = 1;
            }
            this.globals.loaderSubscripcion.emit(false);
          });
    } catch (e) {
      this.page = 1;
      this.showModalMsg(
        this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE04Titulo'),
        this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE02Sugerencia'),
        'error',
        '',
        this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE03Observacion')
      );
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  resultRequest(result: any) {
    this.solicitudes = result.content;
    this.totalElements = result.totalElements;
    if (this.totalElements > 0) {
      this.banderaHasRows = true;
      this.banderaShowListaSol = true;
    } else {
      this.banderaHasRows = false;
      this.banderaShowListaSol = false;
    }
  }

  /**
   * @description Evento de click al momento de usar la paginacion
   * @memberOf GestionPaisesComponent
  */
  async onPagChanged(event: any) {
    this.page = event.page;
    this.findSolicitudes();
  }

  /**
   * Abrir el modal de exportar los datos
   */
  exportSolicitudes() {
    const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
    dialogo.afterClosed().subscribe(formato => {
      if (formato) {
        this.exportReporte(formato);
      }
    });
  }

  /**
   * Metodo para poder realizar la exportacion de archivos
   */
  async exportReporte(formato: string) {
    if (formato === 'xlsx') {
      formato = 'xls'
    }

    const request = this.getRequest();
    try {
      await this.service
        .exportaSolicitudes(formato, this.fillObjectPag(this.page, this.rowsPorPagina), request).then(
          async (result: any) => {
            this.fc.convertBase64ToDownloadFileInExport(result);
            this.globals.loaderSubscripcion.emit(false);
          });
    } catch (e) {
      this.showModalMsg(
        this.translate.instant('modals.gestionAlarma.error'),
        this.translate.instant('modals.error.exportacion'),
        'error',
        '',
        ''
      );
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  /** Metodo para realizar la aprovación de solicitudes de enrolamiento */
  approveSolicitud() {
    this.validateCheck("A");
  }

  /** Metodo para realizar el rechazo de solicitudes de enrolamiento */
  refuseSolicitud() {
    this.validateCheck("R");
  }

  validateCheck(estatus: any) {
    if (this.currentRecord === undefined || this.currentRecord === null) {
      this.showModalMsg(
        this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE01Titulo'),
        this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE04Sugerencia'),
        'alert',
        '',
        this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE09Observacion')
      );
    } else {
      this.updateSolicitud(estatus);
    }
  }

  /** Metodo para realizar la actualizacion de la solicitud de enrolamiento */
  async updateSolicitud(estatus: any) {
    if (estatus === this.currentRecord.estatus.substring(0, 1)) {
      this.showModalMsg(
        this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE06Titulo'),
        this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE05Sugerencia'),
        'alert',
        '',
        this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE10Observacion')
      );
    } else {
      const request = {
        fechaFin: this.currentRecord.fechaFin,
        fechaInicio: this.currentRecord.fechaInicio,
        clienteId: this.currentRecord.clienteId,
        estatus: estatus,
        numContrato: this.currentRecord.numContrato,
        razonSocial: this.currentRecord.razonSocial,
        motivoRechazo: ""
      }
      if (estatus === 'R') {
        const dialogo = this.dialog.open(ModalMtvoRechazoComponent, {
          data: new ModalInfoBeanCorreoComponents(this.translate.instant('pantalla.autorizacionEnrolamiento.modal.mtvoRechazo.titulo'), this.translate.instant('pantalla.autorizacionEnrolamiento.modal.mtvoRechazo.contenido'), request), hasBackdrop: true
        })
        dialogo.afterClosed().subscribe((result) => {
          if (result) {
            request.motivoRechazo = result;
            this.updateSolicitudService(request);
          }
        });
      } else {
        this.updateSolicitudService(request);
      }

    }
  }

  async updateSolicitudService(request: any) {
    try {
      await this.service.modificaSolicitud(request).then(
        async (result: any) => {
          this.findSolicitudes();
          this.currentRecord = null;
          this.globals.loaderSubscripcion.emit(false);
          this.showModalMsg(
            this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE05Titulo'),
            this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE08Observacion'),
            'info',
            '',
            ''
          );
        });
    } catch (e) {
      this.page = 1;
      this.showModalMsg(
        this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE04Titulo'),
        this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE02Sugerencia'),
        'error',
        '',
        this.translate.instant('pantalla.autorizacionEnrolamiento.msjAPE03Observacion')
      );
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  getRequest(): any {
    const fecInicio =
      this.fechasForm.value?.fecRegistro == ! '' && typeof this.fechasForm.value?.fecRegistro === 'string'
        ? parse(
          this.fechasForm.value?.fecRegistro,
          'd/MM/yyyy',
          new Date()
        )
        : this.fechasForm.value?.fecRegistro;
    const fecFin =
      this.fechasForm.value?.fecAutorizacion == ! '' && typeof this.fechasForm.value?.fecAutorizacion === 'string'
        ? parse(
          this.fechasForm.value?.fecAutorizacion,
          'd/MM/yyyy',
          new Date()
        )
        : this.fechasForm.value?.fecAutorizacion;

    let fechaRegistro = "";
    if (fecInicio) {
      fechaRegistro = format(new Date(fecInicio), 'dd/MM/yyyy')
    }
    let fechaAutorizacion = "";
    if (fecFin) {
      fechaAutorizacion = format(new Date(fecFin), 'dd/MM/yyyy');
    }

    const request = {
      fechaFin: fechaAutorizacion,
      fechaInicio: fechaRegistro,
      clienteId: this.datos.buc,
      estatus: this.estatus,
      numContrato: this.datos.numContrato,
      razonSocial: this.datos.razonSocial,
      motivoRechazo: ""
    }

    return request;
  }

  onChecked(event: any, current: any) {
    if (event.target.checked) {
      this.currentRecord = current;
    } else {
      this.currentRecord = null;
    }
  }
}
