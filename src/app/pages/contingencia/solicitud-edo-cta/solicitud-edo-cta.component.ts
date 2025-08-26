import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Subscription } from 'rxjs';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { SolicitudEdoCtaService } from 'src/app/services/contingencia/solicitud-edo-cta.service';
import { IPaginationRequest } from '../request/pagination-request.component';
import { format } from 'date-fns';

@Component({
  selector: 'app-solicitud-edo-cta',
  templateUrl: './solicitud-edo-cta.component.html',
  styleUrls: ['./solicitud-edo-cta.component.css']
})
export class SolicitudEdoCtaComponent implements OnInit, OnDestroy {
  datosContrato: any = {
    numContrato: "", bucCliente: "", descEstatus: "", nombreCompleto: "",
    personalidad: "", cuentaEje: "", idContrato: "", razonSocial: "", idEstatus: ""
  };

  clickSuscliption: Subscription | undefined;

  objPageable: IPaginationRequest;
  /**
   * Atributo que contiene la configuracion del calendario
   * @type {Partial<BsDatepickerConfig>}
   * @memberof ArchivosConsultaComponent
   */
  datePickerConfig: Partial<BsDatepickerConfig> = Object.assign({}, {
    dateInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-red',
    showWeekNumbers: false,
    adaptivePosition: true
  });

  disabledInputDate = true;

  showFrecuency = false;
  showCta = false;

  fechaActual = new Date();

  edoCtaForm!: FormGroup;
  resFrecuency: any;

  channelList: any = [];
  formatList: any = [];
  ctaList: any = [];
  returnedArray: any = [];

  idFormatoMT940: string = '16';
  idFormatoMT940D: string = '60';
  idFormatoMT942: string = '27';
  idCanalSwiftFin: number;
  rowsPorPagina: number = 10;
  page: number = 0;
  cuentaDescubierto: string = 'off';
  checkDivisa: string = 'off';
  checkConvenio: string = 'off';
  idRadioFrecuencia: number;
  usuarioActual: string | null = '';

  constructor(
    private formBuilder: FormBuilder,
    private fc: FuncionesComunesComponent,
    private globals: Globals,
    public dialog: MatDialog,
    private translate: TranslateService,
    private comunService: ComunesService,
    private solicitudEdoCtaService: SolicitudEdoCtaService,
  ) {
    this.usuarioActual = localStorage.getItem('UserID');
  }

  ngOnInit(): void {
    this.edoCtaForm = this.createForm();
    this.clickSuscliption = this.comunService.clickAtion.subscribe((resp) => {
      const action = resp;
      if (action) {
        this.onClickClean();
      }
    });
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }

  private createForm(date?: any) {
    return this.formBuilder.group({
      codigoCliente: [''],
      fecha: [date ? date : '', Validators.required],
      radioFrecuencia: [''],
      radioTipoArchivo: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
      checkDivisa: [false],
      checkCtaDescubierto: [false],
      checkConvenio: [false],
      canal: [null],
      formato: [null]
    });
  }

  async getFrecuency() {
    const { fecha } = this.edoCtaForm.value
    const { numContrato } = this.datosContrato
    this.edoCtaForm = this.createForm(fecha)

    if (fecha === '') {
      return
    }
    const fechaIni = this.formatoFechas(fecha)

    try {
      this.resFrecuency = await this.solicitudEdoCtaService.getFrecuencyList(
        {
          contrato: numContrato,
          fechaIni
        });

      if (this.resFrecuency.catalogos.length > 0) {
        this.showFrecuency = true;
      } else {
        this.openModal(
          this.translate.instant('pantalla.solicitudEdoCtaContingencia.msjINF001Titulo'),
          this.translate.instant('contingencia.msjERR007Sugerencia'),
          'info',
          this.translate.instant('pantalla.reporteCobranzaConsolidado.INF001CTACodigo'),
          this.translate.instant('pantalla.reporteCobranzaConsolidado.mensaje'),
        );
      }
    } catch (e) {
      this.openModal(
        this.translate.instant('contingencia.msjERR002Titulo'),
        this.translate.instant('contingencia.msjERR002Observacion'),
        'error',
        this.translate.instant('contingencia.msjERR002Codigo'),
        this.translate.instant('contingencia.msjERR002Sugerencia')
      );
    }
    this.globals.loaderSubscripcion.emit(false);
    
  }

