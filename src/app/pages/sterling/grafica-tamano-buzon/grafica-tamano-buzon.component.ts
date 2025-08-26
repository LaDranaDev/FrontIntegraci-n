import { format, parse, subDays } from 'date-fns';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GraficaTamanoBuzonService } from 'src/app/services/sterling/grafica-tamano-buzon.service';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale, esLocale } from 'ngx-bootstrap/chronos';
import { Chart } from 'chart.js';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ComunesService } from 'src/app/services/comunes.service';

defineLocale('es', esLocale);

@Component({
  selector: 'app-grafica-tamano-buzon',
  templateUrl: './grafica-tamano-buzon.component.html'
})
export class GraficaTamanoBuzonComponent implements OnInit, OnDestroy {


  /**
  * Datos para llenar la tabla de buzones
  */
  tabla: any[] = []

  request: any;

  /**
   * @description Formulario para la busqueda de buzones
   * @type {FormGroup}
   * @memberOf GraficaTamanoBuzonComponent
  */
  gestionbuzonForm!: UntypedFormGroup;

  tamanoMB: boolean = false;
  total: boolean = false;

  /**
    * @description Nombre de usuario de la sesión actual.
    * Este usuario se tendria que sustituir por el de la sesion actual.
    * @type {string}
    * @memberOf GestionComprobantesComponent
    */
  usuarioActual: string | null = '';

  datePickerConfig: BsDatepickerConfig;

