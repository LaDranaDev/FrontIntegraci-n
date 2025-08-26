import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe, formatDate } from '@angular/common';
import { GraficaArchivosClienteService } from 'src/app/services/control-volumen-operativo/grafica-archivos-cliente.service';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';
import { ComunesService } from 'src/app/services/comunes.service';
import { format, parse } from 'date-fns';

@Component({
  selector: 'app-grafica-archivo-cliente',
  templateUrl: './grafica-archivo-cliente.component.html',
  styleUrls: ['./grafica-archivo-cliente.component.css'],
})
export class GraficaArchivoClienteComponent implements OnInit, OnDestroy {
  mostrarResultado: boolean = false;
  buscarFechaNg: boolean = false;
  result: any;
  clickSuscliption: Subscription;
  /** Variables para la obtencion de fecha inicial y final cuando cambie el date*/
  fechaInicioChange = '';
  fechaFinChange = '';
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
      //maxDate: new Date(),
    }
  );
  clickOnPageSuscliption: Subscription;
  clickSuscliptionGraph: Subscription | undefined;
  radioCheckButton = '';

  chart = new Chart('chartStatusParametrics', {
    type: 'horizontalBar',
    data: {
      labels: ['uno', 'dos'],

      datasets: [
        {
          label: 'Titulo grafica',
          data: [1, 2],
          borderColor: '#FF7A96',
          type: 'horizontalBar',
          fill: false,
          backgroundColor: '#EAC3CC',
          borderWidth: 1,
        },
      ],
    },
  });

  private createSubscriptionsToDatesInputs() {
    /** Funcion onchange para cuando cambia la fecha inicial */
    this.graficoArchivoClienteForm.controls[
      'fechaInicio'
    ].valueChanges.subscribe((fechaInicio) => {
      this.fechaInicioChange = this.fc.parseFormatDate(
        this.datePipe.transform(fechaInicio, 'dd/MM/yyyy') || ''
      );
    });
    /** Funcion onchange para cuando cambia la fecha final */
    this.graficoArchivoClienteForm.controls['fechaFin'].valueChanges.subscribe(
      (fechaFin) => {
        this.fechaFinChange = this.fc.parseFormatDate(
          this.datePipe.transform(fechaFin, 'dd/MM/yyyy') || ''
        );
      }
    );
  }

  submittedBuzonSearch = false;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinks: boolean = true;
  showDirectionLinks: boolean = true;
  /** Variables para mostrar el boton o no de exportar*/
  banderaBtnExportar: boolean = true;
  /**
   * @description Formulario para la busqueda de paises
   * @type {FormGroup}
   * @memberOf GestionPaisesComponent
   */
  graficoArchivoClienteForm!: FormGroup;
  /**
   * Datos para llenar la tabla de paises
   */
  // tabla:GraficaEstatusRespuesta[]=[];
  content: any;
  datos: any;
  /** Objeto de paises para inicializar busqueda */
  estatusClientePara = {
    codigoCliente: '',
    fechaInicio: [new Date()],
    fechaFin: [new Date()],
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

  constructor(
    private formBuilder: FormBuilder,
    private fc: FuncionesComunesComponent,
    public datePipe: DatePipe,
    private globals: Globals,
    public dialog: MatDialog,
    private router: Router,
    public graficaArchivosClienteServices: GraficaArchivosClienteService,
    private translate: TranslateService,
    private comunService: ComunesService
  ) {
    /** Se inicializa el formulario graficoArchivoClienteForm */
    this.graficoArchivoClienteForm = this.formBuilder.group({
      /** Se inicializa el formulario para validar el search */
      codigoCliente: ['', Validators.required],
      top: ['', Validators.required],
      fechaInicio: [new Date(), Validators.required],
      fechaFin: [new Date(), Validators.required],
      monto: [true, Validators.required],
      operaciones: [false, Validators.required],
    });
  }

  ngOnInit(): void {
    this.clickSuscliption = this.comunService.clickAtion.subscribe(
      (resp: any) => {
        const { codeMenu } = resp;

        if (codeMenu === 4) {
          this.regresarInicio();
          /** Se realizan las suscripciones a los change de los datepickers */
          this.createSubscriptionsToDatesInputs();
        }
      }
    );
    this.clickSuscliptionGraph = this.comunService.clickReloadGp.subscribe((resp: any) => {
      try {
        this.createChart(this.result.listaDetalle, this.translate.instant("pantalla.controlVolumenOperativo.graficaEstatusCliente.clientes"))
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
  resultRequest(result: any) {
    this.datos = result;
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
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    code?: string,
    sugerencia?: string
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

  get formControlGraficoArchivoCliente() {
    return this.graficoArchivoClienteForm.controls;
  }

  onClickClean() {
    this.submittedBuzonSearch = false;
    this.radioCheckButton = '';
    this.graficoArchivoClienteForm?.reset();
    this.graficoArchivoClienteForm?.controls['fechaInicio']?.setValue(
      new Date()
    );
    this.graficoArchivoClienteForm?.controls['fechaFin']?.setValue(new Date());
    this.chart?.destroy();
  }

  public async eventoConsultar(): Promise<void> {
    if (!this.validar()) {
      return;
    }

    this.submittedBuzonSearch = true;
    try {
      const graficoArchivoClienteForm = this.graficoArchivoClienteForm.value;
      const requets = {
        fechaInicio: format(
          new Date(graficoArchivoClienteForm.fechaInicio),
          'dd-MM-yyyy'
        ),
        fechaFin: format(
          new Date(graficoArchivoClienteForm.fechaFin),
          'dd-MM-yyyy'
        ),
        operaciones: this.radioCheckButton === 'operaciones' ? true : false,
        monto: this.radioCheckButton === 'monto' ? true : false,
        codigoCliente: graficoArchivoClienteForm?.codigoCliente
          ? graficoArchivoClienteForm?.codigoCliente
          : '',
      };
      const getFile =
        await this.graficaArchivosClienteServices.getBusquedaGrafArchClie(
          requets
        );
      if (getFile.listaDetalle) {
        this.result = getFile;
        this.mostrarResultado = true;
        setTimeout(() => {
          this.createChart(this.result.listaDetalle, this.translate.instant("pantalla.controlVolumenOperativo.graficaEstatusCliente.clientes"));
        }, 700);
        window.addEventListener('resize', () => {
          this.chart.destroy();
          this.createChart(this.result.getFile.listaDetalle, this.translate.instant("pantalla.controlVolumenOperativo.graficaEstatusCliente.clientes"));
        });
        this.globals.loaderSubscripcion.emit(false);
      } else {
        this.open(
          '',
          this.translate.instant('modals.moduloAdministracion.consultasBics.error.consulta'),
          'alert',
          getFile.code,
          '',
        );
        this.mostrarResultado = false;

        this.globals.loaderSubscripcion.emit(false);
      }
      this.submittedBuzonSearch = false;
    } catch (e) {
      /** Se establece el page en el 0 */

      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant('modal.msjERRGEN0001Sugerencia')
      );
      this.globals.loaderSubscripcion.emit(false);
    }
    this.submittedBuzonSearch = false;
  }

  validar() {

    const fechaIncio = typeof this.graficoArchivoClienteForm.value?.fechaInicio === 'string' 
      ? parse(this.graficoArchivoClienteForm.value?.fechaInicio,'d/MM/yyyy', new Date()) 
      : this.graficoArchivoClienteForm.value?.fechaInicio;
    const fechaFin =  typeof this.graficoArchivoClienteForm.value?.fechaFin === 'string'
        ? parse(this.graficoArchivoClienteForm.value?.fechaFin,'d/MM/yyyy',new Date())
        : this.graficoArchivoClienteForm.value?.fechaFin;

    var fechaSelIni = formatDate(fechaIncio, 'dd/MM/yyyy', 'en-MX');
    var fechaSelFin = formatDate(fechaFin, 'dd/MM/yyyy', 'en-MX');
    var fechaDia = formatDate(new Date(), 'dd/MM/yyyy', 'en-MX');

    if (fechaSelIni > fechaSelFin) {
      this.open(
        this.translate.instant('cuentas.ordenantes.msjINF00010Titulo'),
        this.translate.instant('pantalla.graficaBuzon.validacion.fechas.Observacion'),
        'alert'
      );
      this.onClickClean();
      return false;
    } else if(fechaSelFin > fechaDia || fechaSelIni > fechaDia){
      this.open(
        this.translate.instant('cuentas.ordenantes.msjINF00010Titulo'),
        this.translate.instant('pantalla.controlVolumenOperativo.graficaEstatusCliente.fechaDia'),
        'alert'
      );
      this.onClickClean();
      return false;
    }


    return true;
  }

  /**
   * Metodo para regresar
   */
  regresarInicio() {
    this.mostrarResultado = false;
    this.onClickClean();
    this.router.navigate(['/controlVolumenOperativo/graficaArchivosCliente']);
  }

  /**
   * Metodo para poder realizar la exportacion de archivos
   */
  async onExportar() {
    // let graficoArchivoClienteForm = this.graficoArchivoClienteForm.value;
    const graficoArchivoClienteForm = this.graficoArchivoClienteForm.value;
    const requets = {
      fechaInicio: format(
        new Date(graficoArchivoClienteForm.fechaInicio),
        'dd-MM-yyyy'
      ),
      fechaFin: format(
        new Date(graficoArchivoClienteForm.fechaFin),
        'dd-MM-yyyy'
      ),
      operaciones: this.radioCheckButton === 'operaciones' ? true : false,
      monto: this.radioCheckButton === 'monto' ? true : false,
      codigoCliente: graficoArchivoClienteForm?.codigoCliente
        ? graficoArchivoClienteForm?.codigoCliente
        : '',
    };

    try {
      await this.graficaArchivosClienteServices
        .exportar(requets)
        .then(async (result: any) => {
          if (result.data) {

            /** Se manda la informacion para realizar la descarga del archivo */
            this.fc.convertBase64ToDownloadFileInExport(result);
          } else {
            if (result.code === '404') {
              this.open('Error', result.message, 'error');
            } else {
              this.open(
                '',
                this.translate.instant('modals.error.exportacion'),
                'error'
              );
            }
          }
          this.globals.loaderSubscripcion.emit(false);
        });
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        '',
        this.translate.instant('modals.error.exportacion'),
        'error'
      );
    }
  }

  createChart(dataToShow: any[], title: string) {
    const labesl = dataToShow.map((l) => l.nombreBUC);
    const totalData = dataToShow.map((ta) => ta.total);

    this.validarChart();

    this.chart = new Chart('chartStatusParametrics', {
      type: 'horizontalBar',
      data: {
        labels: labesl,

        datasets: [
          {
            label: title,
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
          text: this.result.graph,
        },
      },

    });

    this.chart.update();
  }

  procesaDatos(data: any) {
    let result = [];

    for (let i = 0; i < data.length; i++) {
      let item = { nombreBUC: data[i].nombreBUC, total: data[0].total };
      result.push(item);
    }
    return result;
  }

  validarCampos(campo: any) {
    this.radioCheckButton = campo;
    if (campo == 'codigoCliente') {
      this.graficoArchivoClienteForm.get('top')?.setValue('');
    } else if (campo == 'monto' || campo == 'operaciones') {
      this.graficoArchivoClienteForm.get('codigoCliente')?.setValue('');
    }
  }

  validarChart() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