  async findContratoByBuc() {
    try {
      if (!this.validateBuc()) {
        return this.openModal(
          this.translate.instant('contingencia.msjINF004Titulo'),
          this.translate.instant('contingencia.msjINF004Sugerencia'),
          'alert',
          this.translate.instant('contingencia.msjINF004Codigo'),
          this.translate.instant('contingencia.msjINF004Observacion'),
        );
      }
      const response: any = await this.comunService.consultaInformacionCliente(this.datosContrato.bucCliente);
      if (response.codError == 'OK00000') {
        this.datosContrato.bucCliente = response.bucCliente;
        this.datosContrato.cuentaEje = response.cuentaEje;
        this.datosContrato.numContrato = response.numContrato;
        this.datosContrato.razonSocial = response.razonSocial;
        this.datosContrato.descEstatus = response.descEstatus;
        this.datosContrato.idContrato = response.idContrato;
        this.edoCtaForm.controls['fecha'].enable();
        this.edoCtaForm.reset();
        this.edoCtaForm.controls['fecha'];
        this.disabledInputDate = false;

      } else {
        this.openModal(
          this.translate.instant('contingencia.msjERR007Titulo'),
          this.translate.instant('contingencia.msjERR007Sugerencia'),
          'info',
          this.translate.instant('contingencia.msjERR007Codigo'),
          this.translate.instant('contingencia.msjERR007Observacion'),
        );
        this.clearContrato();
      }
      this.globals.loaderSubscripcion.emit(false);
      
    } catch (e) {
      this.openModal(
        this.translate.instant('contingencia.msjERR002Titulo'),
        this.translate.instant('contingencia.msjERR002Observacion'),
        'error',
        this.translate.instant('contingencia.msjERR002Codigo'),
        this.translate.instant('contingencia.msjERR002Sugerencia')
      );
      this.globals.loaderSubscripcion.emit(false);
      
      this.clearContrato();
    }
  }

  openModal(
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

  validateBuc() {
    if (this.datosContrato.bucCliente.length < 8) {
      this.clearContrato();
      return false;
    }
    return true;
  }

  clearContrato() {
    this.datosContrato = {
      numContrato: '',
      bucCliente: '',
      descEstatus: '',
      nombreCompleto: '',
      personalidad: '',
      cuentaEje: '',
      idContrato: '',
      razonSocial: '',
    };
    this.disabledInputDate = true;
    this.channelList = []
    this.formatList = []

  }

  pasteOnlyNumeros(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let element of textPasted) {
      if (!this.fc.numberOnlyForPasteEvent(element.charCodeAt(0))) {
        flag = false;
      }
    }
    return flag;
  }

  formatoFechas(fecha: Date) {
    const date = fecha.getDate() < 10 ? '0' + fecha.getDate() : fecha.getDate();
    const month = fecha.getMonth() < 9 ? '0' + (fecha.getMonth() + 1) : fecha.getMonth() + 1;
    const year = fecha.getFullYear();

    return `${date}/${month}/${year}`;
  }

  onClickClean(flag?: boolean) {
    this.edoCtaForm.reset();
    this.resFrecuency = {};
    this.showFrecuency = false;
    this.showCta = false;
    this.channelList = [];
    this.formatList = [];
    this.returnedArray = [];
    this.cuentaDescubierto = 'off';
    this.checkDivisa = 'off';
    this.checkConvenio = 'off';

    if (!flag) {
      this.clearContrato();
      this.edoCtaForm.controls['fecha'].disable()
      this.edoCtaForm.controls['radioTipoArchivo'].disable()
    }
  }

  /**
   * ValCheck
   * @returns valCheck
   */
  onChangeCheckBox(e: any, check: any) {
    // Se inicia con el estatus NO activado
    var estatus = 'off'
    // Validamos si el Check esta en modo Activado
    if (e.target.checked) {
      estatus = 'on';
    }
    // Validamos los tipos de Check
    if( check ==='ctaDescubierto') {
      this.cuentaDescubierto = estatus; 
    }
    if( check ==='checkDivisa') {
      this.checkDivisa = estatus; 
    }
    if( check ==='checkConvenio') {
      this.checkConvenio = estatus; 
    }
  }


