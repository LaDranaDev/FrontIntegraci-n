import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import {
  ExportReportParam,
  GraficaEstatusClienteParametrizadaService,
} from 'src/app/services/control-volumen-operativo/grafica-estatus-cliente-parametrizada.service';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';
import { ComunesService } from 'src/app/services/comunes.service';
import { format, parse } from 'date-fns';
import { animate } from '@angular/animations';

@Component({
  selector: 'app-grafica-estatus-cliente-parametrizada',
  templateUrl: './grafica-estatus-cliente-parametrizada.component.html',
  styleUrls: ['./grafica-estatus-cliente-parametrizada.component.css'],
})
export class GraficaEstatusClienteParametrizadaComponent
  implements OnInit, OnDestroy {
  buscarFechaNg: boolean = false;
  resultado: any;
  setFilterBy: string = '';
  titleRow = '';
  chart = new Chart('chartBuzonAnual', {
    type: 'horizontalBar',
    data: {
      labels: [],
      datasets: [],
    },
  });
  /**
   * Atributo que contiene la configuracion del calendario
   * @type {Partial<BsDatepickerConfig>}
   * @memberof ArchivosConsultaComponent
   */
  datePickerConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-red',
    showWeekNumbers: false,
    isDisabled: true,
    adaptivePosition: true
  };
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinks: boolean = true;
  showCharParams: boolean = false;
  showDirectionLinks: boolean = true;
  /** Variables para mostrar el boton o no de exportar*/
  banderaBtnExportar: boolean = true;
  /**
   * @description Formulario para la busqueda de paises
   * @type {FormGroup}
   * @memberOf GestionPaisesComponent
   */
  graficoEstatusClienteForm!: FormGroup;
  /**
   * Datos para llenar la tabla de paises
   */
  // tabla:GraficaEstatusRespuesta[]=[];
  content: any;
  datos: any[] = [];
  /** Objeto de paises para inicializar busqueda */
  estatusClientePara = {
    codigoCliente: '',
    fechaInicio: '',
    fechaFin: '',
    idStatus: '',
    diaParam: '',
    tipoGrafica: '',
    busquedaFecha: false,
  };
  /**
   * @description Objeto para el evento de paginacion
   * y ademas contiene el parametro a buscar
   * @type {IPaginationRequest}
   * @memberof ParametrosComponent
   */
  objPageable: IPaginationRequest;
  disabledInputDate = true;
  titleGraph = '';
  clickSuscliption: Subscription | undefined;
  clickSuscliptionGraph: Subscription | undefined;
  usuarioActual: string | null = '';
  result: any;
  fechaActual: Date;

  constructor(
    private formBuilder: FormBuilder,
    /** */
    public graficaEstatusClienteParamService: GraficaEstatusClienteParametrizadaService,
    private globals: Globals,
    public dialog: MatDialog,
    private fc: FuncionesComunesComponent,
    public datePipe: DatePipe,
    private transtaleService: TranslateService,
    private comunService: ComunesService
  ) {
    this.usuarioActual = localStorage.getItem('UserID');
    this.fechaActual = new Date();
    this.buildForm();
  }

  async ngOnInit(): Promise<void> {
    this.clickSuscliption = this.comunService.clickAtion.subscribe(
      async (resp: any) => {
        const { codeMenu } = resp;
        if (codeMenu === 3) {
          this.onClickClean();
          /**Nos trae los Estatus */
          await this.getEstatus();
          /** Se realizan las suscripciones a los change de los datepickers */
          this.validInputDtaes();
        }
      }
    );
    this.clickSuscliptionGraph = this.comunService.clickReloadGp.subscribe((resp: any) => {
      try {
        if (this.setFilterBy === 'DIA') {
          this.titleRow = this.transtaleService.instant("pantalla.controlVolumenOperativo.graficaEstatusClienteParametrizada.dia");
        } else if (this.setFilterBy === 'MES') {
          this.titleRow = this.transtaleService.instant("pantalla.controlVolumenOperativo.graficaEstatusClienteParametrizada.mes");
        } else {
          this.titleRow = this.transtaleService.instant("pantalla.controlVolumenOperativo.graficaEstatusClienteParametrizada.anio");
        }
        this.createChart(this.result);
      } catch (error) {
      }
    });
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
    this.clickSuscliptionGraph?.unsubscribe();
  }
  /**
   * @descripcion Metodo para poder obtener el listado inicial de los parametros
   *
   * @param objPaginacion objeto que contiene las propiedades de paginacion y busqueda
   */

  resultRequest(result: any): void {
    this.datos = result;
  }

  buildForm(): void {
    /** Se inicializa el formulario graficoEstatusClienteForm */
    this.graficoEstatusClienteForm = this.formBuilder.group({
      /** Se inicializa el formulario para validar el search */
      codigoCliente: [''],
      dia: [false],
      mes: [false],
      anio: [false],
      diasParame: [''],
      buscarFecha: [true],
      fechaInicio: [new Date()],
      fechaFin: [new Date()],
      estatus: [''],
    });
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
    sugerencia: string
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

  get formControlGraficoEstatusCliente() {
    return this.graficoEstatusClienteForm.controls;
  }

  onClickClean() {
    this.showCharParams = false;
    this.buildForm();
    this.validInputDtaes();
    this.chart.destroy();
    this.datos = [];
  }

  public async eventoConsultar(): Promise<void> {
    if (!this.formValid()) return;

    try {

      const dateInit =
        typeof this.graficoEstatusClienteForm.value?.fechaInicio === 'string'
          ? parse(
            this.graficoEstatusClienteForm.value?.fechaInicio,
            'd/MM/yyyy',
            new Date()
          )
          : this.graficoEstatusClienteForm.value?.fechaInicio;
      const dateEnd =
        typeof this.graficoEstatusClienteForm.value?.fechaFin === 'string'
          ? parse(
            this.graficoEstatusClienteForm.value?.fechaFin,
            'd/MM/yyyy',
            new Date()
          )
          : this.graficoEstatusClienteForm.value?.fechaFin;

      const { banderaValiddaciones, mensajeError } = this.validaciones(dateInit, dateEnd);

      if (!banderaValiddaciones) {
        return this.open(
          this.transtaleService.instant('pantalla.archivo.consulta.msjERRTitulo'),
          this.transtaleService.instant(mensajeError),
          'alert',
          '',
          ''
        );
      }

      const busquedaGraEstCli = {
        codigoCliente:
          this.graficoEstatusClienteForm.value.codigoCliente.toString(),
        fechaInicio: dateInit !== undefined ? format(new Date(dateInit), 'dd/MM/yyyy') : '',
        fechaFin: dateEnd !== undefined ? format(new Date(dateEnd), 'dd/MM/yyyy') : '',
        idStatus: this.graficoEstatusClienteForm.value.estatus.toString(),
        diaParam: this.graficoEstatusClienteForm.value.diasParame
          ? this.graficoEstatusClienteForm.value.diasParame.toString()
          : '',
        tipoGrafica: this.setFilterBy,
        busquedaFecha: this.graficoEstatusClienteForm.value.buscarFecha,
      };
      const getDataGraph =
        await this.graficaEstatusClienteParamService.getBusquedaEstatusClientePara(
          busquedaGraEstCli
        );
      this.result = getDataGraph;
      if (getDataGraph.length <= 0) {
        this.open(
          this.transtaleService.instant(
            'modals.controlVolumenOperativo.graficaEstatusClienteParametrizada.messajeSantander'
          ),
          this.transtaleService.instant(
            'modal.controlVolumenOperativo.graficaEstatusClienteParametrizada.noData'
          ),
          'info',
          '',
          ''
        );
        this.globals.loaderSubscripcion.emit(false);
        return;
      }
      if (this.setFilterBy === 'DIA') {
        this.titleRow = this.transtaleService.instant("pantalla.controlVolumenOperativo.graficaEstatusClienteParametrizada.dia");
      } else if (this.setFilterBy === 'MES') {
        this.titleRow = this.transtaleService.instant("pantalla.controlVolumenOperativo.graficaEstatusClienteParametrizada.mes");
      } else {
        this.titleRow = this.transtaleService.instant("pantalla.controlVolumenOperativo.graficaEstatusClienteParametrizada.anio");
      }
      this.resultRequest(getDataGraph);
      this.createChart(getDataGraph);
      this.showCharParams = true;
      this.globals.loaderSubscripcion.emit(false);
    } catch (e) {
      this.datos = [];
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.transtaleService.instant('modal.msjERRGEN0001Titulo'),
        this.transtaleService.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.transtaleService.instant('modal.msjERRGEN0001Codigo'),
        this.transtaleService.instant('modal.msjERRGEN0001Sugerencia')
      );
    }
  }

  validaciones(fechaIni: Date, fechaFin: Date): any {
    let banderaValiddaciones = true;
    let mensajeError = '';
    const dateNow = new Date();
    if (fechaIni !== undefined && fechaFin !== undefined) {
      if (
        fechaFin > dateNow ||
        fechaIni > dateNow
      ) {
        banderaValiddaciones = false;
        mensajeError =
          'pantalla.controlVolumenOperativo.graficaEstatusCliente.fechaDia';
      } else if (fechaIni > fechaFin) {
        banderaValiddaciones = false;
        mensajeError =
          'pantalla.controlVolumenOperativo.graficaEstatusCliente.fechaInicioMayorFechaFin';
      }
    }
    return { banderaValiddaciones, mensajeError };
  }

  private async getEstatus(): Promise<void> {
    try {
      const getEstatus =
        await this.graficaEstatusClienteParamService.getListaEstatus();
      this.resultado = getEstatus;
      this.globals.loaderSubscripcion.emit(false);
    } catch (e) {
      /** Se establece el page en el 0 */
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.transtaleService.instant('modal.msjERRGEN0001Titulo'),
        this.transtaleService.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.transtaleService.instant('modal.msjERRGEN0001Codigo'),
        this.transtaleService.instant('modal.msjERRGEN0001Sugerencia')
      );
    }
  }

  async exportReport(): Promise<void> {
    try {
      const getFormValue = this.graficoEstatusClienteForm.getRawValue();
      const dateInit =
        typeof this.graficoEstatusClienteForm.value?.fechaInicio === 'string'
          ? parse(
            this.graficoEstatusClienteForm.value?.fechaInicio,
            'd/MM/yyyy',
            new Date()
          )
          : this.graficoEstatusClienteForm.value?.fechaInicio;
      const dateEnd =
        typeof this.graficoEstatusClienteForm.value?.fechaFin === 'string'
          ? parse(
            this.graficoEstatusClienteForm.value?.fechaFin,
            'd/MM/yyyy',
            new Date()
          )
          : this.graficoEstatusClienteForm.value?.fechaFin;
      const formatDateInit = dateInit !== undefined ? format(new Date(dateInit), 'dd/MM/yyyy') : ''
      const formatDateEnd = dateEnd !== undefined ? format(new Date(dateEnd), 'dd/MM/yyyy') : '';
      const request: ExportReportParam = {
        filtrosBusqueda: {
          codigoCliente: getFormValue.codigoCliente,
          fechaInicio: formatDateInit,
          fechaFin: formatDateEnd,
          idStatus: getFormValue.estatus,
          diaParam: getFormValue.diasParame,
          tipoGrafica: this.setFilterBy,
          busquedaFecha: getFormValue.buscarFecha,
        },
        usuario: this.usuarioActual!,
      };
      const getReport =
        (await this.graficaEstatusClienteParamService.exportReport(
          request
        )) as { data: string; code: string; message: string };

      if (getReport.data) {
        /** Se manda la informacion para realizar la descarga del archivo */
        this.fc.convertBase64ToDownloadFileInExport(getReport);
        this.globals.loaderSubscripcion.emit(false);
      } else {
        if (getReport.code === '404') {
          this.open(
            this.transtaleService.instant('modal.msjERRGEN0001Titulo'),
            this.transtaleService.instant('modal.msjERRGEN0001Observacion'),
            'error',
            this.transtaleService.instant(getReport.code),
            this.transtaleService.instant('modal.msjERRGEN0001Sugerencia')
          );
          this.globals.loaderSubscripcion.emit(false);
        } else {
          this.open(
            this.transtaleService.instant('modal.msjERRGEN0001Titulo'),
            this.transtaleService.instant('modal.msjERRGEN0001Observacion'),
            'error',
            this.transtaleService.instant('modal.msjERRGEN0001Codigo'),
            this.transtaleService.instant('modal.msjERRGEN0001Sugerencia')
          );
          this.globals.loaderSubscripcion.emit(false);
        }
      }
    } catch (error) {
      this.open(
        this.transtaleService.instant('modal.msjERRGEN0001Titulo'),
        this.transtaleService.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.transtaleService.instant('modal.msjERRGEN0001Codigo'),
        this.transtaleService.instant('modal.msjERRGEN0001Sugerencia')
      );
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  validInputDtaes(): void {
    const searchDateValue =
      this.graficoEstatusClienteForm.get('buscarFecha')?.value;
    if (!searchDateValue) {
      this.graficoEstatusClienteForm.get('fechaInicio')?.disable();
      this.graficoEstatusClienteForm.get('fechaFin')?.disable();
      this.disabledInputDate = true;
    } else {
      this.graficoEstatusClienteForm.get('fechaInicio')?.setValue('');
      this.graficoEstatusClienteForm.get('fechaInicio')?.enable();
      this.graficoEstatusClienteForm.get('fechaFin')?.setValue('');
      this.graficoEstatusClienteForm.get('fechaFin')?.enable();
      this.disabledInputDate = false;
    }
    this.graficoEstatusClienteForm
      .get('fechaInicio')
      ?.setValue(new Date());
    this.graficoEstatusClienteForm.get('diasParame')?.disable();
    this.graficoEstatusClienteForm
      .get('fechaFin')
      ?.setValue(new Date());
  }

  formValid(): boolean {
    const valueForm = this.graficoEstatusClienteForm.value as {
      estatus: string;
      fechaInicio: string;
      fechaFin: string;
    };
    const dateInit = valueForm.fechaInicio;
    const dateEnd = valueForm.fechaFin;
    if (!valueForm.estatus) {
      this.open(
        this.transtaleService.instant(
          'modals.controlVolumenOperativo.graficaEstatusClienteParametrizada.messajeSantander'
        ),
        this.transtaleService.instant(
          'modals.controlVolumenOperativo.graficaEstatusClienteParametrizada.estatusObligatorio'
        ),
        'alert',
        '',
        ''
      );
      return false;
    }
    if (!this.setFilterBy) {
      this.open(
        this.transtaleService.instant(
          'modals.controlVolumenOperativo.graficaEstatusClienteParametrizada.messajeSantander'
        ),
        this.transtaleService.instant(
          'modals.controlVolumenOperativo.graficaEstatusClienteParametrizada.filter'
        ),
        'alert',
        '',
        ''
      );
      return false;
    }
    if (dateInit > dateEnd) {
      this.open(
        this.transtaleService.instant(
          'modals.controlVolumenOperativo.graficaEstatusClienteParametrizada.messajeSantander'
        ),
        this.transtaleService.instant(
          'modals.controlVolumenOperativo.graficaEstatusClienteParametrizada.dateMayor'
        ),
        'alert',
        '',
        ''
      );
      return false;
    }
    return true;
  }

  setFilter(filter: string, setParametrics?: boolean): void {
    this.setFilterBy = filter;
    if (setParametrics) {
      this.graficoEstatusClienteForm.get('diasParame')?.setValue('1');
      this.graficoEstatusClienteForm.get('diasParame')?.enable();
    } else {
      this.graficoEstatusClienteForm.get('diasParame')?.setValue('');
      this.graficoEstatusClienteForm.get('diasParame')?.disable();
    }
  }

  createChart(
    dataToShow: { fecha: string; totalArchivos: number }[]
  ): void {
    let tipo = "";
    let periodo = this.transtaleService.instant("SinPeriodo");
    let al = this.transtaleService.instant("AL")

    this.validarChart();

    if (this.setFilterBy === "DIA") {
      tipo = this.transtaleService.instant("dia");
    } else if (this.setFilterBy === "MES") {
      tipo = this.transtaleService.instant("mes");
    } else if (this.setFilterBy === "ANIO") {
      tipo = this.transtaleService.instant("anual");
    }
    if (this.graficoEstatusClienteForm.value?.fechaInicio && this.graficoEstatusClienteForm.value?.fechaFin) {
      const fechaIni = format(new Date(this.graficoEstatusClienteForm.value?.fechaInicio), 'dd/MM/yyyy');
      const fechaFin = format(new Date(this.graficoEstatusClienteForm.value?.fechaFin), 'dd/MM/yyyy');

      if (this.graficoEstatusClienteForm.value?.buscarFecha) {
        periodo = fechaIni + " " + al + " " + fechaFin;
      }
    }
    const labesl = dataToShow.map((l) => l.fecha);
    const totalData = dataToShow.map((ta) => ta.totalArchivos);
    this.chart = new Chart('chartStatusParametrics', {
      type: 'horizontalBar',
      data: {
        labels: labesl,

        datasets: [
          {
            label: this.setFilterBy === 'DIA' ? this.transtaleService.instant("pantalla.controlVolumenOperativo.graficaEstatusClienteParametrizada.dia") : this.setFilterBy === 'MES' ? this.transtaleService.instant("pantalla.controlVolumenOperativo.graficaEstatusClienteParametrizada.mes") : this.transtaleService.instant("pantalla.controlVolumenOperativo.graficaEstatusClienteParametrizada.anio"),
            data: totalData,
            borderColor: '#FF7A96',
            type: 'horizontalBar',
            fill: false,
            backgroundColor: '#EAC3CC',
            borderWidth: 1,
          },
        ],
      },
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
          text: tipo + " " + periodo,
        },
      },
    });
    this.chart.update();
  }

  validarChart() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
