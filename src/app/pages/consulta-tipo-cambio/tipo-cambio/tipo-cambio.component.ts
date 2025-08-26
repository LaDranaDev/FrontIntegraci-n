import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { IConsultaTipoCambio } from 'src/app/interface/consultaTipoCambioRespuesta.interface';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { TipoCambioService } from 'src/app/services/consulta-tipo-cambio/tipo-cambio.service';
import { TranslateService } from '@ngx-translate/core';
import { ComunesService } from 'src/app/services/comunes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tipo-cambio',
  templateUrl: './tipo-cambio.component.html',
  styleUrls: ['./tipo-cambio.component.css']
})
export class TipoCambioComponent implements OnInit, OnDestroy {


  /** Variable para indicar en que pagina se encuentra */
  page: number = 0;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows: boolean = false;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 10;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinks6: boolean = true;
  showDirectionLinks6: boolean = true;
  //Variable para los cambios
  cambios = 1;
  valorCambio = false
  cambioResultado: any;
  valDivisaDestino: any
  data: any = {
    divisaDeEnvio: ''
  }

  /**
  * Datos para llenar la tabla de cambio
  */
  tablacambio: IConsultaTipoCambio[] = []
  /**
   * @description Formulario para la busqueda de cambio
   * @type {FormGroup}
   * @memberOf TipoCambioComponent
  */
  gestioncambioForm!: UntypedFormGroup;
  submittedcambioSearch = false;

  /** variable de control para saber si se realizo el submit de la consulta a los cambios */
  submittedSearchcambio = false;
  pageSize: number = 0;
  tabla: any;
  returnedArray!: any;
  cambio = {
    valorOrigen: "",
    divDestino: "",
    divOrigen: ""
  }

  divOrigen: any[] = [
    {
      "id": "USD",
      "nombre": "USD (Dólar Americano)"
    },
    {
      "id": "EUR",
      "nombre": "EUR (Euro)"
    },
    {
      "id": "CAD",
      "nombre": "CAD (Dólar Canadiense)"
    },
    {
      "id": "CHF",
      "nombre": "CHF (Franco Suizo)"
    },
    {
      "id": "GBP",
      "nombre": "GBP (Libra Esterlina)"
    },
    {
      "id": "JPY",
      "nombre": "JPY (Yen Japonés)"
    },
    {
      "id": "SEK",
      "nombre": "SEK (Corona Sueca)"
    },
  ]

  /**
  * @description Objeto para el evento de paginacion
  * con el parametro a buscar
  * @type {IPaginationRequest}
  * @memberof ParametrosComponent
  */
  objPagination: IPaginationRequest;
  /**
  * @description monto de origen
  * @type {string}
  * @memberOf TipoCambioComponent
  */
  valorOrigen: String = '';

  /**
  * @description monto de origen
  * @type {string}
  * @memberOf TipoCambioComponent
  */
  divDestino: String = '';

