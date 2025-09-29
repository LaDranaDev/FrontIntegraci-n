import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConsultaTrackingApiService } from 'src/app/services/monitoreo-api/consulta-tracking-api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { Chart } from 'chart.js';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ComunesService } from 'src/app/services/comunes.service';
import { PagoRequest } from '../../../models/pago-request.module';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';

@Component({
  selector: 'app-consulta-tracking-api',
  templateUrl: './consulta-tracking-api.component.html',
  styleUrls: ['./consulta-tracking-api.component.css']
})
export class ConsultaTrackingApiComponent implements OnInit {
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
  showBoundaryLinksArchivoA: boolean = true;
  showDirectionLinksArchivoA: boolean = true;

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
  catalogoDivisa:any;
  catalogoProductos:any;
  catalogoTipoPago:any;
  idArchivo: any = 0;
  l: any;
  t: any;

  lab: string[] = [];
  tab: number[] = [];
  est: string[] = [];
  tot: number[] = [];

  public chart: any;
  public chart2: any;
  //traking: any;
  datos: any;
  content: any;
  clickSuscliptionGraph: Subscription | undefined;
  date: any;
  // Datos de usuario
  cliente: any = '';
  traking: any;
  estatus: number = 0;
  codCliente: any = '';
  isData=true;

  pagosRequest :PagoRequest={
    operacion :'',
    divisa : '',
    tipoPago:'',
    estatus :'',
    cuentaCargo:'',
    cuentaAbono:'',
    canal:'',
    transactionId:'',
    referenciaCanal:'',
    importe:0,
    fechaInicio: new Date(),
    fechaFin: new Date()
  };

  constructor(
    public consultaTrackingApiService: ConsultaTrackingApiService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router,
    private globals: Globals,
    private translate: TranslateService,
    private comunService: ComunesService,
    public datePipe: DatePipe,
  ) {
    this.comunService.setSaveLocalStorage('idioma', 1);
    this.translate.use('es');
    this.formSearch = this.formBuilder.group({
      /** Se inicializa el formulario para validar el search */
      operacion:'',
      tipoPago:'',
      divisa:''
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
    this.pagosRequest = {
      operacion: null,
      divisa:null,
      tipoPago:null,
      estatus:null,
      cuentaCargo:null,
      cuentaAbono:null,
      canal:null,
      transactionId:null,
      referenciaCanal:null,
      importe:null,
      fechaInicio: null,
      fechaFin: null
    };
    try {
      this.consultaTrackingApiService
        .pagos(this.pagosRequest,this.fillObjectPag(0, 20)).then(
        resp => {
          this.resultRequest(resp);
          this.det(resp);
          this.getCatalogs();
          this.globals.loaderSubscripcion.emit(false);
      }
      );
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

  async det(resp:any) {
    this.respuestaTabla(resp.resumenPorProductoDivisaEstatus,resp.totales);
    this.globals.loaderSubscripcion.emit(false);
  }

  respuestaTabla(data: any,totales:any) {
    this.datos = data;
    this.title=totales;
    this.totalElements = data.length;
    if (this.totalElements > 0) {
      this.banderaHasRows = true;
      //this.banderaBtnExportar = true;
      // Si existen datos provocamos el SLICE
      this.datos = this.datos ? this.datos.slice(0, this.rowsPorPagina) : [];
    } else {
      this.banderaHasRows = false;
      //this.banderaBtnExportar = false;
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

  validarChart() {
    if (this.chart2) {
      this.chart2.destroy();
    }
  }

  getCatalogs(){
    try {
      this.consultaTrackingApiService
        .obtenerCatalogos()
        .then( (resp:any) => {
          this.catalogoDivisa=resp.divisas;
          this.catalogoProductos=resp.tiposOperacion;
          this.catalogoTipoPago=resp.tiposPago;
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

  title: any;
  resultRequest(result: any) {
    this.validarChart();
    this.content = [];
    this.est = [];
    this.tot = [];
    this.datos = '';
    this.title = result.totales;
    this.datos = result;
    if(result.resumenPorEstatus.length===0){
      this.isData=false;
      this.content = [
      {
        estatus: this.translate.instant('ENVIADO'),
        total: 0,
        id: 1
      }, {
        estatus: this.translate.instant('PROCESADO'),
        total: 0,
        id: 2
      }, {
        estatus: this.translate.instant('PENDIENTE'),
        total: 0,
        id: 3
      }, {
        estatus: this.translate.instant('RECHAZADO'),
        total: 0,
        id: 4
      }, {
        estatus: this.translate.instant('RECHAZADO APLICATIVO'),
        total: 0,
        id: 5
      }];
    }else{
      this.isData=true;
      for(let data in result.resumenPorEstatus){
      this.content[data] =
      {
        estatus: this.translate.instant(result.resumenPorEstatus[data].estatus),
        total: this.datos.resumenPorEstatus[data].total,
        id: data
      }
    }
    }

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
              '#ff5555',
              '#55ffff',
              '#5555ff',
              '#ff55ff',
              '#f7f065',
              '#c0c0c0',
              '#ffafaf',
            ],
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: this.translate.instant('aH2HOR'),
        },
        legend: {
          position: 'bottom',
          onClick: (e: { stopPropagation: () => any; }) => e.stopPropagation()
        },
      },
    });
    this.globals.loaderSubscripcion.emit(false);
  }

  archivo(data: string) {
    this.consultaTrackingApiService.setSaveLocalStorage('monitoreoConsulta', data.split(' ')[0]);
     console.log('Navigation triggered'); // Check browser console
  this.router.navigate(['/monitoreo-api/monitorOperaciones']).then(success => {
    console.log('Navigation success:', success);
  }).catch(err => {
    console.error('Navigation error:', err);
  });
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
      this.consultaTrackingApiService
        .pagos(this.pagosRequest,this.fillObjectPag(this.page, this.rowsPorPagina))
        .then((tabla:any) => {
          this.respuestaTabla(tabla.resumenPorProductoDivisaEstatus,tabla.totales);
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

  refrescar() {
    this.ngOnInit();
  }

  async buscar() {
    this.pagosRequest = {
      operacion: this.formSearch.value.operacion || null,
      divisa:this.formSearch.value.divisa || null,
      tipoPago:this.formSearch.value.tipoPago || null,
      estatus:null,
      cuentaCargo:null,
      cuentaAbono:null,
      canal:null,
      transactionId:null,
      referenciaCanal:null,
      importe:null,
      fechaInicio: null,
      fechaFin: null
    };
    try {
      await this.consultaTrackingApiService
        .buscarProductoDivisa(this.pagosRequest, this.fillObjectPag(0, 20))
        .then(async (result: any) => {
          this.respuestaTabla(result.resumenPorProductoDivisaEstatus,result.totales);
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

  Limpiar(){
    this.formSearch=this.formBuilder.group({
      /** Se reinicia el formulario*/
      operacion:'',
      tipoPago:'',
      divisa:''
    });
    this.pagosRequest = {
      operacion: null,
      divisa:null,
      tipoPago:null,
      estatus:null,
      cuentaCargo:null,
      cuentaAbono:null,
      canal:null,
      transactionId:null,
      referenciaCanal:null,
      importe:null,
      fechaInicio: null,
      fechaFin: null
    };
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
    //this.fc.onlyAlphabeticEspe(event);
  }
}
