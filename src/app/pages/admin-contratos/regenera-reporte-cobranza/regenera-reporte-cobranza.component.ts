import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import {
  NgbCalendar,
  NgbDateAdapter,
} from '@ng-bootstrap/ng-bootstrap';
import { Globals } from '../../../bean/globals-bean.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ReporteCobranzaConsolidadoService } from 'src/app/services/admin-contratos/reporte-cobranza-consolidado.service';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ReporteCobranzaValidacionesCL } from './reporte-cobranza-validaciones';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';

@Component({
  selector: 'app-regenera-reporte-cobranza',
  templateUrl: './regenera-reporte-cobranza.component.html',
  styleUrls: ['./regenera-reporte-cobranza.component.css'],
})
export class RegeneraReporteCobranzaComponent implements OnInit, OnDestroy {
  @ViewChild('limpiar') limp: any;

  claconSelected: string = '';

  listClacones: any[] = [];
  listClaconesSelected: any[] = [];
  listCanales: any[] = [];
  listFormats: any[] = [];
  listCuentas: any[] = [];
  listHorarios: any = {};
  //canales formatos
  idFormatoMT940D: string;
  idFormatoMT940: string;
  idFormatoMT942: string;
  idFormatoMT940_42: string;
  idFormatoRepCobTXT: string;
  idCanalREPAL: string;
  idCanalSwiftFin: string;
  valorRecArcxCta: string;

  //configuracion general
  optIntradia: boolean;
  optOperCierre: boolean;
  optConsXDia: boolean;
  optCantidad: string;
  optTipoContenido: string;
  optCanal: string;
  optFormato: string;
  optFormatoConsolidado: string;
  bandCierre: boolean;
  optClaAbono: boolean;
  optClaCarg: boolean;
  banderaProducto: string;
  banderaProdActivo: string;

  archivoSelected: any;
  showFileButton = false;
  usuarioLogueo: string | null;
  public activeLang = 'es';
  closeResult = '';

  datos: any = {
    numContrato: '',
    bucCliente: '',
    descEstatus: '',
    nombreCompleto: '',
    personalidad: '',
    cuentaEje: '',
    idContrato: '',
    razonSocial: '',
  }
  formRepCta: UntypedFormGroup = new UntypedFormGroup({});
  CE: any;

  listHorasSelectedIzquierda: string[] = [];
  listCuentasSelectedIzquierda: string[] = [];
  cuentasIzquierdas: string[] = [];
  /** contiene las horas seleccionadas */
  listHorasSelectedDerecha: string[] = [];
  listCuentasSelectedDerecha: string[] = [];
  cuentasDerechas: string[] = [];
  /** Lista que contiene las horas */
  listHorasFirstSelect: any = [];
  listCuentasFirstSelect: any = [];
  listHorasFirstSelectRespaldo: any = [];
  listCuentasFirstSelectRespaldo: any = [];
  listHorasSecondSelect: any = [];
  listHorasSecondSelectRespaldo: any = [];
  listCuentasSecondSelect: any = [];
  listCuentasSecondSelectRespaldo: any = [];
  /** pagination **/
  pageIndex = 1;
  pageIndex1 = 1;
  pageCount = 1;

  constructor(
    public translate: TranslateService,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private translateService: TranslateService,
    private serviceComun: ComunesService,
    private globals: Globals,
    private fb: UntypedFormBuilder,
    private fc: FuncionesComunesComponent,
    public dialog: MatDialog,
    private reportService: ReporteCobranzaConsolidadoService,
    private validationService: ReporteCobranzaValidacionesCL,
  ) {
    // Obtenemos el nombre del usuario
    this.usuarioLogueo = localStorage.getItem('UserID');
    if (
      this.datos.descEstatus === 'CANCELADO' ||
      this.datos.descEstatus === 'INACTIVO'
    ) {
      this.formRepCta.disable();
    }
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  clickSuscliption: Subscription | undefined;

  ngOnInit() {
    this.clickSuscliption = this.serviceComun.clickAtion.subscribe(async (resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 10) {
        this.datos = this.serviceComun.datosContrato;
        this.initForm();
        await this.configPage();
        this.globals.loaderSubscripcion.emit(false);
      }
    });
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }

  initForm() {
    this.formRepCta = this.fb.group({
      listClacones: [''],
      listClaconesSelected: [''],
      //Combos select
      optCanal: '',
      optFormato: '',
      //Config checkbox & radio
      optClaCarg: [''],
      optClaAbono: [''],
      cantFilesRadioConsolid: [''],
      chkSigN: [''],
      optTipoContenido: [''],
      chkCta: [''],
      anulaciones: [''],
    });
  }

  async configPage() {
    try {
      const { confGeneral, horarios, clacones, canalesFormatos, bandsCobranza, anulaciones } = await this.reportService.getConfRepCob(this.datos.idContrato)
      const { lstClacones, lstclaconesDisp } = clacones;
      const { idFormatoMT940D, idFormatoMT940, idFormatoMT942, idFormatoMT940_42, idFormatoRepCobTXT, idCanalREPAL, idCanalSwiftFin, valorRecArcxCta, lstCanales, lstFormatos } = canalesFormatos;
      const {
        optIntradia,
        optOperCierre,
        optConsXDia,
        optCantidad,
        optTipoContenido,
        optCanal,
        optFormato,
        optClaAbono,
        optClaCarg,
        bandCierre
      } = confGeneral;

      const { chkCta, chkSigN } = bandsCobranza;
      const { indicador } = anulaciones;

      const { content, totalPages } = await this.reportService.getCtaCob(this.datos.idContrato, 0)
      //cargan listas temporales
      this.listClacones = lstclaconesDisp;
      this.listClaconesSelected = lstClacones;
      this.listCuentas = content;
      this.listHorarios = horarios;
      this.pageCount = totalPages;
      //Cargan los combos de los canales y formatos
      if (this.listCanales.length === 0) this.listCanales = lstCanales;
      if (this.listFormats.length === 0) this.listFormats = lstFormatos;
      //Se ocupan para validaciones
      this.idFormatoMT940D = idFormatoMT940D
      this.idFormatoMT940 = idFormatoMT940
      this.idFormatoMT942 = idFormatoMT942
      this.idFormatoMT940_42 = idFormatoMT940_42
      this.idFormatoRepCobTXT = idFormatoRepCobTXT
      this.idCanalREPAL = idCanalREPAL
      this.idCanalSwiftFin = idCanalSwiftFin
      this.valorRecArcxCta = valorRecArcxCta

      //Se mandan al back para validacion de reporte
      this.optIntradia = optIntradia;
      this.optOperCierre = optOperCierre;
      this.optConsXDia = optConsXDia;
      this.bandCierre = bandCierre;

      this.assingListadoHoraSelect(lstClacones, lstclaconesDisp)

      this.formRepCta.patchValue({
        listClacones: lstClacones,
        listClaconesSelected: lstclaconesDisp,
        optCanal: +optCanal,
        optFormato: +optFormato,
        optClaCarg,
        optClaAbono,
        cantFilesRadioConsolid: optCantidad,
        chkSigN,
        optTipoContenido,
        chkCta,
        anulaciones: indicador === "A" ? true : false,
      })
    } catch (error) {
      return this.open(
        this.translateService.instant('config.cobranza.msjERRORoperacion'),
        '',
        'error',
        '',
        ''
      );
    }
  }


  addNewCuenta1() {
    if (!this.listCuentasSelectedIzquierda.length) {
      this.open(
        this.translateService.instant('modals.edoCuentaConsolidado.error.title'),
        this.translateService.instant('modals.edoCuentaConsolidado.error.bodyIzq'),
        'alert',
        this.translateService.instant('modals.edoCuentaConsolidado.error.codeIzq'),
        this.translateService.instant('modals.edoCuentaConsolidado.error.sugerencia'),
      );
    } else {
      if (this.listCuentasSelectedIzquierda.indexOf('-1') >= 0) {
        this.validateAndAddCuentaToRigthSideSelectedTodos();
      } else {
        this.validateAndAddCuentaToRigthWithOutSelectedTodos();
      }
    }
  }