  /**
    * @description Nombre de usuario de la sesión actual.
    * Este usuario se tendria que sustituir por el de la sesion actual.
    * @type {string}
    * @memberOf GestionComprobantesComponent
    */
  usuarioActual: string | null = '';
  clickSuscliption: Subscription | undefined;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public gestioncambioService: TipoCambioService,
    private globals: Globals,
    private translate: TranslateService,
    private comunService: ComunesService,
  ) {
    this.usuarioActual = localStorage.getItem('UserID');
    this.gestioncambioForm = this.initializeForm();
    //Se inicializa el objeto
    this.objPagination = {
      page: this.page,
      size: this.rowsPorPagina,
      ruta: ''
    }
  }

  /**
  * Metodo para poder inicializar el formulario
  */
  private initializeForm() {
    return this.formBuilder.group({
      valorOrigen: [''],
      divDestino: [''],
      divOrigen: [''],
      tDestino: ['']
    })
  }

  ngOnInit(): void {
    this.clickSuscliption = this.comunService.clickAtion.subscribe((resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 1) {
        this.eventCleanTipo();
      }
    });
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
    this.objPagination.page = numPage;
    this.objPagination.size = totalItemsPage;
    return this.objPagination;
  }

  /**
  * @descripcion Metodo para poder obtener el listado inicial de los parametros
  *
  * @param objPaginacion objeto que contiene las propiedades de paginacion y busqueda
  */
  private async getConsultaCambio(objPaginacion: IPaginationRequest) {
    try {
      await this.gestioncambioService.getListaCambio(this.cambio, objPaginacion).then(
        async (result: any) => {
          this.resultRequest(result);
          this.globals.loaderSubscripcion.emit(false);
        }
      )
    } catch (e) {
      this.tabla = [];
      /** Se establece el page en el 0 */
      this.page = 0;
      this.globals.loaderSubscripcion.emit(false);
      this.open(this.translate.instant('modal.msjERRGEN0001Titulo'), this.translate.instant('modal.msjERRGEN0001Observacion'), 'error', this.translate.instant('modal.msjERRGEN0001Codigo'), this.translate.instant('modal.msjERRGEN0001Sugerencia'));
    }
  }

  /**
  * Metodo getter para la validacion de formulario
  * en la vista
  */
  get formControlSearchcambio() {
    return this.gestioncambioForm.controls;
  }

  /**
  * Metodo que se ejecutara al realizar click
  * sobre el boton de clean
  */
  eventCleanTipo() {
    /** Se reinicia el formulario de busqueda */
    this.submittedcambioSearch = false;
    this.gestioncambioForm = this.initializeForm();
    this.page = 0;
    this.cambioResultado = null;
    this.valorCambio = false
  }

  async eventoConsultarTipo() {
    if (this.gestioncambioForm.value.divDestino === '' || this.gestioncambioForm.value.valorOrigen === '' || this.gestioncambioForm.value.divOrigen === '') {
      this.open(
        '',
        this.translate.instant('pantalla.tipoCambio.err02.observacion'),
        'error',
        'ERR02',
        ''
      );
      return
    }

    try {
      const cambio = this.gestioncambioForm.value;
      this.page = 0
      await this.gestioncambioService.getBusquedaCambio(cambio).then(
        async (result: any) => {
          if (result.codigo === 'OK00000') {
            this.valorCambio = true
            this.cambioResultado = result;
            this.valDivisaDestino = this.cambioResultado.valorDivDestino
            this.data.divisaDeEnvio = this.cambioResultado.divDestino
            this.gestioncambioForm.patchValue({
              tDestino: result.valorDivDestino
            })
          } else {
            this.open(this.translate.instant('tipoCambio.msjERR04Titulo'), '', 'error', this.translate.instant('tipoCambio.msjERR04Codigo'), '');
          }
          this.globals.loaderSubscripcion.emit(false);
        }
      )
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        '',
        this.translate.instant('pantalla.tipoCambio.error.observacion'),
        'error',
        '',
        ''
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
  }

  /**
   * @description Evento de click al momento de usar la paginacion
   * @memberOf TipoCambioComponent
  */
  async onPageChanged(event: any) {
    this.page = 0
    this.page = event.page - 1;
    /** Se crea el objeto con la paginacion */
    const valorOrigen = this.gestioncambioForm.value.valorOrigen;
    const divDestino = this.gestioncambioForm.value.divDestino;
    const cambio = {
      "valorOrigen": valorOrigen,
      "divDestino": divDestino,

    }
    this.tabla = [];
    /** Validacion para determinar si se uso el search antes de usar el paginado */
    if (valorOrigen === '') {
      await this.getConsultaCambio(this.fillObjectPag(this.page, this.rowsPorPagina));
    } else {
      this.gestioncambioService.getBusquedaCambio(cambio).then(
        (result: any) => {
          this.resultRequest(result);
          this.globals.loaderSubscripcion.emit(false);
        }
      )
    }
  }

  /**
   * @description evento para poder levantar el modal para
   * mostrar los mensajes de sucess o error
   * @param titulo indica si se ejecutara para error o success
   * @param contenido mensaje que se mostrara en el modal
  */

  open(titulo: string, contenido: string, type?: any, errorCode?: string, sugerencia?: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, errorCode, sugerencia), hasBackdrop: true
    }
    );
  }

  /**
  *
  * Abrir el modal de error
  */
  openModalError(titulo: string, contenido: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido)
    }
    );
  }


}
