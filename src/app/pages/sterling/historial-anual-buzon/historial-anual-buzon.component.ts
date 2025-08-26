import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Globals } from 'src/app/bean/globals-bean.component';
import { GraficaHistorialBuzonService } from 'src/app/services/sterling/historial-buzon.service';
import { Chart } from 'chart.js';
import { MatDialog } from '@angular/material/dialog';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { TranslateService } from '@ngx-translate/core';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { Subscription } from 'rxjs';
import { ComunesService } from 'src/app/services/comunes.service';

interface formBuzonAnual {
  buzon: string;
  anio: string;
  tamano: boolean;
  total: boolean;
}
interface DataToTable {
  minimo: string;
  maximo: string;
  mes: string;
}

interface DataToSetGraph {
  listaAnual: DataToTable[];
  banderaMB: boolean;
  tope: string;
}

@Component({
  selector: 'app-historial-anual-buzon',
  templateUrl: './historial-anual-buzon.component.html',
  styleUrls: ['./historial-anual-buzon.component.css'],
})
export class HistorialAnualBuzonComponent implements OnInit, OnDestroy {
  formHistorialAnualBuzon: FormGroup;
  getYearMailbox: string[] = [];
  submittedBuzonSearch = false;
  tabla: DataToTable[] = [];
  chart: Chart = new Chart('chartBuzonAnual', {
    type: 'line',
    data: {
      labels: [],
      datasets: [],
    },
    options: {
      aspectRatio: 2.5,
    },
  });
  clickSuscliption: Subscription | undefined;

  clickSuscliptionGraph: Subscription | undefined;
  responseService: any;

  usuarioActual: string | null = '';

  rutaBuzon: any;

