import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { DatePipe } from "@angular/common";
import { BsDatepickerConfig, BsLocaleService } from "ngx-bootstrap/datepicker";
import { MonitorOperacionesService } from 'src/app/services/monitoreo/monitor-operaciones.service';
import { Globals } from 'src/app/bean/globals-bean.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalComprobanteComponent } from 'src/app/components/modals/modal-comprobante/modal-comprobante.component';
import { ModalSeleccionarPaginaComponent } from 'src/app/components/modals/modal-seleccionar-pagina/modal-seleccionar-pagina.component';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoBeanCorreoComponents } from 'src/app/bean/modal-info-bean-correo.component'
import { ModalEnviarCorreoComponent } from 'src/app/components/modals/modal-enviar-correo/modal-enviar-correo.component';
import { TranslateService } from '@ngx-translate/core';
import { ComunesService } from 'src/app/services/comunes.service';
import { Subscription } from 'rxjs';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
defineLocale('es', esLocale);

@Component({
  selector: 'app-monitor-operaciones',
  templateUrl: './monitor-operaciones.component.html',
  styleUrls: ['./monitor-operaciones.component.css']
})

export class MonitorOperacionesComponent implements OnInit, OnDestroy {

  id: boolean = false;
  /**
   *  @description Formulario para la busqueda de buzones
    * @type {FormGroup}
    * @memberOf MonitorOperacionesComponent
  */
  monitorOperacionesForm!: UntypedFormGroup;
  rowsPorPagina: number = 20;

  page: number = 1;

  checkComprobante: boolean = false;
  selAllCheck: boolean = false;

  comprobanteObj: any[] = []

  /**
   * Atributo que contiene la configuracion del calendario
   * @type {Partial<BsDatepickerConfig>}
   * @memberof ArchivosConsultaComponent
   */
  datePickerConfig: Partial<BsDatepickerConfig> = Object.assign({}, {
    dateInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-red',
    showWeekNumbers: false,
    language: 'es',
    adaptivePosition: true
  });;

  /** Variable para el producto seleccionado */
  productoSeleccionado: any = '';
  /** Variable para el producto */
  productoText: any = '';
  estatusText: any = '';
  horaOperacion: any = '';
  /** Variables para la obtencion de fecha inicial y final cuando cambie el date*/
  fechaInicialChange = "";
  fechaFinalChange = "";
  rut: any
  /**Variable para los productos */
  productos: any
  /**Variable para los estatus */
  estatus: any
  /**Variable para los divisa */
  divisa: any
  /**Variable para los tipos */
  tipo: any
  //panelOpenState: boolean = false;
  tablaMonitor: any
  tablaMoni: any;
  abrir: boolean = true;

  abrir1: boolean = false;
  abreFiltros = true
  abreTabla = false

  totalElements: any
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;

  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinksMO: boolean = true;
  showDirectionLinksMO: boolean = true;
  hora: any
  /**
* @description Objeto para el evento de paginacion
* y ademas contiene el parametro a buscar
* @type {IPaginationRequest}
* @memberof ParametrosComponent 
*/
  objPageable: IPaginationRequest;
  archi: any
  correoT: any
  importGlobal: any
  catalogo: any
  estat: any
  divi: any
  todos = true
  catHoras: any
  regreso = null
  valoresRetorno: any
  limiteOperaciones: any
  totalOperaciones: any
  usuarioActual: string | null = '';
  fechaFin: any
  maxFromDate: Date | null;
  idiom: any

  tipos: any[] = [
    { "value": this.translate.instant('preexistente'), "description": this.translate.instant('preexistente') },
    { "value": this.translate.instant('nuevo'), "description": this.translate.instant('nuevo') }
  ];


