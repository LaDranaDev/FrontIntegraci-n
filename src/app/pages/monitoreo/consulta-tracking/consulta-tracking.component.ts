import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ConsultaTrackingArchivoService } from 'src/app/services/monitoreo/consulta-tracking-archivo.service';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { Chart } from 'chart.js';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ComunesService } from 'src/app/services/comunes.service';


@Component({
  selector: 'app-consulta-tracking',
  templateUrl: './consulta-tracking.component.html',
  styleUrls: ['./consulta-tracking.component.css']
})
export class ConsultaTrackingComponent implements OnInit, OnDestroy {

  usuarioActual: string | null = '';
  content: any;
  // backend : datosBackend[] = [];
  submittedBuzonSearch = false;
  /** Variables para mostrar el boton o no de exportar*/
  banderaBtnExportar: boolean = true;

  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;
  /** Variable para indicar en que pagina se encuentra */
  page: number = 0;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 10;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinksTraking: boolean = true;
  showDirectionLinksTraking: boolean = true;
  public chart: any;
  public ch: any;
  /**
   * @description Formulario para la busqueda de paises
   * @type {FormGroup}
   * @memberOf GestionPaisesComponent
  */
  formSearchConTra!: FormGroup;

  datos: any;
  /** Objeto de paises para inicializar busqueda */
  consultaTracking = {
    codCliente: ""
  }
  objPageable:IPaginationRequest;
  
