import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { GraficaEstatusClienteService } from 'src/app/services/control-volumen-operativo/grafica-estatus-cliente.service';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { TranslateService } from '@ngx-translate/core';
import * as Chart from 'chart.js';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { format } from 'date-fns';
import { Subscription } from 'rxjs';
import { ComunesService } from 'src/app/services/comunes.service';

@Component({
  selector: 'app-grafica-estatus-cliente',
  templateUrl: './grafica-estatus-cliente.component.html',
  styleUrls: ['./grafica-estatus-cliente.component.css'],
})
export class GraficaEstatusClienteComponent implements OnInit {
  mostrarResultado: boolean = false;
  buscarFechaNg: boolean = true;

  submittedBuzonSearch = false;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinks: boolean = true;
  showDirectionLinks: boolean = true;
  banderaHasRows: boolean = false;
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
  datos: any;
  result: any;
  /** Objeto de paises para inicializar busqueda */
  estatusCliente = {
    idCliente: '',
    fechaIni: '',
    fechaFin: '',
  };
  /**
   * @description Objeto para el evento de paginacion
   * y ademas contiene el parametro a buscar
   * @type {IPaginationRequest}
   * @memberof ParametrosComponent
   */
  objPageable: IPaginationRequest;

  chart: any;
  chartFilter: any;
  showChartClient = false;
  fechaActual: Date;

  datePickerConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-red',
    showWeekNumbers: false,
    isDisabled: true,
    adaptivePosition: true
  };
  dataFilter: any[] = [];
  calendario = false;
  estatusFilter: string;
  usuarioActual: string | null = '';
  clickSuscliption: Subscription | undefined;
  clickSuscliptionGraph: Subscription | undefined;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private fc: FuncionesComunesComponent,
    private translate: TranslateService,
    public graficaEstatusClienteService: GraficaEstatusClienteService,
    private globals: Globals,
    public dialog: MatDialog,
    private comunService: ComunesService
  ) {
    this.usuarioActual = localStorage.getItem('UserID');
    this.fechaActual = new Date();
    this.graficoEstatusClienteForm = this.createForm();
  }

  ngOnInit(): void { 
    this.clickSuscliption = this.comunService.clickAtion.subscribe(
      async (resp: any) => {
        const { codeMenu } = resp;
        if (codeMenu === 2) {
          this.onClickClean();
          this.limpiarChart();
          this.showChartClient = false;
        }
      }
    );
    this.clickSuscliptionGraph = this.comunService.clickReloadGp.subscribe((resp: any) => {
      try {
        this.createChart();
      } catch (error) {
      }
    });
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
    this.clickSuscliptionGraph?.unsubscribe();
  }

  private createForm() {
    const day = this.fechaActual.getDate();
    const months = this.fechaActual.getMonth();
    const years = this.fechaActual.getFullYear();
    this.content = [];
    return this.formBuilder.group({
      /** Se inicializa el formulario para validar el search */
      codigoCliente: [''],
      buscarFecha: [this.buscarFechaNg],
      fechaInicio: new FormControl(
        { value: new Date(years, months, day), disabled: false },
        Validators.required
      ),
      fechaFin: new FormControl(
        { value: new Date(years, months, day), disabled: false },
        Validators.required
      ),
    });
  }

  resultRequest(mapaGrafica: any) {
    this.banderaHasRows = true;
    this.content = [];
    for (let key in mapaGrafica) {
      this.content = [
        ...this.content,
        { estatus: `${key}`, total: mapaGrafica[key] },
      ];
    }
    this.content.sort(function (a: any, b: any) {
      return a.estatus.localeCompare(b.estatus);
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

  onClickClean(isByFilter?: boolean) {
    if (!isByFilter) {
      this.submittedBuzonSearch = false;
      this.buscarFechaNg = true;
      this.graficoEstatusClienteForm.controls['fechaInicio'].enable();
      this.graficoEstatusClienteForm.controls['fechaFin'].enable();
      this.limpiarChart();
      this.banderaHasRows = false;
      this.graficoEstatusClienteForm = this.createForm();
    } else {
      this.showChartClient = false;
      this.chartFilter.destroy();
      this.eventoConsultar();
    }
  }

  public async eventoConsultar() {
    this.submittedBuzonSearch = true;

    if (this.graficoEstatusClienteForm.invalid) {
      return;
    }

    const {
      codigoCliente,
      fechaInicio = null,
      fechaFin = null,
    } = this.graficoEstatusClienteForm.value;
    try {
      const busquedaGraEstCli = {
        clienteCod: codigoCliente,
        fechaIni: fechaInicio,
        fechaFin: fechaFin,
      };
      const { banderaValiddaciones, mensajeError } =
        this.validaciones(busquedaGraEstCli);

      if (!banderaValiddaciones) {
        return this.open(
          this.translate.instant('pantalla.archivo.consulta.msjERRTitulo'),
          this.translate.instant(mensajeError),
          'alert',
          '',
          ''
        );
      }

      this.result =
        await this.graficaEstatusClienteService.getBusquedaEstatusCliente(
          busquedaGraEstCli
        );

      if (Object.keys(this.result.mapaGrafica).length === 0) {
        this.globals.loaderSubscripcion.emit(false);
        return this.open(
          this.translate.instant(
            'pantalla.controlVolumenOperativo.graficaEstatusCliente.title'
          ),
          this.translate.instant(
            'modal.controlVolumenOperativo.graficaEstatusClienteParametrizada.noData'
          ),
          'info',
          '',
          ''
        );
      }

      this.resultRequest(this.result.mapaGrafica);
      this.createChart();
      this.globals.loaderSubscripcion.emit(false);
    } catch (e) {
      this.datos = {};
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant('modal.msjERRGEN0001Sugerencia')
      );
    }
    this.submittedBuzonSearch = false;
    this.mostrarResultado = true;
  }

  goResultado(origen: any) {
    this.router.navigate(
      ['/controlVolumenOperativo/grafica-resultado/', origen],
      { queryParams: origen }
    );
  }

  async createChart() {

    this.validarChart();

    let nombre = this.translate.instant('Todos');
    let periodo =this.translate.instant('SinPeriodo');
    if (this.graficoEstatusClienteForm.value?.codigoCliente !== '') {
      nombre = this.result.clienteNom;
    }
    if (this.graficoEstatusClienteForm.value?.fechaInicio && this.graficoEstatusClienteForm.value?.fechaFin) {
      const fechaIni = format(new Date(this.graficoEstatusClienteForm.value?.fechaInicio), 'dd/MM/yyyy');
      const fechaFin = format(new Date(this.graficoEstatusClienteForm.value?.fechaFin), 'dd/MM/yyyy');

      if (this.graficoEstatusClienteForm.value?.buscarFecha) {
        periodo = this.translate.instant('PDD') + fechaIni + this.translate.instant('AL') + fechaFin;
      }
    }
    this.chart = new Chart('chartHistory', {
      type: 'horizontalBar',

      data: {
        labels: [],
        datasets: [],
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
          text: this.translate.instant('TOC')+":" + nombre + ' - ' + periodo,
        },
      },
    });

    let labels: string[] = [];
    let data: number[] = [];
    for (const item of this.content) {
      labels = [...labels, item.estatus];
      data = [...data, parseInt(item.total)];
    }

    this.chart.data.labels = labels;
    this.chart.data.datasets = [
      {
        label: this.translate.instant("pantalla.controlVolumenOperativo.graficaEstatusCliente.Estatus"),
        data,
        backgroundColor: 'red',
        borderColor: 'red',
        fill: false,
      },
    ];

    return this.chart.update();
  }

  activarInputFecha(event: any) {
    if (event.target.checked) {
      this.calendario = false;
      this.graficoEstatusClienteForm.controls['fechaInicio'].enable();
      this.graficoEstatusClienteForm.controls['fechaFin'].enable();
    } else {
      this.calendario = true;
      this.graficoEstatusClienteForm.controls['fechaInicio'].disable();
      this.graficoEstatusClienteForm.controls['fechaFin'].disable();
    }
  }

  limpiarChart() {
    this.content = [];
    if (this.chart) {
      this.chart.destroy();
    }
  }

  validaciones(request: any): any {
    let banderaValiddaciones = true;
    let mensajeError = '';
    const { fechaIni, fechaFin } = request;

    if (
      this.parseDate(fechaFin) > this.fechaActual.getTime() ||
      this.parseDate(fechaIni) > this.fechaActual.getTime()
    ) {
      banderaValiddaciones = false;
      mensajeError =
        'pantalla.controlVolumenOperativo.graficaEstatusCliente.fechaDia';
    } else if (this.parseDate(fechaIni) > this.parseDate(fechaFin)) {
      banderaValiddaciones = false;
      mensajeError =
        'pantalla.controlVolumenOperativo.graficaEstatusCliente.fechaInicioMayorFechaFin';
    }
    return { banderaValiddaciones, mensajeError };
  }

  parseDate(date: string) {
    return Date.parse(date);
  }
  async exportarDatos(isByFilter?: boolean) {
    const {
      codigoCliente,
      fechaInicio,
      fechaFin,
    } = this.graficoEstatusClienteForm.value;
    try {
      const busquedaGraEstCli = {
        clienteCod: codigoCliente,
        fechaIni: fechaInicio ? fechaInicio : null,
        fechaFin: fechaFin ? fechaFin : null,
        user: this.usuarioActual
      };
      const getXlsByFilter = {
        fechaIni: fechaInicio ? fechaInicio : null,
        fechaFin: fechaFin ? fechaFin : null,
        estatusId: this.estatusFilter,
        user: this.usuarioActual
      }
      const { banderaValiddaciones, mensajeError } =
        this.validaciones(busquedaGraEstCli);

      if (!banderaValiddaciones) {
        return this.open(
          this.translate.instant('pantalla.archivo.consulta.msjERRTitulo'),
          this.translate.instant(mensajeError),
          'alert',
          '',
          ''
        );
      }

      const result = await this.graficaEstatusClienteService.postExportarDatos(
        isByFilter ? getXlsByFilter : busquedaGraEstCli,
        isByFilter
      );
      const { data } = result;

      if (!data) {
        return this.open(
          this.translate.instant('modal.msjERRGEN0001Titulo'),
          this.translate.instant('modal.msjERRGEN0001Observacion'),
          'error',
          this.translate.instant('modal.msjERRGEN0001Codigo'),
          this.translate.instant('modal.msjERRGEN0001Sugerencia')
        );
      } else {
        this.fc.convertBase64ToDownloadFileInExport(result);
      }
      this.globals.loaderSubscripcion.emit(false);
    } catch (e) {
      this.datos = {};
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

  async createCharWithFilter(estatusId: string): Promise<void> {
    const requetsWithId = {
      clienteCod: '',
      fechaIni: null,
      fechaFin: null,
      estatusId,
    };
    const getdataWithFilter =
      await this.graficaEstatusClienteService.getBusquedaEstatusCliente(
        requetsWithId,
        true
      );
    this.makeChartFilter(
      getdataWithFilter.operaciones,
      getdataWithFilter.estatusId
    );
    this.showChartClient = true;
    this.globals.loaderSubscripcion.emit(false);
  }

  makeChartFilter(contentGraph: any, status: string) {
    this.dataFilter = contentGraph;
    this.estatusFilter = status;

    this.validarChart();

    const labels = (contentGraph as []).map(
      (label: { nombreBenef: string }) => label.nombreBenef
    );
    const dataSets = (contentGraph as []).map((label: { numeMovil: number }) =>
      Number(label.numeMovil)
    );
    this.chartFilter = new Chart('chartByFilter', {
      type: 'horizontalBar',
      data: {
        labels: labels,
        datasets: [
          {
            label: this.translate.instant("pantalla.controlVolumenOperativo.graficaEstatusCliente.clientes"),
            data: dataSets,
            type: 'horizontalBar',
            fill: false,
            borderWidth: 1,
            backgroundColor: 'red',
            borderColor: 'red',
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
          text: this.translate.instant("ESTATUS") +":" + status
        },
      },
    });
    this.chartFilter.update();
  }

  validarChart() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
