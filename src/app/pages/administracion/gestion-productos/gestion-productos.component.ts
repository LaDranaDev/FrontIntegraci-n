import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GestionProductosRespuesta } from 'src/app/interface/gestionProductosRespuesta.interface';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/bean/globals-bean.component';
import { GestionProductosService } from 'src/app/services/administracion/gestion-productos.service';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { PerfilamientoService } from 'src/app/services/perfilamiento.service';

@Component({
  selector: 'app-gestion-productos',
  templateUrl: './gestion-productos.component.html',
  styleUrls: ['./gestion-productos.component.css']
})
export class GestionProductosComponent implements OnInit, OnDestroy {
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;
  /** Variable para indicar en que pagina se encuentra */
  page: number = 1;
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
  gestionProductosForm!: FormGroup;
  /**
  * Datos para llenar la tabla de paises
  */
  tabla: GestionProductosRespuesta[] = [];
  /** Objeto de paises para inicializar busqueda */
  /**
  * @description Objeto para el evento de paginacion
  * y ademas contiene el parametro a buscar
  * @type {IPaginationRequest}
  * @memberof ParametrosComponent 
  */
  objPageable: IPaginationRequest;
  usuarioActual: string | null = '';
  perfilamiento: any;
  agregarProducto: boolean = false;
  editarProducto: boolean = false;
  verPeriodo: boolean = false;
  verCont: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public gestionProductosService: GestionProductosService,
    public perfila: PerfilamientoService,
    private globals: Globals,
    private fc: FuncionesComunesComponent,
    public dialog: MatDialog,
    private comunService: ComunesService,
    private tranlateService: TranslateService

  ) {
    this.usuarioActual = localStorage.getItem('UserID');

    this.gestionProductosForm = this.formBuilder.group({  /** Se inicializa el formulario para validar el search */
      claveProd: [''],
      descripcion: ['']
    });
    //Se inicializa el objeto pageable
    this.objPageable = {
      page: this.page - 1,
      size: this.rowsPorPagina,
      ruta: ''
    }

  }

  clickSuscliption: Subscription | undefined;

  async ngOnInit() {
    //this.initForm();

    this.clickSuscliption = this.comunService.clickAtion.subscribe(async (resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 5) {
        /*this.perfilamiento = this.comunService.getSaveLocalStorage('perfilamiento');
        const usu = {
            "usuario": this.perfilamiento.usuario,
            "diferenciador": this.perfilamiento.diferenciador,
            "perfil": this.perfilamiento.perfil,
        }
    
        const perfil = {
          'perfilamientoUsuario': usu,
          "url" : "/administracion/productos/agregarproducto.do",
          "componente": "agregarproducto"
        }
        const perfil2 = {
          'perfilamientoUsuario': usu,
          "url" : "/administracion/productos/editarproducto.do",
          "componente": "editarproducto"
        }
        const perfil3 = {
          'perfilamientoUsuario': usu,
          "url" : "/administracion/productos/consultaPeriodoProd.do",
          "componente": "consultaPeriodo"
        }
        const perfil4 = {
          'perfilamientoUsuario': usu,
          "url" : "/administracion/productos/consultaContingenciaProd.do",
          "componente": "consultaContingencia"
        }

        try {
          await this.perfila.accion(perfil).then(
            async(result: any) => {
          if(result.message === 'La operacion es valida'){*/
        this.agregarProducto = true
        /*}
        await this.perfila.accion(perfil2).then( async(result: any) => {
          if(result.message === 'La operacion es valida'){*/
        this.editarProducto = true
        /*}
        await this.perfila.accion(perfil3).then(async(result: any) => {
          if(result.message === 'La operacion es valida'){*/
        this.verPeriodo = true
        /*}
        await this.perfila.accion(perfil4).then(async(result: any) => {
          if(result.message === 'La operacion es valida'){*/
        this.verCont = true
        /*}
        this.globals.loaderSubscripcion.emit(false);*/
        this.initForm();
        /*}
        )
      }
      )
    }
    )
  }
  )
}catch{
  this.globals.loaderSubscripcion.emit(false);
  this.open(this.tranlateService.instant('modals.moduloAdministracion.consultasBics.error.consulta'), '', 'error', '', '');

}*/
      }
    });
  }

  initForm() {
    this.onClickClean();
    this.loadPage();
    /**Nos trae todos los datos */
    this.getGestionProductos(this.fillObjectPag(this.page, this.rowsPorPagina));
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
    this.objPageable.page = numPage - 1,
      this.objPageable.size = totalItemsPage;
    return this.objPageable;
  }

  private async getGestionProductos(objPaginacion: IPaginationRequest) {
    /** Se crea el objeto con la paginacion */
    const claveProd = this.gestionProductosForm.value.claveProd;
    const descripcion = this.gestionProductosForm.value.descripcion;
    const producto = {
      "cveProd": claveProd,
      "descProd": descripcion
    }
    try {
      await this.gestionProductosService.getListaProductos(producto, objPaginacion).then(
        async (result: any) => {
          if (result.totalElements <= 0) {
            this.open(this.tranlateService.instant('modals.moduloAdministracion.consultasBics.error.consulta'), '', 'error', '', '');
            this.banderaHasRows = false;
            this.banderaBtnExportar = true;
          } else {
            this.resultRequest(result);
          }
          this.globals.loaderSubscripcion.emit(false);
        }
      )
    } catch (e) {
      this.tabla = [];
      /** Se establece el page en el 0 */
      this.page = 1;
      this.globals.loaderSubscripcion.emit(false);
      this.open(this.tranlateService.instant('modals.moduloAdministracion.consultasBics.error.consulta'), '', 'error', '', '');
    }
  }

  resultRequest(result: any) {
    this.tabla = result.content;
    this.totalElements = result.totalElements;
    if (this.totalElements > 0) {
      this.banderaHasRows = true;
      this.banderaBtnExportar = false;
    } else {
      this.banderaHasRows = false;
      this.banderaBtnExportar = true;
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

  async onPageChanged(event: any) {
    this.page = event.page;
    this.getGestionProductos(this.fillObjectPag(this.page, this.rowsPorPagina))
  }

  onClickClean() {
    /**Se limpia el formulario de busqueda */
    this.gestionProductosForm.reset();
  }

  searchProductos() {
    if (this.gestionProductosForm.invalid) {
      return;
    }
    this.page = 1;
    this.getGestionProductos(this.fillObjectPag(this.page, this.rowsPorPagina));
  }

  get formControlSearch() {
    return this.gestionProductosForm.controls;
  }

  goProducto(origen: any) {
    this.savePage();
    this.router.navigate(['/moduloAdministracion/producto/', origen], { queryParams: origen });
  }

  goEnviarProducto(origen: any, id: any) {
    this.savePage();
    this.router.navigate(['/moduloAdministracion/productos/', origen, id], { queryParams: { origen: origen, id: id } });
  }

  goContingencia(origen: any, id: any, descProd: any) {
    this.savePage();
    this.router.navigate(['/moduloAdministracion/contingencia/', origen, id, descProd], { queryParams: { origen: origen, id: id, descProd: descProd } });
  }

  onClickExportar() {
    const producto = {
      "cveProd": this.gestionProductosForm.value.claveProd,
      "descProd": this.gestionProductosForm.value.descripcion
    }
    this.gestionProductosService.reporteXls(producto, this.usuarioActual).then(result => {
      this.fc.convertBase64ToDownloadFileInExport(result);
      this.globals.loaderSubscripcion.emit(false);
    });
  }

  /**
   * Evento para solo permitir escritura
   * del alphabeto
   */
  eventOnlyAlphabeticAndNumbers(event: KeyboardEvent) {
    this.fc.onlyAlphabeticAndNumbers(event);
  }

  loadPage() {
    const page = sessionStorage.getItem('GestionProductosComponentPage');
    if (page) {
      this.page = JSON.parse(page);
      sessionStorage.removeItem('GestionProductosComponentPage');
    }
  }

  savePage() {
    sessionStorage.setItem('GestionProductosComponentPage', JSON.stringify(this.page));
  }

}
