import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { CurrencyPipe, DatePipe } from "@angular/common";
import { BsDatepickerConfig, BsLocaleService } from "ngx-bootstrap/datepicker";
import { MonitorOperacionesService } from 'src/app/services/monitoreo/monitor-operaciones.service';
import { Globals } from 'src/app/bean/globals-bean.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalComprobanteComponent } from 'src/app/components/modals/modal-comprobante/modal-comprobante.component';
import { ModalSinElementosComponent } from 'src/app/components/modals/modal-sin-elementos/modal-sin-elementos.component';
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
import { MonitorOperacionesDuplicadasService } from 'src/app/services/duplicados/monitor-operaciones-duplicadas.service';
defineLocale('es', esLocale);

@Component({
  selector: 'app-monitor-operaciones-duplicadas',
  templateUrl: './monitor-operaciones-duplicadas.component.html',
  styleUrls: ['./monitor-operaciones-duplicadas.component.css']
})
export class MonitorOperacionesDuplicadasComponent implements OnInit {

  id: boolean = false;
  /**
   *  @description Formulario para la busqueda de buzones
    * @type {FormGroup}
    * @memberOf MonitorOperacionesComponent
  */
  monitorOperacionesForm!: UntypedFormGroup;
  rowsPorPagina2: number = 20;

  page: number = 1;

  checkComprobante: boolean = false;

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

