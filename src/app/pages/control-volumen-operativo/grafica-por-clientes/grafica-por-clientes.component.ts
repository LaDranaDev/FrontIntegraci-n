import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IGraficaCliente } from 'src/app/interface/graficaClienteRespuesta.interface';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { GraficaClienteService } from 'src/app/services/control-volumen-operativo/grafica-cliente.service';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';
import { format, parse } from 'date-fns';
import { ComunesService } from 'src/app/services/comunes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-grafica-por-clientes',
  templateUrl: './grafica-por-clientes.component.html',
  styleUrls: ['./grafica-por-clientes.component.html'],
})
export class GraficaPorClientesComponent implements OnInit {
  /** Variable para indicar en que pagina se encuentra */
  page: number = 0;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 10;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinks7: boolean = true;
  showDirectionLinks7: boolean = true;
  titleGraph: string;
  //Variable para los graficas
  graficas = 1;
  /** Variables para la obtencion de fecha inicial y final cuando cambie el date*/
  fechaInicialChange = '';
  fechaFinalChange = '';

  /**Función para que solo se le permita al usuario elegir una sola opción*/
  radioTitle: string;
  radioItems: Array<string>;
  model = { option: 'option2' };

  /**
   * Datos para llenar la tabla de graficas
   */
  tablagraficas: IGraficaCliente[] = [];
  banderaBtnExportar: boolean = true;
  /**
   * @description Formulario para la busqueda de graficas
   * @type {FormGroup}
   * @memberOf GraficaPorClienteComponent
   */
  gestionGraficasForm!: FormGroup;

  /** variable de control para saber si se realizo el submit de la consulta a los graficas */
  submittedSearchgraficas = false;
  pageSize: number = 0;
  tabla: any[] = [];
  returnedArray!: any;
  tituloCol: any;
  grafica = {
    codigoCliente: '',
    radiobutton: '',
    fechainicio: '',
    fechaFin: '',
  };

  chart = new Chart('chartBuzonAnual', {
    type: 'horizontalBar',
    data: {
      labels: [],
      datasets: [],
    },
  });
  /**
   * @description Objeto para el evento de paginacion
   * con el parametro a buscar
   * @type {IPaginationRequest}
   * @memberof ParametrosComponent
   */
  objPagination: IPaginationRequest;

  /**
   * @description claveIdentificacion del cliente
   * @type {string}
   * @memberOf GraficaPorClienteComponent
   */
  codigoCliente: String = '';

