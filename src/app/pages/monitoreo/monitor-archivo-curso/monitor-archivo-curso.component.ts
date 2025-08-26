import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, UntypedFormControl, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/bean/globals-bean.component';
import { MonitorArchivosEnCurso } from 'src/app/services/monitor-archivos-en-curso.service';
import { formatDate } from '@angular/common';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginator } from '../../../layout/CustomPaginatorConfiguration';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component'
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ComunesService } from 'src/app/services/comunes.service';

import { TranslateService } from '@ngx-translate/core';

import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';


@Component({
  selector: 'app-monitor-archivo-curso',
  templateUrl: './monitor-archivo-curso.component.html',
  styleUrls: ['./monitor-archivo-curso.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }  // Here
  ]
})
export class MonitorArchivoCursoComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filtros= true;
  fechaIni = new UntypedFormControl('', []);
  fechaFin = new UntypedFormControl('', []);
  numContrato = new UntypedFormControl('', []);
  nombreArchivo = new UntypedFormControl('', []);
  codigoCliente = new UntypedFormControl('', []);
  producto = new UntypedFormControl('', []);
  estatus = new UntypedFormControl('', []);
  displayedColumns: string[] = ['cliente', 'nombreArch', 'fechaRegistro', 'nombCanl', 'descEstatus', 'descProd', 'totalOper', 'totalMont'];
  submittedBuzonSearch = false;
  content = null;
  catEstatus = null;
  catProductos: any[] = [];
  dataSource: any;

    /** Variable para el producto seleccionado */
    productoSeleccionado: any = '';
    /** Variables para la obtencion de fecha inicial y final cuando cambie el date*/
    fechaInicialChange = "";
    fechaFinalChange = "";
    rut: any
    /**Variable para los productos */
    productos: any

    /**Variable para los divisa */
    divisa: any
    /**Variable para los tipos */
    tipo: any
    //panelOpenState: boolean = false;
    tablaMonitor: any
    tablaMoni: any;
    abrir: boolean = true;

    abrir1: boolean = false;
    abreFiltros = true
    abreTabla = false

    totalElements: any
    /** Variable para identificar si el listado contiene o no valores*/
    banderaHasRows: boolean = false;

    /** Variables para mostrar las vinetas de ultimo y primero */
    showBoundaryLinksMO: boolean = true;
    showDirectionLinksMO: boolean = true;
    hora: any
    rowsPorPagina: number = 26;
    /**
  * @description Objeto para el evento de paginacion
  * y ademas contiene el parametro a buscar
  * @type {IPaginationRequest}
  * @memberof ParametrosComponent
  */
    objPageable: IPaginationRequest;

    archi: any
    correoT: any
    importGlobal: any
    catalogo: any
    estat: any
    divi: any
    todos = true
    catHoras: any
    regreso = null
    valoresRetorno: any
    limiteOperaciones: any
    totalOperaciones: any
    usuarioActual: string | null = '';
    maxFromDate: Date | null;
    page: number = 1;

  matForm = this.fb.group({
    fechaIni: this.fechaIni,
    fechaFin: this.fechaFin,
    numContrato: this.numContrato,
    nombreArchivo: this.nombreArchivo,
    codigoCliente: this.codigoCliente,
    producto: this.producto,
    estatus: this.estatus
  });

  clickSuscliption: Subscription | undefined;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private service: MonitorArchivosEnCurso,
    private globals: Globals,
    private fc: FuncionesComunesComponent,
    public dialog: MatDialog,
    private comunService: ComunesService,
    private translate: TranslateService,
  ) {
    /** Se inicializa el formulario gestionMonitorArchivoCursoForm */
    this.objPageable = {
      page: this.page,
      size: this.rowsPorPagina,
      ruta: ''
    }
   }

  async ngOnInit() {
    this.clickSuscliption = this.comunService.clickAtion.subscribe((resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 5) {
        this.onClickClean();
        if (this.content === null) {
          this.consultarArchivosEnCurso();
          this.consultaCatalogos();
        }
      }
    });

  }



  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }

  async onPageChanged(event: any) {
    let fechaInicio = '';
    let fechaFin = '';

    if (this.fechaIni.value && this.fechaFin.value) {
      try {
        fechaInicio = formatDate(this.fechaIni.value, 'dd-MM-yyyy', 'en-MX');
        fechaFin = formatDate(this.fechaFin.value, 'dd-MM-yyyy', 'en-MX');
      } catch {

      }
    } else {
      this.fechaIni.setValue('');
      this.fechaFin.setValue('');
    }
    let request = {
      "buc": this.codigoCliente.value,
      "nombreArch":this.nombreArchivo.value,
      "fechaIni": fechaInicio,
      "fechaFin": fechaFin,
      "codCliente": this.codigoCliente.value,
      "nomArch": this.nombreArchivo.value,
      "numContrato": this.numContrato.value,
      "idProducto":this.producto.value,
      "idEstatus":this.estatus.value
    }
    this.page = event.page;
    this.tablaMonitor = [];
    this.service.consultar(request, this.fillObjectPag(this.page, this.rowsPorPagina)).then((tab: any) => {
      this.resultRequest(tab);
      this.globals.loaderSubscripcion.emit(false);

    });
  }

    /**
  * @descripcion Metodo para poder generar y regresar el objeto con la paginacion
  *
  * @param numPage valor para indicar el numero de la pagina
  * @param totalItemsPage valor para indicar el total de elementos que se mostraran en la pagina
 */
    private fillObjectPag(numPage: number, totalItemsPage: number) {
      this.objPageable.page = numPage-1,
        this.objPageable.size = totalItemsPage;
      return this.objPageable;
    }


  resultRequest(result: any) {
    this.tablaMonitor = result.content;
    this.totalElements = result.totalElements;
    this.limiteOperaciones = result.limiteOperaciones
    this.totalOperaciones = Math.ceil(parseFloat(this.totalElements) / 20);
    if (this.totalElements > 0) {
      this.banderaHasRows = true;
      this.abreTabla = true
      this.filtros = false
    } else {
      this.banderaHasRows = false;
      this.abreTabla = false
      this.filtros = true
    }
  }

  async consultaCatalogos(){
    await this.service.consultaCatEstatus().then(
      async (resp: any) => {
       this.catEstatus = resp;
       this.globals.loaderSubscripcion.emit(false);

     });

     await this.service.consultaCatProducto().then(
      async (resp: any) => {
       this.catProductos = resp;
       this.globals.loaderSubscripcion.emit(false);

     });
  }



  get formControlGestionMonitorArchivoCurso() {
    return this.matForm.controls;
  }

  onClickClean(){
    this.submittedBuzonSearch = false;
    this.matForm.reset();
  }

  public async eventoConsultar() {
    this.submittedBuzonSearch = true;
    this.submittedBuzonSearch = false;
  }

  async consultarArchivosEnCurso(){
    this.page = 1;
    let fechaInicio = '';
    let fechaFin = '';

    if (this.fechaIni.value && this.fechaFin.value) {
      try {
        fechaInicio = formatDate(this.fechaIni.value, 'dd-MM-yyyy', 'en-MX');
        fechaFin = formatDate(this.fechaFin.value, 'dd-MM-yyyy', 'en-MX');
      } catch {

      }
    } else {
      this.fechaIni.setValue('');
      this.fechaFin.setValue('');
    }

    let request = {
      "buc": this.codigoCliente.value,
      "nombreArch":this.nombreArchivo.value,
      "fechaIni": fechaInicio,
      "fechaFin": fechaFin,
      "codCliente": this.codigoCliente.value,
      "nomArch": this.nombreArchivo.value,
      "numContrato": this.numContrato.value,
      "idProducto":this.producto.value,
      "idEstatus":this.estatus.value
    }




     await this.service.consultar(request, this.fillObjectPag(this.page, this.rowsPorPagina)).then(
       (resp: any) => {
        this.resultRequest(resp);
        if(resp.content.length === 0){
          this.open(
            this.translate.instant('buzon.msjINFOOKTitulo'),
            this.translate.instant('consultaTracking.menssage'),
            'info',
            this.translate.instant('consultaTracking.msjTRACKING007'),
            ""
          );
        }
        this.globals.loaderSubscripcion.emit(false);
      });

      this.globals.loaderSubscripcion.emit(false);
  }

  open(
    titulo: string,
    contenido: string,
    type?: any,
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

  go(element: any){
    this.router.navigateByUrl(
      `/monitoreo/monitorArchivosEnCurso/nivelProducto/${btoa(
        JSON.stringify(element)
      )}`
    );

  }

  exportMonitorArchivos(){
    let fechaInicio = '';
    let fechaFin = '';

    if (this.fechaIni.value && this.fechaFin.value) {
      try {
        fechaInicio = formatDate(this.fechaIni.value, 'dd-MM-yyyy', 'en-MX');
        fechaFin = formatDate(this.fechaFin.value, 'dd-MM-yyyy', 'en-MX');
      } catch {

      }
    } else {
      this.fechaIni.setValue('');
      this.fechaFin.setValue('');
    }

    let request = {
      "buc": this.codigoCliente.value ? this.codigoCliente.value : "",
      "nombreArch":this.nombreArchivo.value ? this.nombreArchivo.value : "",
      "fechaIni": fechaInicio,
      "fechaFin": fechaFin,
      "codCliente": this.codigoCliente.value ? this.codigoCliente.value : "",
      "nomArch": this.nombreArchivo.value ? this.nombreArchivo.value : "",
      "numContrato": this.numContrato.value ? this.numContrato.value  : "",
      "idProducto":this.producto.value ? this.producto.value : "",
      "idEstatus":this.estatus.value ? this.estatus.value : "",
      "estatus": this.estatus.value ? this.estatus.value : "",
      "pagina": 0,
      "tamanioPagina": 0
    }
    this.service.exportMonitorArchivos(request).then(
     async(tabla: any)=>{
       if (tabla.data) {
         /** Se manda la informacion para realizar la descarga del archivo */
         this.fc.convertBase64ToDownloadFileInExport(tabla);
         this.globals.loaderSubscripcion.emit(false);
       } else {
         if (tabla.code === '404') {

           this.globals.loaderSubscripcion.emit(false);
         }else{

           this.globals.loaderSubscripcion.emit(false);
         }
       }
   })
 }

 refrescar(){
   this.consultarArchivosEnCurso();
}

}
