import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { ParametriaAdicionalService } from 'src/app/services/admin-contratos/parametria-adicional.service';
import { IAdditionalEnviromentRequest } from './request/iadditional-enviroment-request';
import { IBeanParametroAdicionalATM } from './request/ibean-parametro-adicional-atm';
import { IProducto } from './request/iproducto';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { ModalGuardarParametriaAdicionalComponent } from 'src/app/components/modals/modal-guardar-parametria-adicional/modal-guardar-parametria-adicional.component';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-parametria-adicional',
  templateUrl: './parametria-adicional.component.html',
  styleUrls: ['./parametria-adicional.component.css']
})
export class ParametriaAdicionalComponent implements OnInit, OnDestroy {
  /** Variable para poder almacenar el valor de activar optimus */
  activateOptimus: boolean = false;
  activateProdATM: boolean = false;
  valorSwiftFin: boolean = false;
  valorContinueBicSave: boolean = false;
  /** componente modal */
  modal: BsModalRef = new BsModalRef;
  /** variable de control para guardar el numero de contrato */
  numContrato: string = "";
  /** Propiedad que se enviara a la peticion de preload */
  request: IAdditionalEnviromentRequest;
  requestBackup: IAdditionalEnviromentRequest;
  /** Se inicializa el objeto que contendra los datos del contrato */
  datosContrato: any = {
    numContrato: "",
    bucCliente: "",
    descEstatus: "",
    nombreCompleto: "",
    personalidad: "",
    cuentaEje: "",
    idContrato: "",
    razonSocial: "",
    idEstatus: ""
  };
  /** Propiedad para mostrar la informacion del bean */
  beanParametriaAdicionalATM: IBeanParametroAdicionalATM;
  /** Lista que contiene las horas */
  listHorasFirstSelect: any = [];
  listHorasSecondSelect: any = [];
  /** Listado para canal de entrega, reportes optimus y devoluciones online */
  listCanalEntrega = [];
  listReportesOptimus = [];
  listDevolucionesOnline = [];
  /** Se obtiene el listado de productos */
  listProductos: IProducto[] = [];
  /** Variable para identificar si el listado de productos contiene o no valores*/
  banderaHasRows: boolean = false;
  /** contiene las horas seleccionadas */
  listHorasSelectedIzquierda: string[] = [];
  /** contiene las horas seleccionadas */
  listHorasSelectedDerecha: string[] = [];
  /** Lista que contendra los ids del select derecho */
  listIdsSelectedDerecha: number[] = [];
  /** Bandera para poder deshabilitar el boton de guardar o exportar */
  banderaDisableSave: boolean = true;
  banderaDisableExport: boolean = false;
  banderaDisableSelectHorasIzq: boolean = true;
  banderaDisableSelectHorasDer: boolean = true;
  banderaDisableAddHour: boolean = true;
  banderaDisableRemoveHour: boolean = true;
  /** Bandera para mostrar u ocultar los botones Guardar, Limpiar y Exportar */
  banderaShowButtons: boolean = false;
  banderaDisabledChkAtivaReporteConsolidadPagoAtm: boolean = true;
  banderaDisabledChkActivaReporteIntradiaPagoAtm: boolean = true;
  banderaDisabledChkMostrarReferenciaCobroResponseOdp: boolean = true;
  banderaDisabledChkActivaReporteHistoricoPagoAtm: boolean = true;
  banderaDisabledIdCanalPaAd: boolean = true;
  banderaDisabledIdCanal: boolean = true;
  banderaDisabledListaCriticidadCliente: boolean = true;
  banderaDisabledEnvioClaveRastreo: boolean = false;
  banderaDisabledEntregaEstadoCuenta: boolean = false;
  /**
    * @description Nombre de usuario de la sesión actual.
    * Este usuario se tendria que sustituir por el de la sesion actual.
    * @type {string}
    * @memberOf GestionComprobantesComponent
    */
  usuarioActual: string | null = '';
  /*** Bandera para deshabilitar los elementos de la pantalla cuando no existe informacion */
  banderaDisableItem: boolean = true;
  datos:any

  /** Listado para criticidad de cliente */
  listaCriticidad: any;

  /**
    * Constructor de la clase
    * aplicar las validaciones correspondientes
    * @param toastService -Servicio de alertas
    * @param router - Servicio de direccionamiento
    * @param modalService - Servicio para levantar el modal
    * @param fc - contiene las validaciones
    * @param globals - contiene el evento de cargando
    * @param dialog - contiene el evento para levantar un toast
    * @param parametriaAdicionalService - contiene las peticiones a los servicios
    */
  constructor(
    private fc: FuncionesComunesComponent,
    private globals: Globals,
    public dialog: MatDialog,
    private parametriaAdicionalService: ParametriaAdicionalService,
    private translate: TranslateService,
    private service: ComunesService,
  ) {
    this.request = {
      folioEnc: "",
      hdnContratoFolio: "",
      folioEncHdn: "",
      horarios: "",
      idCanalPaAd: "",
      idCanalOnline: "",
      ipCliente: "",
      codBICE: "",
      idCntr: "",
      formato: "",
      chkValDuplicados: "",
      chkRptActConsAtm: "",
      chkRptHistAtm: "",
      chkRptIntrAtm: "",
      chkOdpAtm: "",
      activaOptimus: false,
      idCanal: "",
      horariosEspec: "",
      contratosProd: "",
      usrReporte: "",
      chkCveRsto: "",
      chkEntregaEstadoCuenta: "",
      bandVip: "",
      bandCV: false,
      bandCVAnt: ""
    };

    this.beanParametriaAdicionalATM = {
      lista: [],
      idCanalPaAd: 0,
      ordenPagoATMactivo: false,
      idCanalOnline: 0,
      ipCliente: "",
      codBICE: "",
      idcanalSwiftFile: "",
      chkRptActConsAtm: "",
      chkRptHistAtm: "",
      chkRptIntrAtm: "",
      chkValDuplicados: "",
      chkOdpAtm: "",
      idCanal: 0,
      chkCveRsto: "",
      chkEntregaEstadoCuenta: "",
      bandVip: "",
      bandCV: false
    };

    this.usuarioActual = localStorage.getItem('UserID');
  }