  totalElements2: any
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;

  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinksMO2: boolean = true;
  showDirectionLinksMO2: boolean = true;
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
  idiom:any


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
    private monitorOperacionesDuplicadasService: MonitorOperacionesDuplicadasService,
    private cd: ChangeDetectorRef,
    private globals: Globals,
    public dialog: MatDialog,
    private translate: TranslateService,
    private comunService: ComunesService,
    private bsLocaleService: BsLocaleService,
    private currencyPipe: CurrencyPipe,
  ) {
    this.idiom = localStorage.getItem('idioma');
    if(this.idiom === '1'){
      this.bsLocaleService.use('es')
    }else{
      this.bsLocaleService.use('en')
    }
    this.monitorOperacionesForm = this.initializeForm();
    /** Funcion para el onchange de los inpust dates */
    this.createSubscriptionsToDatesInputs();
    //Se inicializa el objeto pageable
    this.objPageable = {
      page: this.page,
      size: this.rowsPorPagina2,
      ruta: ''
    }
    this.usuarioActual = localStorage.getItem('UserID');
    this.maxFromDate = new Date() || undefined;
  }

  hoy: any

  clickSuscliption: Subscription | undefined;
  ngAfterViewChecked(): void {
    this.idiom = localStorage.getItem('idioma');
    if(this.idiom === '1'){
      this.bsLocaleService.use('es')
    }else{
      this.bsLocaleService.use('en')
    }
  }

  ngOnInit() {
    //this.initForm();
    this.regreso = this.monitor.getSaveLocalStorage('regrese');
    this.loadPage();
    if(  this.regreso === 'si'){
      this.filtros=false
      this.abreTabla = true
      this.comprobanteObj = []
      this.hoy = this.datePipe.transform(Date.now(), 'dd/MM/yyyy')
      this.valoresPrueba = this.monitor.getSaveLocalStorage('monitor');
      this.regresoPantalla()
    }
    this.clickSuscliption = this.comunService.clickAtion.subscribe(async (resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 2) {
        this.monitorOperacionesDuplicadasService.setSaveLocalStorage('regrese', null);
        this.initForm();
        this.filtros=true
        this.abreFiltros = true
        this.abreTabla = false
        this.limpiarMonitor2()
        this.comprobanteObj = []
      }
    });

  }

  async initForm() {
    this.comprobanteObj = []
    this.hoy = this.datePipe.transform(Date.now(), 'dd/MM/yyyy')
    this.valoresPrueba = this.monitorOperacionesDuplicadasService.getSaveLocalStorage('monitor');
    try {
      await this.monitorOperacionesDuplicadasService.catalogos().then(
        async (productos: any) => {
          this.catalogo = productos.productos;
          this.divi = productos.divisas
          this.estat = productos.estatus
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
      await this.monitorOperacionesDuplicadasService.consultar(this.valoresPrueba, this.fillObjectPag(this.page, this.rowsPorPagina2)).then(
        async (tab: any) => {
          this.tablaMonitor = []
          this.resultRequest(tab);
          if (tab.code === '400') {
            this.globals.loaderSubscripcion.emit(false);
            this.open('', this.translate.instant('monitor.Inf01.mensaje'), 'info', this.translate.instant('monitor.Inf01.codigo'));
          } else {
            try {
              await this.monitorOperacionesDuplicadasService.operacionesTotales(this.valoresPrueba).then(
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
    this.monitorOperacionesDuplicadasService.setSaveLocalStorage('producto', this.productoSeleccionado);
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
      estatus: [{
        value: '76',
        disabled: true
      }],
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
      tipo: [''],
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
    this.monitorOperacionesDuplicadasService.setSaveLocalStorage('regrese', null);
    this.filtros=true
    this.abreFiltros = true
    this.abreTabla = false
    this.limpiarMonitor2()
    this.comprobanteObj = []
  }
  async refrescar() {
    try {
      this.monitorOperacionesDuplicadasService.setSaveLocalStorage('monitor', this.valoresPrueba);
      await this.monitorOperacionesDuplicadasService.consultar(this.valoresPrueba, this.fillObjectPag(this.page, this.rowsPorPagina2)).then(
        async (tab: any) => {
          this.tablaMonitor = []
          if (tab.content.length > 0) {
            if (tab.code === '400') {
              this.globals.loaderSubscripcion.emit(false);
              this.open('Grupo Financiero Santander Mexicano', this.translate.instant('monitor.Inf01.mensaje'), 'info', '');
            } else {
              try {
                await this.monitorOperacionesDuplicadasService.operacionesTotales(this.valoresPrueba).then((tab: any) => {
                  this.archi = tab.archivos
                  this.correoT = tab.correosEnv
                  this.importGlobal = tab.importeGlobal
                  this.limiteOperaciones = tab.limiteOperaciones
                  this.globals.loaderSubscripcion.emit(false);
                });
                this.resultRequest(tab);
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
            this.open('Grupo Financiero Santander Mexicano', this.translate.instant('monitor.Inf01.mensaje'), 'info', '');
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

  limpiarMonitor2() {
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
      'idEs': this.monitorOperacionesForm.value.estatus,
      ...tab
    }

    this.monitorOperacionesDuplicadasService.setSaveLocalStorage('operaciones', data);

    try {
      await this.monitor.ruta(data.cmbProducto).then(
        async (resp: any) => {
          this.globals.loaderSubscripcion.emit(false);
          this.ruta = resp.ruta
          this.savePage();
          if (this.ruta == 'URL_DETALLE_DOMIS') {
            if (data.cmbProducto == 29) {
              this.monitorOperacionesDuplicadasService.setSaveLocalStorage('intradia', 's');
            }
            this.router.navigate(['/duplicados/detallesOperacionesDomisDuplicadas']);
            this.rut = "/duplicados/detallesOperacionesDomisDuplicadas"
            this.monitorOperacionesDuplicadasService.setSaveLocalStorage('ruta', this.rut);
            return
          }
          if (this.ruta == 'URL_DETALLE_CNF') {
            this.router.navigate(['/duplicados/detallesOperacionesAdmProvConfDuplicadas']);
            this.rut = "/duplicados/detallesOperacionesAdmProvConfDuplicadas"
            this.monitorOperacionesDuplicadasService.setSaveLocalStorage('ruta', this.rut);
            return
          }
          if (this.ruta == 'URL_DETALLE_IMP_FED') {
            this.router.navigate(['/duplicados/detallesPIFDuplicadas']);
            this.rut = "/duplicados/detallesPIFDuplicadas"
            this.monitorOperacionesDuplicadasService.setSaveLocalStorage('ruta', this.rut);
            return
          }
          if (this.ruta == 'URL_DETALLE_PAG_REF') {
            this.router.navigate(['/duplicados/detallesPIFDuplicadas']);
            this.rut = "/duplicados/detallesPIFDuplicadas"
            this.monitorOperacionesDuplicadasService.setSaveLocalStorage('ruta', this.rut);
            return
          }
          if (this.ruta == 'URL_DETALLE_APOR_PATR') {
            this.router.navigate(['/duplicados/detallesPIFDuplicadas']);
            this.rut = "/duplicados/detallesPIFDuplicadas"
            this.monitorOperacionesDuplicadasService.setSaveLocalStorage('ruta', this.rut);
            return
          }
          if (this.ruta == 'URL_DETALLE_ORDEN_PAGO') {
            this.router.navigate(['/duplicados/detallesOperacionesOrdenPagoDuplicadas']);
            this.rut = "/duplicados/detallesOperacionesOrdenPagoDuplicadas"
            this.monitorOperacionesDuplicadasService.setSaveLocalStorage('ruta', this.rut);
            return
          }
          if (this.ruta == 'URL_DETALLE_ALTA_MASIVA') {
            this.router.navigate(['/duplicados/detallesOperacionesAltaMasivaDuplicadas']);
            this.rut = "/duplicados/detallesOperacionesAltaMasivaDuplicadas"
            this.monitorOperacionesDuplicadasService.setSaveLocalStorage('ruta', this.rut);
            return
          }
          if (this.ruta == 'URL_DETALLE_TARJ_PROP') {
            this.router.navigate(['/duplicados/detallesOperacionesTarjetasPropDuplicadas']);
            this.rut = "/duplicados/detallesOperacionesTarjetasPropDuplicadas"
            this.monitorOperacionesDuplicadasService.setSaveLocalStorage('ruta', this.rut);
            return
          }
          if (this.ruta == 'URL_DETALLE_PIF') {
            this.router.navigate(['/duplicados/detallesPIFDuplicadas']);
            this.rut = "/duplicados/detallesPIFDuplicadas"
            this.monitorOperacionesDuplicadasService.setSaveLocalStorage('ruta', this.rut);
            return
          }
          if (this.ruta == 'URL_DETALLE_TRANSFERENCIAS') {
            this.router.navigate(['/duplicados/detallesOperacionesTransferDuplicadas']);
            this.rut = "/duplicados/detallesOperacionesTransferDuplicadas"
            this.monitorOperacionesDuplicadasService.setSaveLocalStorage('ruta', this.rut);
            return
          }
          if (this.ruta == 'URL_DETALLE_SPID') {
            this.router.navigate(['/duplicados/detallesOperacionesSPIDDuplicadas']);
            this.rut = "/duplicados/detallesOperacionesSPIDDuplicadas"
            this.monitorOperacionesDuplicadasService.setSaveLocalStorage('ruta', this.rut);
            return
          }
          else if (this.ruta == 'URL_DETALLE_PD') {
            this.router.navigate(['/duplicados/detallesOperacionesPagoDirectDuplicadas']);
            this.rut = "/duplicados/detallesOperacionesPagoDirect"
            this.monitorOperacionesDuplicadasService.setSaveLocalStorage('ruta', this.rut);
            return
          }
          else if (this.ruta == 'OrdPagAtm') {
            this.router.navigate(['/duplicados/detallesOperacionesOrdenPagoATMDuplicados']);
            this.rut = "/duplicados/detallesOperacionesOrdenPagoATMDuplicados"
            this.monitorOperacionesDuplicadasService.setSaveLocalStorage('ruta', this.rut);
            return
          }
          else if (this.ruta == 'PagImpAdua') {
            this.router.navigate(['/duplicados/detallesOperacionesPagImpAduaDuplicadas']);
            this.rut = "/duplicados/detallesOperacionesPagImpAduaDuplicadas"
            this.monitorOperacionesDuplicadasService.setSaveLocalStorage('ruta', this.rut);
            return
          } else {
            this.router.navigate(['/duplicados/detallesOperacionesDuplicadas']); // buena va aqui
            //this.router.navigate(['/duplicados/detallesPIFDuplicadas']);
            this.rut = "/duplicados/detallesOperacionesDuplicadas"
            this.monitorOperacionesDuplicadasService.setSaveLocalStorage('ruta', this.rut);
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
  async guardarMonitor2() {
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
          "fechaFinal": this.datePipe.transform(Date.now(), 'dd/MM/yyyy'), // este es el bueno
          //"fechaFinal":  this.datePipe.transform(this.monitorOperacionesForm.value.fechaFin, 'dd/MM/yyyy'),
          "divisa": this.monitorOperacionesForm.value.divisa || null,
          "buc": this.monitorOperacionesForm.value.codCli || null,
          "cuentaAbono": this.monitorOperacionesForm.value.cuentaAbono || null,//002180434000102861
          "importe": this.monitorOperacionesForm.value.importe?.replace('$', '')?.replace(',', '') || null, //560.00
          "referencia": this.monitorOperacionesForm.value.referencia || null,
          "contrato": this.monitorOperacionesForm.value.numContrato || null,
          "cuentaCargo": this.monitorOperacionesForm.value.cuentaCargo || null, //65506119203
          "idProducto": this.monitorOperacionesForm.value.producto || null,
          "nombreArchivo": this.monitorOperacionesForm.value.nombreArchivo || null, //TRAN08032023_TEF_CLABINT111.IN
          "idEstatus": '76', // Error falta Algo  (SI)
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
          "user": this.usuarioActual

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
              "divisa": this.monitorOperacionesForm.value.divisa || null,
              "buc": this.monitorOperacionesForm.value.codCli || null,
              "cuentaAbono": this.monitorOperacionesForm.value.cuentaAbono || null,//002180434000102861
              "importe": this.monitorOperacionesForm.value.importe?.replace('$', '')?.replace(',', '') || null, //560.00
              "referencia": this.monitorOperacionesForm.value.referencia || null,
              "contrato": this.monitorOperacionesForm.value.numContrato || null,
              "cuentaCargo": this.monitorOperacionesForm.value.cuentaCargo || null, //65506119203
              "idProducto": this.monitorOperacionesForm.value.producto || null,
              "nombreArchivo": this.monitorOperacionesForm.value.nombreArchivo || null, //TRAN08032023_TEF_CLABINT111.IN
              "idEstatus": this.monitorOperacionesForm.value.estatus || null, // Error falta Algo  (SI)
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
              "user": this.usuarioActual
            }
          } else {
            this.open('Error',this.translate.instant('MO.RF7') , 'error');
            return
          }
        } else {
          return
        }
      }

      try {
        this.monitorOperacionesDuplicadasService.setSaveLocalStorage('monitor', this.valoresPrueba);
        this.page = 1
        await this.monitorOperacionesDuplicadasService.consultar(this.valoresPrueba, this.fillObjectPag(this.page, this.rowsPorPagina2)).then(
          async (tab: any) => {
            this.tablaMonitor = []
            if (tab.content.length > 0) {
              if (tab.code === '400') {
                this.globals.loaderSubscripcion.emit(false);
                this.open('Grupo Financiero Santander Mexicano', this.translate.instant('monitor.Inf01.mensaje'), 'info', '');
              } else {
                try {
                  await this.monitorOperacionesDuplicadasService.operacionesTotales(this.valoresPrueba).then((tab: any) => {
                    this.archi = tab.archivos
                    this.correoT = tab.correosEnv
                    this.importGlobal = tab.importeGlobal
                    this.limiteOperaciones = tab.limiteOperaciones
                    this.globals.loaderSubscripcion.emit(false);
                  });
                  this.resultRequest(tab);
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

  filtros= true
  resultRequest(result: any) {
    this.tablaMonitor = result.content;
    this.totalElements2 = result.totalElements;
    this.limiteOperaciones = result.limiteOperaciones
    this.totalOperaciones = Math.ceil(parseFloat(this.totalElements2) / 20);
    if (this.totalElements2 > 0) {
      this.banderaHasRows = true;
      this.abreTabla = true
      this.filtros = false
    } else {
      this.banderaHasRows = false;
      this.abreTabla = false
      this.filtros = true
    }
  }



  async onPageChanged2(event: any) {
    this.page = event.page;
    this.tablaMonitor = [];
    this.monitorOperacionesDuplicadasService.consultar(this.valoresPrueba, this.fillObjectPag(this.page, this.rowsPorPagina2)).then((tab: any) => {
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
    this.objPageable.page = numPage-1,
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
      this.checkComprobante = true
      this.comprobanteObj.push(tab)
    } else {
      this.checkComprobante = false
      this.comprobanteObj = this.comprobanteObj.filter((item) => item.idOperacion !== tab.idOperacion)
    }

  }

  /**
   *
   * @Description Metodo para puros numeros
   */
  numerico(event: KeyboardEvent) { this.fc.numberOnly(event); }


  /**
     * Abrir el modal de exportar los datos
     */
  openModalComprobante() {
    if (this.comprobanteObj.length > 0) {
      const dialogo = this.dialog.open(ModalComprobanteComponent);
      dialogo.afterClosed().subscribe(result => {
        if (result) {
          this.comprobante(result)
        }
      });
    } else {
      // const dialogo = this.dialog.open(ModalSinElementosComponent);
      this.open(
        this.translate.instant('MONOP003'),
        this.translate.instant('monitoreo.monitorSlados.observacion'),
        'alert'
      );
    }
  }

  comprobanteObj: any[] = []
  async comprobante(tipo: any) {
    if (tipo.radio === '2') { // 1 todos  pdf     // 2 uno nomas zip
      try {
        await this.monitorOperacionesDuplicadasService.getFile(this.comprobanteObj, 'pdf', this.fillObjectPag(this.page, this.rowsPorPagina2)).then(
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
              this.globals.loaderSubscripcion.emit(false);
            }
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
    } else if (tipo.radio === '1') {
      try {
        await this.monitorOperacionesDuplicadasService.getFile(this.comprobanteObj, 'zip', this.fillObjectPag(this.page, this.rowsPorPagina2) ).then(
          async (result: any) => {
            if (result.data === 'UEsFBgAAAAAAAAAAAAAAAAAAAAAAAA==') {
              this.open(
                this.translate.instant('buzon.msjINFOOKTitulo'),
                this.translate.instant('NO.RP'),
                'info',
                'MONOP0002',
                ''
              );
            } else {
              this.fc.convertBase64ToDownloadFileInExport(result);
              this.globals.loaderSubscripcion.emit(false);
            }
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
    var limit = Number(this.limiteOperaciones);
    if (this.totalOperaciones >= limit) {
      const titulo = 'Aviso'
      const contenido = 'Capture por favor su correo:'
      this.dialog.open(ModalEnviarCorreoComponent, {
        data: new ModalInfoBeanCorreoComponents(titulo, contenido, this.valoresPrueba), hasBackdrop: true
      })
    } else {
      try {
        await this.monitorOperacionesDuplicadasService.getFile(this.valoresPrueba, 'excel', this.fillObjectPag(this.page, this.rowsPorPagina2)).then(
          async (result: any) => {
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
        this.open('Error',this.translate.instant('90'), 'error');
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

  transformAmount(event: any) {
    event.target.value = event.target.value?.replace('$', '')?.replace(',', '');
    event.target.value = this.currencyPipe.transform(event.target.value, '$ ');
  }

}