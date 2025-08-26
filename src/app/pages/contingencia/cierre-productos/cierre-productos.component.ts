import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { CierreProductoRespuesta } from 'src/app/interface/cierreProductoRespuesta.interface';
import { CierreProductosService } from 'src/app/services/contingencia/cierre-productos.service';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { ModalConfirmComponent } from 'src/app/components/modals/modal-confirm/modal-confirm.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ComunesService } from 'src/app/services/comunes.service';


@Component({
  selector: 'app-cierre-productos',
  templateUrl: './cierre-productos.component.html',
  styleUrls: ['./cierre-productos.component.css']
})
export class CierreProductosComponent implements OnInit, OnDestroy {
  nameBusqueda: string = '';
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;
  /** Variable para indicar en que pagina se encuentra */
  page: number = 0;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 10;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinks: boolean = true;
  showDirectionLinks: boolean = true;
  /** Variables para mostrar el boton o no de exportar*/
  banderaBtnExportar: boolean = true;
  /**
   * @description Formulario para la busqueda de paises
   * @type {FormGroup}
   * @memberOf GestionPaisesComponent
  */
  cierreProductosForm!: UntypedFormGroup;
  /**
  * Datos para llenar la tabla de paises
  */
  tabla: CierreProductoRespuesta[] = [];
  /** Objeto de cierreProdctos para inicializar busqueda */
  cierreProd = {
    idProducto: 0,
    descipcionProd: "",
    claveProducto: "",
    cveProdOper: "",
    hora: 0,
    minutos: 0,
    bandera: "",
    horaFin: 0,
  }
  /**
  * @description Objeto para el evento de paginacion
  * y ademas contiene el parametro a buscar
  * @type {IPaginationRequest}
  * @memberof ParametrosComponent 
  */
  objPageable: IPaginationRequest;

  constructor(
    private formBuilder: UntypedFormBuilder,
    /** */
    public cierreProdServices: CierreProductosService,
    private globals: Globals,
    public dialog: MatDialog,
    private fc: FuncionesComunesComponent,
    private translate: TranslateService,
    private comunService: ComunesService,
  ) {

    //Se inicializa el objeto pageable
    this.objPageable = {
      page: this.page,
      size: this.rowsPorPagina,
      ruta: ''
    }
  }
  
  clickSuscliption: Subscription | undefined;

  ngOnInit(){
    //this.initForm();
    
    this.clickSuscliption = this.comunService.clickAtion.subscribe((resp:any) => {
      const { codeMenu } = resp;
      if (codeMenu === 5) {
        this.initForm();
      }
    });
  }

  initForm(){
    this.getConsultaCierreProd(this.fillObjectPag(this.page, this.rowsPorPagina));
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
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

  /**
   * @descripcion Metodo para poder obtener el listado inicial de los parametros
   * 
   * @param objPaginacion objeto que contiene las propiedades de paginacion y busqueda
  */
  private async getConsultaCierreProd(objPaginacion: IPaginationRequest) {
    try {
      await this.cierreProdServices.getListacierreProd(objPaginacion).then(
        async (result: any) => {
          if (result.totalElements == 0) {
            this.open(
              this.translate.instant('consultaadmonusuario.msjINF00001Titulo'),
              this.translate.instant('modals.cierre.productos.error.consulta'),
              'info',
              'INF001',
              this.translate.instant('planCalidad.msjERR007Sugerencia')
            );
          } else {
            this.resultRequest(result);
          }
          this.globals.loaderSubscripcion.emit(false);
        }
      )
    } catch (e) {
      this.tabla = [];
      /** Se establece el page en el 0 */
      this.page = 0;
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('consultaadmonusuario.msjINF00001Titulo'),
        this.translate.instant('modals.cierre.productos.error.consulta'),
        'info',
        'INF001',
        this.translate.instant('planCalidad.msjERR007Sugerencia')
      );
    }
  }

  resultRequest(result: any) {
    this.tabla = result.content;
    this.totalElements = result.totalElements;
    if (this.totalElements > 0) {
      this.banderaHasRows = true;
    } else {
      this.banderaHasRows = false;
    }
    if (result.totalElements === 0) {
      this.banderaBtnExportar = false;
    } else {
      this.banderaBtnExportar = true;
    }
  }

  open(titulo: string, contenido: string, type?: any, code?: string, sugerencia?: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, code, sugerencia), hasBackdrop: true
    });
  }

  onPageChanged(event: any) {
    this.page = event.page - 1;
    this.getConsultaCierreProd(this.fillObjectPag(this.page, this.rowsPorPagina));
  }

  /**
   * @descripcion Metodo para poder inactivar el producto
   * 
   * @param objPaginacion objeto que contiene las propiedades de paginacion y busqueda
  */
  private async updateCierreProd(idProducto: any) {
    try {
      await this.cierreProdServices.updateCierreProd(idProducto).then(
        async (result: any) => {
          this.open(
            this.translate.instant('consultaadmonusuario.msjINF00001Titulo'),
            this.translate.instant('modals.cierre.productos.alerta.inactivar.producto'),
            'info',
            'INF002',
            ''
          );
          this.globals.loaderSubscripcion.emit(false);
          this.getConsultaCierreProd(this.fillObjectPag(this.page, this.rowsPorPagina));
        }
      )
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('pantalla.cierre.productos.msjERR005Titulo'),
        `${(this.translate.instant('pantalla.cierre.productos.msjERR005Observacion'))}`,
        'error',
        this.translate.instant('pantalla.cierre.productos.msjERR005Codigo'),
        `${(this.translate.instant('pantalla.cierre.productos.msjERR003Sugerencia'))}`
        )
      
    }
  }

  /**
  * Metodo para poder realizar update de Cierre producto
  */
  inactiveProducto(idProducto: any) {
    let titulo = this.translate.instant('modals.cierre.productos.confirmacion');
    let contenido = this.translate.instant('modals.cierre.productos.confirmacion.inactivar.producto');
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, "confirm"), hasBackdrop: true
    });
    dialogo.afterClosed().subscribe(result => {
      if (result) {
        this.updateCierreProd(idProducto);
      }
    });
  }

}
