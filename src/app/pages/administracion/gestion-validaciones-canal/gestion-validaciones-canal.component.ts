import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import {
  FormControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalAgregarValidacionCanalComponent } from 'src/app/components/modals/modal-agregar-validacion-canal/modal-agregar-validacion-canal.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { GestionValidacionCanalService } from 'src/app/services/administracion/gestion-validacion-canal.service';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GestionValidacionesCanal } from 'src/app/interface/consultaValidacionesCanal.interface';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { Subscription } from 'rxjs';
import { ComunesService } from 'src/app/services/comunes.service';

@Component({
  selector: 'app-gestion-validaciones-canal',
  templateUrl: './gestion-validaciones-canal.component.html',
})
export class GestionValidacionesCanalComponent implements OnInit, OnDestroy {
  /** Objeto para la paginacion */
  paginationRequest: IPaginationRequest;

  /** Variable para indicar en que pagina se encuentra */
  page: number = 0;

  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 10;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinksGvc: boolean = true;
  showDirectionLinksGvc: boolean = true;

  //Variable para los canales
  canales = 1;

  /**
   * @description Formulario para la busqueda gestion de alarmas
   * @type {FormGroup}
   * @memberOf GestionAlarmaConsultaComponent
   */
  formControlValidaciones: UntypedFormGroup = new UntypedFormGroup({});

  /** variable de control para saber si se realizo el submit de la consulta*/
  submittedSearch = false;
  pageSize: number = 20;
  tabla: GestionValidacionesCanal[] = [];
  returnedArray!: any;
  canal = {
    producto: '',
    layout: '',
    asignados: '',
  };

