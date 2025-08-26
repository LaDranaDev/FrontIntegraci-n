import { Component, OnDestroy, OnInit } from '@angular/core';
import { Globals } from 'src/app/bean/globals-bean.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsultaTrackingArchivoService } from 'src/app/services/monitoreo/consulta-tracking-archivo.service';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { MonitorOperacionesService } from 'src/app/services/monitoreo/monitor-operaciones.service';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-consulta-archivo',
  templateUrl: './consulta-archivo.component.html',
  styleUrls: ['./consulta-archivo.component.css']
})
export class ConsultaArchivoComponent implements OnInit, OnDestroy {

  usuarioActual: string | null = '';
  archivo: any = undefined
  datos: any = undefined
  conten: any = undefined
  traking: any
  pageTitleName: any
  banderaArchDuplicados: any
  objPageable: IPaginationRequest;
  formSearchArchivo!: FormGroup;
  data: any
  producto: any
  banderaBtnExportar: boolean = true;
  estatusOperacion: any
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;
  /** Variable para indicar en que pagina se encuentra */
  page: number = 0;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 10;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinksConsultaArchivo: boolean = true;
  showDirectionLinksConsultaArchivo: boolean = true;
  archi: any
  // Catalogos
  catalogo: any;
  estat: any;


  constructor(
    public consultaTrackingArchivoService: ConsultaTrackingArchivoService,
    private monitor: MonitorOperacionesService,
    private globals: Globals,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router,
    private fc: FuncionesComunesComponent,
    private translate: TranslateService,
  ) {
    this.usuarioActual = localStorage.getItem('UserID');
    this.formSearchArchivo = this.formBuilder.group({  /** Se inicializa el formulario para validar el search */
      producto: [''],
      estatus: ['']
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


  ngOnInit() {
    
    this.archivo = this.consultaTrackingArchivoService.getSaveLocalStorage('archivo');
    this.traking = this.consultaTrackingArchivoService.getSaveLocalStorage('traking');
    this.consnomArchivo();

    this.initForm();
  }


  async initForm() {
    // Consultamos el Catalogo y Estatus de Productos
    try {
      await this.monitor.catalogos().then(
        async (productos: any) => {
          this.catalogo = productos.operationsMonitorCatalogsResponse.productos;
          this.estatusOperacion = productos.operationsMonitorCatalogsResponse.estatus
        })
    } catch (e) {
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        ''
      );
    }
    //this.globals.loaderSubscripcion.emit(false);
  }




  async consnomArchivo() {
    //this.resultRequest(this.archivo)
    var nom = this.archivo.nombreArchivo
    try {
      await this.consultaTrackingArchivoService.iniciaNivelProducto(this.traking, this.archivo).then(
        async (resp: any) => {
          this.archi = resp
          this.respuesta(resp)
        await this.consultaTrackingArchivoService.nivelProductoDetalle(this.archivo, this.fillObjectPag(0,10)).then(
          async(resp:any)=>{
          this.respuestaTabla(resp)
          this.globals.loaderSubscripcion.emit(false);
        })
        })
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

  ngOnDestroy(): void {
    this.consultaTrackingArchivoService.setSaveLocalStorage('archDupPage', null);


  }
  respuestaTabla(data: any) {
    this.conten = data.content
    this.totalElements = data.totalElements;
    if (this.totalElements > 0) {
      this.banderaHasRows = true;
      this.banderaBtnExportar = true
    } else {
      this.banderaHasRows = false;
      this.banderaBtnExportar = false
      this.open('Info', this.translate.instant('consultaTracking.menssage'), 'info');
    }
  }
  respuesta(data: any) {
    this.data = data.archivo;
    this.producto = data.listProducto;
    this.estatusOperacion = data.listEstatus;
  }


  operacion(data: any) {
    this.consultaTrackingArchivoService.setSaveLocalStorage('operacion', data);
    this.consultaTrackingArchivoService.setSaveLocalStorage('totalOperaciones', null);
    this.router.navigate(['/monitoreo/consultaTracking/consultaOperacion']);
  }

  totalOperaciones(data: any) {
    this.consultaTrackingArchivoService.setSaveLocalStorage('operacion', null);
    this.consultaTrackingArchivoService.setSaveLocalStorage('totalOperaciones', data);
    this.router.navigate(['/monitoreo/consultaTracking/consultaOperacion']);
  }

  /**
   * @description Evento de click al momento de usar la paginacion
   * @memberOf GestionPaisesComponent
  */
  async onPageChanged(event: any) {
    this.page = 0
    this.page = event.page - 1;
    this.conten = [];
    this.consultaTrackingArchivoService.nivelProductoDetalle(this.archivo, this.fillObjectPag(this.page, 10)).then((resp: any) => {
      this.respuestaTabla(resp.content)
      this.globals.loaderSubscripcion.emit(false);
    })
  }

  async exportar3() {
    var produc = this.formSearchArchivo.value.producto
    var estatu = this.formSearchArchivo.value.estatus
    try {
      await this.consultaTrackingArchivoService.exportarProducto(this.archivo.idArchivo, estatu, produc, this.traking.codCliente, this.usuarioActual).then(
        async (tabla) => {
          if (tabla.data) {
            /** Se manda la informacion para realizar la descarga del archivo */
            this.fc.convertBase64ToDownloadFileInExport(tabla);
            this.globals.loaderSubscripcion.emit(false);
          } else {
            if (tabla.code === '404') {
              this.open('Error', tabla.message, 'error');
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
        })
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

  async buscarNivelProducto() {
    var produc = this.formSearchArchivo.value.producto
    var estatu = this.formSearchArchivo.value.estatus
    if (produc === '' && estatu === '') {
      this.open(
        this.translate.instant('modals.catalogoDin.alerta'),
        this.translate.instant('SCB'), 'alert');
      return
    }
    try {
      await this.consultaTrackingArchivoService.buscarProducto(this.archivo.idArchivo, estatu, produc, this.fillObjectPag(this.page, 20)).then(
        async (tabla) => {
          this.respuestaTabla(tabla)
          this.globals.loaderSubscripcion.emit(false);
        })
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

  refrescar() {
    this.ngOnInit();
  }
  /**
 * Metodo para poder realizar la exportacion de archivos
 */

  regresar() {
    this.consultaTrackingArchivoService.setSaveLocalStorage('archivo', null);

    if (this.banderaArchDuplicados) {
      this.router.navigate(['/duplicados/monitorArchivosDuplicados']);
      return;
    }
    return this.router.navigate(['/monitoreo/consultaTracking/consultaTrackingArchivo']);
  }
  onClickExportarGC(tipoExportacion: string) {
    if (tipoExportacion === 'xlsx' || tipoExportacion === 'csv') {
      tipoExportacion = 'xls'
    }
    /*this.monitor.exportar(tipoExportacion, expor).then((result: any) => {
        if (result.data) {
          /** Se manda la informacion para realizar la descarga del archivo *
          this.fc.convertBase64ToDownloadFileInExport(result);
          this.open('Éxito', 'Se descargo correctamente el archivo.');
          this.globals.loaderSubscripcion.emit(false);
        } else {
          if (result.code === '404') {
            this.openModalError('Error', result.message);
            this.globals.loaderSubscripcion.emit(false);
          }else{
            this.openModalError('Error', ' Ocurrió un error al realizar la exportación en formato PDF.');
            this.globals.loaderSubscripcion.emit(false);
          }
        }
      });*/
  }
}
