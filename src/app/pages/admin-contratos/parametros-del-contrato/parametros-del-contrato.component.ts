import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { DatosCuentaBeanComponent } from 'src/app/bean/datos-cuenta-bean.component';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { MatDialog } from '@angular/material/dialog';
import { ParametrosDelContratoService } from '../../../services/admin-contratos/parametros-del-contrato.service';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-parametros-del-contrato',
  templateUrl: './parametros-del-contrato.component.html',
  styleUrls: ['./parametros-del-contrato.component.css'],
})
export class ParametrosDelContratoComponent implements OnInit, OnDestroy {
  /**
   * @description Formulario para la busqueda de paises
   * @type {FormGroup}
   * @memberOf GestionPaisesComponent
   */
  parametrosContratoForm!: UntypedFormGroup;

  datos: any;
  listaTipoFormato: any = [];
  /** contiene las horas seleccionadas */
  listHorasSelectedIzquierda: string[] = [];
  /** contiene las horas seleccionadas */
  listHorasSelectedDerecha: string[] = [];
  /** Lista que contiene las horas */
  listHorasFirstSelect: any = [];
  listHorasFirstSelectRespaldo: any = [];
  listHorasSecondSelect: any = [];
  listHorasSecondSelectRespaldo: any = [];
  request: any;
  usuarioActual: string | null = '';
  idTipoProcesamientoAnterior = '';
  idTipoProcesamientoAnteriorDesc = '';

  /** Lista que contendra los ids del select derecho */
  listIdsSelectedDerecha: number[] = [];

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

  masterSelected: boolean;
  checkedList: any;
  options: any = [];
  periodo: any;
  procesamiento: any;
  hsm: any;
  selectedStatus: any;

  tiposFormatos: any[];
  tipoArchivoRespuesteARecibir: any;

  constructor(
    private service: ComunesService,
    private parametrosDelContrato: ParametrosDelContratoService,
    private globals: Globals,
    public dialog: MatDialog,
    private fc: FuncionesComunesComponent,
    private translateService: TranslateService
  ) {
    this.usuarioActual = localStorage.getItem('UserID');
  }



  clickSuscliption: Subscription | undefined;

