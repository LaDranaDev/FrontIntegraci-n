import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { DatosCuentaBeanComponent } from 'src/app/bean/datos-cuenta-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { IPaginationRequest } from '../../contingencia/request/pagination-request.component';
import { ConsultaDocumentosCFDIService } from 'src/app/services/consulta-documentos-cfdi/consulta-documentos-cfdi.service';
import { ContratosService } from 'src/app/services/admin-contratos/contratos.service';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ConsultaDocumentosCFDIRespuesta } from 'src/app/interface/consutlaDocumentosCDFI.interface';
import { TranslateService } from '@ngx-translate/core';
import { differenceInDays } from 'date-fns';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { Subscription } from 'rxjs';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
@Component({
  selector: 'app-consulta-documentos-cfdi',
  templateUrl: './consulta-documentos-cfdi.component.html',
  styleUrls: ['./consulta-documentos-cfdi-detalle.component.css'],
})
export class ConsultaDocumentosCfdiComponent implements OnInit,OnDestroy{
  /**Se inicializa componente*/
  datospersonales: DatosCuentaBeanComponent = {
    numContrato: '',
    bucCliente: '',
    descEstatus: '',
    nombreCompleto: '',
    personalidad: '',
    cuentaEje: '',
    idContrato: '',
    razonSocial: '',
  };
  @Output() valueChange = new EventEmitter();
  @Input() data: any;
  @Input() blocked: any;
  bloqueado: any;
  blockedForm: boolean = true;
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
  //Variable para los documentos
  documentos = 1;
  /** Lista para el select*/
  listaconfirming: {
    numContratoConfirmingCfdi: string;
    numContratoH2hCfdi: string;
  }[] = [];
  returnedArray?: any[] = [];
  /**
   * @description Formulario para la busqueda de las cuentas beneficiarias
   * @type {FormGroup}
   * @memberOf CuentasBeneficiariasContratosComponent
   */
  documentosCFDIForm!: UntypedFormGroup;

  /**
   * Datos para llenar la tabla de paises
   */
  tablaDocumentos: ConsultaDocumentosCFDIRespuesta[] = [];
  /** variable de control para saber si se realizo el submit de la consulta a los protocolos */
  submittedSearchprotocolos = false;
  pageSize: number = 0;

  //** Objeto de cuentas para inicializar busqueda */
  documento = {
    contratoConfirmingCfdi: '',
    fechaInicioCfdi: '',
    fechaFinCfdi: '',
    numDocumentoClienteCfdi: '',
  };

  /**
   * @description Objeto para el evento de paginacion
   * y ademas contiene el parametro a buscar
   * @type {IPaginationRequest}
   * @memberof ParametrosComponent
   */
  objPagination: IPaginationRequest;
  showDetail = false;
  clickSuscliption: Subscription | undefined;
  docDetail: any

  constructor(
    private serviceCFDI: ConsultaDocumentosCFDIService,
    private contratoService: ContratosService,
    public datePipe: DatePipe,
    private service: ComunesService,
    private formBuilder: UntypedFormBuilder,
    private cd: ChangeDetectorRef,
    private globals: Globals,
    public dialog: MatDialog,
    private fc: FuncionesComunesComponent,
    private translate: TranslateService
  ) {
    this.documentosCFDIForm = this.initializeForm();
    //Se inicializa el objeto pageable
    this.objPagination = {
      page: this.page,
      size: this.rowsPorPagina,
      ruta: '',
    };
  }

  /**
   * Metodo para poder inicializar el formulario
   */
  private initializeForm() {
    return this.formBuilder.group({
      codigoClienteCfdi: [''],
      razonSocialCfdi: [''],
      numeroContratoCfdi: [''],
      numeroConfirming: [''],
      fechaInicioCfdi: [''],
      fechaFinCfdi: [''],
    });
  }

