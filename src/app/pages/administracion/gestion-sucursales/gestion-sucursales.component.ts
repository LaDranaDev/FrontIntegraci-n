import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SucursalesRespuesta } from 'src/app/interface/sucursalesRespuesta.interface';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/bean/globals-bean.component';
import { GestionSucursalesService } from 'src/app/services/administracion/gestion-sucursales.service';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { TranslateService } from '@ngx-translate/core';
import { ModalConfirmComponent } from 'src/app/components/modals/modal-confirm/modal-confirm.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gestion-sucursales',
  templateUrl: './gestion-sucursales.component.html',
  styleUrls: ['./gestion-sucursales.component.css'],
})
export class GestionSucursalesComponent implements OnInit, OnDestroy {
  cpBusqueda: string = '';
  sucurBusqueda: string = '';

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
  gestionSucursalesForm!: UntypedFormGroup;
  /**
   * Datos para llenar la tabla de paises
   */
  tabla: SucursalesRespuesta[] = [];
  /** Objeto de paises para inicializar busqueda */
  sucursal = {
    id: '',
    sucursal: '',
    latitud: '',
    longitud: '',
    direccion: '',
    cp: '',
    activo: '',
  };
  /**
   * @description Objeto para el evento de paginacion
   * y ademas contiene el parametro a buscar
   * @type {IPaginationRequest}
   * @memberof ParametrosComponent
   */
  objPageable: IPaginationRequest;
  ids: any[] = [];

  constructor(
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private fc: FuncionesComunesComponent,
    /** */
    public service: GestionSucursalesService,
    private globals: Globals,
    public dialog: MatDialog,
    private translate: TranslateService,
    private comunService: ComunesService,    
  ) {
    this.gestionSucursalesForm = this.formBuilder.group({
      /** Se inicializa el formulario para validar el search */
      cp: ['', Validators.required],
      sucursal: ['', Validators.required],
    });
    //Se inicializa el objeto pageable
    this.objPageable = {
      page: this.page,
      size: this.rowsPorPagina,
      ruta: '',
    };
  }


  clickSuscliption: Subscription | undefined;

  ngOnInit(){
    //this.initForm();
    
    this.clickSuscliption = this.comunService.clickAtion.subscribe((resp:any) => {
      const { codeMenu } = resp;
      if (codeMenu === 9) {
        this.initForm();
      }
    });
  }

  initForm(){
    this.cleanFiltros()
    this.getAllSucursales(this.fillObjectPag(this.page, this.rowsPorPagina));
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
    (this.objPageable.page = numPage), (this.objPageable.size = totalItemsPage);
    return this.objPageable;
  }