  /**
   * @description Nombre de usuario de la sesión actual.
   * Este usuario se tendria que sustituir por el de la sesion actual.
   * @type {string}
   * @memberOf GestionComprobantesComponent
   */
  usuarioActual: string | null = '';
  clickSuscliption: Subscription | undefined;
  clickSuscliptionGraph: Subscription | undefined;
  result: any;

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public graficaService: GraficaClienteService,
    private globals: Globals,
    public datePipe: DatePipe,
    private fc: FuncionesComunesComponent,
    private translate: TranslateService,
    private comunService: ComunesService
  ) {
    /** Funcion para el onchange de los inpust dates */
    this.usuarioActual = localStorage.getItem('UserID');
    //Se inicializa el objeto
    this.objPagination = {
      page: this.page,
      size: this.rowsPorPagina,
      ruta: '',
    };
    //Valores para los botones de radio
    this.radioItems = ['Operaciones', 'Monto'];
  }

  /**
   * Metodo para poder inicializar el formulario
   */
  private initializeForm() {
    this.model.option = '';
    return this.formBuilder.group({
      codigoCliente: [''],
      radiobutton: [''],
      fechaInicio: [new Date()],
      fechaFin: [new Date()],
    });
  }

  ngOnInit(): void {
    this.clickSuscliption = this.comunService.clickAtion.subscribe(
      async (resp: any) => {
        const { codeMenu } = resp;
        if (codeMenu === 1) {
          this.eventClean();
        }
      }
    );
    this.clickSuscliptionGraph = this.comunService.clickReloadGp.subscribe((resp: any) => {
      try {
        this.createChart(this.result.listaDetalle);
        this.tituloCol = this.model.option === 'Operaciones' ? this.translate.instant("pantalla.controlVolumenOperativo.graficaArchivoCliente.operaciones") : this.translate.instant("pantalla.controlVolumenOperativo.graficaArchivoCliente.monto");
      } catch (error) {
      }
    });
    this.gestionGraficasForm = this.initializeForm();
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }

  /**
   * @descripcion Metodo para poder generar y regresar el objeto con la paginacion
   *
   * @param numPage valor para indicar el numero de la pagina
   * @param totalItemsPage valor para indicar el total de elementos que se mostraran en la pagina
   */
  private fillObjectPag(numPage: number, totalItemsPage: number) {
    this.objPagination.page = numPage;
    this.objPagination.size = totalItemsPage;
    return this.objPagination;
  }

  /**
   * @descripcion Metodo para poder obtener el listado inicial de los parametros
   *
   * @param objPaginacion objeto que contiene las propiedades de paginacion y busqueda
   */
  private async getConsultaGraficas() {
    try {
      await this.graficaService
        .getListaGraficas(this.grafica)
        .then(async (result: any) => {
          this.resultRequest(result);
          this.globals.loaderSubscripcion.emit(false);
        });
    } catch (e) {
      this.tabla = [];
      /** Se establece el page en el 0 */
      this.page = 0;
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant('modal.msjERRGEN0001Sugerencia')
      );
    }
  }

  /**
   * Metodo getter para la validacion de formulario
   * en la vista
   */
  get formControlSearchgraficas() {
    return this.gestionGraficasForm.controls;
  }

  /**
   * Metodo que se ejecutara al realizar click
   * sobre el boton de clean
   */
  eventClean() {
    /** Se reinicia el formulario de busqueda */
    this.gestionGraficasForm = this.initializeForm();
    this.tabla = [];
    this.page = 0;
    /* this.getConsultaGraficas(this.fillObjectPag(this.page, this.rowsPorPagina)); */
  }

  async eventoConsultar(): Promise<void> {
    try {
      const codigoCliente = this.gestionGraficasForm.value.codigoCliente;
      const optionByOpetarions =
        this.model.option === 'Operaciones' ? true : false;
      const dateInit =
        typeof this.gestionGraficasForm.value?.fechaInicio === 'string'
          ? parse(
            this.gestionGraficasForm.value?.fechaInicio,
            'd/MM/yyyy',
            new Date()
          )
          : this.gestionGraficasForm.value?.fechaInicio;
      const dateEnd =
        typeof this.gestionGraficasForm.value?.fechaFin === 'string'
          ? parse(
            this.gestionGraficasForm.value?.fechaFin,
            'd/MM/yyyy',
            new Date()
          )
          : this.gestionGraficasForm.value?.fechaFin;
      const formatDateInit = format(new Date(dateInit), 'dd/MM/yyyy')
      const formatDateEnd = format(new Date(dateEnd), 'dd/MM/yyyy');
      const grafica = {
        codigoCliente: codigoCliente,
        monto: !optionByOpetarions,
        operaciones: optionByOpetarions,
        fechaInicio: formatDateInit,
        fechaFin: formatDateEnd,
      };
      this.page = 0;
      const getGraphData = await this.graficaService.getBusquedaGrafica(
        grafica,
        this.fillObjectPag(this.page, this.rowsPorPagina)
      );
      if (getGraphData.tituloGrafica) {
        this.result = getGraphData;
        this.resultRequest(getGraphData);
        this.createChart(getGraphData.listaDetalle);
      } else {
        this.gestionGraficasForm = this.initializeForm();
        this.open(
          this.translate.instant('menu.controlVolumenOperativo.graficaCliente'),
          this.translate.instant(
            'modal.controlVolumenOperativo.graficaEstatusClienteParametrizada.noData'
          ),
          'info',
          '',
          ''
        );
      }
      this.globals.loaderSubscripcion.emit(false);
    } catch (error) {
      this.gestionGraficasForm = this.initializeForm();
      this.open(
        this.translate.instant('menu.controlVolumenOperativo.graficaCliente'),
        this.translate.instant(
          'modal.controlVolumenOperativo.graficaEstatusClienteParametrizada.noData'
        ),
        'info',
        '',
        ''
      );
    }
    this.globals.loaderSubscripcion.emit(false);
  }

  resultRequest(result: any) {
    this.tabla = result.listaDetalle;
    this.titleGraph = result.tituloGrafica;
    this.tituloCol = this.model.option === 'Operaciones' ? this.translate.instant("pantalla.controlVolumenOperativo.graficaArchivoCliente.operaciones") : this.translate.instant("pantalla.controlVolumenOperativo.graficaArchivoCliente.monto");
    this.totalElements = result.totalElements;
    if (this.totalElements > 0) {
      this.banderaHasRows = true;
    } else {
      this.banderaHasRows = false;
    }
  }

  /**
   * @description Evento de click al momento de usar la paginacion
   * @memberOf GraficaPorClienteComponent
   */
  async onPageChanged(event: any) {
    this.page = 0;
    this.page = event.page - 1;
    /** Se crea el objeto con la paginacion */
    const claveIdentificacion =
      this.gestionGraficasForm.value.claveIdentificacion;
    const nombre = this.gestionGraficasForm.value.nombre;
    const grafica = {
      codigoCliente: this.codigoCliente,
    };
    this.tabla = [];
    /** Validacion para determinar si se uso el search antes de usar el paginado */
    if (claveIdentificacion === '' && nombre === '') {
      await this.getConsultaGraficas();
    } else {
      this.graficaService
        .getBusquedaGrafica(
          grafica,
          this.fillObjectPag(this.page, this.rowsPorPagina)
        )
        .then((result: any) => {
          this.resultRequest(result);
          this.globals.loaderSubscripcion.emit(false);
        });
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
    type: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    code: string,
    sugerencia: string,
    englishType?: boolean
  ) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        contenido,
        type,
        code,
        sugerencia,
        englishType
      ), hasBackdrop: true
    });
  }

  /**
   *
   * Abrir el modal de error
   */

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
    date.setMonth(Number(partsDate[1]) - 1 + 6);
    date.setFullYear(Number(partsDate[2]) - 1);
    /** Se regresa la fecha maxima con formato de fecha */
    return date;
  }

  /**
   * Atributo que contiene la configuracion del calendario
   * @type {Partial<BsDatepickerConfig>}
   * @memberof ArchivosConsultaComponent
   */
  datePickerConfig: Partial<BsDatepickerConfig> = Object.assign(
    {},
    {
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-red',
      showWeekNumbers: false,
      adaptivePosition: true
    }
  );

  /**
   * Funcion para que la fecha no sea mayor a la actual
   */
  fechaNoMayorActual() {
    const fechaIncio = typeof this.gestionGraficasForm.value?.fechaInicio === 'string' 
      ? parse(this.gestionGraficasForm.value?.fechaInicio,'d/MM/yyyy', new Date()) 
      : this.gestionGraficasForm.value?.fechaInicio;
    const fechaFin =  typeof this.gestionGraficasForm.value?.fechaFin === 'string'
        ? parse(this.gestionGraficasForm.value?.fechaFin,'d/MM/yyyy',new Date())
        : this.gestionGraficasForm.value?.fechaFin;

    var fechaSelIni = formatDate(fechaIncio, 'dd/MM/yyyy', 'en-MX');
    var fechaSelFin = formatDate(fechaFin, 'dd/MM/yyyy', 'en-MX');
    var fechaDia = formatDate(new Date(), 'dd/MM/yyyy', 'en-MX');

    if (fechaSelIni > fechaSelFin) {
      this.open(
        this.translate.instant('cuentas.ordenantes.msjINF00010Titulo'),
        this.translate.instant('pantalla.graficaBuzon.validacion.fechas.Observacion'),
        'alert','',''
      );
      this.eventClean();
    } else if (fechaSelFin > fechaDia || fechaSelIni > fechaDia) {
      this.open(
        this.translate.instant(
          'modals.controlVolumenOperativo.graficaEstatusClienteParametrizada.messajeSantander'
        ),
        this.translate.instant('pantalla.controlVolumenOperativo.graficaEstatusCliente.fechaDia'),
        'alert',
        '',
        ''
      );
      this.eventClean();
    } else {
      this.eventoConsultar();
    }
  }

  /**
   * Función que valida y muestra mensaje individual
   * de cada campo  obligatorio
   */
  validaCadaCampoObligatorio() {
    var codigoCliente = this.gestionGraficasForm.get('codigoCliente')?.value;
    var radiobutton = this.model.option;
    var fechaInicio = this.gestionGraficasForm.get('fechaInicio')?.value;
    var fechaFin = this.gestionGraficasForm.get('fechaFin')?.value;
    if (codigoCliente === '') {
      this.open(
        this.translate.instant(
          'modals.controlVolumenOperativo.graficaEstatusClienteParametrizada.messajeSantander'
        ),
        this.translate.instant(
          'pantalla.grafica.por.cliente.codigoClienteObligatorio'
        ),
        'alert',
        '',
        ''
      );
    } else if (radiobutton === '') {
      this.open(
        this.translate.instant(
          'modals.controlVolumenOperativo.graficaEstatusClienteParametrizada.messajeSantander'
        ),
        '',
        'alert',
        '',
        this.translate.instant(
          'pantalla.graficaBuzon.validacion.filtroObligatorio.Observacion'
        ),
        true
      );
    } else if (fechaInicio === '') {
      this.open(
        this.translate.instant(
          'modals.controlVolumenOperativo.graficaEstatusClienteParametrizada.messajeSantander'
        ),
        this.translate.instant(
          'pantalla.grafica.por.cliente.fechaInicioObligatoria'
        ),
        'alert',
        '',
        ''
      );
    } else if (fechaFin === '') {
      this.open(
        this.translate.instant(
          'modals.controlVolumenOperativo.graficaEstatusClienteParametrizada.messajeSantander'
        ),
        this.translate.instant(
          'pantalla.grafica.por.cliente.fechaFinObligatoria'
        ),
        'alert',
        '',
        ''
      );
    } else {
      this.fechaNoMayorActual();
    }
  }

  /**
   * @description evento que se ejecutara para solo permitir valores
   * numericos
   */
  eventOnKeyOnlyNumbers(event: any) {
    this.fc.validateKeyCode(event);
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

  createChart(dataToShow: { nombreBUC: string; total: number }[]): void {
    const labesl = dataToShow.map((l) => l.nombreBUC);
    const totalData = dataToShow.map((ta) => ta.total);

    this.validarChart();

    this.chart = new Chart('chartClient', {
      type: 'horizontalBar',
      options: {
        aspectRatio: 2.5,
        scales: {
          xAxes: [{
            position: 'top'
          }]
        },
        legend: {
          position: 'bottom',
          onClick: (e) => e.stopPropagation()
        },
        title: {
          display: true,
          text: this.titleGraph,
        },
      },
      data: {
        labels: labesl,
        datasets: [
          {
            label: this.model.option === 'Operaciones' ? this.translate.instant("pantalla.controlVolumenOperativo.graficaArchivoCliente.numoperaciones") : this.translate.instant("pantalla.controlVolumenOperativo.graficaArchivoCliente.nummonto"),
            data: totalData,
            borderColor: '#FF7A96',
            type: 'horizontalBar',
            fill: false,
            backgroundColor: '#EAC3CC',
            borderWidth: 1,
          },
        ],
      },
    });
    this.chart.update();
  }

  async exportaExcel(): Promise<void> {
    const codigoCliente = this.gestionGraficasForm.value.codigoCliente;
    const optionByOpetarions =
      this.model.option === 'Operaciones' ? true : false;
    const dateInit =
      typeof this.gestionGraficasForm.value?.fechaInicio === 'string'
        ? parse(
          this.gestionGraficasForm.value?.fechaInicio,
          'd/MM/yyyy',
          new Date()
        )
        : this.gestionGraficasForm.value?.fechaInicio;
    const dateEnd =
      typeof this.gestionGraficasForm.value?.fechaFin === 'string'
        ? parse(
          this.gestionGraficasForm.value?.fechaFin,
          'd/MM/yyyy',
          new Date()
        )
        : this.gestionGraficasForm.value?.fechaFin;
    const formatDateInit = format(new Date(dateInit), 'dd/MM/yyyy')
    const formatDateEnd = format(new Date(dateEnd), 'dd/MM/yyyy');
    const request = {
      codigoCliente: codigoCliente,
      monto: !optionByOpetarions,
      operaciones: optionByOpetarions,
      fechaInicio: formatDateInit,
      fechaFin: formatDateEnd,
      user: this.usuarioActual
    };
    const dataToExport = await this.graficaService.getExcel(request);
    this.fc.convertBase64ToDownloadFileInExport(dataToExport);
    this.globals.loaderSubscripcion.emit(false);
  }

  validarChart() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

}
