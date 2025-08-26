import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { GestionAlarmaService } from 'src/app/services/administracion/gestion-alarma.service';
import { IPaginationRequest } from './request/i-pagination-request';
import { IAlarmIdsRequest } from './request/ialarm-ids-request';
import { IAlarmaFilterRequest } from './request/ialarma-filter-request';
import { ComunesService } from 'src/app/services/comunes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gestion-alarma',
  templateUrl: './gestion-alarma.component.html',
  styleUrls: ['./gestion-alarma.component.css']
})

export class GestionAlarmaComponent implements OnInit, OnDestroy {
  /** Contiene el valor desde donde se mando a exportar historico o no */
  opcionExportar: string = "";
  /** componente modal */
  modal: BsModalRef = new BsModalRef;
  /** variable de control para saber si se realizo el submit del alta */
  submittedSearchAlarmas = false;
  /** variable para guardar la informacion de los filtros de busqueda */
  filterAlarmaRequest: IAlarmaFilterRequest;
  /** Variables para la obtencion de fecha inicial y final cuando cambie el date*/
  fechaAtendidaChange = "";
  fechaGeneradaChange = "";
  /** Objeto para la paginacion */
  paginationRequest: IPaginationRequest;
  /** Objeto para guardar los ids para atender */
  listadoIdsAtender: IAlarmIdsRequest;
  /** Listado para alarmas atendidas y por filtros */
  listadoAlarmasAtendidasFiltro: any = [];
  listadoAlarmasHistorico: any[] = [];
  /** Variable para identificar si el listado de gestion de alarma contiene o no valores*/
  banderaAlarmasHasRows: boolean = false;
  banderaAlarmasHistoryHasRows: boolean = false;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinks: boolean = true;
  showDirectionLinks: boolean = true;
  /** Variable para indicar en que pagina se encuentra */
  page: number = 0;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 10;
  /** Bandera para poder habilitar y deshabilitar el boton de exportar */
  banderaHabilitarExportHistory = true;
  banderaHabilitarExport = true;


  /**
    * @description Formulario para la busqueda gestion de alarmas
    * @type {FormGroup}
    * @memberOf GestionAlarmaConsultaComponent
    */
  formControlAlarmas: UntypedFormGroup = new UntypedFormGroup({});

  /**
    * Atributo que contiene la configuracion del calendario
    * @type {Partial<BsDatepickerConfig>}
    * @memberof ArchivosConsultaComponent
    */
  datePickerConfig: Partial<BsDatepickerConfig> = Object.assign({}, {
    dateInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-red',
    showWeekNumbers: false,
    adaptivePosition: true
  });

  constructor(
    private formBuilder: UntypedFormBuilder,
    private globals: Globals,
    private fc: FuncionesComunesComponent,
    public datePipe: DatePipe,
    public dialog: MatDialog,
    private gestionService: GestionAlarmaService,
    private translate: TranslateService,
    private router: Router,
    private comunService: ComunesService,
  ) {
    this.filterAlarmaRequest = {
      idTipoCat: '',
      estatus: '',
      fechaAtencion: '',
      fechaGenerada: ''
    }

    this.paginationRequest = {
      page: this.page,
      size: this.rowsPorPagina
    }

    this.listadoIdsAtender = {
      idsAlarmas: []
    }
  }

  clickSuscliption: Subscription | undefined;

  ngOnInit(){
    //this.initForm();
    
    this.clickSuscliption = this.comunService.clickAtion.subscribe((resp:any) => {
      const { codeMenu } = resp;
      if (codeMenu === 15) {
       this.initForm();
      }
    });
  }

  initForm(){
    this.onClickLimpiar()
    /**
    * Se inicializa el formulario que se llenara
    * para poder realizar las busquedas
   */
   this.formControlAlarmas = this.initializeForm();
   /** Se realizan las suscripciones a los change de los datepickers */
   this.createSubscriptionsToDatesInputs();
   /** Se realiza la peticion para obtener el listado de alarmas atendidas */
   this.getListGestionAlarma();
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }
 

  /**
   * @description Metodo para poder inicializar el formulario y regresar dicho
   * formulario
   */
  private initializeForm() {
    return this.formBuilder.group({
      tipoNotificacion: [''],
      estatus: [''],
      fechaAtendida: [''],
      fechaGenerada: [''],
    });
  }

  /**
   * @description Metodo para poder generar los eventos de subscribe
   * de los campos dates y poder parsear la fecha
   * despues de seleccionar una fecha
   */
  private createSubscriptionsToDatesInputs() {
    /** Funcion onchange para cuando cambia la fecha inicial */
    this.formControlAlarmas.controls['fechaAtendida'].valueChanges.subscribe(
      valFechaAten => {
        this.fechaAtendidaChange = this.fc.parseFormatDate(this.datePipe.transform(valFechaAten, 'dd/MM/yyyy') || '');
      }
    );
    /** Funcion onchange para cuando cambia la fecha final */
    this.formControlAlarmas.controls['fechaGenerada'].valueChanges.subscribe(
      valFechaChang => {
        this.fechaGeneradaChange = this.fc.parseFormatDate(this.datePipe.transform(valFechaChang, 'dd/MM/yyyy') || '');
      }
    );
  }

