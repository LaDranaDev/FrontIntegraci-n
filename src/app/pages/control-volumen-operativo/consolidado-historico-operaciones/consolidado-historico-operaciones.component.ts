import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { ConsolidadoHistoricoOperacionesService } from 'src/app/services/control-volumen-operativo/consolidado-historico-operaciones.service';

@Component({
  selector: 'app-consolidado-historico-operaciones',
  templateUrl: './consolidado-historico-operaciones.component.html',
  styleUrls: ['./consolidado-historico-operaciones.component.css'],
})
export class ConsolidadoHistoricoOperacionesComponent implements OnInit {
  filtetByCurrentYear = '';
  chart: Chart;
  chartDetail: Chart;
  showGraphByYear = false;
  showGraphDetail = false;
  titleGraph = '';
  clickSuscliption: Subscription;
  operaciones: { fecha: string; totalOperaciones: number }[] = [];
  historicoOperaciones: any[] = [];

  clickSuscliptionGraph: Subscription | undefined;
  act: any;

  constructor(
    public dialog: MatDialog,
    public translateService: TranslateService,
    private comunService: ComunesService,
    private fc: FuncionesComunesComponent,
    private historicoOperacionesService: ConsolidadoHistoricoOperacionesService,
    private globals: Globals
  ) { }

  ngOnInit(): void {
    this.historicoOperacionesService.setSaveLocalStorage('grafi', null);
    this.clickSuscliption = this.comunService.clickAtion.subscribe(
      async (resp: any) => {
        const { codeMenu } = resp
        if (codeMenu === 7) {
          this.showGraphByYear = false;
          this.showGraphDetail = false;
          this.chart?.destroy();
          this.chartDetail?.destroy();
          this.clean();
        }
      }
    );
    this.clickSuscliptionGraph = this.comunService.clickReloadGp.subscribe((resp: any) => {
      this.act = this.historicoOperacionesService.getSaveLocalStorage('grafi');
      if(this.act === null){
        return
      }
      if(this.act === 'actual'){
        this.getCurrentYearOperations();
      }
      if(this.act === 'anterior'){
        this.getLastYearOperations();
      }
      if(this.act === 'fecha'){
        this.searchDetail(this.fech)
      }
    });
  }

  search() {
    if (!this.filtetByCurrentYear) {
      this.open(
        this.translateService.instant('consultaadmonusuario.msjINF00001Titulo'),
        `${this.translateService.instant(
          'pantalla.graficaBuzon.validacion.filtroObligatorio.Observacion'
        )}.`,
        '',
        'alert'
      );
      return;
    } else {
      this.filtetByCurrentYear === 'current' ? this.getCurrentYearOperations() : this.getLastYearOperations();
    }
  }

  validarChart() {
    if (this.chart) {
      this.chart.destroy();
    }
  }


  getCurrentYearOperations() {
    this.historicoOperacionesService.obtenerOperacionesAnioActual().then((resp => {
      if(resp.length > 0){
        this.historicoOperacionesService.setSaveLocalStorage('grafi', 'actual');
        this.operaciones = resp;
        this.createChart(resp);
        this.showGraphByYear = true;
      }
      else{
        this.showGraphByYear = false;
        this.open(
          this.translateService.instant('modal.msjERRGEN0001Titulo'),
          this.translateService.instant('administracion.general.nohaydatos'),
         '',
          'info',
          '',
        )
        return
      }
    })).catch(() => {
      this.open(
        this.translateService.instant('modal.msjERRGEN0001Titulo'),
        this.translateService.instant('modal.msjERRGEN0001Observacion'),
        this.translateService.instant('modal.msjERRGEN0001Sugerencia'),
        'error',
        this.translateService.instant('modal.msjERRGEN0001Codigo'),
      )
    }).finally(() => {
      this.globals.loaderSubscripcion.emit(false);
    });
  }

  getLastYearOperations() {
    this.historicoOperacionesService.obtenerOperacionesAnioAnterior().then((resp => {
      if(resp.length > 0){
        this.historicoOperacionesService.setSaveLocalStorage('grafi', 'anterior');
        this.operaciones = resp;
        this.createChart(resp);
        this.showGraphByYear = true;
      }else{
        this.showGraphByYear = false;
        this.open(
          this.translateService.instant('modal.msjERRGEN0001Titulo'),
          this.translateService.instant('administracion.general.nohaydatos'),
         '',
          'info',
          '',
        )
        return
      }
    })).catch(() => {
      this.open(
        this.translateService.instant('modal.msjERRGEN0001Titulo'),
        this.translateService.instant('modal.msjERRGEN0001Observacion'),
        this.translateService.instant('modal.msjERRGEN0001Sugerencia'),
        'error',
        this.translateService.instant('modal.msjERRGEN0001Codigo'),
      )
    }).finally(() => {
      this.globals.loaderSubscripcion.emit(false);
    });
  }