  constructor(
    private formBuilder: FormBuilder,
    private historialMailBoxService: GraficaHistorialBuzonService,
    private globals: Globals,
    private graficaHistorialBuzonService: GraficaHistorialBuzonService,
    public dialog: MatDialog,
    private translateService: TranslateService,
    private fc: FuncionesComunesComponent,
    private comunService: ComunesService,
  ) {
    this.usuarioActual = localStorage.getItem('UserID');

    /** Se inicializa el formulario graficoEstatusClienteForm */
    this.formHistorialAnualBuzon = this.formBuilder.group({
      /** Se inicializa el formulario para validar el search */
      buzon: ['', Validators.required],
      anio: ['', Validators.required],
      tamano: [false, Validators.required],
      total: [false, Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    const currentYear = new Date().getFullYear()
    const yearsToSelect: any = []
    for (let i = currentYear; i >= currentYear - 3; i--) {
      yearsToSelect.unshift(String(i))
    }

    this.clickSuscliption = this.comunService.clickAtion.subscribe(async (resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 12) {
        this.goBack();
        this.onClickClean();
        this.getYearMailbox = (
          (await this.historialMailBoxService.getListaBuzon()) as {
            listaCmbAnios: string[];
          }
        ).listaCmbAnios;
        this.getYearMailbox = this.getYearMailbox.find((year) => year == String(currentYear)) ? this.getYearMailbox.sort() : yearsToSelect;
        this.globals.loaderSubscripcion.emit(false);
      }
    });

    this.clickSuscliptionGraph = this.comunService.clickReloadGp.subscribe((resp: any) => {
      try {
        this.createChart()
      } catch (error) {
      }
    });
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
    this.clickSuscliptionGraph?.unsubscribe();
  }

  get formControlformHistorialAnualBuzon() {
    return this.formHistorialAnualBuzon.controls;
  }

  onClickClean() {
    this.submittedBuzonSearch = false;
    this.formHistorialAnualBuzon.reset();
    this.formHistorialAnualBuzon.get('tamano')?.setValue(false);
    this.formHistorialAnualBuzon.get('total')?.setValue(false);
    this.formHistorialAnualBuzon.get('anio')?.setValue('');
  }

  getValueRadio(tipo: string): void {
    if (tipo == 'tamano') {
      this.formHistorialAnualBuzon.get('tamano')?.setValue(true);
      this.formHistorialAnualBuzon.get('total')?.setValue(false);
    } else if ('total') {
      this.formHistorialAnualBuzon.get('tamano')?.setValue(false);
      this.formHistorialAnualBuzon.get('total')?.setValue(true);
    }
  }

  async gethistorialbuzon(): Promise<void> {
    const validForm = this.validRequest();
    if (!validForm) return;
    const request = this.formHistorialAnualBuzon.getRawValue() as {
      buzon: string;
      anio: number;
      tamano: boolean;
      total: boolean;
    };
    try {
      const getMailBox =
        (await this.graficaHistorialBuzonService.getBusquedaBuzonAnual(
          request.buzon,
          request.tamano,
          request.total,
          Number(request.anio)
        )) as {
          listaDetalle: DataToTable[];
          dataSetHistorialBuzon: DataToSetGraph;
        };

      this.tabla = getMailBox.listaDetalle;
      if (this.tabla.length <= 0) {
        this.open(
          this.translateService.instant('pantalla.sterling.historialBuzon.title'),
          this.translateService.instant(
            'pantalla.administracion.informacion.busqueda.tipoMensaje.Observacion'
          ),
          'info'
        );
      }

      setTimeout(() => {
        this.responseService = getMailBox.dataSetHistorialBuzon
        this.rutaBuzon = ': ' + this.formHistorialAnualBuzon.get('buzon')?.value;
        this.createChart();
      }, 700);
      this.globals.loaderSubscripcion.emit(false);
    } catch (error) {
      this.open(this.translateService.instant('modal.msjERRGEN0001Titulo'), this.translateService.instant('modal.msjERRGEN0001Observacion'), 'error', this.translateService.instant('modal.msjERRGEN0001Codigo'), this.translateService.instant('modal.msjERRGEN0001Sugerencia'));
      this.globals.loaderSubscripcion.emit(false);
    }

  }

  createChart(): void {
    const dataToShow: DataToSetGraph = this.responseService
    const getLabels = dataToShow.listaAnual.map((m) => {
      return m.mes;
    });
    const getMaxMailbox = dataToShow.listaAnual.map((mbox) => {
      return Number(mbox.maximo);
    });
    const getMinMalibox = dataToShow.listaAnual.map((minbox) => {
      return Number(minbox.minimo);
    });
    dataToShow.listaAnual.forEach((m) => getLabels.push(m.mes));
    this.chart = new Chart('chartBuzonAnual', {
      type: 'line',
      data: {
        labels: getLabels,
        datasets: [
          {
            label: this.translateService.instant('pantalla.controlVolumenOperativo.historialBuzon.maxBuzon'),
            data: getMaxMailbox,
            borderColor: '#FF7A96',
            type: 'line',
            fill: false,
            backgroundColor: '#EAC3CC',
          },
          {
            label: this.translateService.instant('pantalla.controlVolumenOperativo.historialBuzon.minBuzon'),
            data: getMinMalibox,
            borderColor: '#FFD36C',
            type: 'line',
            fill: false,
            backgroundColor: '#FFF3D6',
          },
          {
            label: dataToShow.banderaMB ? this.translateService.instant('pantalla.controlVolumenOperativo.historialBuzon.topeMb') : this.translateService.instant('pantalla.controlVolumenOperativo.historialBuzon.tope'),
            data: [Number(dataToShow.tope)],
            borderColor: '#d36cff',
            type: 'line',
            fill: false,
            backgroundColor: '#d36cff',
          },
        ],
      },
      options: {
        legend: {
          position: 'bottom',
          onClick: (e) => e.stopPropagation()
        }
      }
    });
    this.chart.update();
  }

  checkChart() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  validRequest(): Boolean {
    let successForm = true;
    const formBuzonValue = this.formHistorialAnualBuzon.value;
    if (!formBuzonValue.buzon) {
      this.open(
        this.translateService.instant(
          'pantalla.moduloAdministracion.consultaValidacionesCanal.CamposVacios'
        ),
        this.translateService.instant(
          'pantalla.sterling.historialAnualBuzon.buzonvacio'
        ),
        'alert'
      );
      return (successForm = false);
    }
    if (!formBuzonValue.anio) {
      this.open(
        this.translateService.instant(
          'pantalla.moduloAdministracion.consultaValidacionesCanal.CamposVacios'
        ),
        this.translateService.instant(
          'pantalla.sterling.historialAnualBuzon.anioVacio'
        ),
        'alert'
      );
      return (successForm = false);
    }
    if (!formBuzonValue.tamano && !formBuzonValue.total) {
      this.open(
        this.translateService.instant(
          'pantalla.moduloAdministracion.consultaValidacionesCanal.CamposVacios'
        ),
        this.translateService.instant(
          'pantalla.sterling.historialAnualBuzon.agrupadorVacio'
        ),
        'alert'
      );
      return (successForm = false);
    }
    return successForm;
  }

  open(
    titulo: string,
    contenido: string,
    type?: any,
    errorCode?: string,
    sugerencia?: string
  ) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        contenido,
        type,
        errorCode,
        sugerencia
      ), hasBackdrop: true
    });
  }

  goBack(): void {
    this.responseService = null
    this.tabla = [];
    this.chart.destroy();
    this.rutaBuzon = '';
  }

  async exportGraph(): Promise<void> {
    /** Se crea el objeto con la paginacion */
    try {
      const params =
        this.formHistorialAnualBuzon.getRawValue() as formBuzonAnual;
      const getDocExport = (await this.historialMailBoxService.exportGraph(
        params.buzon,
        params.tamano,
        params.total,
        params.anio,
        this.usuarioActual
      )) as { data: string; code: string; message: string };

      if (getDocExport.data) {
        /** Se manda la informacion para realizar la descarga del archivo */

        this.fc.convertBase64ToDownloadFileInExport(getDocExport);
        this.globals.loaderSubscripcion.emit(false);
      } else {
        if (getDocExport.code === '404') {
          this.open(
            this.translateService.instant('modal.msjERRGEN0001Titulo'),
            getDocExport.message,
            'error',
            this.translateService.instant('modal.msjERRGEN0001Codigo'),
            this.translateService.instant('modal.msjERRGEN0001Sugerencia')
          );
          this.globals.loaderSubscripcion.emit(false);
        } else {
          this.open(
            this.translateService.instant('modal.msjERRGEN0001Titulo'),
            this.translateService.instant('modal.msjERRGEN0001Observacion'),
            'error',
            this.translateService.instant('modal.msjERRGEN0001Codigo'),
            this.translateService.instant('modal.msjERRGEN0001Sugerencia')
          );
          this.globals.loaderSubscripcion.emit(false);
        }
      }
    } catch (error) {
      this.open(
        this.translateService.instant('modal.msjERRGEN0001Titulo'),
        this.translateService.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translateService.instant('modal.msjERRGEN0001Codigo'),
        this.translateService.instant('modal.msjERRGEN0001Sugerencia')
      );
      this.globals.loaderSubscripcion.emit(false);
    }
  }
}
