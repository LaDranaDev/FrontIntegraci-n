import { Component, OnInit } from '@angular/core';
import { ConsultaTrackingArchivoService } from 'src/app/services/monitoreo/consulta-tracking-archivo.service';
import { Chart } from 'chart.js';
import { Globals } from 'src/app/bean/globals-bean.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { IPaginationRequest } from '../../../contingencia/request/pagination-request.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { TranslateService } from '@ngx-translate/core';
import { ComunesService } from 'src/app/services/comunes.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-consulta-trakin-archivo',
  templateUrl: './consulta-trakin-archivo.component.html',
  styleUrls: ['./consulta-trakin-archivo.component.css'],
})
export class ConsultaTrakinArchivoComponent implements OnInit {
  usuarioActual: string | null = '';
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;
  /** Variable para indicar en que pagina se encuentra */
  page: number = 0;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 20;
  banderaBtnExportar: boolean = true;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinksArchivo: boolean = true;
  showDirectionLinksArchivo: boolean = true;

  /**
   * @description Formulario para la busqueda de paises
   * @type {FormGroup}
   * @memberOf GestionPaisesComponent
   */
  formSearch!: FormGroup;
  objPageable: IPaginationRequest;

  grafi: any;
  da: any = [];
  dat = [];
  labe = [];
  idArchivo: any = 0;
  l: any;
  t: any;

  lab: string[] = [];
  tab: number[] = [];
  est: string[] = [];
  tot: number[] = [];

  public chart: any;
  public chart2: any;
  traking: any;
  datos: any;
  content: any;
  clickSuscliptionGraph: Subscription | undefined;
  date: any;
  // Datos de usuario
  cliente: any = '';
  estatus: number = 0;
  codCliente: any = '';

  constructor(
    public consultaTrackingArchivoService: ConsultaTrackingArchivoService,
    private globals: Globals,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router,
    private fc: FuncionesComunesComponent,
    private translate: TranslateService,
    private comunService: ComunesService,
    public datePipe: DatePipe,
  ) {
    this.formSearch = this.formBuilder.group({
      /** Se inicializa el formulario para validar el search */
      nomArchivo: [''],
    });
    //Se inicializa el objeto pageable
    this.objPageable = {
      page: this.page,
      size: this.rowsPorPagina,
      ruta: '',
    };
    this.date = this.datePipe.transform(Date.now(), 'dd/MM/yyyy');
  }
  /**
   * @descripcion Metodo para poder generar y regresar el objeto con la paginacion
   *
   * @param numPage valor para indicar el numero de la pagina
   * @param totalItemsPage valor para indicar el total de elementos que se mostraran en la pagina
   */
  private fillObjectPag(numPage: number, totalItemsPage: number) {
    (this.objPageable.page = numPage), (this.objPageable.size = totalItemsPage);
    return this.objPageable;
  }


  async ngOnInit() {
    this.clickSuscliptionGraph = this.comunService.clickReloadGp.subscribe((resp: any) => {
      this.init();
    });
  }


