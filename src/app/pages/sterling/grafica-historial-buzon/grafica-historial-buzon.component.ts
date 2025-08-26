import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IHistorialBuzon } from 'src/app/interface/historialBuzonRespuesta.interface';
import { MatDialog } from '@angular/material/dialog';
import { GraficaHistorialBuzonService } from 'src/app/services/sterling/historial-buzon.service';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { Chart } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Subscription } from 'rxjs';
import { ComunesService } from 'src/app/services/comunes.service';
@Component({
  selector: 'app-grafica-historial-buzon',
  templateUrl: './grafica-historial-buzon.component.html',
  styleUrls: ['./grafica-historial-buzon.component.css'],
})
export class GraficaHistorialBuzonComponent implements OnInit, OnDestroy {

  page: number = 0;
  banderaHasRows: boolean = false;
  showBtnQuery = false;
  gestionbuzonForm!: UntypedFormGroup;
  tabla: IHistorialBuzon[] = [];
  responseService: any;
  returnedArray: any[] = [];
  chart: any;
  usuarioActual: string | null = '';
  fechaActual: Date;
  datePickerConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-red',
    showWeekNumbers: false,
    isDisabled: true,
    adaptivePosition: true
  };
  calendario = false;

  clickSuscliption: Subscription | undefined;
  clickSuscliptionGraph: Subscription | undefined;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    private fc: FuncionesComunesComponent,
    private translate: TranslateService,
    public gestionbuzonService: GraficaHistorialBuzonService,
    private globals: Globals,
    private comunService: ComunesService,
    private bsLocaleService: BsLocaleService,

  ) {
    this.usuarioActual = localStorage.getItem('UserID');
  }

  private initializeForm() {
    return this.formBuilder.group({
      idBuzon: [''],
      filtroFecha: true,
      iniFecha: new FormControl({ value: this.diaAnterior(), disabled: this.calendario }, Validators.required),
      finFecha: new FormControl({ value: this.diaAnterior(), disabled: this.calendario }, Validators.required),
      radio1: [''],
      radio2: ['']
    })

  }

  ngOnInit(): void {
    this.fechaActual = new Date();
    this.fechaActual.setHours(0, 0, 0, 0)
    this.gestionbuzonForm = this.initializeForm();

    this.clickSuscliption = this.comunService.clickAtion.subscribe((resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 11) {
        if (this.translate.currentLang) this.bsLocaleService.use(this.translate.currentLang);

        this.eventCleanGH();

      }
    });
    // this.getConsultabuzon(this.fillObjectPag(this.page,this.rowsPorPagina));
    this.clickSuscliptionGraph = this.comunService.clickReloadGp.subscribe((resp: any) => {
      try {
        if (this.translate.currentLang) this.bsLocaleService.use(this.translate.currentLang);
        this.createDataSet()
      } catch (error) {
      }
    });
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
    this.clickSuscliptionGraph?.unsubscribe();
  }

  async consultarDatosBuzon() {
    const valBuzonPk = this.gestionbuzonForm.value.idBuzon

    this.validarChart();
    const { iniFecha, finFecha, radio1, filtroFecha, radio2 } = this.gestionbuzonForm.value
    let request = {
      iniFecha: iniFecha ? iniFecha : null,
      finFecha: finFecha ? finFecha : null,
      filtro: radio1,
      valBuzonPk,
      checkbox: filtroFecha ? 'on' : 'off',
      idEstatus: radio2
    }



    const { banderaValiddaciones, mensajeError } = this.validaciones(request)


    if (!banderaValiddaciones) {
      this.eventCleanGH()
      return this.open(this.translate.instant('producto.msjERR002Titulo'), this.translate.instant(mensajeError), 'alert');
    }


    try {
      await this.gestionbuzonService.getBusquedaHistorialBuzon(request).then(async (response: any) => {
        this.responseService = response
        this.tabla = response.buzones;
        if (this.tabla === undefined) {
          this.open('', this.translate.instant('monitor.Inf01.mensaje'), 'info', this.translate.instant('monitor.Inf01.codigo'));
          this.globals.loaderSubscripcion.emit(false);
          return;
        } else if (this.tabla.length > 0) {
          await this.createDataSet()
          this.banderaHasRows = true;
          this.returnedArray = this.tabla
        }
        this.globals.loaderSubscripcion.emit(false);

        /* this.returnedArray = [];
        this.banderaHasRows = false; */
        this.showBtnQuery = true
      });

    } catch (error) {
      this.open(this.translate.instant('modal.msjERRGEN0001Titulo'), this.translate.instant('modal.msjERRGEN0001Observacion'), 'error', this.translate.instant('modal.msjERRGEN0001Codigo'), this.translate.instant('modal.msjERRGEN0001Sugerencia'));
      this.eventCleanGH()
      this.globals.loaderSubscripcion.emit(false);
    }


  }

  //Creacion de grafica
  async createDataSet() {
    this.validarChart();
    const valBuzonPk = this.gestionbuzonForm.value.idBuzon
    const response = this.responseService
    this.chart = await new Chart("chartHistory", {
      type: 'line',

      data: {
        labels: [],
        datasets: []
      },
      options: {
        legend: {
          position: 'bottom',
          onClick: (e) => e.stopPropagation()
        },
        aspectRatio: 2.5
      }
    });



    const { column, row, row2, rowTitle } = await this.crearRows(response)


    this.chart.data.labels = column
    this.chart.data.datasets = [
      {
        label: `${this.translate.instant('pantalla.controlVolumenOperativo.historialBuzon.buzonera')} ${valBuzonPk}`,
        data: row,
        backgroundColor: 'red',
        borderColor: 'red',
        fill: false,
      },
      {
        label: rowTitle,
        data: row2,
        backgroundColor: 'blue',
        borderColor: 'blue',
        fill: false,
      },
    ];

    return this.chart.update();
  }

  validarChart() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  eventCleanGH() {
    /** Se reinicia el formulario de busqueda */
    this.page = 0;
    this.tabla = [];
    this.returnedArray = []
    this.banderaHasRows = false;
    this.showBtnQuery = false;
    this.calendario = false;
    this.gestionbuzonForm.get('iniFecha')?.enable();
    this.gestionbuzonForm.get('finFecha')?.enable();
    this.gestionbuzonForm = this.initializeForm();

    // this.gestionbuzonForm.controls['iniFecha'].enable();
    // this.gestionbuzonForm.controls['finFecha'].enable();
    this.validarChart()
  }

  async onPageChanged(event: any) {
    this.page = 0
    this.page = event.page - 1;

    this.pageChanged(event)

  }

  open(titulo: string, contenido: string, type?: any, errorCode?: string, sugerencia?: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, errorCode, sugerencia), hasBackdrop: true
    }
    );
  }

  openModalError(titulo: string, contenido: string, type?: any, errorCode?: string, sugerencia?: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, errorCode, sugerencia), hasBackdrop: true
    }
    );
  }

  activarInputFecha(event: any) {
    if (event.target.checked) {
      this.calendario = false;
      this.gestionbuzonForm.controls['iniFecha'].enable();
      this.gestionbuzonForm.controls['finFecha'].enable();
    } else {
      this.calendario = true;
      this.gestionbuzonForm.controls['iniFecha'].disable();
      this.gestionbuzonForm.controls['finFecha'].disable();
    }

  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;

    this.returnedArray = this.tabla.slice(startItem, endItem);
  }

  validaciones(request: any): any {
    let banderaValiddaciones = true;
    let mensajeError = ''
    const { filtro, finFecha, iniFecha, valBuzonPk, idEstatus } = request;

    if (valBuzonPk === "" || valBuzonPk === null) {

      banderaValiddaciones = false;
      mensajeError = 'menu.sterling.historialBuzon.error.buzonvacio';
    } else if (this.parseDate(iniFecha) > this.fechaActual.getTime() || this.parseDate(finFecha) >= this.fechaActual.getTime()) {
      banderaValiddaciones = false;
      mensajeError = 'menu.sterling.historialBuzon.error.fechaDiaAnterior';

    } else if (this.parseDate(iniFecha) > this.parseDate(finFecha)) {
      banderaValiddaciones = false;
      mensajeError = 'menu.sterling.historialBuzon.error.fechaInicioMayorFechaFin';
    } else if (!this.validarCheck(filtro, idEstatus)) {
      banderaValiddaciones = false;
      mensajeError = 'menu.sterling.historialBuzon.error.filtroObligatorio';
    }
    return { banderaValiddaciones, mensajeError };


  }

  validarCheck(radioAgrupar: string, radioOrden: string): boolean {
    let retorno = true;

    if (radioAgrupar !== "NUM_TOTAL" && radioAgrupar !== "NUM_TAMA_MB") {
      retorno = false;
    } else if (radioOrden !== "DESC" && radioOrden !== "ASC") {
      retorno = false;
    }
    return retorno;
  }

  parseDate(date: string) {
    return Date.parse(date)
  }

  diaAnterior() {
    const date = new Date(this.fechaActual.getTime())
    date.setDate(date.getDate() - 1)
    return date
  }

  async exportarDatos() {
    const valBuzonPk = this.gestionbuzonForm.value.idBuzon

    const { iniFecha, finFecha, radio1, filtroFecha, radio2 } = this.gestionbuzonForm.value
    let request: any = {
      buzon: valBuzonPk,
      tamano: false,
      total: false,
      altos: false,
      bajos: false,
      iniFecha: iniFecha,
      finFecha: finFecha,
      //filtroFecha: filtroFecha ? true : false
      usuario: this.usuarioActual
    }

    if (radio1 === "NUM_TOTAL") {
      request.tamano = true
    } else {
      request.total = true
    }
    if (radio2 === "DESC") {
      request.altos = true
    } else {
      request.bajos = true
    }


    try {

      const response = await this.gestionbuzonService.getXlsHistorialBuzon(request)
      const { data } = response;

      if (!data) {
        return this.openModalError(this.translate.instant('pantalla.monitor.validacion.ErrorTitulo'), response.message, 'error');
      } else {
        this.fc.convertBase64ToDownloadFileInExport(response);
      }
      this.globals.loaderSubscripcion.emit(false);
    } catch (error) {

      this.open(this.translate.instant('modal.msjERRGEN0001Titulo'), this.translate.instant('modal.msjERRGEN0001Observacion'), 'error', this.translate.instant('modal.msjERRGEN0001Codigo'), this.translate.instant('modal.msjERRGEN0001Sugerencia'));
      this.eventCleanGH()
      this.globals.loaderSubscripcion.emit(false);
    }

  }

  crearRows(response: any) {

    const { buzones, banderaMB, topeMB, topeFS } = response;
    const filtro = banderaMB ? 'tamanioMB' : 'numTotal';
    const rowTitle = banderaMB ? this.translate.instant('pantalla.controlVolumenOperativo.historialBuzon.tope') : this.translate.instant('pantalla.controlVolumenOperativo.historialBuzon.topeMb');
    const rowValue = banderaMB ? topeMB : topeFS;

    let column: any = [], row: any = [], row2: any = [];

    for (const item of buzones) {
      column = [...column, item.fecha]
      row = [...row, item[filtro]]
      row2 = [...row2, rowValue]
    }

    return { column, row, row2, rowTitle };

  }
}