  clickSuscliption: Subscription | undefined;

  ngOnInit(){
    this.datos = this.service.datosContrato
    //this.initForm();
    this.clickSuscliption = this.service.clickAtion.subscribe((resp:any) => {      
      const { codeMenu } = resp;
      if (codeMenu === 7) {
        if(this.datos !== undefined) {
          this.initForm();
        } 
      }
    });
  }

  initForm(){
    this.datosContrato.bucCliente = this.datos.bucCliente;
    this.datosContrato.idEstatus = this.datos.idEstatus;
    this.datosContrato.cuentaEje = this.datos.cuentaEje;
    this.getPreloadByNumContrato();
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
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
   * Evento para solo permitir escritura
   * del alphabeto
   */
  eventOnlyAlphabeticAndNumbers(event: KeyboardEvent) {
    this.fc.onlyAlphabeticAndNumbers(event);
  }

  /**
   * Evento para solo permitir valores
   * del alphabeto al momento de pegar 
   * en el input
   */
  eventOnPageOnlyAlphabeticAndNumbers(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let i = 0; i < textPasted.length; i++) {
      if (!this.fc.alphaNumerciOnlyForPasteEvent(textPasted[i].charCodeAt(0))) {
        i = textPasted.length;
        flag = false;
      }
    }
    return flag;
  }

  /**
   * Evento TAB para ir a buscar la informacion
   * del preload para parametria adicional
   */
  eventOnTabObtenerPreload() {
    this.getPreloadByNumContrato();
  }

  /**
   * Evento para solo permitir numero
   * y el punto para el campo ip
   */
  eventOnlyNumberAndPoint(event: KeyboardEvent) {
    this.fc.numberOnlyAndPoint(event);
  }