  async init() {
    this.usuarioActual = localStorage.getItem('UserID');
    this.traking = this.consultaTrackingArchivoService.getSaveLocalStorage('traking');
    this.cliente = this.traking.cliente;
    this.codCliente = this.traking.codigoCliente,
    this.estatus = this.traking.estatus;
    try {
      await this.consultaTrackingArchivoService
        .archivos(this.traking)
        .then(async (resp: any) => {
          this.resultRequest(resp.beanArchivo);
          this.det();
        });
    } catch (e) {
      this.datos = {};
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        'Error',
        this.translate.instant('consultaTracking.noResultTraking'),
        'error'
      );
    }
  }

  async det() {
    try {
      await this.consultaTrackingArchivoService
        .tablaArchivos(this.traking, this.fillObjectPag(0, 20))
        .then(async (tabla) => {
          this.respuestaTabla(tabla);
        });
    } catch (e) {
      this.datos = {};
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        'Error',
        this.translate.instant('consultaTracking.noResultTraking'),
        'error'
      );
    }
    this.globals.loaderSubscripcion.emit(false);
  }

  respuestaTabla(data: any) {
    this.datos = data.content;
    this.totalElements = data.totalElementos;
    if (this.totalElements > 0) {
      this.banderaHasRows = true;
      this.banderaBtnExportar = true;
      // Si existen datos provocamos el SLICE
      this.datos = this.datos ? this.datos.slice(0, this.rowsPorPagina) : [];
    } else {
      this.banderaHasRows = false;
      this.banderaBtnExportar = false;
      this.datos = this.datos;
      this.open(
        'Aviso',
        'No existen datos para la consulta',
        'info',
        this.translate.instant('consultaTracking.msjTRACKING007')
      );
    }
    this.globals.loaderSubscripcion.emit(false);
  }

  title: any;
  resultRequest(result: any) {
    this.content = [];
    this.est = [];
    this.tot = [];
    this.datos = '';
    this.title = result;
    this.datos = result;
    this.content = [
      {
        estatus: this.translate.instant('duplicado'),
        total: this.datos.totDupl,
        id: 1
      }, {
        estatus: this.translate.instant('recibido'),
        total: this.datos.totRecib,
        id: 2
      }, {
        estatus: this.translate.instant('rechazado'),
        total: this.datos.totRecha,
        id: 3
      }, {
        estatus: this.translate.instant('validado'),
        total: this.datos.totVald,
        id: 4
      }, {
        estatus: this.translate.instant('eCliente'),
        total: this.datos.totEnroll,
        id: 5
      }, {
        estatus: this.translate.instant('enProceso'),
        total: this.datos.totEnProc,
        id: 6
      }, {
        estatus: this.translate.instant('enEspera'),
        total: this.datos.totEsp,
        id: 7
      }, {
        estatus: this.translate.instant('procesado'),
        total: this.datos.totProc,
        id: 8
      }
    ]
    for (let dato in this.content) {
      this.est.push(this.content[dato].estatus);
      this.tot.push(this.content[dato].total);
    }
    this.grafica(this.est, this.tot);
  }

  grafica(label: any, data: any) {
    this.chart2 = null;
    this.chart2 = new Chart('MyChart2', {
      type: 'pie', //this denotes tha type of chart

      data: {
        // values on X-Axis
        labels: label,
        datasets: [
          {
            data: data,
            backgroundColor: [
              '#55ff55',
              '#c0c0c0',
              '#ffafaf',
              '#ff5555',
              '#55ffff',
              '#5555ff',
              '#ff55ff',
              '#f7f065',
            ],
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: this.translate.instant('aH2H'),
        },
        legend: {
          position: 'bottom',
          onClick: (e) => e.stopPropagation()
        },
      },
    });
    this.globals.loaderSubscripcion.emit(false);
  }

  archivo(data: any) {
    this.consultaTrackingArchivoService.setSaveLocalStorage('archivo', data);
    this.consultaTrackingArchivoService.setSaveLocalStorage('traking', this.traking);
    this.router.navigate(['/monitoreo/consultaTracking/consultaArchivo']);
  }

  /**
   * @description Evento de click al momento de usar la paginacion
   * @memberOf GestionPaisesComponent
   */
  onPageChanged(event: any) {
    this.page = event.page - 1;
    this.consQuery();
  }

  async consQuery() {
    this.datos = [];
    try {
      this.consultaTrackingArchivoService
        .tablaArchivos(this.traking, this.fillObjectPag(this.page, this.rowsPorPagina))
        .then((tabla) => {
          this.respuestaTabla(tabla);
        });
    } catch (e) {
      this.datos = {};

      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant('modal.msjERRGEN0001Observacion')
      );
    }
    this.globals.loaderSubscripcion.emit(false);
  }


  open(
    titulo: string,
    obser: string,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    errorCode?: string,
    sugerencia?: string
  ) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        obser,
        type,
        errorCode,
        sugerencia
      ), hasBackdrop: true
    });
  }

  async exportar2() {
    var nombre = this.formSearch.value.nomArchivo;
    try {
      this.consultaTrackingArchivoService
        .excelTrackingArchivo(this.traking, this.traking.estatus, nombre, this.usuarioActual)
        .then((result: any) => {
          if (result.data) {
            /** Se manda la informacion para realizar la descarga del archivo */
            this.fc.convertBase64ToDownloadFileInExport(result);
            this.globals.loaderSubscripcion.emit(false);
          } else {
            if (result.code === '404') {
              this.open('Error', result.message, 'error');
              this.globals.loaderSubscripcion.emit(false);
            } else {
              this.open(
                this.translate.instant('modal.msjERRGEN0001Titulo'),
                this.translate.instant('modal.msjERRGEN0001Observacion'),
                'error',
                this.translate.instant('modal.msjERRGEN0001Codigo'),
                this.translate.instant('modal.msjERRGEN0001Observacion')
              );
              this.globals.loaderSubscripcion.emit(false);
            }
          }
        });
    } catch (e) {
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant('modal.msjERRGEN0001Observacion')
      );
      this.globals.loaderSubscripcion.emit(false);
    }
  }
  regresar() {
    this.router.navigate(['/monitoreo/consultaTracking']);
  }

  refrescar() {
    this.ngOnInit();
  }

  async tablaArchivoData(data: any) {
    this.idArchivo = data.id;
    // Almacenamos el estatus consultado
    this.traking.estatus = data.id;
    // Limpiamos los datos de la BD encontrados y almacenados en un array
    this.datos = [];
    this.page = 0;
    try {
      await this.consultaTrackingArchivoService
        .buscarId(this.traking, this.idArchivo, this.fillObjectPag(0, 20))
        .then(async (result: any) => {
          this.respuestaTabla(result);
        });
    } catch (e) {
      this.datos = {};
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant('modal.msjERRGEN0001Observacion')
      );
    }
  }

  async buscarArchivo() {
    var nombre = this.formSearch.value.nomArchivo;
    if (nombre === '') {
      this.open(
        'Error',
        this.translate.instant(
          'consultaTracking.msjErERROR00001Observacion'
        ),
        'error',
        this.translate.instant('consultaTracking.msjErERROR00001Codigo'),
        this.translate.instant(
          'consultaTracking.msjErERROR00001Sugerencia'
        )
      );
      return;
    }
    try {
      await this.consultaTrackingArchivoService
        .buscarNombreArchivo(this.traking, nombre, this.fillObjectPag(0, 20))
        .then(async (result: any) => {
          this.respuestaTabla(result);
        });
    } catch (e) {
      this.datos = {};
      
      this.open(
        'Error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant('modal.msjERRGEN0001Observacion')
      );
    }
    this.globals.loaderSubscripcion.emit(false);
  }

  disableEvent(event: any) {
    event.preventDefault();
    return false;
  }

  /**
   * Evento para al momento de realizar el pegado
   * en cualquier input este evento no ocurra
   */
  eventoOnPasteBlock(event: ClipboardEvent) {
    return false;
  }

  /**
   * Evento para poder validar que el campo solo
   * se puedan ingresar alphabeto, numeros
   */
  texto(event: KeyboardEvent) {
    this.fc.onlyAlphabeticEspe(event);
  }
}
