import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { GestionProductosRespuesta } from 'src/app/interface/gestionProductosRespuesta.interface';
import { GestionProductosService } from 'src/app/services/administracion/gestion-productos.service';
import { IPaginationRequest } from '../../../contingencia/request/pagination-request.component';
import { AltaGestionProducto } from 'src/app/bean/alta-gestionProducto.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { TranslateService } from '@ngx-translate/core';
import { ComunesService } from 'src/app/services/comunes.service';
import { PerfilamientoService } from 'src/app/services/perfilamiento.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
})
export class ProductoComponent implements OnInit {
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
  gestionProductosForm!: FormGroup;
  /**
   * Datos para llenar la tabla de paises
   */
  tabla: GestionProductosRespuesta[] = [];
  /**
   * @description Objeto para el evento de paginacion
   * y ademas contiene el parametro a buscar
   * @type {IPaginationRequest}
   * @memberof ParametrosComponent
   */
  objPageable: IPaginationRequest;

  origen: any;
  id: any;
  formProducto: FormGroup;
  listaCatalogoBackend: any;
  bandActivo: any;
  bandReintentos: any;
  bandTipoCargo: any;
  bandVigencia: any;
  bandEmai: any;
  /**Para el alta Backend */
  objetoSaveProducto: AltaGestionProducto = new AltaGestionProducto();
  /** variable de control para saber si se realizo el submit del alta o modificacion */
  submittedProducto = false;
  cveProd: any;
  descProd: any;
  idBack: any;
  umbral: any;
  idProduct: any;
  codiOperCarg: any;
  codiOperAbon: any;
  claconComision: any;
  diasFecApli: any;
  diasTecTran: any;
  diasFecOper: any;
  bandAct: any;
  bandReint: any;
  bandTipoCar: any;
  bandVig: any;
  bandEmail: any;