  removeCuenta1() {
    if (!this.listCuentasSelectedDerecha.length) {
      this.open(
        this.translateService.instant('modals.edoCuentaConsolidado.error.title'),
        this.translateService.instant('modals.edoCuentaConsolidado.error.bodyDer'),
        'alert',
        this.translateService.instant('modals.edoCuentaConsolidado.error.codeDer'),
        this.translateService.instant('modals.edoCuentaConsolidado.error.sugerencia'),
      );
    } else {
      if (this.listCuentasSelectedDerecha.indexOf('-1') >= 0) {
        this.validateAndRemoveCuentaToRigthSideSelectedTodos();
      } else {
        this.validateAndRemoveCuentaToRigthWithOutSelectedTodos();
      }
    }
  }

  validateAndRemoveCuentaToRigthSideSelectedTodos() {
    //Se selecciono la opcion todos
    var listadoCuentasRemove: any = [];
    var listCuentasRemoveUntilExist: any = [];
    for (var i = 0; i < this.listCuentasSecondSelect.length; i++) {
      var objRigthtHora = this.listCuentasSecondSelect[i];
      listCuentasRemoveUntilExist.push(objRigthtHora);
      var banderaExist = false;
      for (var j = 0; j < this.listCuentasFirstSelect.length; j++) {
        var objLeftHora = this.listCuentasFirstSelect[j];
        if (
          objRigthtHora['descripcionCatalogo'] ==
          objLeftHora['descripcionCatalogo']
        ) {
          banderaExist = true;
          j = this.listCuentasSecondSelect.length;
        }
      }
      if (!banderaExist) {
        listadoCuentasRemove.push(objRigthtHora);
      }
    }
    this.listCuentasFirstSelect = this.ordenateListForFirstSelectOrSecondCuenta(
      this.listCuentasFirstSelect,
      listadoCuentasRemove
    );
    //[...this.listHorasFirstSelect,...listadoHorasRemove];
    //Se eliminan los elementos seleccionados
    listCuentasRemoveUntilExist.forEach((option: any) => {
      this.listCuentasSecondSelect = this.listCuentasSecondSelect.filter(
        (ele: any) => {
          return ele['descripcionCatalogo'] != option['descripcionCatalogo'];
        }
      );
    });
  }

  validateAndRemoveCuentaToRigthWithOutSelectedTodos() {
    var listadoCuentasRemove: any = [];
    var listCuentasRemoveUntilExist: any = [];
    this.listCuentasSelectedDerecha.forEach((horaId: any) => {
      var banderaExist = false;
      var objHoraSelected = null;
      for (var i = 0; i < this.listCuentasSecondSelect.length; i++) {
        var objHora = this.listCuentasSecondSelect[i];
        if (objHora['idCatalogo'] === horaId.idCatalogo) {
          objHoraSelected = objHora;
          listCuentasRemoveUntilExist.push(objHoraSelected);
          i = this.listCuentasSecondSelect.length;
        }
      }
      for (var i = 0; i < this.listCuentasFirstSelect.length; i++) {
        var objLeftHora = this.listCuentasFirstSelect[i];
        if (
          objHoraSelected['descripcionCatalogo'] ==
          objLeftHora['descripcionCatalogo']
        ) {
          banderaExist = true;
          i = this.listCuentasFirstSelect.length;
        }
      }
      if (!banderaExist) {
        listadoCuentasRemove.push(objHoraSelected);
      }
    });
    this.listCuentasFirstSelect = this.ordenateListForFirstSelectOrSecondCuenta(
      this.listCuentasFirstSelect,
      listadoCuentasRemove
    );
    //[...this.listHorasFirstSelect,...listadoHorasRemove];
    //Se eliminan los elementos seleccionados
    listCuentasRemoveUntilExist.forEach((option: any) => {
      this.listCuentasSecondSelect = this.listCuentasSecondSelect.filter(
        (ele: any) => {
          return ele['descripcionCatalogo'] != option['descripcionCatalogo'];
        }
      );
    });

  }

