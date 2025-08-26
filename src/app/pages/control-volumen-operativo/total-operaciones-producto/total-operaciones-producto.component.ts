import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';
import { parse, format } from 'date-fns';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Subscription } from 'rxjs';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { TotalOperacionesProductoService } from 'src/app/services/control-volumen-operativo/total-operaciones-producto.service';

@Component({
  selector: 'app-total-operaciones-producto',
  templateUrl: './total-operaciones-producto.component.html',
  styleUrls: ['./total-operaciones-producto.component.css'],
})
export class TotalOperacionesProductoComponent implements OnInit {
  formSearch: FormGroup;
  datePickerConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-red',
    showWeekNumbers: false,
    isDisabled: true,
    adaptivePosition: true
  };
  showGraph = false;
  titlteGraph = '';
  requestGet = {
    idProducto: '',
    descripcionEstatus: '',
    fechaInicial: '',
    fechaFinal: '',
    nombreProducto:''
  };
  totalOpe: {
    grlNombProd: string;
    numMont: number;
  }[] = [];
  chart: Chart;
  clickSuscliption: Subscription;

  constructor(
    public dialog: MatDialog,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private comunService: ComunesService,
    private totalOpeProdyctService: TotalOperacionesProductoService,
    private globals: Globals,
    private fc: FuncionesComunesComponent
  ) {}

  ngOnInit(): void {
    this.clickSuscliption = this.comunService.clickAtion.subscribe(
      (resp: any) => {
        const { codeMenu } = resp;
        if (codeMenu === 5) {
          this.createForm();
          this.product()
          this.showGraph = false;
        }
      }
    );
  }

  producto:any
  async product(){
    try{
      await this.totalOpeProdyctService.product().then(
        async(result:any) =>{
          this.globals.loaderSubscripcion.emit(false);
          this.producto=result
        })
    }catch(e){
      this.open(
        this.translateService.instant('modal.msjERRGEN0001Titulo'),
        this.translateService.instant('modal.msjERRGEN0001Observacion'),
        '',
        'error',
        this.translateService.instant('modal.msjERRGEN0001Codigo'),
      );
      this.globals.loaderSubscripcion.emit(false);
    }
  }



  
  createForm() {
    this.formSearch = this.fb.group({
      product: [''],
      opeMonto: [''],
      dateInit: [new Date()],
      dateEnd: [new Date()],
    });
  }
  async search(): Promise<void> {
    if (!this.validForm()) return;
    const getOpe = (await this.totalOpeProdyctService.getOpByProduct(
      this.requestGet
    )) as {
      productos: {
        grlNombProd: string;
        numMont: number;
      }[];
    };
    if (getOpe.productos?.length > 0) {
      this.showGraph = true;
      this.createChart(getOpe.productos);
    } else {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translateService.instant(
          'menu.controlVolumenOperativo.graficaCliente'
        ),
        this.translateService.instant('consultaTracking.menssage'),
        '',
        'info'
      );
      this.createForm();
    }
    this.totalOpe = getOpe.productos;
    this.titlteGraph = `${this.translateService.instant(
      'operativo.graficaTotOperTitulo'
    )} ${this.translateService.instant(
      this.formSearch.get('opeMonto')?.value === 'operaciones'
        ? 'menu.controlVolumenOperativo.graficaCliente.opcion'
        : 'pantalla.monitoreo.monitorArchivoCurso.monto'
    )}`;
    this.globals.loaderSubscripcion.emit(false);
  }

  backToFormSearch(): void {
    this.createForm();
    this.chart.destroy();
    this.totalOpe = [];
    this.showGraph = false;
  }

  createChart(
    dataToShow: {
      grlNombProd: string;
      numMont: number;
    }[]
  ) {
    const labesl = dataToShow.map((l) => l.grlNombProd);
    const totalData = dataToShow.map((d) => d.numMont);
    this.chart = new Chart('chartTotalOpProduc', {
      type: 'horizontalBar',
      data: {
        labels: labesl,

        datasets: [
          {
            label: this.translateService.instant(
              'menu.controlVolumenOperativo.graficaCliente.opcion'
            ),
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
        responsive: true,
        scales: {
          xAxes: [
            {
              position: 'top',
            },
          ],
        },
        legend: {
          position: 'bottom',
          onClick: (e) => e.stopPropagation()
        },
      },
    });

    this.chart.update();
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

  validForm(): boolean {
    if (!this.formSearch.get('opeMonto')?.value) {
      this.open(
        this.translateService.instant(
          'modals.controlVolumenOperativo.graficaEstatusClienteParametrizada.messajeSantander'
        ),
        this.translateService.instant(
          'pantalla.graficaBuzon.validacion.filtroObligatorio.Observacion'
        ),
        '',
        'alert'
      );
      return false;
    }
    const dateInit =
      typeof this.formSearch.value?.dateInit === 'string'
        ? parse(this.formSearch.value?.dateInit, 'd/MM/yyyy', new Date())
        : this.formSearch.value?.dateInit;
    const dateEnd =
      typeof this.formSearch.value?.dateEnd === 'string'
        ? parse(this.formSearch.value?.dateEnd, 'd/MM/yyyy', new Date())
        : this.formSearch.value?.dateEnd;
    if (dateInit > dateEnd) {
      this.open(
        this.translateService.instant(
          'modals.controlVolumenOperativo.graficaEstatusClienteParametrizada.messajeSantander'
        ),
        this.translateService.instant(
          'pantalla.controlVolumenOperativo.graficaEstatusCliente.fechaInicioMayorFechaFin'
        ),
        '',
        'alert'
      );
      this.cleanForm();
      return false;
    }
    if (dateEnd > new Date()) {
      this.open(
        this.translateService.instant(
          'modals.controlVolumenOperativo.graficaEstatusClienteParametrizada.messajeSantander'
        ),
        this.translateService.instant('operativo.mensaje.fechaDia'),
        '',
        'alert'
      );
      return false;
    }
    this.requestGet = {
      idProducto: this.formSearch.get('opeMonto')?.value,
      descripcionEstatus: this.formSearch.get('product')?.value
        ? this.formSearch.get('product')?.value
        : 'Todos',
      nombreProducto:this.formSearch.get('product')?.value
      ? this.formSearch.get('product')?.value
      : 'Todos',
      fechaInicial: format(dateInit, 'dd/MM/yyyy'),
      fechaFinal: format(dateEnd, 'dd/MM/yyyy'),
    };
    return true;
  }

  cleanForm(): void {
    this.createForm();
    this.showGraph = false;
    this.chart.destroy();
    this.totalOpe = [];
  }

  async exportReport(): Promise<void> {
    const requestReport = {
      idProducto: this.formSearch.get('opeMonto')?.value,
      descripcionEstatus: this.formSearch.get('product')?.value === '' ? 'Todos': this.formSearch.get('product')?.value,
      fechaInicial: this.requestGet.fechaInicial,
      fechaFinal: this.requestGet.fechaFinal,
    };
    const getReport = await this.totalOpeProdyctService.getReport(requestReport) as {data: string};
    if (getReport.data) {
      this.fc.convertBase64ToDownloadFileInExport(getReport);
    }
    this.globals.loaderSubscripcion.emit(false);
}
}