  /**
   * @description Objeto para el evento de paginacion
   * con el parametro a buscar
   * @type {IPaginationRequest}
   * @memberof ParametrosComponent
   */
  objPagination: IPaginationRequest;
  catLayout: { idCatalogo: string; descripcion: string }[] = [];
  productos: any;
  catAsignados: {
    id: string;
    idProducto: string;
    idLayout: string;
    descripcion: string;
  }[] = [];
  assign: boolean = false;
  habiAgregar = false;
  indexRadio = 0;
  gvcSelected: GestionValidacionesCanal | null;
  clickSuscliption: Subscription | undefined;
  suscriptionParams: Subscription | undefined;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private globals: Globals,
    public dialog: MatDialog,
    private gestionService: GestionValidacionCanalService,
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private fc: FuncionesComunesComponent,
    private comunService: ComunesService
      ) {
    /**
     * Se inicializa el formulario que se llenara
     * para poder realizar las busquedas
     */
    //Se inicializa el objeto
    this.objPagination = {
      page: this.page,
      size: this.rowsPorPagina,
      ruta: '',
    };
  }

  async ngOnInit(): Promise<void> {
    this.formControlValidaciones = this.initializeForm();
    await this.produc();
    await this.layo();
   this.suscriptionParams = this.route.queryParams.subscribe(async (p) => {
      const params = p as GestionValidacionesCanal;
      if (params.idProducto) {
        await this.selectProduct(params.idProducto);
        this.formControlValidaciones.get('layout')?.enable();
        this.formControlValidaciones.get('asignados')?.enable();
        this.formControlValidaciones.patchValue({
          producto: params.idProducto,
          layout: params.idLayout,
          asignados: params.asignado,
        });
        if (params.getConsult === 'true') {
          await this.buscar();
        }
        this.formControlValidaciones.get('layout')?.disable();
      }
    });
    this.clickSuscliption = this.comunService.clickAtion.subscribe((resp) => {
      const action = resp;
      if (action) {
        this.onClickLimpiar();
      }
    });
  }

  async produc(): Promise<void> {
    const result = await this.gestionService.getProductos();
    this.productos = result;
    this.globals.loaderSubscripcion.emit(false);
  }
  async layo(): Promise<void> {
    const result = (await this.gestionService.getLayouts()) as {
      idCatalogo: string;
      descripcion: string;
    }[];
    this.catLayout = result;
    this.globals.loaderSubscripcion.emit(false);
  }

  async selectProduct(e: any): Promise<void> {
    this.formControlValidaciones.get('layout')?.setValue('');
    this.formControlValidaciones.get('asignados')?.setValue('');
    this.tabla = [];
    const seleccionProducto = e.target?.value ? e.target.value : e;
    if (seleccionProducto !== '') {
      this.formControlValidaciones.get('asignados')?.enable();
      this.habiAgregar = true;
      const getLayout = (await this.gestionService.getAsignados(
        seleccionProducto
      )) as any[];
      this.catAsignados = getLayout;
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  selectAsignados(e: any) {
    var seleccionAsignado = this.catAsignados.find(
      (a) => a.id === e.target.value
    );
    const findLayout = this.catLayout.find(
      (l) => l.idCatalogo === seleccionAsignado?.idLayout
    );
    this.formControlValidaciones.patchValue({
      layout: findLayout?.idCatalogo,
    });
  }

  async asignar(): Promise<void> {
    let saveSuccess = false;
    if (this.formControlValidaciones.value.producto !== '') {
      this.formControlValidaciones.get('layout')?.enable();
      this.formControlValidaciones.get('asignados')?.disable();
      if (this.formControlValidaciones.value.layout !== '') {
        if (this.formControlValidaciones.value.claveRelacion !== '') {
          if (this.formControlValidaciones.value.descripcionRelacion !== '') {
            const guardaAsignado = {
              clave: this.formControlValidaciones.value.claveRelacion,
              descripcion:
                this.formControlValidaciones.value.descripcionRelacion,
              producto: this.formControlValidaciones.value.producto,
              layout: this.formControlValidaciones.getRawValue().layout,
            };
            const saveAssing = await this.gestionService.guardarAsignado(
              guardaAsignado
            );
            this.globals.loaderSubscripcion.emit(false);
            this.assign = false;
            this.formControlValidaciones.get('layout')?.disable();
            this.formControlValidaciones.get('asignados')?.enable();
            const getAssings = (await this.gestionService.getAsignados(
              this.formControlValidaciones.value.producto
            )) as any[];
            this.catAsignados = getAssings;
            saveSuccess = true;
            this.formControlValidaciones.patchValue({
              asignados: this.catAsignados.find(
                (v) => v.descripcion === guardaAsignado.descripcion
              )?.id,
              claveRelacion: '',
              descripcionRelacion: '',
            });
            this.globals.loaderSubscripcion.emit(false);
          } else {
            this.open(
              this.translateService.instant(
                'pantalla.moduloAdministracion.consultaValidacionesCanal.CamposVacios'
              ),
              this.translateService.instant(
                'modal.comun.mensaje.campos.descripcion'
              ),
              'alert',
              this.translateService.instant(
                'modals.sucursales.alerta.campo.latitud.vacio.VAL004Codigo'
              )
            );
          }
        } else {
          this.open(
            this.translateService.instant(
              'pantalla.moduloAdministracion.consultaValidacionesCanal.CamposVacios'
            ),
            this.translateService.instant('modal.comun.mensaje.campos.clave'),
            'alert',
            this.translateService.instant(
              'modals.sucursales.alerta.campo.cp.vacio.VAL003Codigo'
            )
          );
        }
        /*if(this.formControlValidaciones.invalid){
          return;
          this.open('Error','La clave relación y descripción de la relación es obligatorio para asignar')
        }else{
        }*/
      } else if (this.assign === true) {
        this.open(
          this.translateService.instant(
            'pantalla.moduloAdministracion.consultaValidacionesCanal.CamposVacios'
          ),
          this.translateService.instant('modal.comun.mensaje.campos.layout'),
          'alert',
          this.translateService.instant('gestionValidaciones.msjERRRC00Codigo')
        );
      }
      saveSuccess ? (this.assign = false) : (this.assign = true);
    } else {
      this.open(
        this.translateService.instant(
          'pantalla.moduloAdministracion.consultaValidacionesCanal.CamposVacios'
        ),
        this.translateService.instant(
          'pantalla.moduloAdministracion.consultaValidacionesCanal.seleccionarProducto'
        ),
        'alert',
        this.translateService.instant(
          'modals.sucursales.alerta.campo.sucursal.vacio.VAL001Codigo'
        )
      );
      this.globals.loaderSubscripcion.emit(false);
      return;
    }
  }
  agregar() {
    if (this.formControlValidaciones.value.asignados !== '') {
      const dialogo = this.dialog.open(ModalAgregarValidacionCanalComponent);
      dialogo.afterClosed().subscribe((result) => {
        if (result) {
          if (result.radio) {
            this.router.navigate(
              [
                '/moduloAdministracion',
                result.radio === 1 ? 'agregarCampo' : 'agregarValidacion',
              ],
              {
                queryParams: {
                  idProducto:
                    this.formControlValidaciones.get('producto')?.value,
                  idLayout: this.formControlValidaciones.get('layout')?.value,
                  asignado:
                    this.formControlValidaciones.get('asignados')?.value,
                  getConsult: this.tabla.length > 0 ? true : false,
                },
              }
            );
          }
        }
      });
    } else {
      this.open(
        this.translateService.instant(
          'pantalla.moduloAdministracion.consultaValidacionesCanal.CamposVacios'
        ),
        this.translateService.instant('modal.comun.mensaje.campos.asignado'),
        'error',
        this.translateService.instant(
          'modal.comun.mensaje.campos.descripcion.ERRRC10Codigo'
        )
      );
    }
  }

  /**
   * @description Metodo para poder inicializar el formulario y regresar dicho
   * formulario
   */
  private initializeForm() {
    return this.formBuilder.group({
      producto: [''],
      layout: [{ value: '', disabled: true }],
      asignados: [{ value: '', disabled: false }],
      claveRelacion: ['', [Validators.required]],
      descripcionRelacion: ['', [Validators.required]],
    });
  }

  /**
   * Metodo para poder realizar la limpieza
   * de los valores del formulario
   */
  onClickLimpiar() {
    this.formControlValidaciones = this.initializeForm();
    this.assign = false;
    this.tabla = [];
    this.banderaHasRows = false;
    this.catAsignados = [];
  }

  /**
   * @descripcion Metodo para poder generar y regresar el objeto con la paginacion
   *
   * @param numPage valor para indicar el numero de la pagina
   * @param totalItemsPage valor para indicar el total de elementos que se mostraran en la pagina
   */
  private fillObjectPag(numPage: number, totalItemsPage: number) {
    this.objPagination.page = numPage;
    this.objPagination.size = totalItemsPage;
    return this.objPagination;
  }

  /**
   * @description evento para poder levantar el modal para
   * mostrar los mensajes de sucess o error
   * @param titulo indica si se ejecutara para error o success
   * @param contenido mensaje que se mostrara en el modal
   */
  open(
    titulo: string,
    contenido: string,
    type?: any,
    errorCode?: string,
    sugerencia?: string,
    isEnglisType?: boolean
  ) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        contenido,
        type,
        errorCode,
        sugerencia,
        isEnglisType
      ), hasBackdrop: true
    });

    dialogo.afterClosed().subscribe(async result => {
      if (result === 'ok') {
        const deleteCall = (await this.gestionService.deleteValidacion(
          this.gvcSelected?.id as string
        )) as { error: string; message: string };
        if (deleteCall.error) {
          this.open(
            this.translateService.instant(
              'pantallas.moduloAdministracion.gestionValidacionesCanal.noResultados.ERRRC00Titulo'
            ),
            deleteCall.message,
            'info',
            this.translateService.instant('convenios.errores.msjOK0002Codigo'),
            '',
          );
        }
        this.gvcSelected = null;
        await this.buscar();

      }
    });
  }

  get layout(): FormControl {
    return this.formControlValidaciones.controls['layout'] as FormControl;
  }
  get asignados(): FormControl {
    return this.formControlValidaciones.controls['asignados'] as FormControl;
  }

  /**
   * Para la consulta de los canales
   */
  async buscar(): Promise<void> {
    const layout = this.formControlValidaciones.get('layout')?.value as string;
    const assignees = this.formControlValidaciones.get('asignados')
      ?.value as string;
    const producto = this.formControlValidaciones.get('producto')
      ?.value as string;
    if (!producto) {
      this.open(
        this.translateService.instant(
          'pantalla.moduloAdministracion.consultaValidacionesCanal.CamposVacios'
        ),
        this.translateService.instant(
          'pantalla.moduloAdministracion.consultaValidacionesCanal.seleccionarProducto'
        ),
        'alert',
        this.translateService.instant(
          'modals.sucursales.alerta.campo.sucursal.vacio.VAL001Codigo'
        )
      );
      this.globals.loaderSubscripcion.emit(false);
      return;
    } else if (!assignees) {
      this.open(
        this.translateService.instant(
          'pantalla.moduloAdministracion.consultaValidacionesCanal.CamposVacios'
        ),
        this.translateService.instant('modal.comun.mensaje.campos.layout'),
        'alert',
        this.translateService.instant(
          'modals.sucursales.alerta.campo.direccion.vacio.VAL002Codigo'
        )
      );
      this.globals.loaderSubscripcion.emit(false);
      return;
    }
    const getValidaciones = (await this.gestionService.validacionesCanal(
      producto,
      layout,
      this.pageSize,
      this.page
    )) as unknown as { content: GestionValidacionesCanal[] };
    if (getValidaciones?.content.length <= 0) {
      this.open(
        this.translateService.instant('gestionValidaciones.msjERRRC00Titulo'),
        this.translateService.instant(
          'gestionValidaciones.msjERRRC00Observacion'
        ),
        'info',
        this.translateService.instant('gestionValidaciones.msjERRRC00Codigo'),
        this.translateService.instant(
          'gestionValidaciones.msjERRRC00Sugerencia'
        )
      );
      this.globals.loaderSubscripcion.emit(false);
    }
    this.resultRequest(getValidaciones);
    this.globals.loaderSubscripcion.emit(false);
  }

  radio(data: GestionValidacionesCanal, index: number) {
    this.tabla[index].selected = !this.tabla[index].selected;
    this.gvcSelected = this.tabla[index].selected ? data : null;
  }

  resultRequest(result: any) {
    const tablaWithFlag: GestionValidacionesCanal[] = [];
    const mappedResult = result.content as GestionValidacionesCanal[];
    mappedResult.forEach((m: GestionValidacionesCanal) => {
      m.selected = false;
      tablaWithFlag.push(m);
    });
    this.tabla = tablaWithFlag;
    this.totalElements = result.totalElements;
    if (this.totalElements > 0) {
      this.banderaHasRows = true;
    } else {
      this.banderaHasRows = false;
    }
  }

  /**
   * @descripcion Metodo para poder obtener el listado inicial de los parametros
   *
   * @param objPaginacion objeto que contiene las propiedades de paginacion y busqueda
   */
  private async getConsultaCanal(objPaginacion: IPaginationRequest) {
    try {
      await this.gestionService
        .getListaCanales(this.canales, objPaginacion)
        .then(async (result: any) => {
          this.resultRequest(result);
          this.globals.loaderSubscripcion.emit(false);
        });
    } catch (e) {
      this.tabla = [];
      /** Se establece el page en el 0 */
      this.page = 0;
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translateService.instant('modal.msjERRGEN0001Titulo'),
        this.translateService.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translateService.instant('modal.msjERRGEN0001Codigo'),
        this.translateService.instant('modal.msjERRGEN0001Sugerencia')
      );
    }
  }

  async onPageChanged(event: any): Promise<void> {
    this.page = 0;
    this.page = event.page - 1;
    await this.buscar();
  }

  unselectRadio(event: any) {}

  edit(): void {
    if (!this.gvcSelected) {
      this.open(
        this.translateService.instant(
          'pantallas.moduloAdministracion.gestionValidacionesCanal.noResultados.ERRRC00Titulo'
        ),
        this.translateService.instant(
          'gestionValidaciones.msjSeleccioneModif'
        ),
        'alert',
        'ERR001',
        '',
        true
      );
      return;
    }
    const dialogo = this.dialog.open(ModalAgregarValidacionCanalComponent, {
      data: { edit: true },
    });
    dialogo.afterClosed().subscribe((result) => {
      if (result) {
       const type = [
          { name: 'Detalle', value: 'D' },
          { name: 'Sumario', value: 'S' },
          { name: 'Encabezado', value: 'E' },
          { name: 'Swift', value: 'MT' },
        ];
        const getType = type.find((t) => t.name === this.gvcSelected?.tipoCampo)?.value as string;
        this.gvcSelected ? this.gvcSelected.tipoCampo = getType: this.gvcSelected;
        result.radio === 3 ?? delete this.gvcSelected?.selected;
        this.router.navigate(
          [
            `/moduloAdministracion/${
              result.radio === 3 ? 'editarCampo' : 'editarValidacion'
            }`,
          ],
          {
            queryParams: {
              ...this.gvcSelected,
              idProducto: this.formControlValidaciones.get('producto')?.value,
              idLayout: this.formControlValidaciones.get('layout')?.value,
              asignado: this.formControlValidaciones.get('asignados')?.value,
              getConsult: this.tabla.length > 0 ? true : false,
            },
          }
        );
      }
    });
  }

  async deleteV(): Promise<void> {
    if (!this.gvcSelected) {
      this.open(
        this.translateService.instant(
          'pantallas.moduloAdministracion.gestionValidacionesCanal.noResultados.ERRRC00Titulo'
        ),
        this.translateService.instant(
          'gestionValidaciones.msjSeleccioneElim'
        ),
        'alert',
        'ERR001'
      );
      return;
    }
    this.open(this.translateService.instant(
      'pantallas.moduloAdministracion.gestionValidacionesCanal.noResultados.ERRRC00Titulo'
    ),
    this.translateService.instant('gestionValidaciones.confirmaElim'),
    'confirm',
    'INFO001'
    )
    this.globals.loaderSubscripcion.emit(false);
  }

  async openModal(): Promise<void> {
    const dialogo = this.dialog.open(ModalExportacionComponent, { disableClose: false, closeOnNavigation: true, hasBackdrop: true });
    let resultOptionSelected = await dialogo.afterClosed().toPromise();
    if(resultOptionSelected){
      resultOptionSelected === 'xlsx'
        ? (resultOptionSelected = 'xls')
        : resultOptionSelected;
      await this.onClickExportar(resultOptionSelected);
    }
  }

  async onClickExportar(typeDocument: any): Promise<void> {
    /** Se crea el objeto con la paginacion */
    try {
      const getExportClaves = (await this.gestionService.getExport(
        typeDocument,
        this.formControlValidaciones.get('producto')?.value as string,
        this.formControlValidaciones.get('layout')?.value as string
      )) as { data: string; code: string; message: string };
      if (getExportClaves.data) {
        /** Se manda la informacion para realizar la descarga del archivo */

        this.fc.convertBase64ToDownloadFileInExport(getExportClaves);
        this.globals.loaderSubscripcion.emit(false);
      } else {
        if (getExportClaves.code === '404') {
          this.open(
            this.translateService.instant(
              'pantallas.moduloAdministracion.gestionValidacionesCanal.noResultados.ERRRC00Titulo'
            ),
            getExportClaves.message,
            'error'
          );
          this.globals.loaderSubscripcion.emit(false);
        } else {
          this.translateService.instant('modal.msjERRGEN0001Titulo'),
            this.translateService.instant('modal.msjERRGEN0001Observacion'),
            'error',
            this.translateService.instant('modal.msjERRGEN0001Codigo'),
            this.translateService.instant('modal.msjERRGEN0001Sugerencia');
          this.globals.loaderSubscripcion.emit(false);
        }
      }
    } catch (error) {
      this.open('Error', ' Ocurrió un error al realizar la exportación');
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  eventoPaste(event: ClipboardEvent): boolean {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let i = 0; i < textPasted.length; i++) {
      if (!this.fc.textoCopy(textPasted[i].charCodeAt(0))) {
        i = textPasted.length;
        flag = false;
      }
    }
    return flag;
  }

  onNoclickModal(){
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
    this.suscriptionParams?.unsubscribe();
    this.dialog?.closeAll();
  }
}