  private async getAllSucursales(objPaginacion: IPaginationRequest) {
    try {
      await this.service
        .getAllSucursales(objPaginacion)
        .then(async (result: any) => {
          if (result.totalElements > 0) {
            this.resultRequest(result);
          } else {
            this.open(
              this.translate.instant('pantallas.moduloAdministracion.gestionValidacionesCanal.noResultados.ERRRC00Titulo'),
              this.translate.instant('modals.sucursales.error.consulta'),
              'info',
              this.translate.instant('modals.sucursales.error.consulta.ERRRC01Codigo')
            );
          }
          this.globals.loaderSubscripcion.emit(false);
        });
    } catch (e) {
      this.tabla = [];
      this.banderaHasRows = false;
      /** Se establece el page en el 0 */
      this.page = 0;
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modals.sucursales.error'),
        this.translate.instant('modals.sucursales.error.consulta'),
        'error',
        this.translate.instant('modals.sucursales.error.consulta.ERRRC01Codigo')
      );
    }
  }

  private async getSucursalesByFiltro(sucursal: any, cp: any) {
    try {
      await this.service
        .getSucursalesByFiltro(sucursal, cp)
        .then(async (result: any) => {
          if (result.totalElements > 0) {
            this.resultRequest(result);
          } else {
            this.tabla = [];
            this.banderaHasRows = false;
            this.totalElements = 0;
            this.open(
              this.translate.instant('gestionValidaciones.msjERRRC00Titulo'),
              this.translate.instant('modals.sucursales.error.consulta.sininfo'),
              'info',
              this.translate.instant('modals.sucursales.error.consulta.ERRRC00Codigo')
            );
          }
          this.globals.loaderSubscripcion.emit(false);
        });
    } catch (e) {
      this.tabla = [];
      this.banderaHasRows = false;
      /** Se establece el page en el 0 */
      this.page = 0;
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modals.sucursales.error'),
        this.translate.instant('modals.sucursales.error.consulta'),
        'error',
        this.translate.instant('modals.sucursales.error.consulta.ERRRC01Codigo')
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

  open(
    titulo: string,
    contenido: string,
    type?: any,
    errorCode?: string,
    sugerencia?: string
  ) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        contenido,
        type,
        errorCode,
        sugerencia
      ), hasBackdrop: true
    });
  }

  get formControlSearch() {
    return this.gestionSucursalesForm.controls;
  }

  cleanFiltros() {
    /**Se limpia el formulario de busqueda */
    this.gestionSucursalesForm.reset();
    this.ids = [];
  }

  async searchSucursal() {
    let sucursal = this.sucurBusqueda;
    let cp = this.cpBusqueda;
    if (sucursal === null) {
      sucursal = '';
    }
    if (cp === null) {
      cp = '';
    }
    if (sucursal === '' && cp === '') {
      this.getAllSucursales(this.fillObjectPag(this.page, this.rowsPorPagina));
    } else {
      this.getSucursalesByFiltro(sucursal, cp);
    }
  }

  onPageChanged(event: any) {
    this.page = event.page - 1;
    this.getAllSucursales(this.fillObjectPag(this.page, this.rowsPorPagina));
  }

  goAddSucursal() {
    if (this.service.validatePropertyExisteInLocalStorage('dato')) {
      this.service.removeSaveLocalStorage('dato');
    }
    this.router.navigate(['/moduloAdministracion', 'sucursal']);
  }

  goUpdateSucursal(dato: any) {
    this.service.setSaveLocalStorage('dato', dato);
    this.router.navigate(['/moduloAdministracion', 'sucursal']);
  }

  deleteSucursal() {
    if (this.ids.length <= 0) {
      this.open(
        this.translate.instant('modals.sucursales.alerta'),
        this.translate.instant('modals.sucursales.alerta.seleccione.registro')
        ),
        'alert',
        this.translate.instant('modals.sucursales.error.consulta.ERR001Codigo');
      return;
    }
    let titulo = this.translate.instant('modals.sucursales.confirmacion');
    let contenido = this.translate.instant('modals.sucursales.confirmacion.eliminar.registros');
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, 'confirm'), hasBackdrop: true
    });
    dialogo.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteSucursalesById();
      }
    });
  }

  /** Metodo para eliminar las sucursales por id */
  async deleteSucursalesById() {
    this.page = 0;
    try {
      await this.service.deleteSucursal(this.ids).then(async (result: any) => {
        if (result.error === 'OK00000') {
          this.open(
            this.translate.instant('modals.sucursales.alerta'),
            this.translate.instant('modals.sucursales.alerta.eliminacion'),
            'info',
            this.translate.instant(
              'modals.sucursales.alerta.eliminacion.OK0002Codigo'
            )
          );
        } else {
          this.open(
            this.translate.instant('modals.sucursales.error'),
            this.translate.instant('modals.sucursales.error.eliminacion'),
            'error',
            this.translate.instant(
              'modals.sucursales.error.eliminacion.ERRRC02Codigo'
            )
          );
        }
        this.globals.loaderSubscripcion.emit(false);
        this.getAllSucursales(
          this.fillObjectPag(this.page, this.rowsPorPagina)
        );
      });
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modals.sucursales.error'),
        this.translate.instant('modals.sucursales.error.eliminacion'
        ),
        'error',
        this.translate.instant(
          'modals.sucursales.error.eliminacion.ERRRC02Codigo'
        )
      );
    }
  }

  onChangeChkSeleccionar(e: any, idSucursal: any) {
    let index = this.ids.indexOf(idSucursal);
    if (e.target.checked) {
      if (index === -1) {
        this.ids.push(idSucursal);
      }
    } else {
      if (index !== -1) {
        this.ids = this.ids.slice(idSucursal, 1);
      }
    }
  }

  /**
   * Abrir el modal de exportar los datos
   */
  exportSucursales() {
    const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
    dialogo.afterClosed().subscribe((result) => {
      if (result) {
        this.generateReporte(result);
      }
    });
  }

  /**
   * Metodo para poder realizar la peticion para el generar
   * reporte excel o csv
   */
  private async generateReporte(tipo: string) {
    let cp = this.gestionSucursalesForm.value.cp;
    let sucursal = this.gestionSucursalesForm.value.sucursal;
    try {
      await this.service
        .exportSucursales(sucursal, cp, tipo)
        .then(async (result: any) => {
          /** Se manda la informacion para realizar la descarga del archivo */
          this.fc.convertBase64ToDownloadFileInExport(result);
          this.globals.loaderSubscripcion.emit(false);
        });
    } catch (e) {
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant('modal.msjERRGEN0001Sugerencia')
      );
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  /**
   * Metodo que valida que se ingresen solo numero, en caso de que se quieran ingresar datos diferentes no se permitira
   */
  onlyNumbers(event: KeyboardEvent) {
    this.fc.numberOnly(event);
  }

  /**
   * Metodo que valida que solo se puedan pegar numeros en el input text
   */
  pasteOnlyNumbers(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let element of textPasted) {
      if (!this.fc.numberOnlyForPasteEvent(element.charCodeAt(0))) {
        flag = false;
      }
    }
    return flag;
  }

  /**
   * Metodo que valida que se ingresen solo mayusculas, minusculas, numeros, espacios y puntos, en caso de que se quieran ingresar datos diferentes no se permitira
   */
  onlyAlphaNumberPointAndSpace(event: KeyboardEvent) {
    this.fc.alphaNumberPointAndSpaceOnly(event);
  }

  /**
   * Metodo que valida que solo se puedan pegar mayusculas, minusculas, numeros, espacios y puntos en el input text
   */
  pasteOnlyAlphaNumberPointAndSpace(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let element of textPasted) {
      if (
        !this.fc.alphaNumberPointAndSpaceOnlyPasteEvent(element.charCodeAt(0))
      ) {
        flag = false;
      }
    }
    return flag;
  }
}