  validateAndAddCuentaToRigthSideSelectedTodos() {
    //Se selecciono la opcion todos
    var listadoCuentaAdd: any = [];
    var listCuentaRemoveUntilExist: any = [];
    for (var i = 0; i < this.listCuentasFirstSelect.length; i++) {
      var objLeftHora = this.listCuentasFirstSelect[i];
      listCuentaRemoveUntilExist.push(objLeftHora);
      var banderaExist = false;
      for (var j = 0; j < this.listCuentasSecondSelect.length; j++) {
        var objRightHora = this.listCuentasSecondSelect[j];
        if (
          objLeftHora['descripcionCatalogo'] ==
          objRightHora['descripcionCatalogo']
        ) {
          banderaExist = true;
          j = this.listCuentasSecondSelect.length;
        }
      }
      if (!banderaExist) {
        listadoCuentaAdd.push(objLeftHora);
      }
    }
    this.listCuentasSecondSelect = this.ordenateListForFirstSelectOrSecondCuenta(
      this.listCuentasSecondSelect,
      listadoCuentaAdd
    );
    //[...this.listHorasSecondSelect,...listadoHorasAdd];
    //Se eliminan los elementos seleccionados
    listCuentaRemoveUntilExist.forEach((option: any) => {
      this.listCuentasFirstSelect = this.listCuentasFirstSelect.filter(
        (ele: any) => {
          return ele['descripcionCatalogo'] != option['descripcionCatalogo'];
        }
      );
    });
  }

  validateAndAddCuentaToRigthWithOutSelectedTodos() {
    var listadoCuentaAdd: any = [];
    var listCuentaRemoveUntilExist: any = [];
    this.listCuentasSelectedIzquierda.forEach((horaId: any) => {
      var banderaExist = false;
      var objHoraSelected = null;
      for (var i = 0; i < this.listCuentasFirstSelect.length; i++) {
        var objHora = this.listCuentasFirstSelect[i];
        if (objHora['idCatalogo'] === horaId.idCatalogo) {
          objHoraSelected = objHora;
          listCuentaRemoveUntilExist.push(objHoraSelected);
          i = this.listCuentasFirstSelect.length;
        }
      }
      for (var i = 0; i < this.listCuentasSecondSelect.length; i++) {
        var objRightHora = this.listCuentasSecondSelect[i];
        if (
          objHoraSelected['descripcionCatalogo'] ==
          objRightHora['descripcionCatalogo']
        ) {
          banderaExist = true;
          i = this.listCuentasSecondSelect.length;
        }
      }
      if (!banderaExist) {
        listadoCuentaAdd.push(objHoraSelected);
      }
    });
    this.listCuentasSecondSelect = this.ordenateListForFirstSelectOrSecondCuenta(
      this.listCuentasSecondSelect,
      listadoCuentaAdd
    );
    //[...this.listHorasSecondSelect,...listadoHorasAdd];
    //Se eliminan los elementos seleccionados
    listCuentaRemoveUntilExist.forEach((option: any) => {
      this.listCuentasFirstSelect = this.listCuentasFirstSelect.filter(
        (ele: any) => {
          return ele['descripcionCatalogo'] != option['descripcionCatalogo'];
        }
      );
    });
  }

  ordenateListForFirstSelectOrSecondCuenta(
    listadooriginal: any,
    listadoAgregar: any
  ) {
    var listadoComplete: any = [...listadooriginal, ...listadoAgregar];

    listadoComplete.sort((a: any, b: any) => {
      var numberValidate: number = 0;
      let objHoraA = a['descripcionCatalogo'];
      let objHoraB = b['descripcionCatalogo'];

      if (objHoraA < objHoraB) {
        numberValidate = -1;
      }

      if (objHoraA > objHoraB) {
        numberValidate = 1;
      }

      return numberValidate;
    });

    return listadoComplete;
  }

