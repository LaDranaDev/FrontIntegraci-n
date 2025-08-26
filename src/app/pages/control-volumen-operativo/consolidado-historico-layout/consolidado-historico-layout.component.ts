import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { Chart } from 'chart.js';
import { Globals } from 'src/app/bean/globals-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { Subscription } from 'rxjs';
import { ComunesService } from 'src/app/services/comunes.service';
import { ConsolidadoHistoricoLayoutsService } from 'src/app/services/control-volumen-operativo/consolidado-historico-layouts.service';

interface Layout {
  idLayout: number;
  fechaLayout: string;
  nameLayout: string;
  numArchivos: number;
}
@Component({
  selector: 'app-consolidado-historico-layout',
  templateUrl: './consolidado-historico-layout.component.html',
  styleUrls: ['./consolidado-historico-layout.component.css'],
})
export class ConsolidadoHistoricoLayoutComponent implements OnInit, OnDestroy {
  filterBy: 'most' | 'top' | '' = '';
  showGraph = false;
  showGraphDetail = false;
  chart: Chart;
  chartDetail: Chart;
  layouts: any[] = [];
  clientDetailLayout: any[] = [];
  layoutSelected: Layout | null;
  clickSuscliption: Subscription | undefined;

  constructor(
    private translateService: TranslateService,
    public dialog: MatDialog,
    private consolidadoHistoricoLayoutsService: ConsolidadoHistoricoLayoutsService,
    private globals: Globals,
    private fc: FuncionesComunesComponent,
    private comunService: ComunesService
  ) {}

  ngOnInit(): void {
    this.clickSuscliption = this.comunService.clickAtion.subscribe(async (resp: any) => {
      const { codeMenu } = resp;
      if(codeMenu === 8){
        this.showGraph = false;
        this.showGraphDetail = false;
        this.layouts = [];
        this.filterBy = '';
        this.chart.destroy();
        this.chartDetail.destroy();
        this.clientDetailLayout = [];
        this.layoutSelected = null;
      }
    });
  }

  async search(): Promise<void> {
    this.layouts = [];
    try {
      if (!this.filterBy) {
        this.open(
          this.translateService.instant(
            'consultaadmonusuario.msjINF00001Titulo'
          ),
          `${this.translateService.instant(
            'pantalla.graficaBuzon.validacion.filtroObligatorio.Observacion'
          )}.`,
          '',
          'alert'
        );
        return;
      } else {
        this.showGraph = true;
        const getHistoricoLayouts =
          this.filterBy === 'most'
            ? await this.consolidadoHistoricoLayoutsService.obtenerMasUsadoConsolidado()
            : await this.consolidadoHistoricoLayoutsService.obtenerTopConsolidado();
        this.globals.loaderSubscripcion.emit(false);
        this.layouts = getHistoricoLayouts;
        this.createChart(getHistoricoLayouts);
      }
    } catch (error) {
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  back(isFromDetail: boolean) {
    if (!isFromDetail) {
      this.filterBy = '';
      this.showGraph = false;
      this.chart.destroy();
    } else {
      this.showGraph = true;
      this.showGraphDetail = false;
      this.layoutSelected = null;
      this.chartDetail.destroy();
    }
  }

  clean(): void {
    this.filterBy = '';
  }

  createChart(dataToShow: any[]) {
    const labels = dataToShow.map((l) => l.nameLayout);
    const totalData = dataToShow.map((ta) => ta.numArchivos);
    this.chart = new Chart('chartConsolidadoLayout', {
      type: 'horizontalBar',
      data: {
        labels: labels,
        datasets: [
          {
            label: this.translateService.instant('operativo.layouts'),
            data: totalData,
            backgroundColor: '#ff0404',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        scales: {
          xAxes: [
            {
              position: 'top',
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
        legend: {
          position: 'bottom',
          onClick: (e) => e.stopPropagation(),
        },
      },
    });

    this.chart.update();
  }

  async ceateChartDetail(layoutToShowDetail: any): Promise<void> {
    this.layoutSelected = layoutToShowDetail;
    const colors = ['red', 'blue', 'greenyellow', 'yellow', 'pink', 'cyan', 'violet', 'darkgray', 'crimson'];
    this.clientDetailLayout =
      (await this.consolidadoHistoricoLayoutsService.obtenerDetailConsolidado(
        this.layoutSelected?.idLayout as number,
        this.layoutSelected?.fechaLayout.split(' ')[0] as string
      )) as any[];
    this.globals.loaderSubscripcion.emit(false);
    const labels = this.clientDetailLayout.map((l) => l.nombreProducto);
    //Se útiliza de esta forma porque están invertidas las propiedadesd desde el back
    const productName = this.clientDetailLayout.map((ta) => ta.nombreCliente);
    const datasets: Chart.ChartDataSets[] = [];
    productName.forEach((n, i) => {
      //validamos si existen los mismos productos en todos los clientes, de no ser así, seteamos un 0 para que no se vea mal la tabla
      const totalData = this.clientDetailLayout.map((ta) =>
        ta.nombreCliente === n ? ta.total : 0
      );
      datasets.push({
        label: n,
        data: totalData,
        backgroundColor: colors[i],
      });
    });
    this.showGraphDetail = true;
    this.showGraph = false;
    this.chartDetail = new Chart('chartConsolidadoLayoutDetail', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        aspectRatio:2.5,
        scales: {
          xAxes: [{
            position: 'bottom'
          }],
          yAxes: [{
            display: true,
            ticks: {
                beginAtZero: true,
                min: 0
            }
        }]
        },
        legend: {
          position: 'bottom',
          onClick: (e) => e.stopPropagation(),
        },
      }
    });

    this.chartDetail.update();
  }

  async exportLayouts(isByTop: boolean): Promise<void> {
    const getReporTop =
      await this.consolidadoHistoricoLayoutsService.exportarHistoricoOrTopLayout(
        isByTop
      );
    this.fc.convertBase64ToDownloadFileInExport(getReporTop);
    this.globals.loaderSubscripcion.emit(false);
  }

  async exportDetailLayouts(): Promise<void> {
    const dateToService = this.layoutSelected?.fechaLayout.split(' ')[0];
    const getReporTopDetail =
      await this.consolidadoHistoricoLayoutsService.exportarDetalleLayout(
        this.layoutSelected?.idLayout as number,
        dateToService as string
      );
    this.fc.convertBase64ToDownloadFileInExport(getReporTopDetail);
    this.globals.loaderSubscripcion.emit(false);
  }

  open(
    titulo: String,
    contenido: String,
    sugerencia: string,
    type: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    code?: string
  ) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        sugerencia,
        type,
        code,
        contenido
      ),
    });
  }

  ngOnDestroy(): void{
    this.clickSuscliption?.unsubscribe();
  }
}
