import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatosCuentaBeanComponent } from 'src/app/bean/datos-cuenta-bean.component';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { CuentasBeneficiariasContratosService } from 'src/app/services/admin-contratos/cuentas-beneficiarias-contratos.service';
import { ComunesService } from 'src/app/services/comunes.service';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { ModalCuentasBeneficiariasComponent } from 'src/app/components/modals/modal-cuentas-beneficiarias/modal-cuentas-beneficiarias.component';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cuentas-beneficiarias-contratos',
  templateUrl: './cuentas-beneficiarias-contratos.component.html',
})
export class CuentasBeneficiariasContratosComponent implements OnInit, OnDestroy {
  @ViewChild('limpiar') limp: any;
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;
  /** Bandera para determinar si se habilita el boton de guardar y exportar */
  banderaBtnExportar: boolean = true;
  /** Variable para indicar en que pagina se encuentra */
  page: number = 0;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 10;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinksCuentas: boolean = true;
  showDirectionLinksCuentas: boolean = true;
  /**
   * @description Formulario para la busqueda de las cuentas beneficiarias
   * @type {FormGroup}
   * @memberOf CuentasBeneficiariasContratosComponent
   */
  cuentasBeneficiariasForm!: UntypedFormGroup;
  /**
   * Datos para llenar la tabla de paises
   */
  tablaCuentas: any[] = [];
  //** Objeto de cuentas para inicializar busqueda */
  cuenta = {
    numContrato: '',
    cuentabeneficiaria: '',
  };
  /**
   * @description Objeto para el evento de paginacion
   * y ademas contiene el parametro a buscar
   * @type {IPaginationRequest}
   * @memberof ParametrosComponent
   */
  objPageable: IPaginationRequest;
  /**
   * @description Número de contrato actual.
   * @type {string}
   * @memberOf CuentasBeneficiariasContratosComponent
   */
  numContrato: String = '';
  request: any;
  /**
   * @description Nombre de usuario de la sesión actual.
   * Este usuario se tendria que sustituir por el de la sesion actual.
   * @type {string}
   * @memberOf GestionComprobantesComponent
   */
  usuarioActual: string | null = '';
  /**
   * @description Objeto para poder realizar la obtencion de
   * los datos del contrato
   * @type {CuentasBeneficiariasContratosComponent}
   * @memberOf CuentasBeneficiariasContratosComponent
   */
  /** Se inicializa el objeto que contendra los datos del contrato */
  datosContrato: DatosCuentaBeanComponent = {
    numContrato: '',
    bucCliente: '',
    descEstatus: '',
    nombreCompleto: '',
    personalidad: '',
    cuentaEje: '',
    idContrato: '',
    razonSocial: '',
  };

  datos: any;

  constructor(
    private servicecuentasBeneficiarias: CuentasBeneficiariasContratosService,
    private serviceComun: ComunesService,
    private formBuilder: UntypedFormBuilder,
    private globals: Globals,
    public dialog: MatDialog,
    private fc: FuncionesComunesComponent,
    private translateService: TranslateService
  ) {
    this.cuentasBeneficiariasForm = this.initializeForm();
    //Se inicializa el objeto pageable
    this.objPageable = {
      page: this.page,
      size: this.rowsPorPagina,
      ruta: '',
    };
    this.usuarioActual = localStorage.getItem('UserID');
  }

  /**
   * Metodo para poder inicializar el formulario
   */
  private initializeForm() {
    return this.formBuilder.group({
      numContrato: [''],
      cuentaBeneficiaria: [''],
    });
  }
  
  clickSuscliption: Subscription | undefined;

  ngOnInit(){
    //this.initForm();
    
    this.clickSuscliption = this.serviceComun.clickAtion.subscribe((resp:any) => {
      const { codeMenu } = resp;
      if (codeMenu === 15) {
        this.initForm();
      }
    });
  }

  initForm(){
    this.limpiarDatosForm()
    this.datos = this.serviceComun.datosContrato;
    //this.getConsultaCuentas(this.fillObjectPag(this.page,this.rowsPorPagina));
    if (this.datos !== undefined) {
      this.datosContrato.numContrato = this.datos.numContrato;
    }     
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }

  /**
   * Metodo para poder limpiar los datos del formulario
   * y dejarlo en estado inicial
   */
  limpiarDatosForm() {
    this.tablaCuentas = [];
    this.banderaHasRows = false;
    this.cuentasBeneficiariasForm.reset();
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

  /**
   * Metodo getter para la validacion de formulario
   * en la vista
   */
  get formControlSearchCuentas() {
    return this.cuentasBeneficiariasForm.controls;
  }

  /**
   * Se utiliza para realizar la busqueda del formulario
   * Al dar clic en buscar
   */
  async eventoConsultar() {
    const numContrato = this.datosContrato.numContrato;
    const cuentaBeneficiaria =
      this.cuentasBeneficiariasForm.value.cuentaBeneficiaria;
    if (
      cuentaBeneficiaria !== null &&
      cuentaBeneficiaria !== '' &&
      (cuentaBeneficiaria.length == 10 ||
        cuentaBeneficiaria.length == 11 ||
        cuentaBeneficiaria.length == 16 ||
        cuentaBeneficiaria.length == 18)
    ) {
      const cuenta = {
        numeroContrato: numContrato,
        numeroCuenta: cuentaBeneficiaria,
      };
      this.page = 0;
      try {
        await this.servicecuentasBeneficiarias
          .findCuentasBeneficiariasContratos(cuenta)
          .then(
            async (result: any) => {
              if (result.message === 'ERDB000') {
                this.open(
                  this.translateService.instant(
                    'consultabeneficiaria.msjERR002Titulo'
                  ),
                  this.translateService.instant(
                    'consultabeneficiaria.msjERR002Observacion'
                  ),
                  'error',
                  this.translateService.instant(
                    'consultabeneficiaria.msjERR002Codigo'
                  ),
                  this.translateService.instant(
                    'consultabeneficiaria.msjERR002Sugerencia'
                  )
                );
                this.banderaHasRows = false;
                this.tablaCuentas = [];
              } else {
                this.tablaCuentas = [];
                this.tablaCuentas.push(result);
                this.banderaHasRows = true;
              }
              this.globals.loaderSubscripcion.emit(false);
            });
      } catch (e) {
        this.tablaCuentas = [];
        this.banderaHasRows = false;
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
    } else {
      this.open(
        this.translateService.instant('modal.error.msjERRNE005Sugerencia'),
        this.translateService.instant('modal.error.msjERR003Observacion'),
        'error',
        this.translateService.instant('consultabeneficiaria.msjERR003Codigo'),
        this.translateService.instant('modal.error.msjERRNE005Titulo')
      );
    }
  }

  /**
   * Abrir el modal de exportar los datos
   */
  openCuentaBeneficiaria() {
    const dialogo = this.dialog.open(ModalCuentasBeneficiariasComponent);
    dialogo.afterClosed().subscribe((result) => {
      if (result) {
        this.openExportInfo(result.radio);
      }
    });
  }

  /**
   * Abrir el modal de exportar los datos
   */
  openExportInfo(tipo: any) {
    const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
    dialogo.afterClosed().subscribe((formato) => {
      if (formato) {
        if (
          tipo === 'B' &&
          (this.cuentasBeneficiariasForm.controls['cuentaBeneficiaria']
            .value === '' ||
            this.cuentasBeneficiariasForm.controls['cuentaBeneficiaria']
              .value === null ||
            !this.banderaHasRows)
        ) {

          this.open(
            this.translateService.instant('general.INF001.titulo'),
            this.translateService.instant('general.INF001.observacion'),
            'info',
            this.translateService.instant('general.INF001.codigo'),
            this.translateService.instant('general.INF001.sugerencia'),

          )
          return;
        }
        if (formato === 'xlsx') {
          formato = 'excel';
        }
        this.generateReporte(tipo, formato);
      }
    });
  }

  disableEvent(event: any) {
    event.preventDefault();
    return false;
  }

  /**
   * Evento para poder validar que el campo solo
   * se puedan ingresar alphabeto, numeros
   */
  validaNumberos(event: KeyboardEvent) {
    this.fc.numeros(event);
  }

  /**
   * Metodo para exportar la información
   */
  async generateReporte(tipo: string, formato: string) {
    if (tipo === 'T') {
      this.request = {
        ctaBeneficiariaCtoRequest: {
          numeroContrato: this.datosContrato.numContrato,
          numeroCuenta: '',
        },
        usuario: this.usuarioActual!,
        tipoReporte: tipo,
      };
    } else {
      this.request = {
        ctaBeneficiariaCtoRequest: {
          numeroContrato: this.datosContrato.numContrato,
          numeroCuenta: this.cuentasBeneficiariasForm.value.cuentaBeneficiaria,
        },
        usuario: this.usuarioActual!,
        tipoReporte: tipo,
      };
    }
    try {
      await this.servicecuentasBeneficiarias
        .exportarInformacion(formato, this.request)
        .then(
          async (result: any) => {
            if (result.data) {
              /** Se manda la informacion para realizar la descarga del archivo */
              this.fc.convertBase64ToDownloadFileInExport(result);
            } else {
              if (result.code === '404') {
                this.open('Error', result.message, 'error');
              } else {
                this.open(
                  'Error',
                  this.translateService.instant('modals.error.exportacion'),
                  'error'
                );
              }
            }
            this.globals.loaderSubscripcion.emit(false);
          });
    } catch (e) {
      this.tablaCuentas = [];
      this.banderaHasRows = false;
      /** Se establece el page en el 0 */
      this.page = 0;
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        'Error',
        this.translateService.instant('modals.error.exportacion'),
        'error'
      );
    }
  }
}