  createChart(dataToShow: { fecha: string; totalOperaciones: number }[]) {
    this.validarChart();
    const labels = dataToShow.map((l) => l.fecha);
    const totalData = dataToShow.map((d) => d.totalOperaciones);
    const yearFilter = this.filtetByCurrentYear === 'current' ? new Date().getFullYear() : new Date().getFullYear() - 1;
    this.titleGraph = `${this.translateService.instant('operativo.graficaConsolidadoHistoricoOperaciones')} ${yearFilter}`
    this.chart = new Chart('chartConsolidadoHistorico', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: this.translateService.instant(
              'pantallas.monitorizacion.Fecha'
            ),
            data: totalData,
            borderColor: '#FF0000',
            type: 'line',
            fill: false,
            backgroundColor: '#FF0000',
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
  fech:any;
  searchDetail(fecha: string): void {
    this.fech = fecha;
    if (this.fech !== '') {
      this.fech = this.fech.replace(/\//g, '-');
      this.historicoOperacionesService.obtenerDetalleOperacion(this.fech).then((resp => {
        if(resp.length > 0){
          this.historicoOperacionesService.setSaveLocalStorage('grafi', 'fecha');
          this.historicoOperaciones = resp
          this.createChartDetail(resp);
          this.showGraphDetail = true;
          this.showGraphByYear = false;
        }else{
          this.showGraphDetail = false;
          this.showGraphByYear = true;
          this.open(
            this.translateService.instant('modal.msjERRGEN0001Titulo'),
            this.translateService.instant('administracion.general.nohaydatos'),
           '',
            'info',
            '',
          )
          return
        }
      })).catch(() => {
        this.open(
          this.translateService.instant('modal.msjERRGEN0001Titulo'),
          this.translateService.instant('modal.msjERRGEN0001Observacion'),
          this.translateService.instant('modal.msjERRGEN0001Sugerencia'),
          'error',
          this.translateService.instant('modal.msjERRGEN0001Codigo'),
        )
      }).finally(() => {
        this.globals.loaderSubscripcion.emit(false);
      });
    }
  }

  createChartDetail(datosGrafica: { fecha: string, nombre: string, nombreProducto: string, totalOperaciones: number }[]) {
    datosGrafica.forEach((dato) => {
      dato.nombreProducto === '' ? dato.nombreProducto = '--' : dato.nombreProducto
    });

    let etiquetasGrafica = datosGrafica.map((n) => n.nombre);
    etiquetasGrafica = etiquetasGrafica.filter((v, i) => etiquetasGrafica.findIndex(item => item == v) === i);
    const dataSetGrafica = this.createDataSet(datosGrafica, etiquetasGrafica);
    this.chartDetail = new Chart("chartConsolidadoHistoricoDetail", {
      type: 'horizontalBar',
      data: {
        labels: etiquetasGrafica,
        datasets: dataSetGrafica
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
      }
    });

    this.chartDetail.update();
  }

  createDataSet(datosGrafica: { fecha: string, nombre: string, nombreProducto: string, totalOperaciones: number }[], etiquetas: string[]): any[] {
    let productos = datosGrafica.map((n) => n.nombreProducto);
    productos = productos.filter((v, i) => productos.findIndex(item => item == v) === i);
    const dataSetGrafica: any[] = [];
    const colores = ['red', 'blue', 'green', 'yellow', 'pink'];

    productos.forEach((producto, index) => {
      const totales: number[] = [];
      etiquetas.forEach(nombre => {
        const etiquetasAgrupadas = datosGrafica.filter((etiqueta) => etiqueta.nombre === nombre);
        const datosFiltrados = etiquetasAgrupadas?.find((datoIndividual) => datoIndividual.nombreProducto === producto);
        datosFiltrados ? totales.push(datosFiltrados?.totalOperaciones!) : totales.push(0);
      });

      const objDataSetGrafica = {
        label: producto,
        data: totales,
        backgroundColor: colores[index],
      }
      dataSetGrafica.push(objDataSetGrafica);
    });
    return dataSetGrafica;
  }

  back(isFromDetail: boolean): void {
    if (isFromDetail) {
      if(this.filtetByCurrentYear === 'current'){
        this.historicoOperacionesService.setSaveLocalStorage('grafi', 'actual');
      }else{
        this.historicoOperacionesService.setSaveLocalStorage('grafi', 'anterior');
      }
      this.showGraphDetail = false;
      this.showGraphByYear = true;
      this.chartDetail.destroy();
    } else {
      this.historicoOperacionesService.setSaveLocalStorage('grafi', null);
      this.showGraphDetail = false;
      this.showGraphByYear = false;
      this.chart?.destroy();
      this.chartDetail?.destroy();
      this.clean();
    }
  }

  clean(): void {
    this.filtetByCurrentYear = '';
  }

  exportarHistorico() {
    this.historicoOperacionesService.obtenerReportOperacionesAnioActual(this.filtetByCurrentYear).then((resp => {
      this.fc.convertBase64ToDownloadFileInExport(resp);
      this.globals.loaderSubscripcion.emit(false);
    })).catch(() => {
      this.globals.loaderSubscripcion.emit(false);
      this.dialog.open(ModalInfoComponent, {
        data: new ModalInfoBeanComponents(
          this.translateService.instant('modal.msjERRGEN0001Titulo'),
          this.translateService.instant('modal.msjERRGEN0001Observacion'),
          'error',
          this.translateService.instant('modal.msjERRGEN0001Codigo'),
          this.translateService.instant('modal.msjERRGEN0001Sugerencia')
        ),
      });
    });
  }

  exportarDetalle() {
    this.historicoOperacionesService.obtenerReportDetalleOperacion(this.fech).then((resp => {
      this.fc.convertBase64ToDownloadFileInExport(resp);
      this.globals.loaderSubscripcion.emit(false);
    })).catch(() => {
      this.globals.loaderSubscripcion.emit(false);
      this.dialog.open(ModalInfoComponent, {
        data: new ModalInfoBeanComponents(
          this.translateService.instant('modal.msjERRGEN0001Titulo'),
          this.translateService.instant('modal.msjERRGEN0001Observacion'),
          'error',
          this.translateService.instant('modal.msjERRGEN0001Codigo'),
          this.translateService.instant('modal.msjERRGEN0001Sugerencia')
        ),
      });
    });
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

}
