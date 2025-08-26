import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormGroup } from '@angular/forms';
import { UntypedFormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { IConsultaCatalogo } from 'src/app/bean/iconsulta-catalogo-dinamico.component';
import { Globals } from 'src/app/bean/globals-bean.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { AltaCatalogo } from 'src/app/bean/alta-catalogo-dinamico.component';
import { TranslateService } from '@ngx-translate/core';
import { CatalogoDinamicoService } from 'src/app/services/administracion/catalogo-dinamico.service';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalConfirmComponent } from 'src/app/components/modals/modal-confirm/modal-confirm.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-catalogo-dinamico',
  templateUrl: './catalogo-dinamico.component.html',
  styleUrls: ['./catalogo-dinamico.component.css'],
})
export class CatalogoDinamicoComponent implements OnInit, OnDestroy {
  /** variable de control para saber si se realizoel submit del search */
  submittedCatalogoSearch = false;
  /** Variable para indicar en que pagina se encuentra */
  pageSelect: number = 0;
  page: number = 0;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPaginaSelect: number = 1000;
  rowsPage: number = 10;
  /** variable para indicar la accion seleccionada  */
  actions = false;
  /** Variables para el select del catalogo, la descripcion y el estatus */
  idSelectCatalogo: string = '';
  descripcionCatalogo: string = '';
  bandaEstatusCatalogo: string = '';
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinks: boolean = true;
  showDirectionLinks: boolean = true;
  /** Variable para poder guardar el id del sub catalogo seleccionado */
  idSubCatalogoDelete: number = 0;
  descripcionCatalogoSelect: string = '';

  /**
   * Atributo que representa el objeto que se
   * usara para poder realizar el guardado
   * o la actualizacion del catalogo
   */
  objetoSaveUpdCatalogo: AltaCatalogo = new AltaCatalogo();
  /**
   * Atributo que representa la lista para llenar el select
   * @memberof ConsultarCatalogoDinamicoComponent
   */
  listFillSelectCatalogos: any = [];
  /**
   * Atributo que representa la lista para llenar el select
   * @memberof ConsultarCatalogoDinamicoComponent
   */
  listFillTableSubCatalogos: IConsultaCatalogo[] = [];
  /**
   * @description Formulario para la busqueda de buzones
   * @type {FormGroup}
   * @memberOf ConsultarBuzonesComponent
   */
  formCatalogoDinamico: UntypedFormGroup;
  /**
   * @description Objeto para el evento de paginacion
   * y ademas contiene el buzon a buscar
   * @type {IPaginationRequest}
   * @memberof ConsultarCatalogoDinamicoComponent
   */
  objPageableSelect: IPaginationRequest;
  /**
   * @description Objeto para el evento de paginacion
   * para el listado de subcatalogos
   * @type {IPaginationRequest}
   * @memberof ConsultarCatalogoDinamicoComponent
   */
  objPageableTable: IPaginationRequest;
  /** Variable para mostrar los botones despues de haber dado de alta un catalogo*/
  banderaShowButtonsAgregarSubCat: boolean = false;

  constructor(
    private globals: Globals,
    private formBuilder: UntypedFormBuilder,
    private catalogosService: CatalogoDinamicoService,
    public dialog: MatDialog,
    private router: Router,
    private fc: FuncionesComunesComponent,
    private translate: TranslateService,
    private comunService: ComunesService,
  ) {
    /** Se inicializa el formulario para validar el search */
    this.formCatalogoDinamico = this.formBuilder.group({
      descripcion: ['', Validators.required],
      estatus: [''],
    });

    //Se inicializa el objeto pageable
    this.objPageableSelect = {
      page: this.pageSelect,
      size: this.rowsPorPaginaSelect,
      ruta: '',
    };

    //Se inicializa el objeto de pageable para la tabla
    this.objPageableTable = {
      page: this.page,
      size: this.rowsPage,
      ruta: '',
    };
  }

  /**
   * Inicializacion de componentes
   */
  clickSuscliption: Subscription | undefined;

  ngOnInit(){
    //this.initForm();
    
    this.clickSuscliption = this.comunService.clickAtion.subscribe(async (resp:any) => {
      const { codeMenu } = resp;
      if (codeMenu === 7) {
        this.initForm();   
      }
    });
  }