  async eventoConsultar() {

    const validaFlag = this.validarDatos();
    if (validaFlag) {
      return this.openModal(
        this.translate.instant(validaFlag.titulo),
        this.translate.instant(validaFlag.obser),
        validaFlag.type,
        this.translate.instant(validaFlag.errorCode),
        this.translate.instant(validaFlag.sugerencia)
      );
    }

    const { fecha, radioFrecuencia, radioTipoArchivo, formato, canal } = this.edoCtaForm.value;
    const { bucCliente, numContrato } = this.datosContrato;
    var fechaInicio = format(fecha, 'dd/MM/yyyy')
    
    var body = {
      "numeroContrato": numContrato,
      "idCanal": canal,
      "idFormatos": formato,
      "buc": bucCliente,
      "fechaIni": fechaInicio,
      "idFrecuencia": this.idRadioFrecuencia,
      "idTipoArchivotmp": radioTipoArchivo,
      "cuentaDescubiertotmp": this.cuentaDescubierto,
      "convenioVirtualtmp": this.checkConvenio,
      "dividirXDivisa": this.checkDivisa,
      "anulacionesContingenciatmp": ""
    }


    const { codError } = await this.solicitudEdoCtaService.subeInstruccionesEdoCta(body, this.usuarioActual);
    this.globals.loaderSubscripcion.emit(false);
    
    if (codError !== '200' && codError !== 'VALFEC00') {
      return this.openModal(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant('modal.msjERRGEN0001Sugerencia'))
    }
    this.onClickClean(true)
    return this.openModal(
      this.translate.instant('pantalla.solicitudEdoCtaContingencia.msjINF001Titulo'),
      this.translate.instant('pantalla.solicitudEdoCtaContingencia.msjINF001Observacion'),
      'info',
      this.translate.instant('pantalla.solicitudEdoCtaContingencia.msjINF001Codigo'),
      this.translate.instant('pantalla.solicitudEdoCtaContingencia.msjINF001Sugerencia'),
    );
  }

  async selRadioFrec(event: any, id: any) {
    this.idRadioFrecuencia = id;
    this.edoCtaForm.patchValue({ radioFrecuencia: event.target.value });
    this.edoCtaForm.patchValue({ canal: '' });
    this.edoCtaForm.patchValue({ formato: '' });
    const { fecha } = this.edoCtaForm.value
    const fechaIni = this.formatoFechas(fecha)
    const { numContrato } = this.datosContrato;
    const { codError, canales, formato }: any = await this.solicitudEdoCtaService.getChannelFormatList(
      {
        contrato: numContrato,
      });

    const { cuentas }: any = await this.solicitudEdoCtaService.getCtaFrecs(
      {
        numContrato,
        fecha: fechaIni,
        idFrecuencia: event.target.id
      });
    this.ctaList = cuentas;
    this.showCta = true;
    this.returnedArray = this.ctaList.slice(0, this.rowsPorPagina);

    if (codError == '500') {
      return this.openModal(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant('modal.msjERRGEN0001Sugerencia'))
    }else{
      this.edoCtaForm.get('radioTipoArchivo')?.enable();
    }
    this.channelList = canales;
    this.formatList = formato;

    this.idCanalSwiftFin = canales.find((x: any) => x.nombre === 'SWIFT_FIN').idCanal;

    this.globals.loaderSubscripcion.emit(false);
    
  }

  validarDatos(): any {
    const { fecha, radioFrecuencia, radioTipoArchivo, formato, canal } = this.edoCtaForm.value;
    const { bucCliente } = this.datosContrato;

    let msj: any = false;
    if (bucCliente == '' || !bucCliente) {
      msj = {
        obser: 'pantalla.solicitudEdoCtaContingencia.msjERR005Observacion',
      }
    } else if (!fecha || fecha == '') {
      msj = {
        obser: 'pantalla.solicitudEdoCtaContingencia.msjERR002Observacion',
      }
    } else if (radioFrecuencia == '' || !radioFrecuencia) {
      msj = {
        obser: 'pantalla.solicitudEdoCtaContingencia.msjERR003Observacion',
      }
    } else if (radioTipoArchivo == '' || !radioTipoArchivo) {
      msj = {
        obser: 'pantalla.solicitudEdoCtaContingencia.msjERR004Observacion',
      }
    } else if (
      formato !== this.idFormatoMT940 &&
      formato !== this.idFormatoMT940D &&
      formato !== this.idFormatoMT942 &&
      canal == this.idCanalSwiftFin
    ) {
      msj = {
        obser: 'pantalla.solicitudEdoCtaContingencia.msjINF00016Observacion',
        titulo: 'pantalla.solicitudEdoCtaContingencia.msjINF00016Titulo',
        type: 'info',
        errorCode: 'pantalla.solicitudEdoCtaContingencia.msjINF00016Codigo',
        sugerencia: 'pantalla.solicitudEdoCtaContingencia.msjINF00016Sugerencia',
      }
    }
    if (msj) {
      msj = {
        titulo: 'pantalla.solicitudEdoCtaContingencia.msjERR002Titulo',
        type: 'error',
        errorCode: 'pantalla.solicitudEdoCtaContingencia.msjERR002Codigo',
        sugerencia: 'pantalla.solicitudEdoCtaContingencia.msjERR002Sugerencia',
        ...msj,

      }

    }
    return msj;
  }

  async onPageChanged(event: any) {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.returnedArray = this.ctaList.slice(startItem, endItem);
  }


}