  TablaInferior:any;
  subtotal:any
  
  
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    /** */
    private fc: FuncionesComunesComponent,
    public consultaTrackingArchivoService: ConsultaTrackingArchivoService,
    private globals: Globals,
    public dialog: MatDialog,
    private translate: TranslateService,
    private comunService: ComunesService,
    
  ) {
    this.formSearchConTra = this.formBuilder.group({  /** Se inicializa el formulario para validar el search */
      codiCliente: ['', Validators.required]
    });
    //Se inicializa el objeto pageable
    this.objPageable = {
      page: this.page,
      size: this.rowsPorPagina,
      ruta: ''
    }
  }


  /** 
 * @descripcion Metodo para poder generar y regresar el objeto con la paginacion
 * 
 * @param numPage valor para indicar el numero de la pagina
 * @param totalItemsPage valor para indicar el total de elementos que se mostraran en la pagina
*/
  private fillObjectPag(numPage: number, totalItemsPage: number) {
    this.objPageable.page = numPage,
      this.objPageable.size = totalItemsPage;
      return this.objPageable;
    }
   
    clickSuscliption: Subscription | undefined;
    clickSuscliptionGraph: Subscription | undefined;


    ngOnInit(){
      //this.initForm();
      
      this.clickSuscliption = this.comunService.clickAtion.subscribe((resp:any) => {
        const { codeMenu } = resp;
        if (codeMenu === 1) {
          this.initForm();
        }
      });
      this.clickSuscliptionGraph = this.comunService.clickReloadGp.subscribe((resp: any) => {
        this.initForm()
      });
    }

    initForm(){
      /**Nos trae la tabla */
      this.usuarioActual = localStorage.getItem('UserID');
      this.getBuscarTotal();      
    }
  
    ngOnDestroy() {
      this.clickSuscliption?.unsubscribe();
      this.clickSuscliptionGraph?.unsubscribe();
    } 
 

  /*<div class="chart-container2" width="300px" height="300px">
  <canvas  id="MyChart2" >{{ chart2 }}</canvas>
</div>*/

  grafi: any
  da: any = []
  dat = []
  labe = []

  l: any
  t: any

  lab: string[] = []
  tab: number[] = []
  est: string[] = []
  tot: number[] = []

  /**
  * @descripcion Metodo para poder obtener el listado inicial de los parametros
  * 
  * @param objPaginacion objeto que contiene las propiedades de paginacion y busqueda
 */

  datosPrincipal: any
  datoSubtotal: any
  resultRequest(result: any, isWithClientCode?: boolean) {
    if(!isWithClientCode){
      this.detalle()  
    }
    this.validarChart();
    this.content = []
    this.est = []
    this.tot = []
    this.datos = '';
    this.datos = result.beanArchivoDetalle;
    this.datoSubtotal = result.beanArchivoDetalle
    this.datosPrincipal = result.beanArchivo
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
      this.est.push(this.content[dato].estatus)
      this.tot.push(this.content[dato].total)
      //resultado.push( this.content[dato]);
    }
    this.grafica(this.est, this.tot)

  }
  grafica(label: any, data: any) {
    this.chart = new Chart("MyChart", {
      type: 'pie', //this denotes tha type of chart
      options: {
        title: {
          display: true,
          text: this.translate.instant('aH2H')
        },
        legend: {
          position: 'bottom',
          onClick: (e) => e.stopPropagation()
        },
      },
      data: {// values on X-Axis
        labels: label,
        datasets: [
          {
            data: data,
            backgroundColor: [
              "#55ff55",
              "#c0c0c0",
              "#ffafaf",
              "#ff5555",
              "#55ffff",
              "#5555ff",
              "#ff55ff",
              "#f7f065"


            ]
          },

        ]
      },
    });
    this.globals.loaderSubscripcion.emit(false);
  }

  validarChart() {
    if (this.chart) {
      this.chart.destroy();
    }
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

  dataTableInferior(data:any){
    this.TablaInferior = data.detalleArchivo.content
    this.subtotal = data.subtotal
    this.totalElements = data.detalleArchivo.totalElements;
    if(this.totalElements > 0){
      this.banderaHasRows = true;
      this.banderaBtnExportar = true
    } else {
      this.open(
        this.translate.instant('buzon.msjINFOOKTitulo'), 
        this.translate.instant('consultaTracking.menssage'),
         'info', 'TRACKINGG007', '')
      this.banderaHasRows = false;
      this.banderaBtnExportar = false
    }
    this.globals.loaderSubscripcion.emit(false);
  }

  get formControlGraficoEstatusCliente() {
    return this.formSearchConTra.controls;
  }

  async getBuscarTotal() {
    try {
      await this.consultaTrackingArchivoService.inicio().then(
        async (result: any) => {
          this.resultRequest(result);
        }
      )
    } catch (e) {
      this.datos = {};
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        ''
      );
    }
  }
  async detalle(){
    this.TablaInferior = [];
    try {
      await this.consultaTrackingArchivoService.detalle(this.fillObjectPag(0, 10)).then(
        async (result: any) => {
          this.dataTableInferior(result);
          this.globals.loaderSubscripcion.emit(false);
        }
      )
    } catch (e) {
      this.datos = {};
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        ''
      );
    }
  }

  /**
   * Metodo para el link TOTAL
   * 
   * @param codigoCliente  Codigo Cliente
   * @param cliente  Cliente
   * @param number Numero de Operacion
   */
  total(codigoCliente: any, cliente: any, number: any) {
    var data: any = {
      "codCliente": codigoCliente,
      "cliente": cliente,
      "estatus": number
    }
    this.consultaTrackingArchivoService.setSaveLocalStorage('traking', data);
    this.router.navigate(['/monitoreo/consultaTracking/consultaTrackingArchivo']);
  }

  /**
   * @description Evento de click al momento de usar la paginacion
   * @memberOf GestionPaisesComponent
  */
  async onPageChanged(event: any) {
    this.page = 0
    this.page = event.page - 1;
    this.TablaInferior = [];
    try {
      await this.consultaTrackingArchivoService.detalle(this.fillObjectPag(this.page, 10)).then(
        async (result: any) => {
          this.dataTableInferior(result)
        })
    } catch (e) {
      this.datos = {};
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        ''
      );
    }

  }

  refresca() {
    this.buscar(true);
  }

  async onClickExportarGC() {
    try {
      var codigo = this.formSearchConTra.value.codiCliente
      await this.consultaTrackingArchivoService.excelTraking(codigo, this.usuarioActual).then(
        async (result: any) => {
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
  number(event: KeyboardEvent) {
    this.fc.numeros(event);
  }

  async buscar(refrescar : boolean) {
    var codigo = this.formSearchConTra.value.codiCliente
    if (codigo === '' && refrescar) {
      return this.open(
        this.translate.instant('monitoreo.error00001.titulo'),
        this.translate.instant('monitoreo.error00001.observacion'),
        'error',
        this.translate.instant('monitoreo.error00001.codigo'),
        this.translate.instant('monitoreo.error00001.sugerencia')
      );
    }

    this.TablaInferior = [];
    try {
     const consult = await this.consultaTrackingArchivoService.buscarCodCliente(codigo);
      this.resultRequest(consult, codigo ? true: false);
      try {
     const codCLientC = await  this.consultaTrackingArchivoService.buscarCodClienteTabla(codigo, this.fillObjectPag(0, 10));
       this.dataTableInferior(codCLientC);
       this.globals.loaderSubscripcion.emit(false);
    } catch (e) {
      this.datos = {};
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        ''
      );
    }
    } catch (e) {
      this.datos = {};
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        ''
      );
    }

  }


  onPaste(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let i = 0; i < textPasted.length; i++) {
      if (!this.fc.numerosP(textPasted[i].charCodeAt(0))) {
        i = textPasted.length;
        flag = false;
      }
    }
    return flag;
  }

}