  /**
   * @description Formulario para la busqueda de bancos
   * @type {FormGroup}
   * @memberOf ModificarBancoComponent
   */
  claveBanco: any;
  statusNum: number;
  perfilamiento: any;
  verAgregar: boolean;
  verEditar: boolean;
  verEliminar: boolean;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private gestionProductoService: GestionProductosService,
    private router: Router,
    private globals: Globals,
    public dialog: MatDialog,
    private fc: FuncionesComunesComponent,
    private translateService: TranslateService,
    private comunService: ComunesService,
    public perfila: PerfilamientoService,
  ) {
    /** Se inicializa el formulario para validar el Producto */
    this.formProducto = this.formBuilder.group({
      cveProd: ['', Validators.required],
      descProd: ['', Validators.required],
      idBack: ['', Validators.required],
      umbral: [null, Validators.required],
      claveProdClie: [null, Validators.required],
      codiOperCarg: [null, Validators.required],
      codiOperAbon: [null, Validators.required],
      claconComision: [null, Validators.required],
      diasFecApli: [null, Validators.required],
      diasTecTran: [null, Validators.required],
      diasFecOper: [null, Validators.required],
      bandActivo: [false, Validators.required],
      bandReintentos: [false, Validators.required],
      bandTipoCargo: [false, Validators.required],
      bandVigencia: [false, Validators.required],
      bandEmail: [false, Validators.required],
    });
    //Se inicializa el objeto pageable
    this.objPageable = {
      page: this.page,
      size: this.rowsPorPagina,
      ruta: '',
    };
  }
  obj: any
  async ngOnInit() {
    this.origen = this.route.snapshot.paramMap.get('origen');
    this.id = this.route.snapshot.paramMap.get('id');


    /** Traer los catalogos */
    this.getCatalogoBAckend();
    if (this.origen === 'modif' || this.origen === 'detalle') {
      this.getGestionProductos();
    }
  }

  get formControlProducto() {
    return this.formProducto.controls;
  }

  onChangeEv(evGet: any, nameBand: string) {
    if (evGet === 'A') {
      this.formProducto.controls[nameBand].setValue(false);
    } else {
      this.formProducto.controls[nameBand].setValue(true);
    }
  }

  onChangeEvInit(evGet: any, nameBand: string) {
    if (evGet === 'A') {
      this.formProducto.controls[nameBand].setValue(true);
    } else {
      this.formProducto.controls[nameBand].setValue(false);
    }
  }

  alta(origen: any) {
    let enviarDatos = {
      idProduct: this.id,
      descProd: this.formProducto.value.descProd,
      bandTipoCargo: this.formProducto.value.bandTipoCargo === true ? 'A' : 'I',
      bandVigencia: this.formProducto.value.bandVigencia === true ? 'A' : 'I',
      bandEmail: this.formProducto.value.bandEmail === true ? 'A' : 'I',
      bandReintentos:
        this.formProducto.value.bandReintentos === true ? 'A' : 'I',
      idBack: this.formProducto.value.idBack,
      cveProd: this.formProducto.value.cveProd,
      umbral: this.formProducto.value.umbral ? parseInt(this.formProducto.value.umbral) : 0,
      visibilidad: 'A',
      cveProdOper: this.formProducto.value.claveProdClie,
      codiOperCarg: this.formProducto.value.codiOperCarg,
      codiOperAbon: this.formProducto.value.codiOperAbon,
      bandConfirming: 'I',
      bandActivo: this.formProducto.value.bandActivo === true ? 'A' : 'I',
      codiOperComi: this.formProducto.value.claconComision,
      diasFecApli: this.formProducto.value.diasFecApli ? this.formProducto.value.diasFecApli : 0,
      diasTecTran: this.formProducto.value.diasTecTran ? this.formProducto.value.diasTecTran : 0,
      diasFecOper: this.formProducto.value.diasFecOper ? this.formProducto.value.diasFecOper : 0,
    };
    let messageReq = '';
    if (!enviarDatos.cveProdOper) {
      messageReq = this.translateService.instant('administracion.productos.codigoOperacion');
    }
    if (!enviarDatos.idBack || enviarDatos.idBack === 'Select ...' || enviarDatos.idBack === 'Seleccione ...') {
      messageReq = 'Backend';
    }
    if (!enviarDatos.descProd) {
      messageReq = this.translateService.instant('pantalla.catalogoDin.descripcionsinpuntos');
    }
    if (!enviarDatos.cveProd) {
      messageReq = this.translateService.instant('administracion.productos.clave');
    }
    if (messageReq !== '') {
      this.open(
        this.translateService.instant('producto.msjERR002Titulo'),
        this.translateService.instant('producto.msjERR002Observacion', {
          value: messageReq,
        }),
        'error',
        '',
        this.translateService.instant('producto.msjERR002Sugerencia')
      );
      return;
    }
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        this.translateService.instant('modal.productos.confirm.titulo'),
        this.translateService.instant('modal.productos.confirm.msj'),
        "confirm"
      ), hasBackdrop: true
    });
    dialogo.afterClosed().subscribe((result) => {
      if (result) {
        this.saveRecord(enviarDatos, origen);
      }
    });
  }

  private async saveRecord(enviarDatos: any, origen: any) {
    if (origen === 'alta') {

      try {
        this.gestionProductoService
          .saveProducto(enviarDatos)
          .then(async (result: any) => {
            this.submittedProducto = false;
            this.globals.loaderSubscripcion.emit(false);
            this.regresarToConsult();
            this.open(
              this.translateService.instant(
                'cuentas.ordenantes.msjINF00009Titulo'
              ),
              this.translateService.instant(
                'cuentas.ordenantes.msjINF00009Observacion'
              ),
              'info',
              this.translateService.instant(
                'cuentas.ordenantes.msjINF00009Codigo'
              ),
              this.translateService.instant(
                'cuentas.ordenantes.msjINF00009Sugerencia'
              )
            );
          });
      } catch (err) {
        this.submittedProducto = false;
        this.globals.loaderSubscripcion.emit(false);
        this.open(
          this.translateService.instant('cuentas.ordenantes.msjINF00010Titulo'),
          this.translateService.instant(
            'cuentas.ordenantes.msjINF00010Observacion'
          ),
          'info',
          this.translateService.instant('cuentas.ordenantes.msjINF00010Codigo'),
          this.translateService.instant(
            'cuentas.ordenantes.msjINF00010Sugerencia'
          )
        );
      }
    }
    if (origen === 'modif') {
      try {
        this.gestionProductoService
          .updateProducto(enviarDatos)
          .then(async (result: any) => {
            this.submittedProducto = false;
            this.globals.loaderSubscripcion.emit(false);
            this.regresarToConsult();
            this.open(
              this.translateService.instant('buzon.msjUPDATE_BUZON_WARNTitulo'),
              this.translateService.instant('producto.observacion'),
              'info',
              this.translateService.instant('producto.codigo'))
          });
      } catch (err) {
        this.submittedProducto = false;
        this.globals.loaderSubscripcion.emit(false);
        this.open(
          this.translateService.instant('cuentas.ordenantes.msjINF00010Titulo'),
          this.translateService.instant(
            'cuentas.ordenantes.msjINF00010Observacion'
          ),
          'info',
          this.translateService.instant('cuentas.ordenantes.msjINF00010Codigo'),
          this.translateService.instant(
            'cuentas.ordenantes.msjINF00010Sugerencia'
          )
        );
      }
    }
  }

  private async getCatalogoBAckend() {
    try {
      await this.gestionProductoService
        .gestListaCatalogoBackend()
        .then(async (result: any) => {
          this.globals.loaderSubscripcion.emit(false);
          this.listaCatalogoBackend = result.catBackend;
        });
    } catch (e) {
      /** Se establece el page en el 0 */
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translateService.instant('cuentas.ordenantes.msjINF00010Titulo'),
        this.translateService.instant('producto.msjBackends'),
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

  private async getGestionProductos() {
    try {
      await this.gestionProductoService
        .getProductoById(this.id)
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
        this.translateService.instant('cuentas.ordenantes.msjINF00010Titulo'),
        this.translateService.instant('producto.msjNoListProducts'),
        'error'
      );
    }
  }

  resultRequest(result: any) {
    this.cveProd = result.cveProd;
    this.descProd = result.descProd;
    this.idBack = result.idBack;
    this.umbral = result.umbral;
    this.idProduct = result.idProduct;
    this.codiOperCarg = result.codiOperCarg;
    this.codiOperAbon = result.codiOperAbon;
    this.claconComision = result.codiOperComi;
    this.diasFecApli = result.diasFecApli;
    this.diasTecTran = result.diasTecTran;
    this.diasFecOper = result.diasFecOper;
    this.bandAct = result.bandActivo;
    this.bandReint = result.bandReintentos;
    this.bandTipoCar = result.bandTipoCargo;
    this.bandVig = result.bandVigencia;
    this.bandEmail = result.bandEmail;
    this.totalElements = 64;
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
    this.onChangeEvInit(this.bandAct, 'bandActivo');
    this.onChangeEvInit(this.bandReint, 'bandReintentos');
    this.onChangeEvInit(this.bandTipoCar, 'bandTipoCargo');
    this.onChangeEvInit(this.bandVig, 'bandVigencia');
    this.onChangeEvInit(this.bandEmail, 'bandEmail');
  }

  regresarToConsult() {
    this.router.navigate(['/moduloAdministracion', 'gestionProductos']);
  }

  openConfirmYN(titulo: string, contenido: string, typeConfirm: string) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, "yesNo"), hasBackdrop: true
    });
    dialogo.afterClosed().subscribe((result) => {
      if (result === 'si') {
        this.alta(typeConfirm);
      }
    });
  }

  /**
   * Metodo que valida que se ingresen solo numero, en caso de que se quieran ingresar datos diferentes no se permitira
   */
  onlyNumbers(event: KeyboardEvent) {
    this.fc.numberOnly(event);
  }

  /**
   * Evento para solo permitir escritura
   * del alphabeto
   */
  onlyAlphabeticAndNumbers(event: KeyboardEvent) {
    this.fc.onlyAlphabeticAndNumbers(event);
  }
}
