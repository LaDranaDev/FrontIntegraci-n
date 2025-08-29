import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { ComunesService } from 'src/app/services/comunes.service';
import { PagoRequest } from '../../../models/pago-request.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDatepickerConfig, BsLocaleService } from "ngx-bootstrap/datepicker";
import { MonitorOperacionesApiService } from 'src/app/services/monitoreo-api/monitor-operaciones-api.service';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { defineLocale, esLocale } from 'ngx-bootstrap/chronos';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { Globals } from 'src/app/bean/globals-bean.component';

@Component({
  selector: 'app-monitoreo-operaciones',
  templateUrl: './monitoreo-operaciones.component.html',
  styleUrls: ['./monitoreo-operaciones.component.css']
})
export class MonitoreoOperacionesComponent implements OnInit {

  id: boolean = false;
  /**
   *  @description Formulario para la busqueda de buzones
    * @type {FormGroup}
    * @memberOf MonitorOperacionesComponent
  */
  monitorOperacionesForm!: UntypedFormGroup;
  rowsPorPagina: number = 20;

  page: number = 1;
  pagosRequest :PagoRequest={
    operacion :'',
    divisa : '',
    tipoPago:'',
    estatus :'',
    cuentaCargo:'',
    cuentaAbono:'',
    canal:'',
    transactionId:'',
    referenciaCanal:'',
    importe:0,
    fechaInicio: new Date(),
    fechaFin: new Date()
  };
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
  tiposPago:any
  estat: any
  divi: any
  todos = true
  catHoras: any
  regreso = null
  monitor2=null
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
    private monitor: MonitorOperacionesApiService,
    private cd: ChangeDetectorRef,
    private fc:FuncionesComunesComponent,
    private globals: Globals,
    public dialog: MatDialog,
    private translate: TranslateService,
    private comunService: ComunesService,
    private bsLocaleService: BsLocaleService
  ) {
    defineLocale('es', esLocale);
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
    this.ngOnInit();
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
    this.initForm();
    this.regreso = this.monitor.getSaveLocalStorage('regrese');
    this.monitor2 = this.monitor.getSaveLocalStorage('monitoreoConsulta');
    this.loadPage();
    if (this.regreso === 'si') {
      this.filtros = false
      this.abreTabla = true
      this.comprobanteObj = []
      this.hoy = this.datePipe.transform(Date.now(), 'dd/MM/yyyy')
      this.valoresPrueba = {
      producto: null,
      divisa:null,
      tipoPago:null,
      estatus:null,
      cuentaCargo:null,
      cuentaAbono:null,
      canal:null,
      transactionId:null,
      referenciaCanal:null,
      importe:null,
      fechaInicio: null,
      fechaFin: null
    };
      this.regresoPantalla();
    }
    if(this.monitor2!=null && this.monitor2!="" && Object.keys(this.monitor2).length > 0){
      this.filtros = false
      this.abreTabla = true
      this.comprobanteObj = []
      this.hoy = this.datePipe.transform(Date.now(), 'dd/MM/yyyy')
      this.valoresPrueba = {
      producto: null,
      divisa:null,
      tipoPago:this.monitor2,
      estatus:null,
      cuentaCargo:null,
      cuentaAbono:null,
      canal:null,
      transactionId:null,
      referenciaCanal:null,
      importe:null,
      fechaInicio: null,
      fechaFin: null
      };
      this.regresoPantalla();
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
    this.valoresPrueba = {
      producto: null,
      divisa:null,
      tipoPago:null,
      estatus:null,
      cuentaCargo:null,
      cuentaAbono:null,
      canal:null,
      transactionId:null,
      referenciaCanal:null,
      importe:null,
      fechaInicio: null,
      fechaFin: null
    };
    this.productoText = '';
    this.estatusText = '';
    this.horaOperacion = '';
    try {
      await this.monitor.catalogos().then(
        async (productos: any) => {
          this.catalogo = productos.tiposOperacion;
          this.divi = productos.divisas;
          this.estat = productos.estatus;
          this.tiposPago = productos.tiposPago;

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
          this.resultRequest(tab.content);
          this.archi = tab.content.page.totalElements;
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
      (      valFechaInicio: string | number | Date) => {
        this.fechaInicialChange = new Date().toString();
      }
    );
    /** Funcion onchange para cuando cambia la fecha final */
    this.monitorOperacionesForm.controls['fechaFin'].valueChanges.subscribe(
      (      valFechaFinal: string | number | Date) => {
        this.fechaFinalChange =  new Date().toString();
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
      producto :'',
    divisa : '',
    tipoPago:'',
    estatus :'',
    cuentaCargo:'',
    cuentaAbono:'',
    canal:'',
    transactionId:'',
    referenciaCanal:'',
    importe:null,
      fechaInicio: [new Date(), Validators.required],
      fechaFin: [new Date(), Validators.required],
    }, {
      validator: [
        this.fc.compareStartDateBiggerThanEnd('fechaInicio', 'fechaFin'),
        this.fc.compareEndDateBiggerThanStart('fechaFin', 'fechaInicio')]
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
  }

  limpiarMonitor() {
    //this.monitorOperacionesForm.reset();
    this.monitorOperacionesForm = this.initializeForm();
    this.todos = true
    /** Funcion para el onchange de los inpust dates */
    this.createSubscriptionsToDatesInputs();
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
        this.x = this.myFunction30Dias(new Date((inicio)))
        if (this.x > 30) {
          return
        }
        this.valoresPrueba = {
          "fechaInicial": this.datePipe.transform(this.monitorOperacionesForm.value.fechaInicio, 'dd/MM/yyyy'),// "01/01/1970"
          // "fechaFinal": this.datePipe.transform(Date.now(), 'dd/MM/yyyy'), // este es el bueno
          "fechaFinal":  this.datePipe.transform(this.monitorOperacionesForm.value.fechaFin, 'dd/MM/yyyy'),
          "divisa": this.monitorOperacionesForm.value.divisa || null,
          "tipoPago": this.monitorOperacionesForm.value.tipoPago || null,
          "cuentaAbono": this.monitorOperacionesForm.value.cuentaAbono || null,//002180434000102861
          "importe": this.monitorOperacionesForm.value.importe || null, //560.00
          "referenciaCanal": this.monitorOperacionesForm.value.referenciaCanal || null,
          "cuentaCargo": this.monitorOperacionesForm.value.cuentaCargo || null, //65506119203
          "operacion": this.monitorOperacionesForm.value.operacion || null,
          "transactionId": this.monitorOperacionesForm.value.transactionId || null,
          "estatus": this.monitorOperacionesForm.value.estatus || null, // Error falta Algo  (SI)
        }
      } else {
        this.x = this.myFunction30Dias(new Date((inicio)))
        if (this.x <= 30) {
          const dias = this.myFunction(new Date(inicio), new Date((fin)))
          if (dias >= 0 && dias <= 7) {
            this.valoresPrueba = {
              "fechaInicial": this.datePipe.transform(this.monitorOperacionesForm.value.fechaInicio, 'dd/MM/yyyy'),// "01/01/1970"
              "fechaFinal": this.datePipe.transform(this.monitorOperacionesForm.value.fechaFin, 'dd/MM/yyyy'),
              "divisa": this.monitorOperacionesForm.value.divisa || null,
              "tipoPago": this.monitorOperacionesForm.value.tipoPago || null,
              "cuentaAbono": this.monitorOperacionesForm.value.cuentaAbono || null,//002180434000102861
              "importe": this.monitorOperacionesForm.value.importe || null, //560.00
              "referenciaCanal": this.monitorOperacionesForm.value.referenciaCanal || null,
              "cuentaCargo": this.monitorOperacionesForm.value.cuentaCargo || null, //65506119203
              "operacion": this.monitorOperacionesForm.value.operacion || null,
              "transactionId": this.monitorOperacionesForm.value.transactionId || null, //TRAN08032023_TEF_CLABINT111.IN
              "estatus": this.monitorOperacionesForm.value.estatus || null, // Error falta Algo  (SI)
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
            this.tablaMonitor = [];
            if (tab1.content.content.length > 0) {
                try {
                  await this.monitor.operacionesTotales(this.valoresPrueba).then((tab: any) => {
                    console.log("Respuesta de total: " + JSON.stringify(tab));
                    this.archi = tab1.content.page.totalElements;
                    if(this.monitorOperacionesForm.value.divisa!=null && this.monitorOperacionesForm.value.divisa!= ""){
                      this.importGlobal = tab[0].importeTotal;
                    }else{
                      this.importGlobal = "";
                    }

                    this.globals.loaderSubscripcion.emit(false);
                  });
                  this.resultRequest(tab1.content);
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
    this.totalElements = result.page.totalElements;
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

  getOperacionDesc(operacion:string):string | null{
    const desc = this.catalogo.find((desc: { id: String; }) => desc.id ===operacion);
    return desc ? desc.descripcion : null; 
  }

  async onPageChanged(event: any) {
    this.page = event.page;
    this.tablaMonitor = [];
    this.monitor.consultar(this.valoresPrueba, this.fillObjectPag(this.page, this.rowsPorPagina)).then((tab: any) => {
      this.resultRequest(tab.content);
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
   * Metodo para obtener la cantidad de registros habilitados.
   * @returns cantidad de registros habilitados
   */
  listDisabledCount() {
    return this.tablaMonitor.filter((d: any) => d.disabled == '0').length;
  }

  

  /**
   *
   * @Description Metodo para puros numeros
   */
  numerico(event: KeyboardEvent) { this.numberDecimal(event); }

  numberDecimal(event: KeyboardEvent) {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode==46 || (charCode >= 48 && charCode <= 57)) {
            return true;
        } else {
            event.preventDefault();
            return false;
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

  myFunction30Dias(end: any) {
    const tiempoTranscurrido = Date.now();
    const hoy = new Date(tiempoTranscurrido);
    // One hour in milliseconds
    const oneHour = 1 * 60 * 60 * 1000;
    // Calculating the time difference between two dates
    const diffInTime = end.getTime() - Date.now();
    // Calculating the no. of days between two dates
    const diffInDays = Math.round((diffInTime / oneHour) / 24);
    if (diffInDays < 0) {
      if (diffInDays * -1 > 30) {
        this.open('Error', this.translate.instant('30'), 'error');
      }
      return diffInDays * -1
    }

    if (diffInDays > 30) {
      this.open('Error', this.translate.instant('30'), 'error');
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