  /**
    * Metodo getter para utilziacion y validacion de formulario
    * en la vista
    */
  get formControlGestionAlarma() {
    return this.formControlAlarmas.controls;
  }

  /**
   * Metodo para poder realizar la limpieza
   * de los valores del formulario
   */
  onClickLimpiar() {
    this.submittedSearchAlarmas = false;
    this.formControlAlarmas = this.initializeForm();
    this.createSubscriptionsToDatesInputs();
    this.banderaAlarmasHasRows = false;
    this.banderaAlarmasHistoryHasRows = false;
    this.banderaHabilitarExport = true;
    this.fechaAtendidaChange = "";
    this.fechaGeneradaChange = "";

  }

  open(titulo: string, contenido: string, type?: any, code?: string, sugerencia?: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, code, sugerencia), hasBackdrop: true 
    });
  }

  /**
   * Se ejecuta el metodo que realiza
   * la peticion para consultar las alarmas
   */
  onClickConsultar() {
    if (this.validateFiltrosBusqueda()) {
      if(!(this.validarFecha(this.fechaAtendidaChange) && this.validarFecha(this.fechaGeneradaChange))){
        this.open(
          this.translate.instant('modals.gestionAlarma.alerta'),
          this.translate.instant('modals.gestionAlarma.alerta.fecha.mayor'),
          'aviso'
        );
        return;
    }
      this.fillObjectRequest();
      this.getListGestionAlarma();
    } else {
      this.open(
        this.translate.instant('modals.gestionAlarma.alerta'),
        this.translate.instant('modals.gestionAlarma.alerta.seleccion.criterio.busqueda'),
        'aviso'
      );
    }
  }

  /**
   * Funcion que valida que se hayan ingresado filtros a la consulta de alarmas
   */
  validateFiltrosBusqueda() {
    if (this.formControlAlarmas.controls['tipoNotificacion'].value != "" || this.formControlAlarmas.controls['estatus'].value != "" ||
      this.formControlAlarmas.controls['fechaAtendida'].value != "" || this.formControlAlarmas.controls['fechaGenerada'].value != "") {
      return true;
    }
    return false;
  }

  /**
   * Metodo para poder llenar el objeto request
   */
  fillObjectRequest() {
    this.filterAlarmaRequest.idTipoCat = this.formControlAlarmas.value.tipoNotificacion;
    this.filterAlarmaRequest.estatus = this.formControlAlarmas.value.estatus;
    this.filterAlarmaRequest.fechaAtencion = this.fechaAtendidaChange;
    this.filterAlarmaRequest.fechaGenerada = this.fechaGeneradaChange;
  }

  /**
   * Metodo para realizar la peticion al servicio para
   * obtener los listado de gestion de alarma
   */
  private async getListGestionAlarma() {
    try {
      await this.gestionService.getListGestionAlarmas(this.filterAlarmaRequest, this.paginationRequest).then(
        async (result: any) => {
          this.listadoAlarmasAtendidasFiltro = result.content;
          this.totalElements = result.totalElements;
          if (this.listadoAlarmasAtendidasFiltro.length > 0) {
            this.banderaAlarmasHasRows = true;
            this.banderaHabilitarExport = false;
            this.getListadoGestionAlarmaHistorico();
          } else {
            this.open(
              '',
              this.translate.instant('modals.gestionAlarma.alerta.consulta.vacia'),
              'alert',
              'OKG001_EMPTY'
            );
            this.filterAlarmaRequest.idTipoCat = '';
            this.filterAlarmaRequest.estatus = '';
            this.banderaAlarmasHasRows = false;
            this.banderaHabilitarExport = true;
          }
          this.submittedSearchAlarmas = false;
          this.globals.loaderSubscripcion.emit(false);
        }
      )
    } catch (e) {
      this.submittedSearchAlarmas = false;
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modals.gestionAlarma.error'),
        this.translate.instant('modals.gestionAlarma.error.consulta'),
        'error',
        'ERRG001'
      );
    }
  }

  /**
   * Metodo para realizar la peticion al servicio para
   * obtener el listado de gestion de alarma historico
   */
  private async getListadoGestionAlarmaHistorico() {
    await this.gestionService.getLlistadoAlarmasHistorica().then(
      async (result: any) => {
        this.listadoAlarmasHistorico = result.content;
        if (this.listadoAlarmasHistorico.length > 0) {
          this.banderaAlarmasHistoryHasRows = true;
          this.banderaHabilitarExportHistory = false;
        } else {
          this.banderaAlarmasHistoryHasRows = false;
          this.banderaHabilitarExportHistory = true;
        }
        this.globals.loaderSubscripcion.emit(false);
      }
    )
  }

  /**
   * Metodo para realizar el proceso de atender las alarmas
   * que se encuentran en pendiente
   */
  onClickAtender() {
    /** Se obtienen todos los elementos checkbox */
    let checkAtender = document.getElementsByName('chkAtender');
    /** Se recorre el listado de check */
    checkAtender.forEach((check: any) => {
      if (check['checked'] && !check['disabled']) {
        this.listadoIdsAtender.idsAlarmas.push(check['value']);
      }
    });

    if (this.listadoIdsAtender.idsAlarmas.length > 0) {
      this.setRequestToAtenderIds();
    } else {
      this.open(
        this.translate.instant('modals.gestionAlarma.alerta'),
        this.translate.instant('modals.gestionAlarma.alerta.seleccion.check'),
        'aviso'
      );
    }
  }

  /**
   * Se ejecuta el metodo que enviara todos los valores de los ids
   * que se desean atender
   */
  private async setRequestToAtenderIds() {
    try {
      await this.gestionService.atenderIds(this.listadoIdsAtender).then(
        async (result: any) => {
          this.getListGestionAlarma();
          this.listadoIdsAtender.idsAlarmas = [];
          this.globals.loaderSubscripcion.emit(false);
          this.open(
            this.translate.instant('modals.gestionAlarma.info'),
            this.translate.instant('modals.gestionAlarma.info.atencion.alarmas'),
            'info',
            'OK_001'
          );
        }
      )
    } catch (e) {
      this.listadoIdsAtender.idsAlarmas = [];
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modals.gestionAlarma.error'),
        this.translate.instant('modals.gestionAlarma.error.atencion.alarmas'),
        'aviso',
        'ERRG002'
      );
    }
  }

  /**
    * @description Evento de click al momento de usar la paginacion
    */
  async onPageChanged(event: any) {
    this.page = event.page - 1;
    this.paginationRequest.page = this.page;
    /** Validacion para determinar si se uso el search antes de usar el paginado */
    if (this.filterAlarmaRequest.idTipoCat != "" || this.filterAlarmaRequest.estatus != "" || this.filterAlarmaRequest.fechaAtencion != "" || this.filterAlarmaRequest.fechaGenerada != "") {
      this.onClickConsultar();
    } else {
      this.getListGestionAlarma();
    }
  }

  /**
   * Abrir el modal de exportar los datos
   */
  openModalExportacion() {
    const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
    dialogo.afterClosed().subscribe(result => {
      if (result) {
        this.generarReporte(result);
      }
    });
  }

  /**
   * Abrir el modal de exportar los datos
   */
  openModalExportacionHistory() {
    const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
    dialogo.afterClosed().subscribe(result => {
      if (result) {
        this.generarReporteHistory(result);
      }
    });
  }



  /**
   * Metodo para poder realizar la peticion para el generar
   * reporte excel o csv
  */
  private async generarReporte(tipo:string) {
    try {
      await this.gestionService.getReporteNormal(this.filterAlarmaRequest, tipo).then(
        async (result: any) => {
          this.fc.convertBase64ToDownloadFileInExport(result);
          this.globals.loaderSubscripcion.emit(false);
        }
      )
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modals.gestionAlarma.error'),
        this.translate.instant('modals.error.exportacion'),
        'error'
      );
    }
  }


  /**
   * Metodo para poder realizar la peticion para el generar
   * reporte excel o csv
  */
  private async generarReporteHistory(tipo:string) {
    try {
      await this.gestionService.getReporteHistory(tipo).then(
        async (result: any) => {
          this.fc.convertBase64ToDownloadFileInExport(result);
          this.globals.loaderSubscripcion.emit(false);
        }
      )
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modals.gestionAlarma.error'),
        this.translate.instant('modals.error.exportacion'),
        'error'
      );
    }
  }


  validarFecha(fecha: any) {
    
    if (fecha != '') {
      var fechaSeparada = fecha.split("-");
      var fc = this.obtenerFecha();
      var fcArr = fc.split("/");
      var hoy = new Date(parseInt(fcArr[2]), parseInt(fcArr[1]), parseInt(fcArr[0]));
      var date = new Date(fechaSeparada[0], parseInt(fechaSeparada[1]) - 1, fechaSeparada[2]);

      var diferencia = Math.abs((hoy.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      var dias = Math.round(diferencia);
      if (dias < 90) {
        return true;
      }
    } else {
      return true;
    }
    return false;
  }

  obtenerFecha() {
    var date = new Date();
    var dia = date.getDay();
    var mes = date.getMonth();
    var ano = date.getFullYear();
    var diaS = '';
    var mesS = '';
    if (dia < 10) {
      diaS = '0' + dia;
    }
    if (mes < 10) {
      mesS = '0' + mes;
    }
    return diaS + '/' + mesS + '/' + ano;
  }

}
