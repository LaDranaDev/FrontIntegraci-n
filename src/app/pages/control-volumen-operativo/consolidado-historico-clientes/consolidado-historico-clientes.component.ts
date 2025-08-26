import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import * as Chart from 'chart.js';
import { format, parse } from 'date-fns';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ConsolidadoHistoricoClientesService } from 'src/app/services/control-volumen-operativo/consolidado-historico-clientes.service';

@Component({
  selector: 'app-consolidado-historico-clientes',
  templateUrl: './consolidado-historico-clientes.component.html',
  styleUrls: ['./consolidado-historico-clientes.component.css']
})
export class ConsolidadoHistoricoClientesComponent implements OnInit {
  showGraph: boolean = false;
  historicoClienteForm: FormGroup;
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


  chart: Chart;
  submittedBuzonSearch = false;
  result: any;
  colors: string[] = [
    '#fc4c4c',
    '#5454fc',
    '#58fc54',
    '#fcfc54',
    '#fc44fc',
    '#58fcfc',
    '#fcacb4',
    '#848880',
    '#c00404',
    '#0804c4',
    '#08c404',
    '#cccc24',
    '#c804c4',
    '#0cc0c4',
    '#383838',
  ];

  lengthColors: number = this.colors.length;
  nombreGrafica: string
  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    public dialog: MatDialog,
    private service: ConsolidadoHistoricoClientesService,
    private globals: Globals,
  ) {
    this.historicoClienteForm = this.formBuilder.group({
      codigoCliente: ['', Validators.required],
      fechaInicio: [new Date(), Validators.required],
      fechaFin: [new Date(), Validators.required],
    });
  }

  ngOnInit(): void {
  }

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

  onClickClean() {

    this.historicoClienteForm?.reset();
    this.historicoClienteForm?.controls['fechaInicio']?.setValue(
      new Date()
    );
    this.historicoClienteForm?.controls['fechaFin']?.setValue(new Date());
    this.chart?.destroy();
  }

  public async eventoConsultar(): Promise<void> {
    if (!this.validar()) {
      return;
    }

    this.submittedBuzonSearch = true;
    try {
      const historicoClienteForm = this.historicoClienteForm.value;
      const requets = {
        fechaIni: format(
          new Date(historicoClienteForm.fechaInicio),
          'dd/MM/yyyy'
        ),
        fechaFin: format(
          new Date(historicoClienteForm.fechaFin),
          'dd/MM/yyyy'
        ),
        codigoCliente: historicoClienteForm?.codigoCliente
          ? historicoClienteForm?.codigoCliente
          : '',
      };
      const { listaConsolidado, nombreGrafica }: any = await this.service.graficaConsolClienteBuscar(
        requets
      );
      this.globals.loaderSubscripcion.emit(false);


      if (listaConsolidado.length === 0) {
        this.onClickClean();
        this.open(
          this.translate.instant('menu.controlVolumenOperativo.graficaCliente'),
          '',
          'info',
          '',
          this.translate.instant('modal.controlVolumenOperativo.graficaEstatusClienteParametrizada.noData')
        );
        return;
      }
      this.nombreGrafica = nombreGrafica
      if (listaConsolidado) {
        this.result = listaConsolidado;
        this.showGraph = true;
        setTimeout(() => {
          this.createChart(listaConsolidado, nombreGrafica);
        }, 700);
        window.addEventListener('resize', () => {
          this.chart.destroy();
          this.createChart(listaConsolidado, nombreGrafica);
        });
        this.globals.loaderSubscripcion.emit(false);
      } else {
        this.showGraph = false;

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

  createChart(dataToShow: any[], title: string) {
    try {
      let countColor = 0;
      let colorFill: any = [];
      let totals: any = [], labels: any = []
      this.result.map((l: any) => {
        if (countColor == this.lengthColors) {
          countColor = 0;
        }
        labels = [...labels, l.layout]
        totals = [...totals, l.total]
        colorFill = [...colorFill, this.colors[countColor]]
        l.color = `color${countColor + 1}`
        countColor++
      });

      this.validarChart();

      this.chart = new Chart('chartHistoricoCli', {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            data: totals, backgroundColor: colorFill,
          }],
        },
        options: {
          aspectRatio: 2.5,
          legend: {
            display: false,
            onClick: (e) => e.stopPropagation(),
          },
          responsive: true,
          scales: {
            xAxes: [{
              display: false
            }],
            yAxes: [{
              display: true
            }],
          }
        },
      });

      this.chart.update();
    } catch (error) {

    }

  }

  back() {
    this.showGraph = false;
    this.onClickClean()
    this.chart.destroy();
  }

  exportDetailLayouts() {

  }

  validarChart() {
    if (this.chart) {
      this.chart.destroy();
    }
  }


  validar() {

    if (!this.historicoClienteForm.get('codigoCliente')?.value) {
      this.onClickClean();
      this.open(
        this.translate.instant('consultaadmonusuario.msjINF00001Titulo'),
        '',
        'alert',
        '',
        // this.translate.instant('monitoreo.error00001.observacion')
        'Mandatory Customer Code'
      );
      return false;
    }

    const fechaIncio = typeof this.historicoClienteForm.value?.fechaInicio === 'string'
      ? parse(this.historicoClienteForm.value?.fechaInicio, 'd/MM/yyyy', new Date())
      : this.historicoClienteForm.value?.fechaInicio;
    const fechaFin = typeof this.historicoClienteForm.value?.fechaFin === 'string'
      ? parse(this.historicoClienteForm.value?.fechaFin, 'd/MM/yyyy', new Date())
      : this.historicoClienteForm.value?.fechaFin;

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
    } else if (fechaSelFin > fechaDia || fechaSelIni > fechaDia) {
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
}