  clickSuscliption: Subscription | undefined;
  clickSuscliptionGraph: Subscription | undefined;
  chart: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public gestionbuzonService: GraficaTamanoBuzonService,
    private globals: Globals,
    private fc: FuncionesComunesComponent,
    private bsLocaleService: BsLocaleService,
    private translate: TranslateService,
    private comunService: ComunesService,

  ) {

    this.usuarioActual = localStorage.getItem('UserID');
    this.gestionbuzonForm = this.initializeForm();
    this.datePickerConfig = new BsDatepickerConfig();
    this.datePickerConfig.dateInputFormat = 'DD/MM/YYYY';
    this.datePickerConfig.containerClass = 'theme-red';
    this.datePickerConfig.showWeekNumbers = false;
    this.bsLocaleService.use('es');
    const date = new Date();
    date.setDate(date.getDate() - 1);
    this.gestionbuzonForm.setValue({
      filtro: null,
      fechaInicio: date,
      fechaFin: date,
      tamanoMB: false,
      total: false
    });
  }

  /**
  * Metodo para poder inicializar el formulario
  */
  private initializeForm() {
    return this.formBuilder.group({
      filtro: [''],
      fechaInicio: [subDays(new Date(), 1)],
      fechaFin: [subDays(new Date(), 1)],
      tamanoMB: [''],
      total: ['']
    })
  }

  ngOnInit(): void {

    this.clickSuscliption = this.comunService.clickAtion.subscribe((resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 10) {
        try {
          this.eventCleanGT();
        } catch (error) {
        }

      }
    });
    this.clickSuscliptionGraph = this.comunService.clickReloadGp.subscribe((resp: any) => {
      try {
        if (this.translate.currentLang) this.bsLocaleService.use(this.translate.currentLang);
        this.createChart()
      } catch (error) {
      }
    });
  }
  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
    this.clickSuscliptionGraph?.unsubscribe();
  }


  /**
  * Metodo que se ejecutara al realizar click
  * sobre el boton de clean
  */
  eventCleanGT() {
    /** Se reinicia el formulario de busqueda */
    this.gestionbuzonForm = this.initializeForm();
    this.tabla = [];

    if (this.chart) {
      this.chart.destroy();
    }
    const date = new Date();
    date.setDate(date.getDate() - 1);
    this.gestionbuzonForm.setValue({
      filtro: null,
      fechaInicio: date,
      fechaFin: date,
      tamanoMB: false,
      total: false
    });
  }

  async eventoConsultarGT() {
    this.request = {
      filtro: this.gestionbuzonForm.value.filtro,
      iniFecha: this.gestionbuzonForm.value.fechaInicio,
      finFecha: this.gestionbuzonForm.value.fechaFin,
      tamanoMB: this.gestionbuzonForm.value.tamanoMB,
      total: this.gestionbuzonForm.value.total
    }
    const dateInit =
      typeof this.request.iniFecha === 'string'
        ? parse(
          this.request.iniFecha,
          'd/MM/yyyy',
          new Date()
        )
        : this.request.iniFecha;
    const dateEnd =
      typeof this.request.finFecha === 'string'
        ? parse(
          this.request.finFecha,
          'd/MM/yyyy',
          new Date()
        )
        : this.request.finFecha;
    this.request.iniFecha = dateInit;
    this.request.finFecha = dateEnd;

    if (this.validaciones(this.request)) {
      try {
        await this.gestionbuzonService.getBusquedaBuzon(this.request).then(
          async (result: any) => {
            if (result && result.length > 0) {
              this.tabla = result;
              this.createChart();
            } else {
              this.openModalError(this.translate.instant('planCalidad.consultaBuzon.msjINF00008Titulo'), this.translate.instant('consultaTracking.menssage'), 'info');
            }
            this.globals.loaderSubscripcion.emit(false);
          })
      } catch (error) {
        this.openModalError(this.translate.instant('modal.msjERRGEN0001Titulo'), this.translate.instant('modal.msjERRGEN0001Observacion'), 'error', this.translate.instant('modal.msjERRGEN0001Codigo'), this.translate.instant('modal.msjERRGEN0001Sugerencia'));
        this.globals.loaderSubscripcion.emit(false);
      }
    }
  }

  validaciones(request: any): boolean {
    const titulo = "Grupo Financiero Santander Mexicano";
    const ayer = new Date(new Date().getTime() - 24 * 60 * 60000);
    if (!request.finFecha) {
      this.openModalError(this.translate.instant('planCalidad.consultaBuzon.msjINF00008Titulo'), this.translate.instant('pantalla.graficaBuzon.validacion.finObligatorio.Observacion'), 'error');
      return false;
    }
    if (request.iniFecha > request.finFecha) {
      this.openModalError(this.translate.instant('planCalidad.consultaBuzon.msjINF00008Titulo'), this.translate.instant('pantalla.graficaBuzon.validacion.fechas.Observacion'), 'alert');
      return false;
    }
    if (request.iniFecha > ayer || request.finFecha > ayer) {
      this.openModalError(this.translate.instant('planCalidad.consultaBuzon.msjINF00008Titulo'), this.translate.instant('pantalla.graficaBuzon.validacion.fechas2.Observacion'), 'alert');
      return false;
    }
    if (!request.filtro || !request.iniFecha || (!request.tamanoMB && !request.total)) {
      this.openModalError(this.translate.instant('planCalidad.consultaBuzon.msjINF00008Titulo'), this.translate.instant('pantalla.graficaBuzon.validacion.filtroObligatorio.Observacion'), 'alert');
      return false;
    }
    return true;
  }

  regresar() {
    this.tabla = [];
    this.chart.destroy();
  }

  exportar() {
    this.request.usuario = this.usuarioActual;
    this.gestionbuzonService.exportar(this.request).then(result => {
      this.fc.convertBase64ToDownloadFileInExport(result);
      this.globals.loaderSubscripcion.emit(false);
    });
  }

  /**
  *
  * Abrir el modal de error
  */
  openModalError(titulo: string, contenido: string, type?: any, errorCode?: string, sugerencia?: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, errorCode, sugerencia), hasBackdrop: true
    }
    );
  }

  createChart() {
    const fechaInicio = this.gestionbuzonForm.value.fechaInicio;
    const fechaFin = this.gestionbuzonForm.value.fechaFin;

    this.validarChart()


    const title = this.translate.instant(
      'pantalla.controlVolumenOperativo.tamanoBuzon.titleGrafica',
      {
        fechaInicio: format(new Date(fechaInicio), 'dd/MM/yyyy'),
        fechaFin: format(new Date(fechaFin), 'dd/MM/yyyy'),
      }
    )
    //  `GRÁFICA TOP 10 BUZÓN: ${format(new Date(fechaInicio), 'dd/MM/yyyy')} - ${format(new Date(fechaFin), 'dd/MM/yyyy')}`;
    this.chart = new Chart("chart", {
      type: 'horizontalBar',
      data: {
        labels: this.tabla.map(d => d.buzonera),
        datasets: [
          {
            label: this.tamanoMB && !this.total ? 'MB' : this.translate.instant('menu.sterling.tamanobuzon.total'),
            data: this.tabla.map(d => this.tamanoMB && !this.total ? d.tamanioMB : d.numTotal),
            backgroundColor: this.tamanoMB && this.total ? '#0000FF' : '#ff0404'
          },
        ]
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
          text: title,
          display: true
        },
        plugins: {
          title: {
            display: true,
            text: title
          },
          legend: {
            position: 'left'
          }
        }
      }
    });
    if (this.tamanoMB && this.total) {
      this.chart.data.datasets.push({
        label: 'MB',
        data: this.tabla.map(d => d.tamanioMB),
        backgroundColor: '#ff0404'
      });
    }
  }

  validarChart() {

    if (this.chart) {

      this.chart.destroy();

    }

  }
}
