import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { ComunesService } from 'src/app/services/comunes.service';
import { MonitorSaldosService } from 'src/app/services/monitoreo/monitor-saldos.service';
import { Globals } from 'src/app/bean/globals-bean.component';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AltaContratosService } from 'src/app/services/admin-contratos/alta-contratos.service';
import { Router } from '@angular/router';
import { CuentasGoService } from 'src/app/services/cuentaGo/cuentas-go.service';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';


@Component({
  selector: 'app-admin-stock-super-cuenta-go',
  templateUrl: './admin-stock-super-cuenta-go.component.html',
  styleUrls: ['./admin-stock-super-cuenta-go.component.css']
})
export class AdminStockSuperCuentaGoComponent implements OnInit {
  datospersonales: any = {
    numContrato: '',
    numRemesa: '',
    bucCliente: '',
    descEstatus: '',
    nombreCompleto: '',
    personalidad: '',
    cuentaEje: '',
    idContrato: '',
    razonSocial: '',
    idEstatus: '',
    centroDistribucion: ''
  };
  bucCliente: any
  saldo: any
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;
  /** Variable para indicar en que pagina se encuentra */
  pageR: number = 0;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElementsR: number = 0;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPaginaR: number = 10;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinksR: boolean = true;
  showDirectionLinksR: boolean = true;
  /** Variables para mostrar el boton o no de exportar*/
  banderaBtnExportar: boolean = true;
  abreTabla = false
  abreFiltros = true
  codigoSi = false
  abrir: boolean = true;
  abrir1: boolean = false;
  statusRemesa: any;
  pagina: any;

  
  /**
   *  @description Formulario para la busqueda de buzones
    * @type {FormGroup}
    * @memberOf MonitorOperacionesComponent
  */
  monitorSaldosForm!: UntypedFormGroup;

  consulta: boolean = false
  /** Variables para la obtencion de fecha inicial y final cuando cambie el date*/
  fechaInicialChange = "";
  fechaFinalChange = "";
  tabla: any

  select = [
    { 'id': '1', 'value': 'Enviado' },
    { 'id': '2', 'value': 'Recibido' },
    { 'id': '3', 'value': 'Cancelado' }
  ];

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

  /**Variable para los productos */
  productos: any
  /** Variable para el producto seleccionado */
  productoSeleccionado: any = '';

  /**
 * @description Objeto para el evento de paginacion
 * y ademas contiene el parametro a buscar
 * @type {IPaginationRequest}
 * @memberof ParametrosComponent 
 */
  objPageable: IPaginationRequest;
  submittedMonitor = false;
  usuarioActual: string | null = '';
  lstEstatusContrato: any;
  idEstatusContratoDef: any;
  idEstatusDef: any;
  idEstatus: any;
  // Valores que ocurren cuando se selecciona un check
  selKeyRemesa: any;
  selCenterId: any;
  returnedArray: any;
  returnedArray2: any;

  constructor(
    private globals: Globals,
    private formBuilder: UntypedFormBuilder,
    public datePipe: DatePipe,
    private fc: FuncionesComunesComponent,
    private service: AltaContratosService,
    private monitor: MonitorSaldosService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private comunService: ComunesService,
    private router: Router,
    private serviceGo: CuentasGoService,

  ) {
    this.usuarioActual = localStorage.getItem('UserID');
    this.monitorSaldosForm = this.initializeForm();
    /** Funcion para el onchange de los inpust dates */
    this.createSubscriptionsToDatesInputs();
    //Se inicializa el objeto pageable
    this.objPageable = {
      page: this.pageR,
      size: this.rowsPorPaginaR,
      ruta: ''
    }
  }


  clickSuscliption: Subscription | undefined;

  ngOnInit() {
    this.clickSuscliption = this.comunService.clickAtion.subscribe(async (resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 1000) {
        this.limpiarContrato();
      }
    });