  async initForm(){
    this.onClickClean();
    this.cleanArrayFromTable();
    this.cleanFormCatalogo();
    await this.getConsultaListCatalogos();
    //this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    let objectLocalStorage =
      this.catalogosService.getSaveLocalStorage('regresa');
    if (objectLocalStorage == true) {
      this.catalogosService.removeSaveLocalStorage('regresa');
      let idCat = this.catalogosService.getSaveLocalStorage('idSelected');
      this.listFillSelectCatalogos.forEach((catalogo: any) => {
        if (catalogo['id'] == idCat) {
          /** Se asignan los valores seleccionados */
          this.descripcionCatalogo = catalogo['descripcion'];
          this.descripcionCatalogoSelect = catalogo['descripcion'];
          this.bandaEstatusCatalogo = catalogo['estatus'];
          this.idSelectCatalogo = idCat;
          /** Se obtiene el listado de sub catalogos */
          this.getInfSubCatalogoFromCatalogo();
        }
      });
    }
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }

  /**
   * @descripcion Metodo para poder obtener el listado inicial de catalogos
   *
   * @param objPaginacion objeto que contiene las propiedades de paginacion y busqueda
   */
  private async getConsultaListCatalogos() {
    try {
      await this.catalogosService
        .getistCatalogos(this.objPageableSelect)
        .then(async (result: any) => {
          if (result.content.length > 0) {
            /** Se habilita el metodo para proceso el result */
            this.listFillSelectCatalogos = result.content;
            this.globals.loaderSubscripcion.emit(false);
          } else {
            this.globals.loaderSubscripcion.emit(false);
            this.open(
              this.translate.instant('modals.catalogoDin.error'),
              this.translate.instant('modals.catalogoDin.error.consulta.registros'),
              'error',
              'ERRRC00'
            );
          }
        });
    } catch (e) {
      this.listFillSelectCatalogos = [];
      /** Se establece el page en el 0 */
      this.pageSelect = 0;
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modals.catalogoDin.error'),
        this.translate.instant('modals.catalogoDin.error.consulta'),
        'error'
      );
    }
  }

  /**
   * @description evento para poder levantar el modal para
   * mostrar los mensajes de sucess o error
   * @param titulo indica si se ejecutara para error o success
   * @param contenido mensaje que se mostrara en el modal
   */
  open(
    titulo: String,
    contenido: String,
    type?: any,
    code?: string,
    sugerencia?: string
  ) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        contenido,
        type,
        code,
        sugerencia
      ), hasBackdrop: true 
    });
  }

  /**
   * @descripcion Metodo para poder llenar el objeto
   * que se usara para el guardado y actualizacion
   * del catalogo
   */
  private fillObjectSaveUpdate() {
    this.objetoSaveUpdCatalogo.descripcion =
      this.formCatalogoDinamico.controls['descripcion'].value;
    if (!this.formCatalogoDinamico.controls['estatus'].value) {
      this.objetoSaveUpdCatalogo.estatus = 'I';
    } else {
      this.objetoSaveUpdCatalogo.estatus = 'A';
    }
  }

  /**
   * Metodo getter para utilziacion y validacion de formulario
   * en la vista
   */
  get formControlCatalogoDinamico() {
    return this.formCatalogoDinamico.controls;
  }

  /**
   * @description Metodo para poder procesar el result de la peticion de busquedas
   * de sub catalogos
   *
   * @param result objeto o arreglo que contiene la informacion del result
   * de las peticiones de busqueda
   */
  private processResultRequestTable(result: any) {
    this.listFillTableSubCatalogos = result.content;
    this.totalElements = result.totalElements;
    if (this.totalElements > 0) {
      this.banderaHasRows = true;
    } else {
      this.banderaHasRows = false;
    }
  }

  /**
   * @description Evento de click en el boton de Limpiar
   * @memberOf ConsultarBuzonesComponent
   */
  async onClickClean() {
    this.submittedCatalogoSearch = false;
    /** Se establece el page en el 0 */
    /** Se crea el objeto con la paginacion por default */
    //await this.getConsultaListCatalogos(this.fillObjectPag(this.page,this.rowsPorPagina,this.busquedaCatalogo));
  }

  /**
   * Metodo para poder realiar el onchange en el select
   */
  onChangeSelect(e: any) {
    /** Se obtiene el id del elemento seleccionado */
    if (e.target.value != '') {
      this.listFillSelectCatalogos.forEach((catalogo: any) => {
        if (catalogo['id'] == e.target.value) {
          /** Se asignan los valores seleccionados */
          this.descripcionCatalogo = catalogo['descripcion'];
          this.descripcionCatalogoSelect = catalogo['descripcion'];
          this.bandaEstatusCatalogo = catalogo['estatus'];
          this.setIdSelectedInLocalStorage();
        }
      });
      /** Se obtiene el listado de sub catalogos */
      this.getInfSubCatalogoFromCatalogo();
    } else {
      this.deleteIdSelectedInLocalStorage();
      this.descripcionCatalogo = '';
      this.bandaEstatusCatalogo = '';
      this.cleanArrayFromTable();
    }
  }

  /**
   * Metodo para poder realizar el guardado
   * del catalogo que aparecen en el select
   */
  guardarCatalogo() {
    if (this.descripcionCatalogo == '') {
      this.open(
        this.translate.instant('modals.catalogoDin.alerta'),
        this.translate.instant('modals.catalogoDin.alerta.descripcion.vacia'),
        'aviso'
      );
      return;
    }
    if (this.descripcionCatalogo == this.descripcionCatalogoSelect) {
      this.open(
        this.translate.instant('modals.catalogoDin.alerta'),
        this.translate.instant('modals.catalogoDin.alerta.registro.existente'),
        'aviso'
      );
      return;
    }
    /** Se realiza el llenado del obejto */
    this.fillObjectSaveUpdate();
    /** Se llama el metodo que realiza el registro del catalogo */
    this.saveCatalogoRequest();
  }

  /**
   * Metodo para poder realizar la peticion
   * para el guardado del catalogo
   */
  private async saveCatalogoRequest() {
    try {
      await this.catalogosService
        .saveCatalogo(this.objetoSaveUpdCatalogo)
        .then(async (result: any) => {
          this.cleanFormCatalogo();
          /** Se obtiene el listado nuevo */
          this.getConsultaListCatalogos();
          this.banderaHasRows = false;
          this.open(
            this.translate.instant('modals.catalogoDin.alerta'),
            this.translate.instant('modals.catalogoDin.alerta.guardado.regicata'),
            'aviso',
            'OK_RC01'
          );
        });
    } catch (e) {
      this.cleanFormCatalogo();
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modals.catalogoDin.error'),
        this.translate.instant('modals.catalogoDin.error.guardado.regicata'),
        'error',
        'ERRUPC3'
      );
    }
  }

  /**
   * Metodo para poder realizar la actualizacion
   * del catalogo que aparecen en el select
   */
  actualizarCatalogo() {
    if (this.descripcionCatalogo == '') {
      this.open(
        this.translate.instant('modals.catalogoDin.alerta'),
        this.translate.instant('modals.catalogoDin.alerta.descripcion.vacia'),
        'aviso'
      );
      return;
    }
    if (this.descripcionCatalogo == this.descripcionCatalogoSelect) {
      this.open(
        this.translate.instant('modals.catalogoDin.alerta'),
        this.translate.instant('modals.catalogoDin.alerta.descripcion.nomodificada'),
        'aviso',
        'OK_RC05'
      );
      return;
    }
    /** Se realiza el llenado del obejto */
    this.fillObjectSaveUpdate();
    /** Se llama el metodo que realiza la actualizacion del catalogo */
    this.updateCatalogoRequest();
  }

  /**
   * Metodo para poder realizar la actualizacion
   * del catalogo
   */
  private async updateCatalogoRequest() {
    try {
      await this.catalogosService
        .actualizarCatalogo(this.idSelectCatalogo, this.objetoSaveUpdCatalogo)
        .then(async (result: any) => {
          this.cleanFormCatalogo();
          /** Se obtiene el listado nuevo */
          this.getConsultaListCatalogos();
          this.banderaHasRows = false;
          this.banderaShowButtonsAgregarSubCat = false;
          this.open(
            this.translate.instant('modals.catalogoDin.alerta'),
            this.translate.instant('modals.catalogoDin.alerta.actualizacion.descripcion'),
            'info',
            'OK_RC05'
          );
        });
    } catch (e) {
      this.idSelectCatalogo = '';
      this.cleanFormCatalogo();
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modals.catalogoDin.error'),
        this.translate.instant('modals.catalogoDin.error.actualizacion.regicata'),
        'error',
        'ERRUPC3'
      );
    }
  }

  /**
   * Metodo para poder realizar la limpieza
   * del formulario despus de guardar o actualizar
   */
  cleanFormCatalogo() {
    this.formCatalogoDinamico.reset();
    this.idSelectCatalogo = '';
    this.descripcionCatalogo = '';
  }

  /**
   * Metodo para poder realizar la peticion
   * para obtener la informacion del sub catalogo
   * de un catalogo
   */
  private async getInfSubCatalogoFromCatalogo() {
    try {
      await this.catalogosService
        .getInformacionSubCatalogo(this.idSelectCatalogo, this.objPageableTable)
        .then(async (result: any) => {
          if (result.content.length > 0) {
            this.processResultRequestTable(result);
            this.globals.loaderSubscripcion.emit(false);
            this.banderaShowButtonsAgregarSubCat = false;
          } else {
            this.open(
              this.translate.instant('modals.catalogoDin.error'),
              this.translate.instant('modals.catalogoDin.error.consulta.registros'),
              'error',
              'ERRRC00'
            );
            this.globals.loaderSubscripcion.emit(false);
            this.banderaHasRows = false;
          }
        });
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modals.catalogoDin.error'),
        this.translate.instant('modals.catalogoDin.error.consulta.registros'),
        'error',
        'ERRRC00'
      );
      this.banderaHasRows = false;
      this.banderaShowButtonsAgregarSubCat = true;
    }
  }

  /**
   * Metodo para poder realizar la modificacion
   * del sub catalogo
   */
  editSubCatalogo(objSubCat: IConsultaCatalogo) {
    /** Se registra el buzon a editar en el localstorage */
    this.catalogosService.setSaveLocalStorage('subcatalogo', objSubCat);
    this.catalogosService.setShowButtonModificar(true);
    /** Se hace el redirect a la vista de alta */
    this.router.navigate([
      '/moduloAdministracion',
      'modificarCatalogoDinamico',
    ]);
  }

  /**
   * Metodo para poder agregar un nuevo sub catalogo a un catalogo
   */
  addSubCatalogo() {
    if (
      this.catalogosService.validatePropertyExisteInLocalStorage('subcatalogo')
    ) {
      this.catalogosService.removeSaveLocalStorage('subcatalogo');
    }
    if (this.catalogosService.isShowButtonModificar()) {
      this.catalogosService.setShowButtonModificar(false);
    }
    this.router.navigate([
      '/moduloAdministracion',
      'modificarCatalogoDinamico',
    ]);
  }

  /**
   * Metodo para poder guarar el id seleccionado
   * desde el select en el localstorage
   */
  setIdSelectedInLocalStorage() {
    this.catalogosService.setSaveLocalStorage(
      'idSelected',
      this.idSelectCatalogo
    );
    this.catalogosService.setSaveLocalStorage(
      'descriopcionSelected',
      this.descripcionCatalogo
    );
  }

  /**
   * Metodo para poder eliminar el id seleccionado
   * que se encuentra en el localstorage
   */
  deleteIdSelectedInLocalStorage() {
    this.catalogosService.removeSaveLocalStorage('idSelected');
    this.catalogosService.removeSaveLocalStorage('descriopcionSelected');
  }

  /**
   * Metodo para poder limpiar el arreglo
   * que contiene la informacion de la tabla
   * cuando se seleciona la opcion seleccione
   * en el select
   */
  cleanArrayFromTable() {
    this.listFillTableSubCatalogos = [];
    this.totalElements = 0;
    this.banderaHasRows = false;
  }

  /**
   * Evento para el paginado de la tabla
   */
  onPageChanged(e: any) {
    this.page = e.page - 1;
    this.objPageableTable.page = this.page;
    /** Se llama el metodo que obtendra la nueva informacion de la siguiente
     * o anterior pagina
     */
    this.getInfSubCatalogoFromCatalogo();
  }

  /**
   * Evento para el momento de seleccionar
   * una opcion del input type radio
   */
  onEventClickRadioButton(idSelSubCatalogo: number) {
    this.idSubCatalogoDelete = idSelSubCatalogo;
  }

  /**
   * Metodo del evento cuando se da click
   * en eliminar subcatalogo
   */
  onDeleteSubCatalogo() {
    /** Se utilza el metodo que realiza la peticion
     * para eliminar el subcatalogo
     */
    this.deleteSubCatalogo();
  }

  /**
   * Metodo para poder realizar la eliminacion
   * del sub catalogo seleccionado
   */
  private async deleteSubCatalogo() {
    try {
      await this.catalogosService
        .deleteInformacionSubCatalogo(this.idSubCatalogoDelete)
        .then(async (result: any) => {
          this.globals.loaderSubscripcion.emit(false);
          this.open(
            this.translate.instant('modals.catalogoDin.alerta'),
            this.translate.instant('modals.catalogoDin.alerta.eliminacion.registro.regicata'),
            'aviso',
            'OK_RC04'
          );
          this.onCleanAfterDelete();
        });
      /** Se ejecuta la peticion para obtener el nuevo listado */
      this.getInfSubCatalogoFromCatalogo();
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modals.catalogoDin.error'),
        this.translate.instant('modals.catalogoDin.error.eliminacion'),
        'error',
        'ERRND04'
      );
    }
  }

  /**
   * Metodo para limpiar elementos necesarios
   * despues del eliminar
   */
  onCleanAfterDelete() {
    this.idSubCatalogoDelete = 0;
    this.page = 0;
    this.objPageableTable.page = this.page;
  }

  /**
   * Abrir el modal de exportar los datos
   */
  openModalExportacion() {
    const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
    dialogo.afterClosed().subscribe((result) => {
      if (result) {
        this.generateReporte(result);
      }
    });
  }

  /**
   * Funcion para abrir el modal de confirmacion
   */
  openModalConfEliminar() {
    if (this.idSubCatalogoDelete == 0) {
      this.open(
        this.translate.instant('modals.catalogoDin.alerta'),
        this.translate.instant('modals.catalogoDin.alerta.catalogo.noseleccionado'),
        'aviso'
      );
      return;
    }
    let titulo = this.translate.instant('modals.catalogoDin.confirmacion');
    let contenido = this.translate.instant('modals.catalogoDin.confirmacion.eliminar.registros');
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, 'confirm'), hasBackdrop: true 
    });
    dialogo.afterClosed().subscribe((result) => {
      if (result) {
        this.onDeleteSubCatalogo();
      }
    });
  }

  /**
   * Metodo para poder realizar la peticion
   * para la obtencion del formato a exportar
   * en pdf
   */
  private async generateReporte(tipo: string) {
    if (tipo === 'xlsx') {
      tipo = 'xls';
    }
    try {
      await this.catalogosService
        .exportarInformacionCatalogo(Number(this.idSelectCatalogo), tipo)
        .then(async (result: any) => {
          /** Se manda la informacion para realizar la descarga del archivo */
          this.fc.convertBase64ToDownloadFileInExport(result);
          this.globals.loaderSubscripcion.emit(false);
        });
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modals.catalogoDin.error'),
        this.translate.instant('modals.error.exportacion'),
        'error'
      );
    }
  }
  /**
   * Metodo para poder realizar la actualizacion
   * del estatus del catalogo
   */
  actualizaStatusCatalogo() {
    /** Se realiza el llenado del obejto */
    this.fillObjectSaveUpdate();
    /** Se llama el metodo que realiza la actualizacion del catalogo */
    this.updateStatusCatalogo();
  }

  /**
   * Metodo para poder realizar la actualizacion
   * del estatus del catalogo
   */
  private async updateStatusCatalogo() {
    try {
      await this.catalogosService
        .actualizarCatalogo(this.idSelectCatalogo, this.objetoSaveUpdCatalogo)
        .then(async (result: any) => {
          this.globals.loaderSubscripcion.emit(false);
          this.cleanFormCatalogo();
          /** Se obtiene el listado nuevo */
          this.getConsultaListCatalogos();
          this.banderaHasRows = false;
          this.banderaShowButtonsAgregarSubCat = false;
          this.open(
            this.translate.instant('modals.catalogoDin.info'),
            this.translate.instant('modals.catalogoDin.info.actualizacion.estatus'),
            'info',
            'OK_RC03'
          );
        });
    } catch (e) {
      this.idSelectCatalogo = '';
      this.cleanFormCatalogo();
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modals.catalogoDin.error'),
        this.translate.instant('modals.catalogoDin.error.actualizacion.registro.regicata'),
        'error',
        'ERRUPC3'
      );
    }
  }

  /**
   * Funcion que valida y muestra dialogo para que se seleccione un elemento del catalogo dinamico para
   * hacer la actualizacion del estatus
   *
   * @param event Propiedades del check de estatus
   */
  onChangeStatusCat(event: any) {
    if (this.descripcionCatalogo == '') {
      event.target.checked = false;
      this.open(
        this.translate.instant('modals.catalogoDin.alerta'),
        this.translate.instant('modals.catalogoDin.alerta.seleccione.estatus'),
        'aviso'
      );
      return;
    }
    let titulo = this.translate.instant('modals.catalogoDin.confirmacion');
    let contenido = this.translate.instant('modals.catalogoDin.confirmacion.modificar.estatus');
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, 'confirm'), hasBackdrop: true 
    });
    dialogo.afterClosed().subscribe((result) => {
      if (result) {
        this.actualizaStatusCatalogo();
      } else {
        if (event.target.checked) {
          event.target.checked = false;
        } else {
          event.target.checked = true;
        }
      }
    });
  }

  /**
   * Metodo para poder realizar la actualizacion
   * del estatus del subcatalogo
   *
   * @param objSubCatalogo Datos del request para la actualizacion del subcatalogo
   */
  actualizaStatusSubCatalogo(objSubCatalogo: IConsultaCatalogo) {
    /** Se define el valor del estatus del subcatalogo para su actualizacion */

    /** Se llama el metodo que realiza la actualizacion del subcatalogo */
    this.updateStatusSubCatalogo(objSubCatalogo);
  }

  /**
   * Metodo para realizar la actualizacion
   * del estatus del subcatalogo
   *
   * @param objSubCatalogo Datos del request para la actualizacion del subcatalogo
   */
  private async updateStatusSubCatalogo(objSubCatalogo: IConsultaCatalogo) {
    try {
      await this.catalogosService
        .updateInformacionSubCatalogo(objSubCatalogo.idReg, objSubCatalogo)
        .then(async (result: any) => {
          this.globals.loaderSubscripcion.emit(false);
          this.open(
            this.translate.instant('modals.catalogoDin.alerta'),
            this.translate.instant('modals.catalogoDin.alerta.actualizacion.regicata'),
            'aviso',
            'ACT_RC_OK'
          );
          this.getInfSubCatalogoFromCatalogo();
        });
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modals.catalogoDin.error'),
        this.translate.instant('modals.catalogoDin.error.actualizacion.registro.regicata'),
        'error',
        'ERRUPC3'
      );
    }
  }

  /**
   * Funcion que valida y muestra dialogo para que se seleccione un elemento del subcatalogo dinamico para
   * hacer la actualizacion del estatus
   *
   * @param objSubCatalogo Datos del request para la actualizacion del subcatalogo
   * @param event Propiedades del check de estatus
   */
  onChangeStatusSubCat(objSubCatalogo: IConsultaCatalogo, event: any) {
    let titulo = this.translate.instant('modals.catalogoDin.confirmacion');
    let contenido = this.translate.instant('modals.catalogoDin.confirmacion.modificar.estatus');
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, 'confirm'), hasBackdrop: true 
    });
    dialogo.afterClosed().subscribe((result) => {
      if (result) {
        if (event.target.checked) {
          objSubCatalogo.bandAct = 'A';
        } else {
          objSubCatalogo.bandAct = 'I';
        }
        this.actualizaStatusSubCatalogo(objSubCatalogo);
      } else {
        if (event.target.checked) {
          event.target.checked = false;
        } else {
          event.target.checked = true;
        }
      }
    });
  }

  /**
   * Funcion para validar el contenido de los inputs
   *
   * @param event Contenido del input
   */
  validateContenidoRegex(event: any) {
    let valor = event.target.value;
    valor = valor.replace(/[^A-Za-z0-9\-\_ ]/gi, '');
    event.target.value = valor;
  }

  eveValidateTextoDescripcion(event: KeyboardEvent) {
    this.fc.numerosCaracteres(event);
  }

  /**
   * @description evento para el evento de pegar en un input
   */
  eventoPaste(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let i = 0; i < textPasted.length; i++) {
      if (!this.fc.numerosCaracteresCopy(textPasted[i].charCodeAt(0))) {
        i = textPasted.length;
        flag = false;
      }
    }
    return flag;
  }
}