  /**
   * Evento para solo permitir valores
   * numericos y punto al momento de pegar
   * los valores en el campo ip
   */
  eventOnPageOnlyNumberAndPoint(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let i = 0; i < textPasted.length; i++) {
      if (!this.fc.numbersAndPointForPasteEvent(textPasted[i].charCodeAt(0))) {
        i = textPasted.length;
        flag = false;
      }
    }
    return flag;
  }

  displayCounter(obj: any){
    if(obj !== null){
      this.datosContrato.bucCliente = obj.bucCliente;
      
      this.getPreloadByNumContrato();
    }
    else{
      this.open(
        this.translate.instant('numContrato'),
        this.translate.instant('admonContratos.msjCONT0020Observacion'),
        'error',
        this.translate.instant('admonContratos.msjCONT0020Codigo'),
        this.translate.instant('admonContratos.msjCONT0020Sugerencia')
      );
    }
  }


  /**
    * @descripcion Metodo para poder obtener la informacion
    * del preload de parametria adicional
    */
  private async getPreloadByNumContrato() {
    try {
      if (this.datosContrato.bucCliente != "") {
        await this.service.consultaInformacionContrato(this.datosContrato.bucCliente, this.datosContrato.idEstatus, this.datosContrato.cuentaEje).then(
          async (resp: any) => {
            try {
                this.assingDatosContratoFromRequest(resp);
                if (this.datosContrato.numContrato != "") {
                  this.request.folioEnc = resp.numContrato;
                  this.request.idCntr = resp.idContrato;
                  await this.parametriaAdicionalService.getPreloadInformacionByNumContrato(this.request).then(
                    async (result: any) => {
                      this.banderaDisableItem = false;
                      this.banderaDisableSave = false;
                      this.activateOptimus = result.activaOptimus;
                      this.activateProdATM = result.activaProdATM;
                      if (result.beanParAdAtm.chkRptIntrAtm === 'A') {
                        this.enableSectionHoras();
                      } else {
                        this.disabledSectionHoras();
                      }
                      if (!this.activateProdATM) {
                        this.banderaDisabledChkAtivaReporteConsolidadPagoAtm = true;
                        this.banderaDisabledChkActivaReporteIntradiaPagoAtm = true;
                        this.banderaDisabledChkMostrarReferenciaCobroResponseOdp = true;
                        this.banderaDisabledChkActivaReporteHistoricoPagoAtm = true;
                        this.banderaDisabledIdCanalPaAd = true;
                        this.banderaDisabledListaCriticidadCliente = false;
                        this.disabledSectionHoras();
                      } else {
                        this.banderaDisabledChkAtivaReporteConsolidadPagoAtm = false;
                        this.banderaDisabledChkActivaReporteIntradiaPagoAtm = false;
                        this.banderaDisabledChkMostrarReferenciaCobroResponseOdp = false;
                        this.banderaDisabledChkActivaReporteHistoricoPagoAtm = false;
                        this.banderaDisabledIdCanalPaAd = false;
                        this.banderaDisabledListaCriticidadCliente = false;
                      }
                      if (!this.activateOptimus) {
                        this.banderaDisabledIdCanal = true;
                      } else {
                        this.banderaDisabledIdCanal = false;
                      }
                      this.assingListadoHoraSelect(result);
                      this.assingListSelectsCanalReporteDevoluciones(result);
                      this.assingListProductos(result);
                      this.assingBeanParametriaAdicional(result);
                      this.listaCriticidadDeCliente(result);
                      this.valorSwiftFin = result.swiftFIN;
                      /** Metodo para poder llenar el request con informacion default */
                      this.assingInformationFromBeanToRequest();
                      if (this.datosContrato.descEstatus != 'ACTIVO') {
                        this.disabledAllElements();
                      }
                      this.globals.loaderSubscripcion.emit(false);
                    });
                }
            } catch (e) {
              this.globals.loaderSubscripcion.emit(false);
              this.open(
              this.translate.instant('modals.parametriadicional.error'), 
              this.translate.instant('modals.parametriadicional.error.consulta.parametria'),
              'error'
            );
            }
          });
      }
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
      this.translate.instant('modals.parametriadicional.error'), 
      this.translate.instant('modals.parametriadicional.error.consulta.cliente'),
      'error');
    }
  }

  listaCriticidadDeCliente(result: any) {
    this.listaCriticidad = result.listaCriticidad;
  }

  /**
   * Metodo para poder asignar la informacion
   * de datos del contrato
   */
  assingDatosContratoFromRequest(result: any) {
    this.datosContrato.bucCliente = result.bucCliente;
    this.datosContrato.cuentaEje = result.cuentaEje;
    this.datosContrato.numContrato = result.numContrato;
    this.datosContrato.razonSocial = result.razonSocial;
    this.datosContrato.descEstatus = result.descEstatus;
    this.datosContrato.idContrato = result.idContrato;
  }

  /**
 * Metodo para pode realizar la limpieza del objeto
 * que contendra la informacion del contrato del cliente
 */
  limpiarContrato() {
    this.datosContrato = {
      numContrato: "",
      bucCliente: "",
      descEstatus: "",
      nombreCompleto: "",
      personalidad: "",
      cuentaEje: "",
      idContrato: "",
      razonSocial: ""
    }
  }

  /**
   * Metodo para poder asignar la informacion
   * de los dos select de las horas
   */
  assingListadoHoraSelect(result: any) {
    this.listHorasFirstSelect = result.catalogoHorasIntradia;
    this.listHorasSecondSelect = result.listaHorasDerecha;
  }

  /**
   * Metodo para poder obtener el listado de los ids
   * de las horas que se establecieron en la lista de select
   * del lado derecho
   */
  getSelectedIdsFromListaHorasDerechaDefault() {
    this.listIdsSelectedDerecha = [];
    this.listHorasSecondSelect.forEach((hora: any) => {
      this.listIdsSelectedDerecha.push(hora['idCat']);
    });
  }

  /**
   * Metodo para asignar la informacion
   * de los select de canal de entrega, reporte
   * optimus y devoluciones online
   */
  assingListSelectsCanalReporteDevoluciones(result: any) {
    this.listCanalEntrega = result.selectCanal;
    this.listReportesOptimus = result.listaOptimus;
    this.listDevolucionesOnline = result.catCanOnl;
  }

  /**
   * Metodo para asignar la informacion
   * del listado de productos
   */
  assingListProductos(result: any) {
    this.listProductos = result.listaProductos;
    if (this.listProductos.length > 0) {
      this.banderaHasRows = true;
      this.banderaDisableExport = false;
    } else {
      this.banderaHasRows = false;
      this.banderaDisableExport = true;
    }
  }

  /**
   * Metodo para asignar la informacion
   * del bean de parametria adicional
   * atm
   */
  assingBeanParametriaAdicional(result: any) {
    this.beanParametriaAdicionalATM.lista = result.beanParAdAtm.lista;
    if (result.beanParAdAtm.idCanalPaAd !== null) {
      this.beanParametriaAdicionalATM.idCanalPaAd = Number(result.beanParAdAtm.idCanalPaAd);
    }
    this.beanParametriaAdicionalATM.ordenPagoATMactivo = result.beanParAdAtm.ordenPagoATMactivo;
    if (result.beanParAdAtm.idCanalOnline !== null) {
      this.beanParametriaAdicionalATM.idCanalOnline = Number(result.beanParAdAtm.idCanalOnline);
    }
    this.beanParametriaAdicionalATM.ipCliente = result.beanParAdAtm.ipCliente;
    this.beanParametriaAdicionalATM.codBICE = result.beanParAdAtm.codBICE;
    this.beanParametriaAdicionalATM.idcanalSwiftFile = result.beanParAdAtm.idcanalSwiftFile;
    this.beanParametriaAdicionalATM.chkRptActConsAtm = result.beanParAdAtm.chkRptActConsAtm;
    this.beanParametriaAdicionalATM.chkRptHistAtm = result.beanParAdAtm.chkRptHistAtm;
    this.beanParametriaAdicionalATM.chkRptIntrAtm = result.beanParAdAtm.chkRptIntrAtm;
    this.beanParametriaAdicionalATM.chkValDuplicados = result.beanParAdAtm.chkValDuplicados;
    this.beanParametriaAdicionalATM.chkOdpAtm = result.beanParAdAtm.chkOdpAtm;
    this.beanParametriaAdicionalATM.chkCveRsto = result.beanParAdAtm.chkCveRsto;
    this.beanParametriaAdicionalATM.chkEntregaEstadoCuenta = result.beanParAdAtm.chkEntregaEstadoCuenta;
    this.beanParametriaAdicionalATM.bandCV = result.beanParAdAtm.bandCV;
    if (result.beanParAdAtm.idCanal !== null) {
      this.beanParametriaAdicionalATM.idCanal = Number(result.beanParAdAtm.idCanal);
    }
    if (result.beanParAdAtm.bandVip !== null) {
      this.beanParametriaAdicionalATM.bandVip = result.beanParAdAtm.bandVip;
    }
  }

  /**
   * Metodo para poder asignar la informacion que se obtiene del bean
   * al objeto de request
   */
  assingInformationFromBeanToRequest() {
    this.request.activaOptimus = this.activateOptimus;
    this.request.chkOdpAtm = this.beanParametriaAdicionalATM.chkOdpAtm;
    this.request.chkRptActConsAtm = this.beanParametriaAdicionalATM.chkRptActConsAtm;
    this.request.chkRptHistAtm = this.beanParametriaAdicionalATM.chkRptHistAtm;
    this.request.chkRptIntrAtm = this.beanParametriaAdicionalATM.chkRptIntrAtm;
    this.request.chkValDuplicados = this.beanParametriaAdicionalATM.chkValDuplicados;
    this.request.codBICE = this.beanParametriaAdicionalATM.codBICE;
    this.request.contratosProd = "";
    this.request.folioEncHdn = "";
    this.request.formato = "";
    this.request.hdnContratoFolio = "";
    this.request.horarios = this.listHorasSelectedDerecha.toString();
    this.request.horariosEspec = "";
    this.request.idCanal = this.beanParametriaAdicionalATM.idCanal.toString();
    this.request.idCanalOnline = this.beanParametriaAdicionalATM.idCanalOnline.toString();
    this.request.idCanalPaAd = this.beanParametriaAdicionalATM.idCanalPaAd.toString();
    this.request.idCntr = this.datosContrato.idContrato;
    this.request.ipCliente = this.beanParametriaAdicionalATM.ipCliente;
    this.request.chkCveRsto = this.beanParametriaAdicionalATM.chkCveRsto;
    this.request.chkEntregaEstadoCuenta = this.beanParametriaAdicionalATM.chkEntregaEstadoCuenta;
    this.request.bandCV = this.beanParametriaAdicionalATM.bandCV;
    this.request.bandCVAnt = this.beanParametriaAdicionalATM.bandVip;

    // BackUp para guardar solo activación clave rastreo y cliente VIP
    this.requestBackup = this.request;
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
        if (objLeftHora['descripcionCatalogo'] == objRightHora['descripcionCatalogo']) {
          banderaExist = true;
          j = this.listHorasSecondSelect.length;
        }
      }
      if (!banderaExist) {
        listadoHorasAdd.push(objLeftHora);
      }
    }
    this.listHorasSecondSelect = this.ordenateListForFirstSelectOrSecond(this.listHorasSecondSelect, listadoHorasAdd);
    //[...this.listHorasSecondSelect,...listadoHorasAdd];
    //Se eliminan los elementos seleccionados
    listHorasRemoveUntilExist.forEach((option: any) => {
      this.listHorasFirstSelect = this.listHorasFirstSelect.filter((ele: any) => {
        return ele['descripcionCatalogo'] != option['descripcionCatalogo'];
      });
    });
  }

  /**
   * Metodo para validar si la hora del lado derecho
   * ya existe o no en la lista de horas del lado izquierdo
   * cuando se selecciona la opcion de todos
   */
  validateAndRemoveHoraToRigthSideSelectedTodos() {
    //Se selecciono la opcion todos
    var listadoHorasRemove: any = [];
    var listHorasRemoveUntilExist: any = [];
    for (var i = 0; i < this.listHorasSecondSelect.length; i++) {
      var objRigthtHora = this.listHorasSecondSelect[i];
      listHorasRemoveUntilExist.push(objRigthtHora);
      var banderaExist = false;
      for (var j = 0; j < this.listHorasFirstSelect.length; j++) {
        var objLeftHora = this.listHorasFirstSelect[j];
        if (objRigthtHora['descripcionCatalogo'] == objLeftHora['descripcionCatalogo']) {
          banderaExist = true;
          j = this.listHorasSecondSelect.length;
        }
      }
      if (!banderaExist) {
        listadoHorasRemove.push(objRigthtHora);
      }
    }
    this.listHorasFirstSelect = this.ordenateListForFirstSelectOrSecond(this.listHorasFirstSelect, listadoHorasRemove);
    //[...this.listHorasFirstSelect,...listadoHorasRemove];
    //Se eliminan los elementos seleccionados
    listHorasRemoveUntilExist.forEach((option: any) => {
      this.listHorasSecondSelect = this.listHorasSecondSelect.filter((ele: any) => {
        return ele['descripcionCatalogo'] != option['descripcionCatalogo'];
      });
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
        if (objHora['idCat'] === horaId) {
          objHoraSelected = objHora;
          listHorasRemoveUntilExist.push(objHoraSelected);
          i = this.listHorasFirstSelect.length;
        }
      }
      for (var i = 0; i < this.listHorasSecondSelect.length; i++) {
        var objRightHora = this.listHorasSecondSelect[i];
        if (objHoraSelected['descripcionCatalogo'] == objRightHora['descripcionCatalogo']) {
          banderaExist = true;
          i = this.listHorasSecondSelect.length;
        }
      }
      if (!banderaExist) {
        listadoHorasAdd.push(objHoraSelected);
      }
    });
    this.listHorasSecondSelect = this.ordenateListForFirstSelectOrSecond(this.listHorasSecondSelect, listadoHorasAdd);
    //[...this.listHorasSecondSelect,...listadoHorasAdd];
    //Se eliminan los elementos seleccionados
    listHorasRemoveUntilExist.forEach((option: any) => {
      this.listHorasFirstSelect = this.listHorasFirstSelect.filter((ele: any) => {
        return ele['descripcionCatalogo'] != option['descripcionCatalogo'];
      });
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
        if (objHora['idCat'] === horaId) {
          objHoraSelected = objHora;
          listHorasRemoveUntilExist.push(objHoraSelected);
          i = this.listHorasSecondSelect.length;
        }
      }
      for (var i = 0; i < this.listHorasFirstSelect.length; i++) {
        var objLeftHora = this.listHorasFirstSelect[i];
        if (objHoraSelected['descripcionCatalogo'] == objLeftHora['descripcionCatalogo']) {
          banderaExist = true;
          i = this.listHorasFirstSelect.length;
        }
      }
      if (!banderaExist) {
        listadoHorasRemove.push(objHoraSelected);
      }
    });
    this.listHorasFirstSelect = this.ordenateListForFirstSelectOrSecond(this.listHorasFirstSelect, listadoHorasRemove);
    //[...this.listHorasFirstSelect,...listadoHorasRemove];
    //Se eliminan los elementos seleccionados
    listHorasRemoveUntilExist.forEach((option: any) => {
      this.listHorasSecondSelect = this.listHorasSecondSelect.filter((ele: any) => {
        return ele['descripcionCatalogo'] != option['descripcionCatalogo'];
      });
    });
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
   * @description evento para poder levantar el modal para
   * mostrar los mensajes de sucess o error
   * @param titulo indica si se ejecutara para error o success
   * @param contenido mensaje que se mostrara en el modal
  */
  open(titulo:String,contenido:String, type?: any, code?: string, sugerencia?: string) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo,contenido,type,code,sugerencia), hasBackdrop: true 
    }
    );
  }

  /**
   * Abrir el modal de guardar todo de parametría, o solo clave rastreo y cliente VIP
   */
  openModalGuardarParametriaAdicional() {

    const dialogo = this.dialog.open(ModalGuardarParametriaAdicionalComponent);

    dialogo.afterClosed().subscribe(result => {

      if (result === "ok") {

        this.requestBackup.chkCveRsto = this.request.chkCveRsto;
        this.requestBackup.chkEntregaEstadoCuenta = this.request.chkEntregaEstadoCuenta;
        this.requestBackup.bandCV = this.request.bandCV;
        this.requestBackup.bandVip = this.request.chkCveRsto === "A" && this.request.bandVip === "" ? "B" : this.request.bandVip;
        this.request = this.requestBackup;

        /** Se realiza la peticion del guardado */
        this.sendRequestToSave();
      }

      if (result === "guardarTodo") {
        this.request.bandVip = this.request.chkCveRsto === "A" && this.request.bandVip === "" ? "B" : this.request.bandVip;
        this.saveParametriaAdicional();
      }

    });

  }

  /**
   * Metodo para poder realizar el guardado de la parametria
   * adicional
   */
  saveParametriaAdicional() {
    /** Se llama el metodo que llenara el objeto de request */
    this.getValuesForParametrosAdicionales();
    /** Validacion para determinar que el objeto esta vacio o no */
    if (this.validateRequestObject()) {
      /** Funcion para poder validar los campos requeridos */
      if (this.validateInputsAnsSelects()) {
        /** Se realiza la peticion del guardado */
        this.sendRequestToSave();
      }
    }
  }

  /**
   * Metodo para poder realizar la validacion
   * de si el objeto request esta vacio o no
   */
  validateRequestObject() {
    var bandera = true;
    if (this.request.chkOdpAtm === "" && this.request.chkRptActConsAtm === "" && this.request.chkRptHistAtm === ""
      && this.request.chkRptIntrAtm === "" && this.request.chkValDuplicados === "" && this.request.codBICE === ""
      && this.request.contratosProd === "" && this.request.folioEnc === "" && this.request.folioEncHdn === ""
      && this.request.formato === "" && this.request.hdnContratoFolio === "" && this.request.horarios === ""
      && this.request.horariosEspec === "" && this.request.idCanal === "" && this.request.idCanalOnline === ""
      && this.request.idCanalPaAd === "" && this.request.idCntr === "" && this.request.ipCliente === "") {
      bandera = false;
    }
    return bandera;
  }

  /**
   * Metodo para poder obtener los valores
   * necesarios para el objeto de parametros adicionales
   */
  getValuesForParametrosAdicionales() {
    this.getSelectedIdsFromListaHorasDerechaDefault();
    this.request.horarios = this.listIdsSelectedDerecha.toString();
    this.request.ipCliente = this.getValuesFromInputs("ipCliente");
    this.request.codBICE = this.getValuesFromInputs("bicEmisiones");
    this.request.idCntr = this.datosContrato.idContrato;
    this.request.formato = "";
    this.readTableListProducts();
    this.request.usrReporte = this.usuarioActual;
  }

  /**
   * Metodo para poder recorrer la tabla de los productos y 
   * obtener los valores para horarios especiales y contratos producto oculto
   */
  readTableListProducts() {
    var myTab: any = document.getElementById("lstProductos");
    var checkedValues = "";
    var contrProdOculto = "";
    //Se recorre cada renglon de la tabla
    for (var i = 1; i < myTab['rows'].length; i++) {
      //Se obtienen las celdas del renglon actual
      var myCells = myTab['rows'].item(i).cells;
      for (var j = 1; j < myCells.length; j++) {
        /** Posicion del checkbox */
        if (j == 1) {
          var checkId = myCells.item(j).children[0].id;
          if (myCells.item(j).children[0].checked) {
            checkedValues = checkedValues + checkId + "," + "A" + "@";
          } else {
            checkedValues = checkedValues + checkId + "," + "I" + "@";
          }
        } else {
          contrProdOculto = contrProdOculto + myCells.item(j).children[0].value + "@";
        }
      }
    }
    this.request.horariosEspec = checkedValues;
    this.request.contratosProd = contrProdOculto;
  }

  /**
   * Metodo para poder obtener los valores de los inputs
   * de ip del cliente y cod bice
   */
  getValuesFromInputs(idInput: string) {
    return (<HTMLInputElement>document.getElementById(idInput)).value;
  }

  /**
   * Metodo para poder obtener el elemento seleccionado
   * del select de canal de entregas, canal de entrega optimus
   * y canal de entrega dev online
   */
  getTheSelectedValueFromSelect(e: any, optionSelect: string) {
    switch (optionSelect) {
      case "CANALENTREGA":
        this.request.idCanalPaAd = this.getValueSelectedInSelect(e);
        break;
      case "CANALENTREGAOPTIMUS":
        /** canal de entrega de reporte optimus */
        this.request.idCanal = this.getValueSelectedInSelect(e);
        break;
      case "CANALENTREGADEVONLINE":
        /** canal de reporte devoluciones online */
        this.request.idCanalOnline = this.getValueSelectedInSelect(e);
        break;
      case "CRITICIDADCLIENTE":
        this.request.bandVip = this.getValueSelectedInSelect(e);
        break;
      default:
        break;
    }
  }

  /**
   * Metodo para poder obtener el valor que se selecciono
   * del select
   */
  getValueSelectedInSelect(e: any) {
    if (e.target.value == '-1') {
      return '';
    } else {
      return e.target.value;
    }
  }

  /**
   * Metodo para obtener si el checkbox para 
   * consolidado pago atm esta activo o no
   */
  getTheCheckboxWhenIsChecked(e: any, optionFill: string) {
    switch (optionFill) {
      case "CONSOPAGOATM":
        this.request.chkRptActConsAtm = this.getValueToAssingActiveOrInactive(e);
        break;
      case "INTRAPAGOATM":
        this.request.chkRptIntrAtm = this.getValueToAssingActiveOrInactive(e);
        if (e.target.checked) {
          this.enableSectionHoras();
        } else {
          this.disabledSectionHoras();
        }
        break;
      case "COBRORESPODP":
        this.request.chkOdpAtm = this.getValueToAssingActiveOrInactive(e);
        break;
      case "VALIDADUPLI":
        this.request.chkValDuplicados = this.getValueToAssingActiveOrInactive(e);
        break;
      case "HISTOPAGOATM":
        this.request.chkRptHistAtm = this.getValueToAssingActiveOrInactive(e);
        break;
      case "ENVIOCLAVERASTREO":
        this.request.chkCveRsto = this.getValueToAssingActiveOrInactive(e);
        break;
      case "ENTREGAESTADOCUENTA":
        this.request.chkEntregaEstadoCuenta = this.getValueToAssingActiveOrInactive(e);
        break;
      default:
        break;
    }
  }

  /**
   * Metodo para pode regresar el
   * valor de activo o inactivo
   * para asignarse
   */
  getValueToAssingActiveOrInactive(e: any) {
    if (e.target.checked) {
      return "A";
    } else {
      return "I";
    }
  }

  /**
   * Se llama el metodo que realizara el envio de la peticion
   * de guardar
   */
  private async sendRequestToSave() {
    try {
      await this.parametriaAdicionalService.saveParametriaAdicional(this.request).then(
        async (result: any) => {
          if (result.error == 'OKUPARTM01') {
            this.globals.loaderSubscripcion.emit(false);
            this.open(this.translate.instant('modals.parametriadicional.info'), 
            this.translate.instant('modals.parametriadicional.info.guardado'),
            'info');
            this.getPreloadByNumContrato();
          } else {
            this.globals.loaderSubscripcion.emit(false);
            this.open(
            this.translate.instant('modals.parametriadicional.error'), 
            this.translate.instant('modals.parametriadicional.error.guardado'),
            'info');
          }
        }
      )
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
      this.translate.instant('modals.parametriadicional.error'), 
      this.translate.instant('modals.parametriadicional.error.guardado'),
      'error');
    }
  }

  /**
   * Metodo para poder realizar la limpieza
   * de los valores nuevos por los antiguos
   */
  limpiarValues() {
    var chkValDuplicados: any = document.getElementById("activaValidacionDuplicados");
    chkValDuplicados.checked = false;
    var chkProductos: any = document.getElementsByName('checkProdId');
    for (var i = 0; i < chkProductos.length; i++) {
      if (chkProductos[i].checked) {
        chkProductos[i].checked = false;
      }
    }
    if (this.activateProdATM) {
      var chkRptConsPagAtm: any = document.getElementById("activaReporteConsolidadPagoAtm");
      chkRptConsPagAtm.checked = false;
      var chkRptIntrPagAtm: any = document.getElementById("activaReporteIntradiaPagoAtm");
      chkRptIntrPagAtm.checked = false;
      var chkRefCobOdpAtm: any = document.getElementById("mostrarReferenciaCobroResponseOdp");
      chkRefCobOdpAtm.checked = false;
      var chkRptHisPagAtm: any = document.getElementById("activaReporteHistoricoPagoAtm");
      chkRptHisPagAtm.checked = false;
      var chkClaveRastreo: any = document.getElementById("activarEnvioClaveRastreo");
      chkClaveRastreo.checked = false;
      var chkEntregaEstadoCuentaCheques: any = document.getElementById("activarEntregaEstadoCuenta");
      chkEntregaEstadoCuentaCheques.checked = false;
      var selCanalPaAd: any = document.getElementById("canalEntrega");
      selCanalPaAd.value = '-1';
      var selCanalOnline: any = document.getElementById("canalEntregaReportesDevOnline");
      selCanalOnline.value = '-1';
      var selCriticidadCliente: any = document.getElementById("listaCriticidadCliente");
      selCriticidadCliente.value = '-1';
      this.disabledSectionHoras();
    }
    if (this.activateOptimus) {
      var selCanal: any = document.getElementById("canalEntregaReporteOptimus");
      selCanal.value = '-1';
    }
    this.request.ipCliente = '';
    this.request.codBICE = '';
  }

  /**
   * Abrir el modal de exportar los datos
   */
  openModalExportacion() {
    const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
    dialogo.afterClosed().subscribe(result => {
      if (result) {
        this.generateReporte(result);
      }
    });
  }

  /**
   * Metodo para realizar la obtencion del 
   * archivo a exportar
   */
  generateReporte(tipoExportacion: string) {
    /** Se llama el metodo que llenara el objeto de request */
    this.getValuesForParametrosAdicionales();
    /** Se valida cual tipo de exportacion se realizara */
    this.exportarFileFormat(tipoExportacion);
  }

  /**
   * Metodo para poder realizar la exportacion del archivo
   * en formato excel o csv
  */
  private async exportarFileFormat(tipo:string) {
    try {
      await this.parametriaAdicionalService.getReporte(this.request, tipo).then(
        async (result: any) => {
          this.globals.loaderSubscripcion.emit(false);
          /** Se manda la informacion para realizar la descarga del archivo */
          this.fc.convertBase64ToDownloadFileInExport(result);
        }
      )
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
      this.translate.instant('modals.parametriadicional.error'), 
      this.translate.instant('modals.error.exportacion'),
      'error');
    }
  }

  /**
  * Funcion para habilitar la seccion de horario
  */
  enableSectionHoras() {
    this.banderaDisableSelectHorasIzq = false;
    this.banderaDisableSelectHorasDer = false;
    this.banderaDisableAddHour = false;
    this.banderaDisableRemoveHour = false;
  }

  /**
  * Funcion para deshabilitar la seccion de horario
  */
  disabledSectionHoras() {
    this.banderaDisableSelectHorasIzq = true;
    this.banderaDisableSelectHorasDer = true;
    this.banderaDisableAddHour = true;
    this.banderaDisableRemoveHour = true;
  }

  /**
   * Metodo para poder validar que checkbox se esta
   * recorriendo y validar con el valor determinado
   * para determinar si se establece como activo o no
   */
  validateCheckboxToActivateOrNot(valorId: string) {
    var banderaCheck = false;
    switch (valorId) {
      case "activaReporteConsolidadPagoAtm":
        banderaCheck = this.beanParametriaAdicionalATM.chkRptActConsAtm == "A" ? true : false;
        break;
      case "activaReporteIntradiaPagoAtm":
        banderaCheck = this.beanParametriaAdicionalATM.chkRptIntrAtm == "A" ? true : false;
        break;
      case "mostrarReferenciaCobroResponseOdp":
        banderaCheck = this.beanParametriaAdicionalATM.ordenPagoATMactivo;
        break;
      case "activaReporteHistoricoPagoAtm":
        banderaCheck = this.beanParametriaAdicionalATM.chkRptActConsAtm == 'A' ? true : false;
        break;
      case "activaValidacionDuplicados":
        banderaCheck = this.beanParametriaAdicionalATM.chkValDuplicados == 'A' ? true : false;
        break;
      default:
        break;
    }

    return banderaCheck;
  }

  /**
   * Metodo par poder validar que select se esta
   * recorriendo y obtener el valor que debe estar
   * seleccionado por default
   */
  validateSelectValueByDefault(selectedValue: string) {
    var selectedValueByDefault = "";
    switch (selectedValue) {
      case "canalEntrega":
        selectedValueByDefault = this.beanParametriaAdicionalATM.idCanalPaAd.toString() == "0" ? "-1" : this.beanParametriaAdicionalATM.idCanalPaAd.toString();
        break;
      case "canalEntregaReporteOptimus":
        selectedValueByDefault = this.beanParametriaAdicionalATM.idCanal.toString() == "0" ? "-1" : this.beanParametriaAdicionalATM.idCanal.toString();
        break;
      case "canalEntregaReportesDevOnline":
        selectedValueByDefault = this.beanParametriaAdicionalATM.idCanalOnline.toString() == "0" ? "-1" : this.beanParametriaAdicionalATM.idCanalOnline.toString();
        break;
      default:
        break;
    }
    return selectedValueByDefault;
  }

  /**
   * Metodo para poder realizar las validaciones
   * de los campos necesarios u obligatorios en
   * caso de proporcionarlos
   */
  validateInputsAnsSelects() {
    var banderaValid: boolean = true;
    /** Se valida el valor de la ip */
    if (this.request.ipCliente !== "") {
      if (!this.validarFormatoIp(this.request.ipCliente)) {
        this.open(this.translate.instant('modals.parametriadicional.error'), 
        this.translate.instant('modals.parametriadicional.error.ip.novalida'),
        'error');
        banderaValid = false;
      }
    }
    if (banderaValid) {
      if (this.request.chkRptIntrAtm == "A" && this.request.horarios == "") {
        this.open(
        this.translate.instant('modals.parametriadicional.error'), 
        this.translate.instant('modals.parametriadicional.error.agregar.hora.reporte'),
        'error');
        banderaValid = false;
      } else {
        banderaValid = this.validarOpcionesBic();
      }
    }

    return banderaValid;
  }

  /**
   * Metodo para poder validar que el 
   * formato del valor de la ip sea 
   * el correcto
   */
  validarFormatoIp(ip: string) {
    var patronIp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gm;
    if (ip.search(patronIp) == 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Metodo para poder validar si tiene registrado un bic de envio
   */
  validarOpcionesBic() {
    var banderaValid = false;
    if (this.valorSwiftFin && this.request.codBICE == "") {
      let titulo = this.translate.instant('modals.catalogoDin.confirmacion');
      let contenido = this.translate.instant('modals.parametriadicional.confirmacion.nodefinir.bic');
      const dialogo = this.dialog.open(ModalInfoComponent, {
        data: new ModalInfoBeanComponents(titulo, contenido, "confirm"), hasBackdrop: true 
      });
      dialogo.afterClosed().subscribe(result => {
        if (result) {
          /** Se realiza el guardar auxiliar reglas sonar */
          banderaValid = this.validacionesAuxiliaresReglasSonar();
        }
      });
    } else {
      if (this.validateBIC()) {
        /** Se realiza el guardar auxiliar reglas sonar */
        banderaValid = this.validacionesAuxiliaresReglasSonar();
      } else {
        this.open(
        this.translate.instant('modals.parametriadicional.error'), 
        this.translate.instant('modals.parametriadicional.error.formato.bic.invalido'),
        'error');
      }
    }
    return banderaValid;
  }

  /**
   * Metodo para aplicar validaciones
   * auxiliares para el guardado
   */
  validacionesAuxiliaresReglasSonar() {
    var bandera = true;
    if (this.activateProdATM && this.activateOptimus) {
      bandera = this.validateOpcionesDeCanalOptimus("OPTIMUS");
    } else if (this.activateProdATM && !this.activateOptimus) {
      bandera = this.validateOpcionesDeCanalOptimus("");
    } else if (!this.activateProdATM && this.activateOptimus) {
      bandera = this.validaOpcionesOptimus();
    }
    return bandera;
  }

  /**
   * Metodo para poder validar las
   * opciones del canal
   */
  validateOpcionesDeCanalOptimus(valOptionVal: string) {
    var bandera = false;
    if (this.request.chkRptIntrAtm == "A" || this.request.chkRptActConsAtm == "A" || this.request.chkRptHistAtm == "A") {
      if (Number(this.request.idCanalPaAd) > 0) {
        if (this.validarCanal(this.request.idCanalPaAd)) {
          if (valOptionVal === "OPTIMUS") {
            bandera = this.validaOpcionesOptimus();
          } else {
            bandera = true;
          }
        } else {
          this.open(
          this.translate.instant('modals.parametriadicional.error'), 
          this.translate.instant('modals.parametriadicional.error.canal.fuera.alcance.ordenpago'),
          'error'
          );
        }
      } else {
        this.open(this.translate.instant('modals.parametriadicional.error'), 
        this.translate.instant('modals.parametriadicional.error.seleccionar.canal'),
        'error');
      }
    } else {
      this.open(this.translate.instant('modals.parametriadicional.error'), 
      this.translate.instant('modals.parametriadicional.error.activar.reporte'),
      'error');
    }
    return bandera;
  }

  /**
   * Metodo para validar que el canal seleccionado
   * sea permitido para los id canal
   */
  validarCanal(canal: string) {
    var banderaValiate = true;
    if (this.beanParametriaAdicionalATM.idcanalSwiftFile !== "" && this.beanParametriaAdicionalATM.idcanalSwiftFile === canal) {
      banderaValiate = false;
    }
    return banderaValiate;
  }

  /**
   * Metodo para poder validar las opciones
   * optimus
   */
  validaOpcionesOptimus() {
    var bandera = false;
    if (this.request.idCanal !== "-1") {
      if (this.validarCanal(this.request.idCanal)) {
        bandera = true;
      } else {
        this.open(this.translate.instant('modals.parametriadicional.error'), 
        this.translate.instant('modals.parametriadicional.error.canal.fuera.alcance.optimus'),
        'error');
      }
    } else {
      this.open(this.translate.instant('modals.parametriadicional.error'), 
      this.translate.instant('modals.parametriadicional.error.seleccionar.canal'),
      'error');
    }
    return bandera;
  }

  /**
   * Metodo para poder realizar la validacion
   * del formato bic de envio
   */
  validateBIC() {
    var bandera = false;
    var fmtBIC = /^[\w]{8,11}$/;
    if (this.request.codBICE.length > 0) {
      if (this.request.codBICE.length == 8 || this.request.codBICE.length == 11) {
        bandera = fmtBIC.test(this.request.codBICE);
      }
    } else {
      bandera = true;
    }
    return bandera;
  }

  /**
   * Metodo para poder realizar el ordenamiento
   * del listado del primer select o segundo select
   */
  ordenateListForFirstSelectOrSecond(listadooriginal: any, listadoAgregar: any) {
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

  /** Funcion que deshabilita todos los elementos de la pantalla en caso de que el contrato no sea activo */
  disabledAllElements() {
    this.banderaDisabledChkAtivaReporteConsolidadPagoAtm = true;
    this.banderaDisabledChkActivaReporteIntradiaPagoAtm = true;
    this.banderaDisabledChkMostrarReferenciaCobroResponseOdp = true;
    this.banderaDisabledChkActivaReporteHistoricoPagoAtm = true;
    this.banderaDisabledIdCanalPaAd = true;
    this.banderaDisableSave = true;
    this.banderaDisableItem = true;
    this.banderaDisabledListaCriticidadCliente = true;
    this.banderaDisabledEnvioClaveRastreo = true;
    this.banderaDisabledEntregaEstadoCuenta = true;
    this.disabledSectionHoras();
    if (this.listProductos.length > 0) {
      var chkProductos: any = document.getElementsByName('checkProdId');
      for (var i = 0; i < chkProductos.length; i++) {
        chkProductos[i].disabled = true;
      }
    }
  }

}