  /**
    * @description Metodo para poder crear la fecha maxima
    */
  getMaxDate() {
    let fecha = this.datePipe.transform(Date.now(), 'dd/MM/yyyy') || '';
    /** Se obtiene el arreglo de las partes de la fecha */
    let partsDate = fecha.split('/');
    /** Se crea la variable de fecha y se crea la fecha maxima */
    const date = new Date();
    date.setDate(Number(partsDate[0]));
    date.setMonth((Number(partsDate[1]) - 1));
    date.setFullYear(Number(partsDate[2]));
    /** Se regresa la fecha maxima con formato de fecha */
    return date;
  }



  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    public datePipe: DatePipe,
    private fc: FuncionesComunesComponent,
    private monitor: MonitorOperacionesService,
    private cd: ChangeDetectorRef,
    private globals: Globals,
    public dialog: MatDialog,
    private translate: TranslateService,
    private comunService: ComunesService,
    private bsLocaleService: BsLocaleService
  ) {
    this.idiom = localStorage.getItem('idioma');
    if (this.idiom === '1') {
      this.bsLocaleService.use('es')
    } else {
      this.bsLocaleService.use('en')
    }
    this.monitorOperacionesForm = this.initializeForm();
    /** Funcion para el onchange de los inpust dates */
    this.createSubscriptionsToDatesInputs();
    //Se inicializa el objeto pageable
    this.objPageable = {
      page: this.page,
      size: this.rowsPorPagina,
      ruta: ''
    }
    this.usuarioActual = localStorage.getItem('UserID');
    this.maxFromDate = new Date() || undefined;
  }

  hoy: any

  clickSuscliption: Subscription | undefined;
  ngAfterViewChecked(): void {
    this.idiom = localStorage.getItem('idioma');
    if (this.idiom === '1') {
      this.bsLocaleService.use('es')
    } else {
      this.bsLocaleService.use('en')
    }
  }

  ngOnInit() {
    //this.initForm();
    this.regreso = this.monitor.getSaveLocalStorage('regrese');
    this.loadPage();
    if (this.regreso === 'si') {
      this.filtros = false
      this.abreTabla = true
      this.comprobanteObj = []
      this.hoy = this.datePipe.transform(Date.now(), 'dd/MM/yyyy')
      this.valoresPrueba = this.monitor.getSaveLocalStorage('monitor');
      this.regresoPantalla()
    }
    this.clickSuscliption = this.comunService.clickAtion.subscribe(async (resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 3) {
        this.monitor.setSaveLocalStorage('regrese', null);
        this.initForm();
        this.filtros = true
        this.abreFiltros = true
        this.abreTabla = false
        this.limpiarMonitor()
        this.comprobanteObj = []
      }
    });

  }

  async initForm() {
    this.comprobanteObj = []
    this.hoy = this.datePipe.transform(Date.now(), 'dd/MM/yyyy')
    this.valoresPrueba = this.monitor.getSaveLocalStorage('monitor');
    this.productoText = '';
    this.estatusText = '';
    this.horaOperacion = '';
    try {
      await this.monitor.catalogos().then(
        async (productos: any) => {
          this.catalogo = productos.operationsMonitorCatalogsResponse.productos;
          this.divi = productos.operationsMonitorCatalogsResponse.divisas
          this.estat = productos.operationsMonitorCatalogsResponse.estatus
          this.globals.loaderSubscripcion.emit(false);
          this.catHoras = productos
        })
    } catch (e) {
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        ''
      );
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }

  async regresoPantalla() {
    try {
      await this.monitor.consultar(this.valoresPrueba, this.fillObjectPag(this.page, this.rowsPorPagina)).then(
        async (tab: any) => {
          this.tablaMonitor = []
          this.resultRequest(tab);
          if (tab.code === '400') {
            this.globals.loaderSubscripcion.emit(false);
            this.open('', this.translate.instant('monitor.Inf01.mensaje'), 'info', this.translate.instant('monitor.Inf01.codigo'));
          } else {
            try {
              await this.monitor.operacionesTotales(this.valoresPrueba).then(
                async (tab: any) => {
                  this.archi = tab.archivos
                  this.correoT = tab.correosEnv
                  this.importGlobal = tab.importeGlobal
                  this.limiteOperaciones = tab.limiteOperaciones
                });
            } catch (e) {
              this.open(
                this.translate.instant('modal.msjERRGEN0001Titulo'),
                this.translate.instant('modal.msjERRGEN0001Observacion'),
                'error',
                this.translate.instant('modal.msjERRGEN0001Codigo'),
                ''
              );
              this.globals.loaderSubscripcion.emit(false);
            }
          }
        });
    } catch (e) {
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        ''
      );
      this.globals.loaderSubscripcion.emit(false);
    }
    this.globals.loaderSubscripcion.emit(false);

  }

  /**
   * @description Metodo para poder generar los eventos de subscribe
   * de los campos dates y poder parsear la fecha
   * despues de seleccionar una fecha
   */
  private createSubscriptionsToDatesInputs() {
    /** Funcion onchange para cuando cambia la fecha inicial */
    this.monitorOperacionesForm.controls['fechaInicio'].valueChanges.subscribe(
      valFechaInicio => {
        this.fechaInicialChange = this.fc.parseFormatDate(this.datePipe.transform(valFechaInicio, 'dd/MM/yyyy') || '');
      }
    );
    /** Funcion onchange para cuando cambia la fecha final */
    this.monitorOperacionesForm.controls['fechaFin'].valueChanges.subscribe(
      valFechaFinal => {
        this.fechaFinalChange = this.fc.parseFormatDate(this.datePipe.transform(valFechaFinal, 'dd/MM/yyyy') || '');
      }
    );
  }



  /**
  * Metodo que obtiene el producto seleccionado
  */
  bloquea: any
  valueChange(event: any) {
    this.productoSeleccionado = event.target.value;
    this.productoText = event.target.options[event.target.options.selectedIndex].text;
    this.monitor.setSaveLocalStorage('producto', this.productoSeleccionado);
    if (this.productoSeleccionado == '11' || this.productoSeleccionado == '93' || this.productoSeleccionado == '85' || this.productoSeleccionado == '36' || this.productoSeleccionado == '23' ||
      this.productoSeleccionado == '21' || this.productoSeleccionado == '22' || this.productoSeleccionado == '40' || this.productoSeleccionado == '80' || this.productoSeleccionado == '85' ||
      this.productoSeleccionado == '29' || this.productoSeleccionado == '99' || this.productoSeleccionado == '09' || this.productoSeleccionado == '02' || this.productoSeleccionado == '25') {
      if (this.productoSeleccionado == '29' || this.productoSeleccionado == '99' || this.productoSeleccionado == '02') {
        if (this.productoSeleccionado == '29') {
          this.hora = this.catHoras.listaHorario29
        }
        if (this.productoSeleccionado == '99') {
          this.hora = this.catHoras.listaHorario99
        }
        if (this.productoSeleccionado == '02') {
          this.hora = this.catHoras.listaHorario02
        }
      }
      this.todos = false
    } else {
      this.todos = true
    }

  }

  valueChangeText(event: any) {
    this.estatusText = event.target.options[event.target.options.selectedIndex].text;
  }

  valueChangeHoraOp(event: any) {
    this.horaOperacion = event.target.options[event.target.options.selectedIndex].text;
  }

  /**
   * Metodo para poder inicializar el formulario
   */
  private initializeForm() {
    return this.formBuilder.group({
      comprobante: [''],
      codCli: ['', Validators.required],
      cuentaCargo: [''],
      cuentaAbono: [''],
      producto: [''],
      importe: [''],
      nombreArchivo: [''],
      referencia: [''],
      estatus: [''],
      divisa: [''],
      idOperacion: [''],
      numContrato: [''],
      horaOperación: [''],
      claveProveedor: [''],
      numEmpleado: [''],
      tipoOperacion: [''],
      numTarjeta: [''],
      sucursalTutora: [''],
      lineaCaptura: [''],
      registroPatronal: [''],
      tipo: ['0'],
      folio: [''],
      numOrden: [''],
      convenio: [''],
      nomBeneficiario: [''],
      nomPersonaAutorizada: [''],
      correo: [''],
      fechaInicio: [new Date(), Validators.required],
      fechaFin: [new Date(), Validators.required],
    }, {
      validator: [
        this.fc.compareStartDateBiggerThanEnd('fechaInicio', 'fechaFin'),
        this.fc.compareEndDateBiggerThanStart('fechaFin', 'fechaInicio'),
        this.fc.validateDatesAndNumClienteOrContratoField('fechaInicio', 'fechaFin', 'codCli', 'numContrato')]
    })

  }

  regresar() {
    this.monitor.setSaveLocalStorage('regrese', null);
    this.filtros = true
    this.abreFiltros = true
    this.abreTabla = false
    this.limpiarMonitor()
    this.comprobanteObj = []
  }
  async refrescar() {
    this.guardarMonitor();
    // try {
    //   this.monitor.setSaveLocalStorage('monitor', this.valoresPrueba);
    //   await this.monitor.consultar(this.valoresPrueba, this.fillObjectPag(this.page, this.rowsPorPagina)).then(
    //     async (tab: any) => {
    //       this.tablaMonitor = []
    //       if (tab.content.length > 0) {
    //         if (tab.code === '400') {
    //           this.globals.loaderSubscripcion.emit(false);
    //           this.open('Grupo Financiero Santander Mexicano', this.translate.instant('monitor.Inf01.mensaje'), 'info', '');
    //         } else {
    //           try {
    //             await this.monitor.operacionesTotales(this.valoresPrueba).then((tab: any) => {
    //               this.archi = tab.archivos
    //               this.correoT = tab.correosEnv
    //               this.importGlobal = tab.importeGlobal
    //               this.limiteOperaciones = tab.limiteOperaciones
    //               this.globals.loaderSubscripcion.emit(false);
    //             });
    //             this.resultRequest(tab);
    //           } catch (e) {
    //             this.globals.loaderSubscripcion.emit(false);
    //             this.open(
    //               this.translate.instant('modal.msjERRGEN0001Titulo'),
    //               this.translate.instant('modal.msjERRGEN0001Observacion'),
    //               'error',
    //               this.translate.instant('modal.msjERRGEN0001Codigo'),
    //               ''
    //             );
    //             this.globals.loaderSubscripcion.emit(false);
    //           }
    //         }
    //       } else {
    //         this.open('Grupo Financiero Santander Mexicano', this.translate.instant('monitor.Inf01.mensaje'), 'info', '');
    //       }
    //     });
    // } catch (e) {
    //   this.globals.loaderSubscripcion.emit(false);
    //   this.open(
    //     this.translate.instant('modal.msjERRGEN0001Titulo'),
    //     this.translate.instant('modal.msjERRGEN0001Observacion'),
    //     'error',
    //     this.translate.instant('modal.msjERRGEN0001Codigo'),
    //     ''
    //   );
    // }
  }

  limpiarMonitor() {
    //this.monitorOperacionesForm.reset();
    this.monitorOperacionesForm = this.initializeForm();
    this.todos = true
    /** Funcion para el onchange de los inpust dates */
    this.createSubscriptionsToDatesInputs();
  }

  ruta: any
  async detalles(tab: any) {
    const data = {
      'vistProd': tab.vistProd,
      'idOperacion': tab.idOperacion,
      'idProducto': tab.idProducto,
      'tabla': tab.tabla,
      'cmbProducto': tab.idProducto,
      'idEs': this.monitorOperacionesForm.value.estatus
    }

    this.monitor.setSaveLocalStorage('operaciones', data);

    try {
      await this.monitor.ruta(data.cmbProducto).then(
        async (resp: any) => {
          this.globals.loaderSubscripcion.emit(false);
          this.ruta = resp.ruta
          this.savePage();
          if (this.ruta == 'URL_DETALLE_DOMIS') {
            if (data.cmbProducto == 29) {
              this.monitor.setSaveLocalStorage('intradia', 's');
            }
            this.router.navigate(['/monitoreo/detallesOperacionesDomis']);
            this.rut = "/monitoreo/detallesOperacionesDomis"
            this.monitor.setSaveLocalStorage('ruta', this.rut);
            return
          }
          if (this.ruta == 'URL_DETALLE_CNF') {
            this.router.navigate(['/monitoreo/detallesOperacionesAdmProvConf']);
            this.rut = "/monitoreo/detallesOperacionesAdmProvConf"
            this.monitor.setSaveLocalStorage('ruta', this.rut);
            return
          }
          if (this.ruta == 'URL_DETALLE_IMP_FED') {
            this.router.navigate(['/monitoreo/detallesPIF']);
            this.rut = "/monitoreo/detallesPIF"
            this.monitor.setSaveLocalStorage('ruta', this.rut);
            return
          }
          if (this.ruta == 'URL_DETALLE_PAG_REF') {
            this.router.navigate(['/monitoreo/detallesPIF']);
            this.rut = "/monitoreo/detallesPIF"
            this.monitor.setSaveLocalStorage('ruta', this.rut);
            return
          }
          if (this.ruta == 'URL_DETALLE_APOR_PATR') {
            this.router.navigate(['/monitoreo/detallesPIF']);
            this.rut = "/monitoreo/detallesPIF"
            this.monitor.setSaveLocalStorage('ruta', this.rut);
            return
          }
          if (this.ruta == 'URL_DETALLE_ORDEN_PAGO') {
            this.router.navigate(['/monitoreo/detallesOperacionesOrdenPago']);
            this.rut = "/monitoreo/detallesOperacionesOrdenPago"
            this.monitor.setSaveLocalStorage('ruta', this.rut);
            return
          }
          if (this.ruta == 'URL_DETALLE_ALTA_MASIVA') {
            this.router.navigate(['/monitoreo/detallesOperacionesAltaMasiva']);
            this.rut = "/monitoreo/detallesOperacionesAltaMasiva"
            this.monitor.setSaveLocalStorage('ruta', this.rut);
            return
          }
          if (this.ruta == 'URL_DETALLE_TARJ_PROP') {
            this.router.navigate(['/monitoreo/detallesOperacionesTarjetasProp']);
            this.rut = "/monitoreo/detallesOperacionesTarjetasProp"
            this.monitor.setSaveLocalStorage('ruta', this.rut);
            return
          }
          if (this.ruta == 'URL_DETALLE_PIF') {
            this.router.navigate(['/monitoreo/detallesPIF']);
            this.rut = "/monitoreo/detallesPIF"
            this.monitor.setSaveLocalStorage('ruta', this.rut);
            return
          }
          if (this.ruta == 'URL_DETALLE_TRANSFERENCIAS') {
            this.router.navigate(['/monitoreo/detallesOperacionesTransfer']);
            this.rut = "/monitoreo/detallesOperacionesTransfer"
            this.monitor.setSaveLocalStorage('ruta', this.rut);
            return
          }
          if (this.ruta == 'URL_DETALLE_SPID') {
            this.router.navigate(['/monitoreo/detallesOperacionesSPID']);
            this.rut = "/monitoreo/detallesOperacionesSPID"
            this.monitor.setSaveLocalStorage('ruta', this.rut);
            return
          }
          else if (this.ruta == 'URL_DETALLE_PD') {
            this.router.navigate(['/monitoreo/detallesOperacionesPagoDirect']);
            this.rut = "/monitoreo/detallesOperacionesPagoDirect"
            this.monitor.setSaveLocalStorage('ruta', this.rut);
            return
          }
          else if (this.ruta == 'OrdPagAtm') {
            this.router.navigate(['/monitoreo/detallesOperacionesOrdenPagoATM']);
            this.rut = "/monitoreo/detallesOperacionesOrdenPagoATM"
            this.monitor.setSaveLocalStorage('ruta', this.rut);
            return
          }
          else if (this.ruta == 'PagImpAdua') {
            this.router.navigate(['/monitoreo/detallesOperacionesPagImpAdua']);
            this.rut = "/monitoreo/detallesOperacionesPagImpAdua"
            this.monitor.setSaveLocalStorage('ruta', this.rut);
            return
          } else {
            this.router.navigate(['/monitoreo/detallesOperaciones']);
            this.rut = "/monitoreo/detallesOperaciones"
            this.monitor.setSaveLocalStorage('ruta', this.rut);
            return
          }
        })

    } catch (e) {
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant('modal.msjERRGEN0001Observacion')
      );
    }
    /**
     * Esto esta mientas jesus arregla lo de redireccionamiento (Descomentar)
     */
    /*this.router.navigate(['/monitoreo/detallesPIF']);
    this.rut = "/monitoreo/detallesPIF"
    this.monitor.setSaveLocalStorage('ruta', this.rut);*/
    //this.router.navigate(['/monitoreo/detallesOperaciones']);

    //this.router.navigate(['/monitoreo/detallesOperacionesSPID']);
  }

  valoresPrueba: any
  x: any
  async guardarMonitor() {
    const inicio = this.monitorOperacionesForm.value.fechaInicio //this.datePipe.transform(this.monitorSaldosForm.value.fechaInicial, 'dd/MM/yyyy')
    const fin = this.monitorOperacionesForm.value.fechaFin
    const archivo = this.monitorOperacionesForm.value.nombreArchivo
    if (this.monitorOperacionesForm.value.fechaFin === "" || this.monitorOperacionesForm.value.fechaInicio === "") {
      this.open('Error',
        this.translate.instant('SRF'), 'error');
      return
    } else {
      if (archivo !== '') {
        //Se quito validacion para prueba
        this.x = this.myFunction90Dias(new Date((inicio)))
        if (this.x > 90) {
          return
        }
        this.valoresPrueba = {
          //"fechaInicial": "01/01/1970",
          //"fechaFinal": "01/01/2023",
          "fechaInicial": this.datePipe.transform(this.monitorOperacionesForm.value.fechaInicio, 'dd/MM/yyyy'),// "01/01/1970"
          // "fechaFinal": this.datePipe.transform(Date.now(), 'dd/MM/yyyy'), // este es el bueno
          "fechaFinal":  this.datePipe.transform(this.monitorOperacionesForm.value.fechaFin, 'dd/MM/yyyy'),
          "divisa": this.monitorOperacionesForm.value.divisa || "0",
          "buc": this.monitorOperacionesForm.value.codCli || null,
          "cuentaAbono": this.monitorOperacionesForm.value.cuentaAbono || null,//002180434000102861
          "importe": this.monitorOperacionesForm.value.importe || null, //560.00
          "referencia": this.monitorOperacionesForm.value.referencia || null,
          "contrato": this.monitorOperacionesForm.value.numContrato || null,
          "cuentaCargo": this.monitorOperacionesForm.value.cuentaCargo || null, //65506119203
          "idProducto": this.monitorOperacionesForm.value.producto || "0",
          "nombreArchivo": this.monitorOperacionesForm.value.nombreArchivo || null, //TRAN08032023_TEF_CLABINT111.IN
          "idEstatus": this.monitorOperacionesForm.value.estatus || "0", // Error falta Algo  (SI)
          "idReg": this.monitorOperacionesForm.value.idOperacion || null,
          "cveProveedor": this.monitorOperacionesForm.value.claveProveedor || null,
          "tipOperacion": this.monitorOperacionesForm.value.tipoOperacion || null,
          "numEmpleado": this.monitorOperacionesForm.value.numEmpleado || null,
          "numTarjeta": this.monitorOperacionesForm.value.numTarjeta || null,
          "sucTutora": this.monitorOperacionesForm.value.sucursalTutora || null,
          "tipo": this.monitorOperacionesForm.value.tipo || null,
          "lineaCaptura": this.monitorOperacionesForm.value.lineaCaptura || null,
          "regPat": this.monitorOperacionesForm.value.registroPatronal || null,
          "numeroOrden": this.monitorOperacionesForm.value.numOrden || null,
          "convenio": this.monitorOperacionesForm.value.convenio || null,
          "nombreBeneficiario": this.monitorOperacionesForm.value.nomBeneficiario || null,
          "folioSUA": this.monitorOperacionesForm.value.folio || null,
          "horaProgramacion": this.horaOperacion,
          "user": this.usuarioActual,
          "nombreProducto": this.productoText === '' ? 'Todos' : this.productoText,
          "descripcionEstatus": this.estatusText === '' ? 'Todos' : this.estatusText


        }
      } else {
        this.x = this.myFunction90Dias(new Date((inicio)))
        if (this.x <= 90) {
          const dias = this.myFunction(new Date(inicio), new Date((fin)))
          if (dias >= 0 && dias <= 7) {
            this.valoresPrueba = {
              //"fechaInicial": "01/01/1970",
              //"fechaFinal": "01/01/2023",
              "fechaInicial": this.datePipe.transform(this.monitorOperacionesForm.value.fechaInicio, 'dd/MM/yyyy'),// "01/01/1970"
              "fechaFinal": this.datePipe.transform(this.monitorOperacionesForm.value.fechaFin, 'dd/MM/yyyy'),
              "divisa": this.monitorOperacionesForm.value.divisa || "0",
              "buc": this.monitorOperacionesForm.value.codCli || null,
              "cuentaAbono": this.monitorOperacionesForm.value.cuentaAbono || null,//002180434000102861
              "importe": this.monitorOperacionesForm.value.importe || null, //560.00
              "referencia": this.monitorOperacionesForm.value.referencia || null,
              "contrato": this.monitorOperacionesForm.value.numContrato || null,
              "cuentaCargo": this.monitorOperacionesForm.value.cuentaCargo || null, //65506119203
              "idProducto": this.monitorOperacionesForm.value.producto || "0",
              "nombreArchivo": this.monitorOperacionesForm.value.nombreArchivo || null, //TRAN08032023_TEF_CLABINT111.IN
              "idEstatus": this.monitorOperacionesForm.value.estatus || "0", // Error falta Algo  (SI)
              "idReg": this.monitorOperacionesForm.value.idOperacion || null,
              "cveProveedor": this.monitorOperacionesForm.value.claveProveedor || null,
              "tipOperacion": this.monitorOperacionesForm.value.tipoOperacion || null,
              "numEmpleado": this.monitorOperacionesForm.value.numEmpleado || null,
              "numTarjeta": this.monitorOperacionesForm.value.numTarjeta || null,
              "sucTutora": this.monitorOperacionesForm.value.sucursalTutora || null,
              "tipo": this.monitorOperacionesForm.value.tipo || null,
              "lineaCaptura": this.monitorOperacionesForm.value.lineaCaptura || null,
              "regPat": this.monitorOperacionesForm.value.registroPatronal || null,
              "numeroOrden": this.monitorOperacionesForm.value.numOrden || null,
              "convenio": this.monitorOperacionesForm.value.convenio || null,
              "nombreBeneficiario": this.monitorOperacionesForm.value.nomBeneficiario || null,
              "folioSUA": this.monitorOperacionesForm.value.folio || null,
              "horaProgramacion": this.monitorOperacionesForm.value.horaOperación || null,
              "user": this.usuarioActual,
              "nombreProducto": this.productoText === '' ? 'Todos' : this.productoText,
              "descripcionEstatus": this.estatusText === '' ? 'Todos' : this.estatusText
            }
          } else {
            this.open('Error', this.translate.instant('MO.RF7'), 'error');
            return
          }
        } else {
          return
        }
      }

      try {
        this.monitor.setSaveLocalStorage('monitor', this.valoresPrueba);
        this.page = 1
        await this.monitor.consultar(this.valoresPrueba, this.fillObjectPag(this.page, this.rowsPorPagina)).then(
          async (tab1: any) => {
            console.log("Consulta de operaciones: " + JSON.stringify(tab1));
            this.tablaMonitor = []
            if (tab1.content.length > 0) {
              if (tab1.code === '400') {
                this.globals.loaderSubscripcion.emit(false);
                this.open('Grupo Financiero Santander Mexicano', this.translate.instant('monitor.Inf01.mensaje'), 'info', '');
              } else {
                try {
                  await this.monitor.operacionesTotales(this.valoresPrueba).then((tab: any) => {
                    console.log("Respuesta de total: " + JSON.stringify(tab));
                    this.archi = tab.archivos
                    this.correoT = tab.correosEnv
                    this.importGlobal = tab.importeGlobal
                    this.limiteOperaciones = tab.limiteOperaciones
                    this.globals.loaderSubscripcion.emit(false);
                  });
                  this.resultRequest(tab1);
                } catch (e) {
                  this.globals.loaderSubscripcion.emit(false);
                  this.open(
                    this.translate.instant('modal.msjERRGEN0001Titulo'),
                    this.translate.instant('modal.msjERRGEN0001Observacion'),
                    'error',
                    this.translate.instant('modal.msjERRGEN0001Codigo'),
                    ''
                  );
                  this.globals.loaderSubscripcion.emit(false);
                }
              }
            } else {
              this.globals.loaderSubscripcion.emit(false);
              this.open(this.translate.instant('solicitudEstadosCuenta.msjINF002Titulo'), this.translate.instant('monitor.Inf01.mensaje'), 'info', '');
            }
          });
      } catch (e) {
        this.globals.loaderSubscripcion.emit(false);
        this.open(
          this.translate.instant('modal.msjERRGEN0001Titulo'),
          this.translate.instant('modal.msjERRGEN0001Observacion'),
          'error',
          this.translate.instant('modal.msjERRGEN0001Codigo'),
          ''
        );
      }
    }
  }

  filtros = true
  resultRequest(result: any) {
    console.log("RESULT: " + JSON.stringify(result.totalElements));
    this.tablaMonitor = this.generateTablaMonitor(result.content);
    this.totalElements = result.totalElements;
    //this.limiteOperaciones = result.limiteOperaciones
    this.totalOperaciones = Math.ceil(parseFloat(this.totalElements) / 20);
    if (this.totalElements > 0) {
      this.banderaHasRows = true;
      this.abreTabla = true
      this.filtros = false
    } else {
      this.banderaHasRows = false;
      this.abreTabla = false
      this.filtros = true
    }
  }

  /**
   * Metodo para asignar valores de selección y estatus de campos habilitados.
   * @param result 
   * @returns list result.
   */
  generateTablaMonitor(result: any) {
    result.forEach((r: any) => {
      r.disabled = '0';
      if (r.idProducto == '93') {
        r.disabled = '1';
      }
      if (r.idProducto == '96') {
        r.disabled = '1';
      }
      if (r.idProducto == '95') {
        r.disabled = '1';
      }
      if (r.idProducto == '54') {
        r.disabled = '1';
      }
      if (r.idProducto == '05') {
        r.disabled = '1';
      }
      if (r.idEstatus != '4') {
        r.disabled = '1';
      }
      r.isSelected = '';
    });
    return result;
  }

  async onPageChanged(event: any) {
    this.page = event.page;
    this.tablaMonitor = [];
    this.monitor.consultar(this.valoresPrueba, this.fillObjectPag(this.page, this.rowsPorPagina)).then((tab: any) => {
      this.resultRequest(tab);
      this.globals.loaderSubscripcion.emit(false);

    });
  }

  /** 
  * @descripcion Metodo para poder generar y regresar el objeto con la paginacion
  * 
  * @param numPage valor para indicar el numero de la pagina
  * @param totalItemsPage valor para indicar el total de elementos que se mostraran en la pagina
 */
  private fillObjectPag(numPage: number, totalItemsPage: number) {
    this.objPageable.page = numPage - 1,
      this.objPageable.size = totalItemsPage;
    return this.objPageable;
  }



  /**
   * Metodo para poder cambiar los valores del check EnviaBuzon en el lista de productos
   */
  onChangeEnviaBuzon(tab: any, e: any) {
    if (tab.idProducto === '32') {
      tab.vistProd = tab.vistProd + '_32'
    }
    if (e.target.checked === true) {
      this.checkComprobante = true;
      this.comprobanteObj.push(tab)
    } else {
      this.checkComprobante = false
      this.comprobanteObj = this.comprobanteObj.filter((item) => item.idOperacion !== tab.idOperacion)
    }

  }

  /**
   * Metodo para obtener la cantidad de registros habilitados.
   * @returns cantidad de registros habilitados
   */
  listDisabledCount() {
    return this.tablaMonitor.filter((d: any) => d.disabled == '0').length;
  }

  /**
   * Metodo para seleccionar todos los registros
   */
  onChangeComboTodos(e: any) {
    this.selAllCheck = false;

    const combobox = document.getElementsByName("comprobante");
    const activos = this.tablaMonitor.filter((d: any) => d.isSelected == 'true').length;
    const inactivos = this.tablaMonitor.filter((d: any) => d.isSelected == '').length;

    if ((activos > 0 && inactivos == 0) || (activos == 0 && inactivos > 0)) {
      /** Selecciona todos los combobox habilitados. **/
      for (let j = 0; j < combobox.length; j++) {
        if (this.tablaMonitor[j].disabled != '1') {
          if (this.tablaMonitor[j] === '32') {
            this.tablaMonitor[j].vistProd = this.tablaMonitor[j].vistProd + '_32'
          }
          if (this.tablaMonitor[j].isSelected == 'true') {
            this.tablaMonitor[j].isSelected = '';
            this.comprobanteObj = this.comprobanteObj.filter((item) => item.idOperacion !== this.tablaMonitor[j].idOperacion);
          } else {
            this.tablaMonitor[j].isSelected = 'true';
            this.comprobanteObj.push(this.tablaMonitor[j]);
          }
        }
      }
      // Activamos la bandera de seleccion de All Checks
      if (this.comprobanteObj.length > 0) {
        this.selAllCheck = true;
      }

    } else {
      /** habilitados **/
      let habilitados = this.tablaMonitor.filter((d: any) => d.disabled == '0').length;

      /** seleccionados **/
      let seleccionados = this.tablaMonitor.filter((d: any) => d.isSelected == 'true').length;

      if (habilitados == seleccionados) {
        /** Se deseleccionan **/
        for (let j = 0; j < combobox.length; j++) {
          if (this.tablaMonitor[j].disabled != '1') {
            if (this.tablaMonitor[j] === '32') {
              this.tablaMonitor[j].vistProd = this.tablaMonitor[j].vistProd + '_32'
            }
            this.tablaMonitor[j].isSelected = '';
            this.comprobanteObj = this.comprobanteObj.filter((item) => item.idOperacion !== this.tablaMonitor[j].idOperacion);
          }
        }
      } else {
        /** Se deseleccionan **/
        for (let j = 0; j < combobox.length; j++) {
          if (this.tablaMonitor[j].disabled != '1') {
            if (this.tablaMonitor[j] === '32') {
              this.tablaMonitor[j].vistProd = this.tablaMonitor[j].vistProd + '_32'
            }
            this.tablaMonitor[j].isSelected = '';
            this.comprobanteObj = this.comprobanteObj.filter((item) => item.idOperacion !== this.tablaMonitor[j].idOperacion);
          }
        }
        /** Se seleccionan todos los campos **/
        for (let j = 0; j < combobox.length; j++) {
          if (this.tablaMonitor[j].disabled != '1') {
            if (this.tablaMonitor[j] === '32') {
              this.tablaMonitor[j].vistProd = this.tablaMonitor[j].vistProd + '_32'
            }
            if (this.tablaMonitor[j].isSelected == 'true') {
              this.tablaMonitor[j].isSelected = '';
              this.comprobanteObj = this.comprobanteObj.filter((item) => item.idOperacion !== this.tablaMonitor[j].idOperacion);
            } else {
              this.tablaMonitor[j].isSelected = 'true';
              this.comprobanteObj.push(this.tablaMonitor[j]);
            }
          }
        }
      }

    }
  }

  /**
   * 
   * @Description Metodo para puros numeros
   */
  numerico(event: KeyboardEvent) { this.fc.numberDecimal(event); }


  /**
     * Abrir el modal de exportar los datos
     */
  openModalComprobante() {
    this.valoresPrueba.oper = "";
    if (this.comprobanteObj.length > 0) {
      if (this.selAllCheck === true) {
        // Abrimos el modal de Enviar por Correo
        const dialogo = this.dialog.open(ModalSeleccionarPaginaComponent);
        dialogo.afterClosed().subscribe(result => {
          if (result) {
            this.comprobanteOp2(result);
          }
        });

      } else {
        // Mostramos el mensaje de envio
        this.showDialog();
      }
    } else {
      // const dialogo = this.dialog.open(ModalSinElementosComponent);
      this.open(
        this.translate.instant('MONOP003'),
        this.translate.instant('monitoreo.monitorSlados.observacion'),
        'alert'
      );
    }
  }

  /** Mostramos la ventan de Dialogo Selecicon by Pagina o todos los campos */
  showDialog() {
    const dialogo = this.dialog.open(ModalComprobanteComponent);
    dialogo.afterClosed().subscribe(result => {
      if (result) {
        this.comprobante(result)
      }
    });
  }

  /** Pagina Principal 1ra Opcion */
  async comprobante(tipo: any) {
    if (tipo.radio === '2') {
      // 1 todos  pdf     // 2 uno nomas zip
      this.sendComprobanteBAll();

    } else if (tipo.radio === '1') {
      // Enviar Registros por Pagina
      this.sendComprobanteBP();
    }
  }


  /** Seleccion de la Opcion 2 All Checks */
  async comprobanteOp2(tipo: any) {
    console.log('Tipo Radio: ' + tipo.radio);
    // Enviamos por Pagina
    if (tipo.radio === '1') {
      // Enviar Registros por Pagina
      this.showDialog();
    } else {
      // Enviamos completo por Email
      this.showDialogEmail();
    }
  }

 /** Mostramos la ventan de Dialogo Selecicon by Pagina o todos los campos */
 showDialogEmail() {
  //const dialogo = this.dialog.open(ModalEnviarCorreoComponent);
  const titulo = 'Aviso'
  const contenido = 'Capture por favor su correo:'
  const dialogo = this.dialog.open(ModalEnviarCorreoComponent, {
    data: new ModalInfoBeanCorreoComponents(titulo, contenido, this.valoresPrueba), hasBackdrop: true
  })

  //const dialogo = this.dialog.open( ModalInfoBeanCorreoComponents );
  dialogo.afterClosed().subscribe(result => {
    if (result) {
      this.sendComprobantEmail();
    }
  });
}
  

  /** Se envian Todas las operaciones en documentos ZIP */
  async sendComprobanteBAll() {
    try {
      await this.monitor.comprobante('pdf', this.comprobanteObj).then(
        async (result: any) => {
          if (result.data === '') {
            this.open(
              this.translate.instant('buzon.msjINFOOKTitulo'),
              this.translate.instant('NO.RP'),
              'info',
              'MONOP0002',
              ''
            );
          } else {
            this.fc.convertBase64ToDownloadFileInExport(result);
          }
          this.globals.loaderSubscripcion.emit(false);
        })
      this.globals.loaderSubscripcion.emit(false);
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        ''
      );
    }
  }

  /** Se envian los datos por Documento */
  async sendComprobanteBP() {
    try {
      await this.monitor.comprobante('zip', this.comprobanteObj).then(
        async (result: any) => {
          if (result.data === '' || result.data === 'UEsFBgAAAAAAAAAAAAAAAAAAAAAAAA==') {
            this.open(
              this.translate.instant('buzon.msjINFOOKTitulo'),
              this.translate.instant('NO.RP'),
              'info',
              'MONOP0002',
              ''
            );
          } else {
            this.fc.convertBase64ToDownloadFileInExport(result);
          }
          this.globals.loaderSubscripcion.emit(false);
        })
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        ''
      );
    }
  }


  /** Se envian los datos por Documento */
  async sendComprobantEmail() {
    try {
      await this.monitor.generarXML(this.comprobanteObj).then(
        async (result: any) => {
          if (result.data === '' || result.data === 'UEsFBgAAAAAAAAAAAAAAAAAAAAAAAA==') {
            this.open(
              this.translate.instant('buzon.msjINFOOKTitulo'),
              this.translate.instant('NO.RP'),
              'info',
              'MONOP0002',
              ''
            );
          } else {
            this.fc.convertBase64ToDownloadFileInExport(result);
          }
          this.globals.loaderSubscripcion.emit(false);
        })
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        ''
      );
    }
  }


  myFunction(start: any, end: any) {
    // One hour in milliseconds
    const oneHour = 1 * 60 * 60 * 1000;
    // Calculating the time difference between two dates
    const diffInTime = end.getTime() - start.getTime();
    // Calculating the no. of days between two dates
    const diffInDays = Math.round((diffInTime / oneHour) / 24);
    if (diffInDays < 0) {
      return diffInDays * -1
    }
    return diffInDays;
  }

  async exportar() {
    console.log("Limite de operaciones: " + this.limiteOperaciones + " Total operaciones: " + this.totalElements);
    var limit = Number(this.limiteOperaciones);
    if (this.totalElements >= limit) {
      this.valoresPrueba.oper = "exp";
      const titulo = 'Aviso'
      const contenido = 'Capture por favor su correo:'
      this.dialog.open(ModalEnviarCorreoComponent, {
        data: new ModalInfoBeanCorreoComponents(titulo, contenido, this.valoresPrueba), hasBackdrop: true
      })
    } else {
      try {
        await this.monitor.exportar('excel', this.valoresPrueba).then(
          async (result: any) => {
            console.log("RESPUESTA EXPORTAR: " + JSON.stringify(result));
            if (result.data) {
              /** Se manda la informacion para realizar la descarga del archivo */
              this.fc.convertBase64ToDownloadFileInExport(result);
              this.globals.loaderSubscripcion.emit(false);
            } else {
              if (result.code === '404') {
                this.open(
                  this.translate.instant('modal.msjERRGEN0001Titulo'),
                  this.translate.instant('modal.msjERRGEN0001Observacion'),
                  'error',
                  this.translate.instant('modal.msjERRGEN0001Codigo'),
                  this.translate.instant('modal.msjERRGEN0001Observacion')
                );
                this.globals.loaderSubscripcion.emit(false);
              }
            }
          });
      } catch (e) {
        this.globals.loaderSubscripcion.emit(false);
        this.open(
          this.translate.instant('modal.msjERRGEN0001Titulo'),
          this.translate.instant('modal.msjERRGEN0001Observacion'),
          'error',
          this.translate.instant('modal.msjERRGEN0001Codigo'),
          this.translate.instant('modal.msjERRGEN0001Observacion')
        );
      }
    }
  }

  /**
     * @description evento para poder levantar el modal para
     * mostrar los mensajes de sucess o error
     * @param titulo indica si se ejecutara para error o success
     * @param contenido mensaje que se mostrara en el modal
    */

  open(
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

  /**
  * @param event Evento Disable
  * @returns la respuesta del evento 
  */
  disableEvent(event: any) {
    event.preventDefault();
    return false;
  }

  /**
  * Evento para al momento de realizar el pegado
  * en cualquier input este evento no ocurra
  */
  eventoOnPasteBlock(event: ClipboardEvent) {
    return false;
  }

  myFunction90Dias(end: any) {
    const tiempoTranscurrido = Date.now();
    const hoy = new Date(tiempoTranscurrido);
    // One hour in milliseconds
    const oneHour = 1 * 60 * 60 * 1000;
    // Calculating the time difference between two dates
    const diffInTime = end.getTime() - Date.now();
    // Calculating the no. of days between two dates
    const diffInDays = Math.round((diffInTime / oneHour) / 24);
    if (diffInDays < 0) {
      if (diffInDays * -1 > 90) {
        this.open('Error', this.translate.instant('90'), 'error');
      }
      return diffInDays * -1
    }

    if (diffInDays > 90) {
      this.open('Error', this.translate.instant('90'), 'error');
    }
    return diffInDays;
  }

  loadPage() {

    const page = sessionStorage.getItem('GestionProductosComponentPage');
    if (page) {
      this.page = JSON.parse(page);
      sessionStorage.removeItem('GestionProductosComponentPage');
    }
  }
  savePage() {
    sessionStorage.setItem('GestionProductosComponentPage', JSON.stringify(this.page));
  }


}