  async ngOnInit(): Promise<void> {
    if (this.data !== undefined) {
      this.datospersonales.bucCliente = this.data.bucCliente;
      this.datospersonales.cuentaEje = this.data.cuentaEje;
      this.datospersonales.numContrato = this.data.numContrato;
      this.datospersonales.razonSocial = this.data.razonSocial;
      this.datospersonales.descEstatus = this.data.descEstatus;
      this.datospersonales.idContrato = this.data.idContrato;
      this.bloqueado = true;
    } else {
      this.bloqueado = false;
    }
    if (this.data === '') {
      this.bloqueado = false;
    }
    this.clickSuscliption = this.service.clickAtion.subscribe((resp: any) => {
      const { codeMenu } = resp;

      if (codeMenu === 1) {
        this.limpiar();
        this.limpiarDatosForm();
        this.documentosCFDIForm.reset()
      }
    });

  }
  /**
   * Seccion datos del cliente --------------------------------------------------------------------------------------------------------------------------
   */
  ngOnChanges(changes: SimpleChanges) {

    if (changes['data']) {
      if (
        this.data !== undefined &&
        this.data !== '' &&
        (typeof this.data === 'string' || this.data instanceof String)
      ) {
        this.datospersonales.bucCliente = this.data;
        this.consultaDatosCliente();
        this.bloqueado = true;
      } else {
        this.bloqueado = false;
      }
    }

    if (changes['blocked']) {
      if (
        this.blocked !== undefined &&
        this.blocked !== '' &&
        this.blocked === false
      ) {
        this.bloqueado = false;
        this.blockedForm = false;
      } else {
        this.bloqueado = true;
        this.blockedForm = true;
      }
    }
  }
  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }
  /**Funcion: realiza la consulta de la informacion del cliente */
  async consultaDatosCliente(): Promise<void> {
    const getCodCLient =
      this.documentosCFDIForm.get('codigoClienteCfdi')?.value;

    if (getCodCLient) {
      const getDataClient = await this.service.consultaInformacionCliente(
        getCodCLient
      );

      if (getDataClient.codError == 'OK00000') {

        const { numContrato } = getDataClient;
        this.setValuesClient(getDataClient);
        this.confirmingContrato(numContrato);
        this.valueChange.emit(this.datospersonales);
        this.service.datosContratoObtenido(true);
        this.service.otro(true);
        this.service.datos(this.datospersonales);
        this.globals.loaderSubscripcion.emit(false);
      } else {
        this.limpiar();
        this.globals.loaderSubscripcion.emit(false);
      }
    }

  }
  /**Funcion que realiza el limpiado de los objetos */
  limpiar() {
    this.datospersonales = {
      numContrato: '',
      bucCliente: '',
      descEstatus: '',
      nombreCompleto: '',
      personalidad: '',
      cuentaEje: '',
      idContrato: '',
      razonSocial: '',
    };
  }

  /**
   * Metodo para solo ingrese numeros
   * en el input de numero de contrato
   */
  eventOnlyNumbers(event: KeyboardEvent) {
    this.fc.numberOnly(event);
  }

  /**
   * @description evento para el evento de pegar en un input
   */
  onPaste(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let i = 0; i < textPasted.length; i++) {
      if (!this.fc.numberOnlyForPasteEvent(textPasted[i].charCodeAt(0))) {
        i = textPasted.length;
        flag = false;
      }
    }
    return flag;
  }

  /**
   * Metodo para poder limpiar los datos del formulario -------------------------------------------------------------------------------------------------------
   * y dejarlo en estado inicial
   */
  limpiarDatosForm() {
    this.tablaRequest = [];
    this.banderaHasRows = false;
    this.documentosCFDIForm.get('fechaInicioCfdi')?.reset();
    this.documentosCFDIForm.get('fechaFinCfdi')?.reset();
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
   * Evento que se activara al realizar el pegado
   * en el input para el codigo del cliente
   */
  eventOnPage(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let element of textPasted) {
      if (!this.fc.alphaNumerciOnlyForPasteEvent(element.charCodeAt(0))) {
        flag = false;
      }
    }
    return flag;
  }

  /**
   * Metodo que se ejecutara al realizar click
   * sobre el boton de clean
   */
  eventClean() {
    /** Se reinicia el formulario de busqueda */
    this.documentosCFDIForm = this.initializeForm();
    this.page = 0;
  }

  /**
   * @descripcion Metodo para poder generar y regresar el objeto con la paginacion
   *
   * @param numPage valor para indicar el numero de la pagina
   * @param totalItemsPage valor para indicar el total de elementos que se mostraran en la pagina
   */
  private fillObjectPag(numPage: number, totalItemsPage: number) {
    (this.objPagination.page = numPage),
      (this.objPagination.size = totalItemsPage);
    return this.objPagination;
  }

  /**
   * Método que conecta con el endpoint para consultar la informacion
   */
  async eventoConsultar(): Promise<void> {

    const request: any = {
      contratoConfirmingCfdi: this.documentosCFDIForm.value.numeroConfirming,
      codigoClienteCfdi: this.documentosCFDIForm.value.codigoClienteCfdi,
      razonSocialCfdi: this.documentosCFDIForm.value.razonSocialCfdi,
      numeroContratoCfdi: this.documentosCFDIForm.value.numeroContratoCfdi,
      fechaInicioCfdi: this.documentosCFDIForm.value.fechaInicioCfdi,
      fechaFinCfdi: this.documentosCFDIForm.value.fechaFinCfdi,
      numDocumentoClienteCfdi: this.documentosCFDIForm.value.numeroConfirming,
    };

    const response: any = await (this.serviceCFDI.consultaDetalle(request));
    if (response.data.length) {
      this.resultRequest(response);
    } else {
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant('modal.msjERRGEN0001Sugerencia')
      );
    }
    this.globals.loaderSubscripcion.emit(false);
  }
  //Tabla para llenar los datos del request
  tablaRequest: any[] = [];

  resultRequest(result: any) {
    this.tablaRequest = result.data ? result.data : result;
    this.returnedArray = this.tablaRequest.slice(0, this.rowsPorPagina)
    const r = /"/g
    this.totalElements = Number((result.total as string).replace(r, ''));
      if (this.totalElements > 0) {
      this.banderaHasRows = true;
    } else {
      this.banderaHasRows = false;
    }
  }

  /**
   * @description Evento de click al momento de usar la paginacion
   * @memberOf GestionProtocolosComponent
   */
  async onPageChanged(event: any) {
    this.page = 0;
    this.page = event.page - 1;
    /** Se crea el objeto con la paginacion */
    const contratoConfirmingCfdi =
      this.documentosCFDIForm.value.numeroConfirming;
    const fechaInicioCfdi = this.documentosCFDIForm.value.fechaInicioCfdi;
    const fechaFinCfdi = this.documentosCFDIForm.value.fechaFinCfdi;
    const documento = {
      contratoConfirmingCfdi: contratoConfirmingCfdi,
      fechaInicioCfdi: fechaInicioCfdi,
      fechaFinCfdi: fechaFinCfdi,
    };
    this.tablaRequest = [];
    if (
      contratoConfirmingCfdi === '' &&
      fechaInicioCfdi === '' &&
      fechaFinCfdi === ''
    ) {
    } else {
      /** Validacion para determinar si se uso el search antes de usar el paginado */
      const response = await this.serviceCFDI.consultaDoc(documento);
      this.resultRequest(response);
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant('modal.msjERRGEN0001Sugerencia')
      );
    }
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.returnedArray = this.tablaRequest.slice(startItem, endItem);
  }

  //Obtiene los valores del select
  async confirmingContrato(numContrat: string): Promise<void> {
    const getConfirmingNumber = await this.serviceCFDI.contratoConfirming(
      numContrat
    );
    if (getConfirmingNumber.length) {
      this.listaconfirming = getConfirmingNumber;
    }
    this.globals.loaderSubscripcion.emit(false);
  }

  /**
   *
   * Abrir el modal de error
   */
  openModalError(
    titulo: String,
    contenido: String,
    type?: any,
    errorCode?: string,
    sugerencia?: string
  ) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
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
   * @description Metodo para poder crear la fecha maxima
   */
  getMinDate() {
    let fecha = this.datePipe.transform(Date.now(), 'YYYY-MM-DD') || '';
    /** Se obtiene el arreglo de las partes de la fecha */
    let partsDate = fecha.split('/');
    /** Se crea la variable de fecha y se crea la fecha maxima */
    const date = new Date();
    date.setDate(Number(partsDate[0]));
    date.setMonth(Number(partsDate[1]) - 1 + 6);
    date.setFullYear(Number(partsDate[2]) - 1);
    /** Se regresa la fecha maxima con formato de fecha */
    return date;
  }

  /**
   * @description Metodo para poder crear la fecha maxima
   */
  getMaxDate() {
    let fecha = this.datePipe.transform(Date.now(), 'YYYY-MM-DD') || '';
    /** Se obtiene el arreglo de las partes de la fecha */
    let partsDate = fecha.split('/');
    /** Se crea la variable de fecha y se crea la fecha maxima */
    const date = new Date();
    date.setDate(Number(partsDate[0]));
    date.setMonth(Number(partsDate[1]) - 1);
    date.setFullYear(Number(partsDate[2]));
    /** Se regresa la fecha maxima con formato de fecha */
    return date;
  }

  /**
   * Atributo que contiene la configuracion del calendario
   * @type {Partial<BsDatepickerConfig>}
   * @memberof ArchivosConsultaComponent
   */
  datePickerConfig: Partial<BsDatepickerConfig> = Object.assign(
    {},
    {
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-red',
      showWeekNumbers: false,
      adaptivePosition: true
    }
  );

  /**
   * Función que valida y muestra mensaje individual
   * de cada campo  obligatorio
   */
  async validaCadaCampoObligatorio() {
    const validDates = this.validDates();
    if (!validDates) return;
    await this.eventoConsultar();
  }

  /**
   * Metodo para poder realizar la exportacion de archivos
   */
  onClickExportar(): void {
    const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
    dialogo.afterClosed().subscribe(async result => {
      const typeDoc = result === 'xlsx' ? 'xls' : result;

      const request: any = {
        contratoConfirmingCfdi: this.documentosCFDIForm.value.numeroConfirming,
        codigoClienteCfdi: this.documentosCFDIForm.value.codigoClienteCfdi,
        razonSocialCfdi: this.documentosCFDIForm.value.razonSocialCfdi,
        numeroContratoCfdi: this.documentosCFDIForm.value.numeroContratoCfdi,
        fechaInicioCfdi: this.documentosCFDIForm.value.fechaInicioCfdi,
        fechaFinCfdi: this.documentosCFDIForm.value.fechaFinCfdi,
        numDocumentoClienteCfdi: this.documentosCFDIForm.value.numeroConfirming,
      };
      try {
        const getReport = await this.serviceCFDI.exportarInformacion(typeDoc, request);
        this.fc.convertBase64ToDownloadFileInExport(getReport);
        this.globals.loaderSubscripcion.emit(false);
      } catch (error) {
        this.globals.loaderSubscripcion.emit(false);
      }

    });
  }

  setValuesClient(dataToSet: DatosCuentaBeanComponent) {
    this.datospersonales.bucCliente = dataToSet.bucCliente;
    this.datospersonales.cuentaEje = dataToSet.cuentaEje;
    this.datospersonales.numContrato = dataToSet.numContrato;
    this.datospersonales.razonSocial = dataToSet.razonSocial;
    this.datospersonales.descEstatus = dataToSet.descEstatus;
    this.datospersonales.idContrato = dataToSet.idContrato;
    this.documentosCFDIForm.patchValue({
      razonSocialCfdi: dataToSet.razonSocial,
      numeroContratoCfdi: dataToSet.numContrato,
    });
  }

  validDates(): boolean {
    const fechaInicio = this.documentosCFDIForm.get('fechaInicioCfdi')
      ?.value as Date;
    const fechaFin = this.documentosCFDIForm.get('fechaFinCfdi')?.value as Date;

    if (!fechaInicio && !fechaFin) {
      this.open(
        '',
        this.translate.instant('consultacfdi.fechas.validacion.Sugerencia'),
        'alert',
        this.translate.instant('consultacfdi.fechas.validacion.Codigo'),
        this.translate.instant('consultacfdi.fechas.validacion.Observacion')
      );
      return false;
    }
    if (!fechaInicio || !fechaFin) {
      this.open(
        this.translate.instant('consultacfdi.3meses.fechas.msj'),
        this.translate.instant('consultacfdi.faltan.fechas.msj'),
        'alert'
      );
      return false;
    }
    const diferenceDays = differenceInDays(
      fechaFin.setHours(0, 0, 0),
      fechaInicio?.setHours(0, 0, 0)
    );
    if (fechaInicio > fechaFin) {
      this.open(
        '',
        '',
        'alert',
        '',
        this.translate.instant('consultaDocumentosCFDI.fechasMayor')
      );
      return false;
    } else if (diferenceDays > 90) {
      this.open(
        '',
        '',
        'alert',
        '',
        this.translate.instant('consultaDocumentosCFDI.fechasAntiguedad')
      );
      return false;
    }
    return true;
  }

  detailDocument(isBack?: boolean, docDetatil?: any) {
    this.documento = {
      contratoConfirmingCfdi: this.documentosCFDIForm.value.numeroConfirming,
      fechaInicioCfdi: this.documentosCFDIForm.value.fechaInicioCfdi,
      fechaFinCfdi: this.documentosCFDIForm.value.fechaFinCfdi,
      numDocumentoClienteCfdi: this.documentosCFDIForm.value.codigoClienteCfdi,
    };
    this.docDetail = docDetatil
    this.showDetail = isBack ? false : true;
  }
}