  readArchivo(fileEvent: any): void {
    this.archivoSelected = fileEvent.target.files[0];
  }


  async chargeAccounts(): Promise<void> {
    try {
      if (this.showFileButton && this.archivoSelected) {
        const formDataArchivo: FormData = new FormData();
        formDataArchivo.append('archivo', this.archivoSelected);
        const file = formDataArchivo;
        const uploadDocumentAccounts =
          (await this.reportService.loadFile(
            this.datos.idContrato,
            file
          )) as { message: string };
        const codMessage = uploadDocumentAccounts?.message;
        if (codMessage === 'EXPOK1' || codMessage === 'OKCC01') {
          const dialog = this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(
              this.translateService.instant('config.cobranza.msjCargaOK'),
              '',
              'confirm',
              codMessage,
              this.translateService.instant('config.cobranza.msjCargaCuentas')
            ),
          });

          dialog.afterClosed().subscribe(async (r) => {
            this.showFileButton = false
            if (r === 'ok') {
              await this.downloadDetailAccounts();
            }
          });
        } else if (codMessage === 'OKCCG1') {
          this.open(
            this.translateService.instant('producto.msjERR002Titulo'),
            this.translateService.instant('pantalla.reporteCobranzaConsolidado.msjOKCCG1Observacion'),
            'info',
            this.translateService.instant('pantalla.reporteCobranzaConsolidado.msjOKCCG1Codigo'),
            '');
        } else if (codMessage === 'ERRORG9') {
          this.open(
            this.translateService.instant('producto.msjERR002Titulo'),
            this.translateService.instant(
              'config.cobranza.msjERRORG9Observacion'
            ),
            'error',
            this.translateService.instant('config.cobranza.msjERRORG9Codigo'),
            this.translateService.instant('config.cobranza.msjERRORG9Sugerencia')
          );
        } else if (codMessage === 'ERRORG99') {
          this.open(
            this.translateService.instant('producto.msjERR002Titulo'),
            this.translateService.instant(
              'config.cobranza.msjERRORG99Observacion'
            ),
            'error',
            this.translateService.instant('config.cobranza.msjERRORG99Codigo'),
            ''
          );
        } else {
          this.open(
            this.translateService.instant('config.cobranza.msjERRORoperacion'),
            '',
            'error',
            codMessage,
            ''
          );
        }
        if (uploadDocumentAccounts) this.globals.loaderSubscripcion.next(false);
      } else if (this.showFileButton && !this.archivoSelected) {
        return;
      }
      this.showFileButton = true;
    } catch (error) {
      this.open(
        this.translateService.instant('config.cobranza.msjERRORoperacion'),
        '',
        'error',
        '',
        ''
      );
    }
  }

  async downloadAccounts(): Promise<void> {
    const getReportDetail =
      await this.reportService.getXlsCtaCob(
        this.datos.idContrato
      );
    if (getReportDetail) {
      this.fc.convertBase64ToDownloadFileInExport(getReportDetail);
    }
    this.globals.loaderSubscripcion.next(false);
  }

  async saveConfig(): Promise<any> {
    const configData = {
      idFormatoMT940D: this.idFormatoMT940D,
      idFormatoMT940: this.idFormatoMT940,
      idFormatoMT942: this.idFormatoMT942,
      idFormatoMT940_42: this.idFormatoMT940_42,
      idFormatoRepCobTXT: this.idFormatoRepCobTXT,
      idCanalREPAL: this.idCanalREPAL,
      idCanalSwiftFin: this.idCanalSwiftFin,
      valorRecArcxCta: this.valorRecArcxCta,
      optIntradia: this.optIntradia,
      optOperCierre: this.optOperCierre,
      optConsXDia: this.optConsXDia,
      bandCierre: this.bandCierre,
      banderaProducto: this.banderaProducto,
      banderaProdActivo: this.banderaProdActivo,
      listCuentas: this.listCuentas,
      listCanales: this.listCanales,
      listFormats: this.listFormats,
      listClacones: this.listClacones,
      listClaconesSelected: this.listCuentasSecondSelect,
      horarios: this.listHorarios,
    }

    try {
      const { validationFlag, bodyMsg }: any = await this.validationService.validaGuardado(this.formRepCta.controls, configData);

      if (this.formRepCta.controls['cantFilesRadioConsolid'].value === '' || this.formRepCta.controls['cantFilesRadioConsolid'].value === null) {
        this.open(
          this.translateService.instant(
            'pantalla.reporteCobranzaConsolidado.VALDAT03Observacion'
          ),
          '',
          'alert',
          'VALDAT03'
        );
        return
      }

      if (this.formRepCta.controls['optTipoContenido'].value === '' || this.formRepCta.controls['optTipoContenido'].value === null) {
        this.open(
          this.translateService.instant(
            'pantalla.reporteCobranzaConsolidado.VALDAT044Observacion'
          ),
          '',
          'alert',
          'VALDAT04'
        );
        return
      }

      if (validationFlag) {
        this.open(
          this.translateService.instant(
            'config.cobranza.msjrealmenteDeseaGuardar'
          ),
          '',
          'confirm',
          '',
          this.translateService.instant('config.cobranza.msjGuardarConfiguracion')
        );
        this.globals.loaderSubscripcion.emit(false);

      } else {
        this.globals.loaderSubscripcion.emit(false);

        return this.open(
          this.translate.instant(bodyMsg.titulo),
          this.translate.instant(bodyMsg.obser),
          bodyMsg.type,
          this.translate.instant(bodyMsg.errorCode),
          this.translate.instant(bodyMsg.sugerencia));
      }
    } catch (error) {
      this.open(
        this.translateService.instant('config.cobranza.msjERRORoperacion'),
        '',
        'error',
        '',
        ''
      );
    }
  }

  assingListadoHoraSelect(result1: any, result2: any) {
    this.listCuentasFirstSelect = result2;
    this.listCuentasFirstSelectRespaldo = result2;
    this.listCuentasSecondSelect = result1;
    this.listCuentasSecondSelectRespaldo = result1;
  }

  exportReport(): void {
    const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
    dialogo.afterClosed().subscribe(async (result) => {
      if (result) {

        const type = result === 'xlsx' ? 'xls' : result;
        const request = {
          idContrato: this.datos.idContrato,
          numeroContrato: this.datos.numContrato,
          usuario: this.usuarioLogueo
        };

        const response = await this.reportService.getRepFile(
          request,
          type,
        );
        if (response) {
          this.fc.convertBase64ToDownloadFileInExport(response);
        }
        this.globals.loaderSubscripcion.emit(false);
      }
    });
  }

  async downloadDetailAccounts(): Promise<void> {
    try {
      const getDetailAccountsCharge =
        await this.reportService.getDetailCta(
          this.datos.idContrato
        );
      if (getDetailAccountsCharge) {
        this.fc.convertBase64ToDownloadFileInExport(getDetailAccountsCharge);
      }
    } catch (error) {
      this.open(
        this.translateService.instant('config.cobranza.msjERRORoperacion'),
        '',
        'error',
        '',
        ''
      );
    }
    this.globals.loaderSubscripcion.next(false);
  }

  open(
    titulo: String,
    contenido: String,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    code?: string,
    sugerencia?: string
  ) {
    const dialog = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        contenido,
        type,
        code,
        sugerencia
      ), hasBackdrop: true
    });

    dialog.afterClosed().subscribe(async (r) => {
      if (r === 'ok') {
        try {
          const {
            optCanal,
            optFormato,
            optClaCarg,
            optClaAbono,
            cantFilesRadioConsolid,
            chkSigN,
            optTipoContenido,
            chkCta,
            anulaciones,
          } = this.formRepCta.controls;
          this.listHorarios.horasSel.forEach((r: any) => {
            delete r.estatusActivo;
            delete r.estatusFinal;
          });
          this.listClaconesSelected.forEach((r) => {
            delete r.estatusActivo;
            delete r.estatusFinal;
          });

          const request = {
            idContrato: Number(this.datos.idContrato),
            hdnContratoFolio: '',
            anulacionesValor: anulaciones.value ? 'A' : 'I',
            confGeneralCobranza: {
              optIntradia: this.optIntradia,
              optConsXDia: this.optConsXDia,
              optCantidad: cantFilesRadioConsolid.value,
              optTipoContenido: optTipoContenido.value,
              optCanal: optCanal.value,
              optFormato: optFormato.value,
              optFormatoConsolidado: optFormato.value,
              bandCierre: this.bandCierre,
              optClaAbono: optClaAbono.value,
              optClaCarg: optClaCarg.value,
              horarios: this.listHorarios.horasSel,
              clacones: this.listCuentasSecondSelect
            },
            bandsCobranza: {
              signosNegativosMostrar: chkSigN.value ? 'A' : 'I',
              cuentaClabeMostrar: chkCta.value ? 'A' : 'I'
            }
          }

          const saveConfig = (await this.reportService.saveConf(
            request
          ));
          if (saveConfig.message === 'OKCCG1') {
            await this.configPage();
            this.globals.loaderSubscripcion.emit(false);
            return this.open(
              '',
              this.translateService.instant('pantalla.reporteCobranzaConsolidado.msjOKCCG1Observacion'),
              'info',
              this.translateService.instant('pantalla.reporteCobranzaConsolidado.msjOKCCG1Codigo'),
              this.translateService.instant('pantalla.reporteCobranzaConsolidado.msjOKCCG1Sugerencia'),
            );
          } else if (saveConfig.code === 'ERRORG9') {
            this.globals.loaderSubscripcion.emit(false);
            return this.open(
              '',
              this.translateService.instant('pantalla.reporteCobranzaConsolidado.msjERRORG9Observacion'),
              'error',
              this.translateService.instant('pantalla.reporteCobranzaConsolidado.msjERRORG9Codigo'),
              this.translateService.instant('pantalla.reporteCobranzaConsolidado.msjERRORG9Sugerencia'),
            );
          }
          this.globals.loaderSubscripcion.emit(false);
        } catch (error) {

          this.globals.loaderSubscripcion.emit(false);
          return this.open(
            this.translateService.instant('config.cobranza.msjERRORoperacion'),
            '',
            'error',
            '',
            ''
          );
        }

      }
    });
  }

  async paginacion(pageConsultar: any, pageActual?: any) {
    let pageCon: any = Number.parseInt(pageConsultar);
    let pagina: any = ((pageCon < 1) ? 0 : pageCon - 1);
    const getCuentas = (await this.reportService.getCtaCob(this.datos.idContrato, pagina));
    this.listCuentas = getCuentas.content;
    this.pageCount = getCuentas.totalPages;
    this.globals.loaderSubscripcion.emit(false);

  }

  moveToPreviousPage() {
    if (this.canMoveToPreviousPage) {
      this.pageIndex--;
      var mas = this.pageIndex + 1
      // consultar uno menos
      this.paginacion(this.pageIndex, this.pageIndex1)
    }
  }

  moveToLastPage() {
    var actual = this.pageIndex
    this.pageIndex = this.pageCount;
    // consultar al ultimo
    this.paginacion(this.pageIndex, this.pageIndex1)
  }

  moveToFirstPage() {
    var actual = this.pageIndex
    this.pageIndex = 1;
    // consultar al inicio
    this.paginacion(this.pageIndex, this.pageIndex1)
  }

  moveToNextPage() {
    if (this.canMoveToNextPage) {
      this.pageIndex++;
      // consultar uno mas
      this.paginacion(this.pageIndex, this.pageIndex1)
    }
  }

  get canMoveToNextPage(): boolean {
    return this.pageIndex < this.pageCount ? true : false;
  }

  get canMoveToPreviousPage(): boolean {
    return this.pageIndex >= 2 ? true : false;
  }
}