    if( localStorage.getItem('datConsulta') !== null) {
      var datSesion = JSON.parse( localStorage.getItem("datConsulta") || "");
      this.datospersonales.bucCliente = datSesion.codCliente;
      this.datospersonales.descEstatus = datSesion.estatusContrato;
      this.datospersonales.razonSocial = datSesion.razonSocial;
      this.datospersonales.cuentaEje = datSesion.ctaEje;
      this.datospersonales.numContrato = datSesion.numContrato;
      this.monitorSaldosForm.controls['tipoFecha'].setValue(datSesion.tipoFecha);
      // Obtenemos los datos de las fechas
      var fecha = this.valConvFechas( datSesion.fechaInicial);
      var fecha2 = this.valConvFechas( datSesion.fechaFinal ) ;
      this.monitorSaldosForm.controls['fechaInicial'].setValue( fecha );
      this.monitorSaldosForm.controls['fechaFinal'].setValue( fecha2 );
      this.createSubscriptionsToDatesInputs();
      // Eliminamos la clave de la sesion usados en este formulario
      localStorage.removeItem('datConsulta');
      localStorage.removeItem('datSesionRemesa');
      localStorage.removeItem('numContrato');

      this.monitorSaldosForm.get('tipoFecha')?.enable();
      this.monitorSaldosForm.get('ramesa')?.enable();
      // Realizamos la consulta si existen datos en la sesion
      this.consultar();
    }
  }


  valConvFechas(miFecha: any) {
    var valFecha2 = miFecha;
    var fecha2: any;
    var typeOfValue = typeof( valFecha2 );
    if(typeOfValue === 'string') {
      fecha2 = new Date(valFecha2);
    }
    return fecha2;
  }

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

  open(titulo: String, contenido: String, type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso' | 'yesNo', code?: string, sugerencia?: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, code, sugerencia), hasBackdrop: true
    });
  }

  limpiarContrato() {
    this.datospersonales = {
      numContrato: '',
      numRemesa: '',
      bucCliente: '',
      descEstatus: '',
      nombreCompleto: '',
      personalidad: '',
      cuentaEje: '',
      idContrato: '',
      razonSocial: '',
      centroDistribucion: ''
    };
    this.selKeyRemesa = '';
    this.selCenterId = '';
    this.idEstatusDef = this.idEstatusContratoDef;
  }

  limpiaFormulario() {
    if( this.datospersonales.bucCliente === this.bucCliente 
      || this.datospersonales.bucCliente === undefined) {
      return;
    }
    this.datospersonales = {
      numContrato: '',
      numRemesa: '',
      descEstatus: '',
      nombreCompleto: '',
      personalidad: '',
      cuentaEje: '',
      idContrato: '',
      razonSocial: '',
      centroDistribucion: ''
    };
    this.selKeyRemesa = '';
    this.selCenterId = '';
    this.idEstatusDef = this.idEstatusContratoDef;
    this.initializeForm()
    this.limpiarTabla();
    this.monitorSaldosForm.controls['tipoFecha'].setValue('');
  }


  limpiarTabla() {
    this.tabla = [];
    this.returnedArray = [];
    this.pagina = 0;
    this.banderaHasRows = false;
    this.consulta = false;
  }

  getContratoByBuc() {
    if (this.datospersonales.bucCliente == '' 
      || this.datospersonales.bucCliente == undefined) {
        return;
    }
    this.bucCliente  = this.datospersonales.bucCliente;
    this.serviceGo
      .getDataCliente(this.datospersonales.bucCliente)
      .then((resp: any) => {
      if (resp.responseCode == 'OK00000') {
        this.datospersonales.bucCliente = resp.response.bucCliente;
        this.datospersonales.cuentaEje = resp.response.cuentaEje;
        this.datospersonales.numContrato = resp.response.numContrato;
        this.datospersonales.numRemesa = resp.response.numRemesa;
        this.datospersonales.razonSocial = resp.response.razonSocial;
        this.datospersonales.descEstatus = resp.response.descEstatus;
        this.datospersonales.idContrato = resp.response.idContrato;
        this.datospersonales.idEstatus = resp.response.idEstatus;
        this.datospersonales.descEstatus = resp.response.descEstatus;
        this.idEstatus = resp.response.idEstatus;
        this.idEstatusDef = this.idEstatus;
        this.monitorSaldosForm.get('tipoFecha')?.enable();
        this.monitorSaldosForm.get('ramesa')?.enable();
      } else {
        this.limpiarContrato();
        this.open(
          '',
          this.translate.instant('contingencia.msjERR007Observacion'),
          'alert',
          '',
          ''
        );
      }
    }).catch(() => {
      this.open(
        this.translate.instant('modals.altacontratos.error'),
        this.translate.instant('modals.altacontratos.error.consulta.contrato.buc'),
        'error'
      );
    }).finally(() =>
      {this.globals.loaderSubscripcion.emit(false);
        
      }
    );
  }

  /**
   * Metodo que valida el tamaño del campo código de cliente, en caso de que sea menor a 8 dígitos lo completa con ceros.
   */
  validateTamanoBuc(event: any) {
    let buc = event.target.value;
    let tamanio = buc.length;
    let relleno = 8 - tamanio;
    this.datospersonales.bucCliente =
      tamanio > 0 ? new Array(relleno + 1).join('0') + buc : buc;
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }

  private initializeForm() {
    const form = this.formBuilder.group({
      codigoCliente: [''],
      tipoFecha: [''],
      ramesa: [''],
      fechaInicial: [],
      fechaFinal: [],
      radio: ['']
    });
    form.get('tipoFecha')?.disable();
    form.get('ramesa')?.disable();
    return form;
  }
  
  validarFechas() {
    if( (this.monitorSaldosForm.value.fechaInicial === null 
      || this.monitorSaldosForm.value.fechaInicial === undefined)
      && (this.monitorSaldosForm.value.fechaFinal === null 
      || this.monitorSaldosForm.value.fechaFinal === undefined) ) {
        return true;
      }
      return false;
  }

  consultar() {
    var tpFecha = this.monitorSaldosForm.value.tipoFecha;
    var remesa = this.monitorSaldosForm.value.ramesa;
    if ( (tpFecha=== '' || tpFecha ===undefined) 
      && (remesa=== '' || remesa === undefined)
      && this.validarFechas() ) {
      this.open( 
        this.translate.instant('adminStock.mensaje.filtro'),
        '', 'alert', '', '');
      return
    }
    // Llamamos al procedimiento de consulta    
    this.consul()
  }


  obtenerDiasNum(fecha: any) {
    var fechaDias : any;
    try {
      fechaDias = new Date(fecha).getDay;
    } catch(error){
      fechaDias = 0;
    }
    return fechaDias
  }


  /**
   * Funcion para que la fecha no sea mayor a la actual
   */
  fechaNoMayorA90Dias(){
    var romperContinudad = false;
    var dateIni: any = new Date(this.monitorSaldosForm.value.fechaInicial);
    var dateFin : any = new Date(this.monitorSaldosForm.value.fechaFinal);
    var suma: any = Math.floor((dateFin - dateIni) / (1000 * 3600 * 24));
    var numDias = 90;
    
    if(suma > numDias){
      romperContinudad = true;
      this.open('Error',
      this.translate.instant('ErrFec'),
      'error', 'VALFEC00');
    }
    return romperContinudad;
  }


  async consul() {
    if( this.fechaNoMayorA90Dias() ) {
      return;
    }
    this.tabla = [];
    this.returnedArray = [];
    this.pagina = 0;
    this.banderaHasRows = false;
    this.consulta = false;
    
    this.pageR = 0;

    const datosEnviar = {
      "buc": this.datospersonales.bucCliente,
      "numContrato": this.datospersonales.numContrato,
      "tipoFecha": this.monitorSaldosForm.value.tipoFecha,
      "numRemesa": this.monitorSaldosForm.value.ramesa,
      "fechaInicio": this.datePipe.transform(this.monitorSaldosForm.value.fechaInicial, 'yyyy-MM-dd'),
      "fechaFinal": this.datePipe.transform(this.monitorSaldosForm.value.fechaFinal, 'yyyy-MM-dd')
    }
    try {
      const response = await this.serviceGo.consultar(datosEnviar);
      if (response) {
        this.resultRequest(response)
      }
    } catch (error) {
      this.open('', 
        this.translate.instant('adminStock.mensaje.filtro.consulta.error'),
        'error', '', '');
    }
    // Esto va en la consulta
    this.globals.loaderSubscripcion.emit(false);
  }


  /**
   * @description Metodo para poder crear la fecha maxima
   */
  getMinDate() {
    let fecha = this.datePipe.transform(Date.now(), 'dd/MM/yyyy') || '';
    /** Se obtiene el arreglo de las partes de la fecha */
    let partsDate = fecha.split('/');
    /** Se crea la variable de fecha y se crea la fecha maxima */
    const date = new Date();
    date.setDate(Number(partsDate[0]));
    date.setMonth((Number(partsDate[1]) - 1) + 6);
    date.setFullYear(Number(partsDate[2]) - 1);
    /** Se regresa la fecha maxima con formato de fecha */
    return date;
  }

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


  /**
    * @description Metodo para poder generar los eventos de subscribe
    * de los campos dates y poder parsear la fecha
    * despues de seleccionar una fecha
    */
  private createSubscriptionsToDatesInputs() {
    /** Funcion onchange para cuando cambia la fecha inicial */
    this.monitorSaldosForm.controls['fechaInicial'].valueChanges.subscribe(
      valFechaInicio => {
        if (valFechaInicio) {
          this.fechaInicialChange = this.fc.parseFormatDate(this.datePipe.transform(valFechaInicio, 'dd/MM/yyyy') || '');
          this.validarFecha();
        }
      }
    );
    /** Funcion onchange para cuando cambia la fecha final */
    this.monitorSaldosForm.controls['fechaFinal'].valueChanges.subscribe(
      valFechaFinal => {
        if (valFechaFinal) {
          this.fechaFinalChange = this.fc.parseFormatDate(this.datePipe.transform(valFechaFinal, 'dd/MM/yyyy') || '');
          this.validarFecha();
        }
      }
    );
  }

  /**
      * @description Metodo para validar las fechas de inicio y fin
  */
  validarFecha(): boolean {
    const fechaInicial = this.fechaInicialChange;
    const fechaFinal = this.fechaFinalChange;

    if (fechaInicial && fechaFinal && fechaFinal < fechaInicial) {
      this.dialog.open(ModalInfoComponent, {
        data: new ModalInfoBeanComponents(
          '',
          this.translate.instant('administracionStockSuperCuentaGo.fechaAlertaMensage'),
          'error',
          ''
        ),
      });
      this.monitorSaldosForm.get('fechaInicial')?.setValue(null);
      this.monitorSaldosForm.get('fechaFinal')?.setValue(null);
      return false;
    }
    return true;
  }

  /** 
    * @descripcion Metodo para poder generar y regresar el objeto con la paginacion
    * 
    * @param numPage valor para indicar el numero de la pagina
    * @param totalItemsPage valor para indicar el total de elementos que se mostraran en la pagina
   */
  private fillObjectPag(numPage: number, totalItemsPage: number) {
    this.objPageable.page = numPage,
      this.objPageable.size = totalItemsPage;
    return this.objPageable;
  }
  x: any


  resultRequest(result: any) {
    if( result.response === undefined || result.response === null
      || result.responseCode==='LME0161') {
      this.getMsgError();
      return;
    }
    // Asignamos los valores 
    this.returnedArray = result.response.cards;
    this.tabla = this.returnedArray.slice(0, this.rowsPorPaginaR);
    this.totalElementsR = result.response.total;
    if (this.totalElementsR > 0) {
      this.consulta = true
      this.banderaHasRows = true;
    } else {
      this.getMsgError();
    }
  }


  getMsgError() {
    this.open(
      this.translate.instant('adminStock.mensaje.filtro.noexiste'),
      '', 'info', 'WND001', ''
    );
  }


  /**
  * 
  * Abrir el modal de error 
  */
  openModalError(titulo: String, contenido: String, type?: any, code?: string, sugerencia?: string) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, code, sugerencia), hasBackdrop: true
    }
    );
  }

  openModal() {
    const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
    dialogo.afterClosed().subscribe((result) => {
      if (result) {
        this.exportar(result);
      }
    });
  }

  async exportar(tipoExportacion: any) {
    const datosEnviar = {
      buc: this.datospersonales.bucCliente,
      numContrato: this.datospersonales.numContrato,
      tipoFecha: this.monitorSaldosForm.value.tipoFecha,
      numRemesa: this.monitorSaldosForm.value.ramesa,
      fechaInicio: this.datePipe.transform(this.monitorSaldosForm.value.fechaInicial, 'yyyy-MM-dd'),
      fechaFinal: this.datePipe.transform(this.monitorSaldosForm.value.fechaFinal, 'yyyy-MM-dd'),
      usuario: this.usuarioActual,
      formato: tipoExportacion
    }
    // Iniciamos peticion de datos
    try {
      await this.serviceGo.exportRemesas(datosEnviar)
      .then((result: any) => {
        if (result.response.data) {
          /** Se manda la informacion para realizar la descarga del archivo */
          this.fc.convertBase64ToDownloadFileInExport(result.response);
          this.globals.loaderSubscripcion.emit(false);
          
        } else {
          if (result.code === '404') {
            this.openModalError('Error', result.message, 'error');
            this.globals.loaderSubscripcion.emit(false);
            
          } else {
            this.openModalError(
              'Error',
              this.translate.instant('modals.error.pdf'),
              'error'
            );
            this.globals.loaderSubscripcion.emit(false);
          }
        }
      });
    } catch(error) {
      console.log( 'Ocurrio un error ..............');
    }
  }

  /**
   * @description Evento de click al momento de usar la paginacion
   * @memberOf GestionPaisesComponent
  */
  async onPageChanged(event: any) {
    this.pagina = event.page - 1;
    const startItem = this.pagina *  this.rowsPorPaginaR;
    const endItem = (this.pagina+1) *  this.rowsPorPaginaR;
    // Hacemos el recorrido de datos
    this.tabla = this.returnedArray.slice(startItem, endItem);
  }


  async consultByPage() {
      // Limpiamos los datos antes de hacer la consulta
      this.tabla = [];
      const datosEnviar = {
        "buc": this.datospersonales.bucCliente,
        "numContrato": this.datospersonales.numContrato,
        "tipoFecha": this.monitorSaldosForm.value.tipoFecha,
        "numRemesa": this.monitorSaldosForm.value.ramesa,
        "pagina": this.pageR,
        "fechaInicio": this.datePipe.transform(this.monitorSaldosForm.value.fechaInicial, 'yyyy-MM-dd'),
        "fechaFinal": this.datePipe.transform(this.monitorSaldosForm.value.fechaFinal, 'yyyy-MM-dd')
      }
      try {
        const response = await this.serviceGo.consultar(datosEnviar);
        if (response) {
          this.resultRequest(response)
        }
      } catch (error) {
        console.log("Ocurrio un error en la consulta de datos....");
      }
      // Esto va en la consulta
      this.consulta = true
      this.banderaHasRows = true;
      this.globals.loaderSubscripcion.emit(false);
      
    
  }


  /**
   * Saltar a otra pagina
   * @param datos 
   */
  tarjetas(datos: any) {
    var datConsulta = {
      codCliente: this.datospersonales.bucCliente,
      estatusContrato : this.datospersonales.descEstatus,
      razonSocial : this.datospersonales.razonSocial,
      ctaEje : this.datospersonales.cuentaEje,
      numContrato : this.datospersonales.numContrato,
      tipoFecha : this.monitorSaldosForm.value.tipoFecha,
      fechaInicial: this.monitorSaldosForm.value.fechaInicial,
      fechaFinal: this.monitorSaldosForm.value.fechaFinal,
      centroDistribucion: datos.centroDistribucion
    };

    localStorage.setItem('datSesionRemesa', JSON.stringify(datos));
    localStorage.setItem('numContrato', this.datospersonales.numContrato);
    localStorage.setItem('datConsulta', JSON.stringify(datConsulta) );
    if( datos.numRemesa !== '') {
      this.router.navigate(['/administracionStockSuperCuentaGo/consultaTarjetas']);
    }
  }



  limpiar() {
    this.monitorSaldosForm = this.initializeForm();
    /** Funcion para el onchange de los inpust dates */
    this.createSubscriptionsToDatesInputs();
    this.consulta = false;
    this.banderaHasRows = false;

    // Eliminamos la clave de la sesion usados en este formulario
    localStorage.removeItem('datConsulta');
    localStorage.removeItem('datSesionRemesa');
    localStorage.removeItem('numContrato');

    this.limpiarContrato();    
  }

  /**
   * 
   * @Description Metodo para puros numeros
   */
  numerico(event: KeyboardEvent) { this.fc.numberOnly(event); }



  /**
   * @description evento para el evento de pegar en un input
   */
  onPaste(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let i = 0; i < textPasted.length; i++) {
      if (!this.fc.numberOnlyForPasteEvent(textPasted[i].charCodeAt(0))) {
        i = textPasted.length;
        flag = false;
      }
    }
    return flag;
  }

  disableEvent(event: any) {
    event.preventDefault();
    return false;
  }

  /**
   * Evento para poder validar que el campo solo
   * se puedan ingresar alphabeto, numeros
   */
  eveValidate(event: KeyboardEvent) {
    this.fc.onlyAlphabeticEspe(event);
  }


  /**
   * Evento para al momento de realizar el pegado
   * en cualquier input este evento no ocurra
   */
  eventoOnPasteBlock(event: ClipboardEvent) {
    return false;
  }

  /**
  * Evento para el momento de seleccionar
  * una opcion del input type radio
  */
  onEventClickRadioButton(value: any, centerId: any) {
    this.selKeyRemesa = value;
    this.selCenterId = centerId;
  }

  validarCheck() {
    var continua = true;
    if( this.selKeyRemesa ==='') {
      continua = false;
      this.openModalError('',
        this.translate.instant('adminStock.mensaje.seleccionar'),
        'error'
      );
    }
    return continua;
  }

  aceptRemesa() {
    if(!this.validarCheck() ) {
      return;
    }
    console.log('Entramos al elemento...........');
    const dialogo = this.dialog.open(
      ModalInfoComponent, {
        data: new ModalInfoBeanComponents(
          "Remesa", 
          "Desea agregar la remesa", 
          "yesNo"
        ), hasBackdrop: true
      }
    );
    dialogo.afterClosed().subscribe((result: string) => {
      if (result === 'si') {
        this.callAceptRemesa();
      }
    });
  }

  async callAceptRemesa() {
    const datosEnviar = this.getDatosEnviar();
    var mensaje = 'administracionStockSuperCuentaGo.mensaje.aceptar.aceptarKO';
    var codError = 'Error';
    var tpError = 'error';
    try {
      await this.serviceGo.aceptRemesa(datosEnviar).then((data)=> {
        console.log( data );
        if (data !== null) {
          if( data.responseCode === 'OK00000') {
            mensaje = 'administracionStockSuperCuentaGo.mensaje.aceptar.aceptarOK';
            codError = 'Info';
            tpError = 'info';
          } else {
            if( data.responseCode === 'LME0002' && data.description !== undefined) {
              mensaje = data.description;
            }
            codError = 'Error';
            tpError = 'error';
          }

          this.openModalError(
            codError, this.translate.instant( mensaje ), tpError
          );
        }
      });
      
    } catch (error) {
      console.log("Ocurrio un error en la consulta de datos....");
    }
    this.globals.loaderSubscripcion.emit(false);
    
  }


  getDatosEnviar() {
    return {
      "centroDistribucion": this.selCenterId,
      "numRemesa": this.selKeyRemesa,
      "statusInfo.statusCode": this.datospersonales.estatusTarjeta,
      "numContrato": this.datospersonales.numContrato
    }
  }


  cancelRemesa() {
    if(!this.validarCheck() ) {
      return;
    }
    const dialogo = this.dialog.open(
      ModalInfoComponent, {
        data: new ModalInfoBeanComponents(
          this.translate.instant('adminSuperGo.cancelar.remesa'), 
          this.translate.instant('adminSuperGo.cancelar.remesa.pregunta'), 
          "yesNo"
        ), hasBackdrop: true
      }
    );
    dialogo.afterClosed().subscribe((result: string) => {
      if (result === 'si') {
        this.callCancelRemesa();
      }
    });
  }


  async callCancelRemesa() {
    const datosEnviar = this.getDatosEnviar();
    var mensaje = 'administracionStockSuperCuentaGo.mensaje.cancelar.remesaKO';
    var codError = 'Error';
    var tpError = 'error';
    try {
      await this.serviceGo.cancelRemesa(datosEnviar).then((data)=>{
        if (data !== null) {
          if( data.responseCode === 'OK00000') {
            mensaje = 'administracionStockSuperCuentaGo.mensaje.cancelar.remesaOK';
            codError = 'Info';
            tpError = 'info';
          } else {
            if( data.responseCode === 'LME0002' && data.description !== undefined) {
              mensaje = data.description;
            }
            codError = 'Error';
            tpError = 'error';
          }

          this.openModalError(
            codError, this.translate.instant( mensaje ), tpError
          );
        }
      });
      
    } catch (error) {
      console.log("Ocurrio un error en la consulta de datos....");
    }
    this.globals.loaderSubscripcion.emit(false);
    
  }
}