  ngOnInit() {
    this.clickSuscliption = this.service.clickAtion.subscribe(async (resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 6) {
        this.initForm();
      }
    });
  }

  async initForm() {
    this.listaTipoFormato = [];
    this.parametrosContratoForm = new UntypedFormGroup({
      activarPantallaContingencia: new UntypedFormControl('', []),
      activarReporteHistorico: new UntypedFormControl('', []),
      activarEstadoCuenta15: new UntypedFormControl('', []),
      activarReporteBeneficiarioEOP: new UntypedFormControl('', []),
      activarNominaPayext: new UntypedFormControl('', []),
      activarReporteConsolidadoOP: new UntypedFormControl('', []),
      altaCuentasBeneficiariasAME: new UntypedFormControl('', []),
      activarReporteIntradiaOP: new UntypedFormControl('', []),
      cambioCodigoCECOBAN: new UntypedFormControl('', []),
      homologarNombreComprobanteSPE: new UntypedFormControl('', []),
      backendConfirming: new UntypedFormControl('', []),
      tipoProcesamiento: new UntypedFormControl('', []),
      periodoEsperaArchivoFondeoHrs: new UntypedFormControl('', []),
      configurarCifradoArchivos: new UntypedFormControl('', []),
      tipoArchivoRespuesteARecibir: new UntypedFormControl('', []),
      otro: new UntypedFormControl('', []),
      tipoFormato: new UntypedFormArray([]),
      profileIdContingente: new UntypedFormControl('', []),
      contingenciaBuzonera: new UntypedFormControl('', []),
      hsm: new UntypedFormControl('', []),
      valActivarIntradia: new UntypedFormControl('', []),
      isVisibleOrdenPago: new UntypedFormControl('', []),
      alias: new UntypedFormControl('', []),
      actCtasBenefcecoban: new UntypedFormControl(''),
      flagNuevoTipoProc: new UntypedFormControl('', []),
    });

    this.datos = this.service.datosContrato;
    this.datosContrato = this.datos;
    if (this.datos !== undefined) {
      this.datosContrato.bucCliente = this.datos.bucCliente;
      await this.getDatos();
    }
    if (this.datosContrato.idEstatus == 43) {
      this.parametrosContratoForm.disable();
    }
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }



  /**
   * Metodo para poder obtener los valores
   * necesarios para el objeto de parametros adicionales
   */
  getValuesForParametrosAdicionales() {
    this.getSelectedIdsFromListaHorasDerechaDefault();
    this.request.horarios = this.listIdsSelectedDerecha.toString();
    this.request.idCntr = this.datosContrato.idContrato;
    this.request.formato = '';
  }

  private _patchValues(): void {
    // get array control
    const formArray = this.parametrosContratoForm.get(
      'tipoFormato'
    ) as UntypedFormArray;
    // loop for each existing value
    this.tiposFormatos.forEach((tipoFormato) => {
      // add new control to FormArray
      formArray.push(
        // here the new FormControl with item value from RADIO_LIST_FROM_DATABASE
        new UntypedFormGroup({
          descripcionCatalogo: new UntypedFormControl(
            tipoFormato.descripcionCatalogo
          ),
          checked: new UntypedFormControl(
            tipoFormato.estatusActivo === 'A' ? true : false
          ),
          idCatalogo: new UntypedFormControl(tipoFormato.idCatalogo),
        })
      );
    });
  }

  valActivarIntradia: any;
  isVisibleOrdenPago: any;
  hr: any;
  /**
   * Obtiene los datos de la pantalla
   */
  ceco: any;
  async getDatos() {
    try {
      await this.parametrosDelContrato
        .parametrosContrato(this.datosContrato.numContrato)
        .then(async (result: any) => {
          this.idTipoProcesamientoAnterior = result.idCatalogoTipoProces;
          this.idTipoProcesamientoAnteriorDesc = result.catalogoProcesamiento.find((t: { idCatalogo: any; }) => t.idCatalogo == this.idTipoProcesamientoAnterior).descripcionCatalogo;

          this.globals.loaderSubscripcion.emit(true);
          this.parametrosContratoForm.patchValue({
            activarPantallaContingencia:
              result.checkActivarPantCon === 'A' ? true : false,
            activarReporteHistorico:
              result.checkActReporteHist === 'A' ? true : false,
            activarEstadoCuenta15:
              result.checkactEdoCta15Min === 'A' ? true : false,
            activarReporteBeneficiarioEOP:
              result.repBenExto === 'A' ? true : false,
            activarNominaPayext:
              result.checkActNomPayext === 'A' ? true : false,
            activarReporteConsolidadoOP:
              result.checkActReporteConsolOrdenPago === 'A' ? true : false,
            altaCuentasBeneficiariasAME:
              result.chkAltaCtasBenefAMEopc === 'A' ? true : false,
            activarReporteIntradiaOP:
              result.valActivarIntradia === 'A' ? true : false,
            cambioCodigoCECOBAN:
              result.checkActCambioCodCecobanVis === 'A' ? true : false,
            homologarNombreComprobanteSPE:
              result.checkActHomologaSPEI === 'A' ? true : false,
            tipoArchivoRespuesteARecibir: Number(result.idCatalogoArchResp),
            configurarCifradoArchivos: result.valCifradoArchivo,
            backendConfirming: result.backConfirming,
            periodoEsperaArchivoFondeoHrs: result.selectPeridodoEsperaFondeo,
            tipoProcesamiento: result.idCatalogoTipoProces,
            profileIdContingente: result.profileIDCont,
            hsm: result.valCertHSM,
            contingenciaBuzonera:
              result.paramContBuzonCntr === 'A' ? true : false,
            isVisibleOrdenPago: result.visibleOrdenPago === 'A' ? true : false,
            valActivarIntradia:
              result.tvalActivarIntradia === 'A' ? true : false,
            alias: result.paramAliasCntr,
            actCtasBenefcecoban: result.actCtasBenefcecoban,
            flagNuevoTipoProc: result.flagNuevoTipoProc,
          });
          if (this.parametrosContratoForm.value.actCtasBenefcecoban == 'A') {
            this.ceco = true;
            this.parametrosContratoForm.get('cambioCodigoCECOBAN')?.enable();
          } else {
            this.ceco = false;
            this.parametrosContratoForm.get('cambioCodigoCECOBAN')?.disable();
          }

          this.valActivarIntradia =
            this.parametrosContratoForm.value.valActivarIntradia;
          this.isVisibleOrdenPago =
            this.parametrosContratoForm.value.isVisibleOrdenPago;
          this.hr = result.selectPeridodoEsperaFondeo;
          if (
            this.parametrosContratoForm.value.activarReporteIntradiaOP == false
          ) {
            this.intradia = false;
          } else {
            this.intradia = true;
          }
          if (this.parametrosContratoForm.value.tipoProcesamiento == '1') {
            // Se bloquea con seleccionar archivo fondeo
            this.parametrosContratoForm
              .get('periodoEsperaArchivoFondeoHrs')
              ?.enable();
          } else {
            this.parametrosContratoForm
              .get('periodoEsperaArchivoFondeoHrs')
              ?.disable();
          }
          this.tiposFormatos = result.catalogoTipoFormato;
          this.selectedStatus = Number(result.idCatalogoArchResp);
          this.options = result.catalogoArchRespuesta;
          this.periodo = result.catalogoArchFondeo;
          this.hsm = result.catalogoHSM;
          this.procesamiento = result.catalogoProcesamiento;
          this._patchValues();
          this.assingListadoHoraSelect(result);
          this.globals.loaderSubscripcion.emit(false);
        });
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        'Error',
        this.translateService.instant(
          'contingencia.msjERR002Observacion'
        ),
        'error'
      );
    }

  }

  cambio(respuesta: any) {
    if (respuesta.target.value == '1') {
      // Se bloquea con seleccionar archivo fondeo
      this.parametrosContratoForm
        .get('periodoEsperaArchivoFondeoHrs')
        ?.enable();
    } else {
      this.parametrosContratoForm
        .get('periodoEsperaArchivoFondeoHrs')
        ?.disable();
    }
  }
  payext(e: any) {
    let paym = this.parametrosContratoForm.value.tipoFormato;
    for (let i in paym) {
      if (paym[i].descripcionCatalogo === 'PAYEXT') {
        let t = paym[i];
        if (t.checked === false) {
          this.open(
            this.translateService.instant(
              'parametros.contrato.selecciona.layPayext'
            ),
            '',
            'alert',
            this.translateService.instant(
              'parametros.contrato.msgERR0001codigo'
            ),
            ''
          );
          e.target.checked = false;
        }
      }
    }
  }

  /**
   * Metodo para poder obtener el listado de los ids
   * de las horas que se establecieron en la lista de select
   * del lado derecho
   */
  getSelectedIdsFromListaHorasDerechaDefault() {
    this.listIdsSelectedDerecha = [];
    this.listHorasSecondSelect.forEach((hora: any) => {
      this.listIdsSelectedDerecha.push(hora['idCatalogo']);
    });
  }

  intradia: any;
  intradiaSelect(e: any) {
    if (e.target.checked == false) {
      this.intradia = false;
      this.validateAndRemoveHoraToRigthSideSelectedTodos();
    } else {
      this.intradia = true;
    }
  }

  /**
   * Evento que se lanzara al dar click sobre el boton
   * para passar la hora del lado izquierdo al lado
   * derecho
   *
   * agregar nueva hora
   */
  addNewHour() {
    if (this.listHorasSelectedIzquierda.indexOf('-1') >= 0) {
      //Se selecciono la opcion de todos
      this.validateAndAddHoraToRigthSideSelectedTodos();
    } else {
      //Se selecciono 1 o mas opciones excepto el todos
      this.validateAndAddHoraToRigthWithOutSelectedTodos();
    }
  }
  /**
   * Evento que se lanzara al dar click sobre el boton
   * para pasar la hora del lado derecho al lado
   * izquierdo
   *
   * eliminar una hora
   */
  removeHour() {
    if (this.listHorasSelectedDerecha.indexOf('-1') >= 0) {
      //Se selecciono la opcion de todos
      this.validateAndRemoveHoraToRigthSideSelectedTodos();
    } else {
      //Se selecciono 1 o mas opciones excepto el todos
      this.validateAndRemoveHoraToRigthWithOutSelectedTodos();
    }
  }

  /**
   * Metodo para validar si la hora del lado izquierdo
   * ya existe o no en la lista de horas del lado derecho
   * cuando se selecciona la opcion de todos
   */
  validateAndAddHoraToRigthSideSelectedTodos() {
    //Se selecciono la opcion todos
    var listadoHorasAdd: any = [];
    var listHorasRemoveUntilExist: any = [];
    for (var i = 0; i < this.listHorasFirstSelect.length; i++) {
      var objLeftHora = this.listHorasFirstSelect[i];
      listHorasRemoveUntilExist.push(objLeftHora);
      var banderaExist = false;
      for (var j = 0; j < this.listHorasSecondSelect.length; j++) {
        var objRightHora = this.listHorasSecondSelect[j];
        if (
          objLeftHora['descripcionCatalogo'] ==
          objRightHora['descripcionCatalogo']
        ) {
          banderaExist = true;
          j = this.listHorasSecondSelect.length;
        }
      }
      if (!banderaExist) {
        listadoHorasAdd.push(objLeftHora);
      }
    }
    this.listHorasSecondSelect = this.ordenateListForFirstSelectOrSecond(
      this.listHorasSecondSelect,
      listadoHorasAdd
    );
    //[...this.listHorasSecondSelect,...listadoHorasAdd];
    //Se eliminan los elementos seleccionados
    listHorasRemoveUntilExist.forEach((option: any) => {
      this.listHorasFirstSelect = this.listHorasFirstSelect.filter(
        (ele: any) => {
          return ele['descripcionCatalogo'] != option['descripcionCatalogo'];
        }
      );
    });
  }

  /**
   * Metodo para validar si la hora del lado derecho
   * ya existe o no en la lista de horas del lado izquierdo
   * cuando se selecciona la opcion de todos
   */
  validateAndRemoveHoraToRigthSideSelectedTodos() {
    //Se selecciono la opcion todos
    try {
      var listadoHorasRemove: any = [];
      var listHorasRemoveUntilExist: any = [];
      for (var i = 0; i < this.listHorasSecondSelect.length; i++) {
        var objRigthtHora = this.listHorasSecondSelect[i];
        listHorasRemoveUntilExist.push(objRigthtHora);
        var banderaExist = false;
        for (var j = 0; j < this.listHorasFirstSelect.length; j++) {
          var objLeftHora = this.listHorasFirstSelect[j];
          if (
            objRigthtHora['descripcionCatalogo'] ==
            objLeftHora['descripcionCatalogo']
          ) {
            banderaExist = true;
            j = this.listHorasSecondSelect.length;
          }
        }
        if (!banderaExist) {
          listadoHorasRemove.push(objRigthtHora);
        }
      }
      this.listHorasFirstSelect = this.ordenateListForFirstSelectOrSecond(
        this.listHorasFirstSelect,
        listadoHorasRemove
      );
      //[...this.listHorasFirstSelect,...listadoHorasRemove];
      //Se eliminan los elementos seleccionados
      listHorasRemoveUntilExist.forEach((option: any) => {
        this.listHorasSecondSelect = this.listHorasSecondSelect.filter(
          (ele: any) => {
            return ele['descripcionCatalogo'] != option['descripcionCatalogo'];
          }
        );
      });
    } catch (error) {
      console.log('error', error);
    }

  }

  limpiar() {
    this._patchValues0();
    this.parametrosContratoForm.patchValue({
      activarPantallaContingencia: false,
      activarReporteHistorico: false,
      activarEstadoCuenta15: false,
      activarReporteBeneficiarioEOP: false,
      activarNominaPayext: false,
      activarReporteConsolidadoOP: false,
      altaCuentasBeneficiariasAME: false,
      activarReporteIntradiaOP: false,
      cambioCodigoCECOBAN: false,
      homologarNombreComprobanteSPE: false,
      tipoArchivoRespuesteARecibir: '',
      configurarCifradoArchivos: '',
      backendConfirming: '',
      periodoEsperaArchivoFondeoHrs: 0,
      tipoProcesamiento: '',
      profileIdContingente: '',
      hsm: '',
      contingenciaBuzonera: false,
    });
    this.intradia = false;
    this.validateAndRemoveHoraToRigthSideSelectedTodos();
  }

  formArray: any[] = [];
  private _patchValues0(): void {
    this.tiposFormatos.forEach((tipoFormato) => {
      this.formArray.push({
        descripcionCatalogo: tipoFormato.descripcionCatalogo,
        checked: false,
        idCatalogo: tipoFormato.idCatalogo,
      });
    });
    this.tiposFormatos = this.formArray;
    this.parametrosContratoForm.patchValue({
      tipoFormato: this.tiposFormatos,
    });
  }

  /**
   * Metodo para validar si la hora del lado izquierdo
   * ya existe o no en la lista de horas del lado derecho
   * cuando se selecciona 1 o mas horas que no sea la opcion
   * todos
   */
  validateAndAddHoraToRigthWithOutSelectedTodos() {
    var listadoHorasAdd: any = [];
    var listHorasRemoveUntilExist: any = [];
    this.listHorasSelectedIzquierda.forEach((horaId) => {
      var banderaExist = false;
      var objHoraSelected = null;
      for (var i = 0; i < this.listHorasFirstSelect.length; i++) {
        var objHora = this.listHorasFirstSelect[i];
        if (objHora['idCatalogo'] === horaId) {
          objHoraSelected = objHora;
          listHorasRemoveUntilExist.push(objHoraSelected);
          i = this.listHorasFirstSelect.length;
        }
      }
      for (var i = 0; i < this.listHorasSecondSelect.length; i++) {
        var objRightHora = this.listHorasSecondSelect[i];
        if (
          objHoraSelected['descripcionCatalogo'] ==
          objRightHora['descripcionCatalogo']
        ) {
          banderaExist = true;
          i = this.listHorasSecondSelect.length;
        }
      }
      if (!banderaExist) {
        listadoHorasAdd.push(objHoraSelected);
      }
    });
    this.listHorasSecondSelect = this.ordenateListForFirstSelectOrSecond(
      this.listHorasSecondSelect,
      listadoHorasAdd
    );
    //[...this.listHorasSecondSelect,...listadoHorasAdd];
    //Se eliminan los elementos seleccionados
    listHorasRemoveUntilExist.forEach((option: any) => {
      this.listHorasFirstSelect = this.listHorasFirstSelect.filter(
        (ele: any) => {
          return ele['descripcionCatalogo'] != option['descripcionCatalogo'];
        }
      );
    });
  }

  /**
   * Metodo para validar si la hora del lado izquierdo
   * ya existe o no en la lista de horas del lado derecho
   * cuando se selecciona 1 o mas horas que no sea la opcion
   * todos
   */
  validateAndRemoveHoraToRigthWithOutSelectedTodos() {
    var listadoHorasRemove: any = [];
    var listHorasRemoveUntilExist: any = [];
    this.listHorasSelectedDerecha.forEach((horaId) => {
      var banderaExist = false;
      var objHoraSelected = null;
      for (var i = 0; i < this.listHorasSecondSelect.length; i++) {
        var objHora = this.listHorasSecondSelect[i];
        if (objHora['idCatalogo'] === horaId) {
          objHoraSelected = objHora;
          listHorasRemoveUntilExist.push(objHoraSelected);
          i = this.listHorasSecondSelect.length;
        }
      }
      for (var i = 0; i < this.listHorasFirstSelect.length; i++) {
        var objLeftHora = this.listHorasFirstSelect[i];
        if (
          objHoraSelected['descripcionCatalogo'] ==
          objLeftHora['descripcionCatalogo']
        ) {
          banderaExist = true;
          i = this.listHorasFirstSelect.length;
        }
      }
      if (!banderaExist) {
        listadoHorasRemove.push(objHoraSelected);
      }
    });
    this.listHorasFirstSelect = this.ordenateListForFirstSelectOrSecond(
      this.listHorasFirstSelect,
      listadoHorasRemove
    );
    //[...this.listHorasFirstSelect,...listadoHorasRemove];
    //Se eliminan los elementos seleccionados
    listHorasRemoveUntilExist.forEach((option: any) => {
      this.listHorasSecondSelect = this.listHorasSecondSelect.filter(
        (ele: any) => {
          return ele['descripcionCatalogo'] != option['descripcionCatalogo'];
        }
      );
    });
  }

  /**
   * Metodo para poder realizar el ordenamiento
   * del listado del primer select o segundo select
   */
  ordenateListForFirstSelectOrSecond(
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

  openConfirmYN(titulo: string, contenido: string) {
    if (this.parametrosContratoForm.value.contingenciaBuzonera && !this.parametrosContratoForm.value.profileIdContingente) {
      this.open(
        this.translateService.instant('parametros.contrato.infoIncompleta'),
        this.translateService.instant(
          'parametros.contrato.infoRequerida'
        ),
        'error',
        this.translateService.instant('convenios.errores.msjERR004Codigo'),
        this.translateService.instant('parametros.contrato.msjERR014Sugerencia'),
      );
      return;
    } else {
      const dialogo = this.dialog.open(ModalInfoComponent, {
        data: new ModalInfoBeanComponents(titulo, contenido, 'confirm', 'CNF000'), hasBackdrop: true
      });
      dialogo.afterClosed().subscribe((result) => {
        if (result === 'ok') {
          this.guardar();
        }
      });
    }
  }

  openConfirmYN2(titulo: string, contenido: string) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, 'confirm', 'VALP01'), hasBackdrop: true
    });
    dialogo.afterClosed().subscribe((result) => {
      if (result === 'ok') {
        this.parametrosContratoForm.patchValue({
          activarNominaPayext: false,
        });
      }
    });
  }

  chek(e: any, valor: any) {
    const { value } = this.parametrosContratoForm;
    const selectedTipoFormato =
      value?.tipoFormato?.filter((f: any) => f.checked == false) || [];
    const selectedTipoFormato2 =
      value?.tipoFormato?.filter((f: any) => f.checked == true) || [];

    for (let i in selectedTipoFormato) {
      if (selectedTipoFormato[i].descripcionCatalogo === 'PAYEXT') {
        let t = selectedTipoFormato[i];
        if (t.checked === false) {
          if (this.parametrosContratoForm.value.activarNominaPayext === true) {
            this.openConfirmYN2(
              this.translateService.instant('parametros.contrato.descativa.nomPayext'),
              ''
            );
          }
        }
      }
    }
    for (let i in selectedTipoFormato2) {
      if (
        selectedTipoFormato2[i].descripcionCatalogo === 'pain.001' &&
        valor.descripcionCatalogo === 'pain.001'
      ) {
        let t = selectedTipoFormato2[i];
        if (this.parametrosContratoForm.value.alias === '') {
          e.target.checked = false;
          valor.checked = false;
          this.open(
            this.translateService.instant(
              'parametros.contrato.infoIncompleta'
            ),
            this.translateService.instant(
              'parametros.contrato.msjERR012Observacion'
            ),
            'error',
            this.translateService.instant(
              'parametros.contrato.msjERR012Codigo'
            ),
            this.translateService.instant(
              'parametros.contrato.msjERR012Sugerencia'
            )
          );
          this._patchValues02('pain.001');
        }
      }
      if (
        selectedTipoFormato2[i].idCatalogo === 57 && this.parametrosContratoForm.value.backendConfirming === 'ENL'
      ) {
        e.target.checked = false;
        valor.checked = false;
        this.open(
          '',
          '',
          'alert',
          'VALCFG01',
          this.translateService.instant('parametros.contrato.val.conf.Corp'),
        );
        this._patchValues02('ALTA DE PAGOS CONFIRMING CORPORATIVO');
      }
    }
  }

  formArray2: any[] = [];
  private _patchValues02(text: any): void {
    this.tiposFormatos.forEach((tipoFormato) => {
      if (text === tipoFormato.descripcionCatalogo) {
        this.formArray2.push({
          descripcionCatalogo: tipoFormato.descripcionCatalogo,
          checked: false,
          idCatalogo: tipoFormato.idCatalogo,
        });
      } else {
        this.formArray2.push({
          descripcionCatalogo: tipoFormato.descripcionCatalogo,
          checked: tipoFormato.estatusActivo === 'A' ? true : false,
          idCatalogo: tipoFormato.idCatalogo,
        });
      }
    });
    this.tiposFormatos = this.formArray2;
    this.parametrosContratoForm.patchValue({
      tipoFormato: this.tiposFormatos,
    });
  }

  async guardar() {
    this.listaTipoFormato = [];
    const { value } = this.parametrosContratoForm;
    // get selected fruit from FormGroup value
    const selectedTipoFormato =
      value?.tipoFormato?.filter((f: any) => f.checked) || [];
    if (selectedTipoFormato.length === 0) {
      this.open(
        this.translateService.instant('parametros.contrato.infoIncompleta'),
        this.translateService.instant(
          'parametros.contrato.infoRequerida'
        ),
        'error',
        this.translateService.instant('parametros.contrato.msjERR011Codigo'),
        this.translateService.instant('parametros.contrato.msjERR011Sugerencia')
      );
      return;
    }
    if (
      this.parametrosContratoForm.value.tipoArchivoRespuesteARecibir.toString() ===
      ''
    ) {
      this.open(
        this.translateService.instant('parametros.contrato.infoIncompleta'),
        this.translateService.instant(
          'parametros.contrato.infoRequerida'
        ),
        'error',
        this.translateService.instant('parametros.contrato.msjERR010Codigo'),
        this.translateService.instant('parametros.contrato.msjERR010Sugerencia')
      );
      return;
    }

    this.getSelectedIdsFromListaHorasDerechaDefault();
    if (this.parametrosContratoForm.value.activarReporteIntradiaOP == true) {
      if (this.listIdsSelectedDerecha.length === 0) {
        this.open(
          this.translateService.instant('parametros.contrato.infoIncompleta'),
          this.translateService.instant(
            'parametros.contrato.infoRequerida'
          ),
          'error',
          this.translateService.instant('parametros.contrato.msjERR009Codigo'),
          this.translateService.instant(
            'parametros.contrato.msjERR009Sugerencia'
          )
        );
        return;
      }
    }

    if (this.parametrosContratoForm.value.tipoProcesamiento === '') {
      this.open(
        this.translateService.instant('parametros.contrato.infoIncompleta'),
        this.translateService.instant(
          'parametros.contrato.infoRequerida'
        ),
        'error',
        this.translateService.instant('parametros.contrato.msjERR001Codigo'),
        this.translateService.instant('parametros.contrato.msjERR001Sugerencia')
      );
      return;
    }

    if (this.parametrosContratoForm.value.selPeridodoEsperaFondeo === '') {
      this.open(
        this.translateService.instant('parametros.contrato.infoIncompleta'),
        this.translateService.instant(
          'parametros.contrato.infoRequerida'
        ),
        'error',
        this.translateService.instant('parametros.contrato.msjERR002Codigo'),
        this.translateService.instant('parametros.contrato.msjERR002Sugerencia')
      );
      return;
    }
    if (this.parametrosContratoForm.value.selConfigCifradoArchivo === '') {
      this.open(
        this.translateService.instant('parametros.contrato.infoIncompleta'),
        this.translateService.instant(
          'parametros.contrato.infoRequerida'
        ),
        'error',
        this.translateService.instant('parametros.contrato.msjERR003Codigo'),
        this.translateService.instant('parametros.contrato.msjERR003Sugerencia')
      );
      return;
    }

    for (let x in selectedTipoFormato) {
      this.listaTipoFormato.push(selectedTipoFormato[x].idCatalogo.toString());
    }

    const actualizar = {
      activarPantCon:
        this.parametrosContratoForm.value.activarPantallaContingencia === true
          ? 'A'
          : 'I',
      actEdoCta15Min:
        this.parametrosContratoForm.value.activarEstadoCuenta15 === true
          ? 'A'
          : 'I',
      actNomPayext:
        this.parametrosContratoForm.value.activarNominaPayext === true
          ? 'A'
          : 'I',
      chkAltaCtasBenefAME:
        this.parametrosContratoForm.value.altaCuentasBeneficiariasAME === true
          ? 'A'
          : 'I',
      actCambioCodCecoban:
        this.parametrosContratoForm.value.cambioCodigoCECOBAN === true
          ? 'A'
          : 'I',
      actHomologaSPEI:
        this.parametrosContratoForm.value.homologarNombreComprobanteSPE === true
          ? 'A'
          : 'I',
      actReporteHist:
        this.parametrosContratoForm.value.activarReporteHistorico === true
          ? 'A'
          : 'I',
      actReporteConsolOrdenPago:
        this.parametrosContratoForm.value.activarReporteConsolidadoOP === true
          ? 'A'
          : 'I',
      actReporteIndtradia:
        this.parametrosContratoForm.value.activarReporteIntradiaOP === true
          ? 'A'
          : 'I',
          actRepBenExto:
        this.parametrosContratoForm.value.activarReporteBeneficiarioEOP === true
          ? 'A'
          : 'I',
      numCntr: this.datosContrato.numContrato,
      actReporteProv: '', //A
      actReportePagConf: '', //A
      selTipoProcesamiento: this.parametrosContratoForm.value.tipoProcesamiento, //A  id
      selPeridodoEsperaFondeo:
        this.parametrosContratoForm.value.periodoEsperaArchivoFondeoHrs, //5
      selConfigCifradoArchivo:
        this.parametrosContratoForm.value.configurarCifradoArchivos, //A,
      catalogoArchivo:
        this.parametrosContratoForm.value.tipoArchivoRespuesteARecibir.toString(), //
      flagNuevoTipoProc: this.parametrosContratoForm.value.flagNuevoTipoProc, //A
      hdnIdValAnteriorTipoProc: this.idTipoProcesamientoAnterior, //A
      hdnDescTipoProc: this.procesamiento.find((t: { idCatalogo: any; }) => t.idCatalogo == this.parametrosContratoForm.value.tipoProcesamiento).descripcionCatalogo, //A
      hdnDescValAnteriorTipoProc: this.idTipoProcesamientoAnteriorDesc, //A
      selBakConfirming: this.parametrosContratoForm.value.backendConfirming, //A
      chkCntgBuz:
        this.parametrosContratoForm.value.contingenciaBuzonera === true
          ? 'A'
          : 'I', //A
      profileIDCont:
        this.parametrosContratoForm.value.profileIdContingente || '', //A
      selCBHSM: this.parametrosContratoForm.value.hsm,
      catalogoFormato: this.listaTipoFormato,
      selHorasDerecha: this.listIdsSelectedDerecha,
    };

    try {
      await this.parametrosDelContrato
        .actualizarParametrosContrato(actualizar)
        .then(async (result: any) => {
          this.globals.loaderSubscripcion.emit(false);
          this.open(
            this.translateService.instant(
              'parametros.contrato.msjINF004Titulo'
            ),
            '',
            'info',
            this.translateService.instant(
              'parametros.contrato.msjINF004Codigo'
            ),
            this.translateService.instant(
              'parametros.contrato.msjINF004Sugerencia'
            )
          );
        });
    } catch (e) {
      this.open(
        this.translateService.instant('parametros.contrato.msjERR008Titulo'),
        this.translateService.instant(
          'parametros.contrato.msjERR008Observacion'
        ),
        'error',
        this.translateService.instant('parametros.contrato.msjERR008Codigo'),
        this.translateService.instant('parametros.contrato.msjERR008Sugerencia')
      );
      this.hr;
      this.parametrosContratoForm.patchValue({
        periodoEsperaArchivoFondeoHrs: this.hr,
      });
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  /**
   * Metodo para poder asignar la informacion
   * de los dos select de las horas
   */
  assingListadoHoraSelect(result: any) {
    this.listHorasFirstSelect = result.catalogoHorasIntradia;
    this.listHorasFirstSelectRespaldo = result.catalogoHorasIntradia;
    this.listHorasSecondSelect = result.listaHorasDerecha;
    this.listHorasSecondSelectRespaldo = result.listaHorasDerecha;
  }

  pregunta() {
    this.openConfirmYN(
      this.translateService.instant('modals.parametros.confirmacion'),
      this.translateService.instant('modals.parametros.confirmacion.contenido'),
    );
  }

  /**
   * Abrir el modal de exportar los datos
   */
  openModal() {
    const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
    dialogo.afterClosed().subscribe((result) => {
      if (result) {
        this.exportar(result);
      }
    });
  }

  async exportar(tipoExportacion: any) {
    if (tipoExportacion === 'xlsx' || tipoExportacion === 'csv') {
      tipoExportacion = 'xls';
    }
    try {
    await this.parametrosDelContrato
      .exportarInformacion(
        tipoExportacion,
        this.datosContrato.numContrato,
        this.usuarioActual
      )
      .then(async (result: any) => {
        if (result.data) {
          /** Se manda la informacion para realizar la descarga del archivo */
          this.fc.convertBase64ToDownloadFileInExport(result);
          this.globals.loaderSubscripcion.emit(false);
        } else {
          if (result.code === '404') {
            this.openModalError('Error', result.message, 'error');
            this.globals.loaderSubscripcion.emit(false);
          } else {
            this.openModalError(
              'Error',
              this.translateService.instant('modals.error.pdf'),
              'error'
            );
            this.globals.loaderSubscripcion.emit(false);
          }
        }
      });
    } catch(error){
      this.open(
        this.translateService.instant('parametrosContrato.msjERR0009Titulo'),
        this.translateService.instant(
          'parametrosContrato.msjERR0009Observacion'
        ),
        'error',
        this.translateService.instant('parametrosContrato.msjERR0009Codigo'),
        this.translateService.instant('parametrosContrato.msjERR0009Sugerencia')
      );
      this.globals.loaderSubscripcion.emit(false);
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
    code?: string,
    sug?: string
  ) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, obser, type, code, sug), hasBackdrop: true
    });
  }

  /**
   *
   * Abrir el modal de error
   */
  openModalError(
    titulo: string,
    obser: string,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    code?: string
  ) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, obser, type, code), hasBackdrop: true
    });
  }

  disableEvent(event: any) {
    event.preventDefault();
    return false;
  }

  /**
   * Evento para al momento de realizar el pegado
   * en cualquier input este evento no ocurra
   */
  eventoOnPasteBlock(event: ClipboardEvent) {
    return false;
  }

  /**
   * Evento para poder validar que el campo solo
   * se puedan ingresar alphabeto,
   */
  carac(event: KeyboardEvent) {
    this.fc.esp(event);
  }
}
