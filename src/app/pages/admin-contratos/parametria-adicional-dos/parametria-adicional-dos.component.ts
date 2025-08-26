import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { ParametriaAdicionalDosService } from 'src/app/services/admin-contratos/parametria-adicional-dos.service';
import { IAdditionalEnviromentDosRequest } from './request/iadditional-enviroment-dos-request';
import { IBeanParametrosSPEI } from './request/ibean-parametros-spei';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ModalGuardarParametriaAdicionalDosComponent } from 'src/app/components/modals/modal-guardar-parametria-adicional-dos/modal-guardar-parametria-adicional-dos.component';

@Component({
  selector: 'app-parametria-adicional-dos',
  templateUrl: './parametria-adicional-dos.component.html',
  styleUrls: ['./parametria-adicional-dos.component.css']
})
export class ParametriaAdicionalDosComponent implements OnInit, OnDestroy {

  activateProdSPEI: boolean = false;
  activateProdChqSeg: boolean = false;
  /** componente modal */
  modal: BsModalRef = new BsModalRef;
  /** variable de control para guardar el numero de contrato */
  numContrato: string = "";
  /** Propiedad que se enviara a la peticion de preload */
  request: IAdditionalEnviromentDosRequest;
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
  beanParametrosSPEI: IBeanParametrosSPEI;

  /** Bandera para poder deshabilitar el boton de guardar o exportar */
  banderaDisableSave: boolean = true;
  banderaDisabledChkAtivaSpeiMayorOchomilFueraHorario: boolean = true;
  /**
    * @description Nombre de usuario de la sesión actual.
    * Este usuario se tendria que sustituir por el de la sesion actual.
    * @type {string}
    * @memberOf GestionComprobantesComponent
    */
  usuarioActual: string | null = '';
  /*** Bandera para deshabilitar los elementos de la pantalla cuando no existe informacion */
  banderaDisableItem: boolean = true;
  banderaDisableChqSeg: boolean = true;
  datos:any
  activeCHQ = false;
  /**
    * Constructor de la clase
    * aplicar las validaciones correspondientes
    * @param toastService -Servicio de alertas
    * @param router - Servicio de direccionamiento
    * @param modalService - Servicio para levantar el modal
    * @param fc - contiene las validaciones
    * @param globals - contiene el evento de cargando
    * @param dialog - contiene el evento para levantar un toast
    * @param parametriaAdicionalDosService - contiene las peticiones a los servicios
    */
  constructor(
    private fc: FuncionesComunesComponent,
    private globals: Globals,
    public dialog: MatDialog,
    private parametriaAdicionalDosService: ParametriaAdicionalDosService,
    private translate: TranslateService,
    private service: ComunesService,
  ) {
    this.request = {
      folioEnc: "",
      idCntr: "",
      bandSpeiFueraHorario: "",
      speiMaxAcumulado: "",
      speiMaxPorOper: "",
      usrReporte: "",
      bandRepChqSeg: "",
      bandEntRepNex: ""
    };

    this.beanParametrosSPEI = {
      chkSpeiFueraHorario: "",
      speiMaxAcumulado: 0,
      speiMaxPorOper: 0,
      speiMontoAcumulado: 0,
      chkRepChqSeg: "",
      chkEntRepNex: "",
      speiMontoAcumuladoAnt: 0
    };

    this.usuarioActual = localStorage.getItem('UserID');
  }

  clickSuscliption: Subscription | undefined;

  ngOnInit(){
    this.datos = this.service.datosContrato
    //this.initForm();
    this.clickSuscliption = this.service.clickAtion.subscribe((resp:any) => {      
      const { codeMenu } = resp;
      if (codeMenu === 23) {
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
   * Evento TAB para ir a buscar la informacion del preload para parametros II
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

  validateSpeiMaxAcumuladoOnlyNumberAndTwoDecimal(event: KeyboardEvent) {

    const charCode = (event.which) ? event.which : event.keyCode;

    var speiMaxAcumuladoOriginal = this.getValuesFromInputs("speiMaxAcumulado");
    var speiMaxAcumuladoCopy = speiMaxAcumuladoOriginal;
    var speiMaxAcumuladoNuevo = "";

    var numCoincidencias = speiMaxAcumuladoOriginal.split('.').length -1;
    var esPuntoUltimo = speiMaxAcumuladoOriginal.endsWith('.') ? true : false;
    speiMaxAcumuladoCopy = speiMaxAcumuladoCopy.substring(0, speiMaxAcumuladoOriginal.length - 1);
    var unoODosDecimales = !esPuntoUltimo && speiMaxAcumuladoCopy.endsWith('.') ? 1 : 2;

    if((numCoincidencias === 1) && charCode != 8 && !esPuntoUltimo) {
      var formatoDecimal = parseFloat(speiMaxAcumuladoOriginal).toFixed(unoODosDecimales);
      this.beanParametrosSPEI.speiMaxAcumulado = formatoDecimal;
    }

    if((numCoincidencias > 1) && charCode != 8) {

      [...speiMaxAcumuladoOriginal].forEach((item) => {
        if(item != "." || !speiMaxAcumuladoNuevo.includes(".")) {
          speiMaxAcumuladoNuevo = speiMaxAcumuladoNuevo.concat(item);
        }
      })

      speiMaxAcumuladoNuevo = parseFloat(speiMaxAcumuladoNuevo).toFixed(2);
      this.beanParametrosSPEI.speiMaxAcumulado = speiMaxAcumuladoNuevo;

    }

  }

  validateSpeiMaxPorOperOnlyNumberAndTwoDecimal(event: KeyboardEvent) {

    const charCode = (event.which) ? event.which : event.keyCode;

    var speiMaxPorOperOriginal = this.getValuesFromInputs("speiMaxPorOper");
    var speiMaxPorOperCopy = speiMaxPorOperOriginal;
    var speiMaxPorOperNuevo = "";

    var numCoincidencias = speiMaxPorOperOriginal.split('.').length -1;
    var esPuntoUltimo = speiMaxPorOperOriginal.endsWith('.') ? true : false;
    speiMaxPorOperCopy = speiMaxPorOperCopy.substring(0, speiMaxPorOperOriginal.length - 1);
    var unoODosDecimales = !esPuntoUltimo && speiMaxPorOperCopy.endsWith('.') ? 1 : 2;

    if((numCoincidencias === 1) && charCode != 8 && !esPuntoUltimo) {
      var formatoDecimal = parseFloat(speiMaxPorOperOriginal).toFixed(unoODosDecimales);
      this.beanParametrosSPEI.speiMaxPorOper = formatoDecimal;
    }

    if((numCoincidencias > 1) && charCode != 8) {

      [...speiMaxPorOperOriginal].forEach((item) => {
        if(item != "." || !speiMaxPorOperNuevo.includes(".")) {
          speiMaxPorOperNuevo = speiMaxPorOperNuevo.concat(item);
        }
      })

      speiMaxPorOperNuevo = parseFloat(speiMaxPorOperNuevo).toFixed(2);
      this.beanParametrosSPEI.speiMaxPorOper = speiMaxPorOperNuevo;

    }

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
    * @descripcion Metodo para poder obtener la informacion del preload de Parametros II
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
                  await this.parametriaAdicionalDosService.getPreloadInformacionSPEIByNumContrato(this.request).then(
                    async (result: any) => {
                      this.banderaDisableItem = false;
                      this.banderaDisableSave = false;
                      this.banderaDisableChqSeg = false;

                      this.activateProdSPEI = result.activaProdSPEI;
                      this.activateProdChqSeg = result.activaProdCHQ;
                      this.banderaDisabledChkAtivaSpeiMayorOchomilFueraHorario = false;
                      this.assingBeanParametriaAdicional(result);
                      /** Metodo para poder llenar el request con informacion default */
                      this.assingInformationFromBeanToRequest();
                      
                      this.getCheckValueToEnableDisableElemetns();
                      if(this.datosContrato.descEstatus != 'ACTIVO' || !this.activateProdSPEI) {
                        this.disabledAllElements();
                      }
                      if(this.datosContrato.descEstatus != 'ACTIVO' || !this.activateProdChqSeg){
                        this.disabledAllChqSeg();
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

  /**
   * Metodo para poder asignar la informacion de datos del contrato
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
   * Metodo para asignar la informacion
   * del bean de parametria adicional
   * spei
   */
  assingBeanParametriaAdicional(result: any) {
    this.beanParametrosSPEI.chkSpeiFueraHorario = result.bandSpeiFueraHorario;
    this.beanParametrosSPEI.speiMaxAcumulado = result.speiMaxAcumulado ? this.fc.commas(result.speiMaxAcumulado): result.speiMaxAcumulado;
    this.beanParametrosSPEI.speiMaxPorOper = result.speiMaxAcumulado ? this.fc.commas(result.speiMaxPorOper): result.speiMaxAcumulado;
    this.beanParametrosSPEI.speiMontoAcumulado = result.speiMontoAcumulado;
    this.beanParametrosSPEI.chkRepChqSeg = result.bandRepChqSeg;
    this.beanParametrosSPEI.chkEntRepNex = result.bandEntRepNex;
    this.request.bandSpeiFueraHorario =  result.bandSpeiFueraHorario == null ? "I" : result.bandSpeiFueraHorario;
    //this.request.bandSpeiFueraHorario = result.bandSpeiFueraHorario;
    this.request.bandRepChqSeg = result.bandRepChqSeg;
    this.request.bandEntRepNex = result.bandEntRepNex;

    this.beanParametrosSPEI.speiMontoAcumuladoAnt = result.speiMontoAcumuladoAnt;

  }

  /**
   * Metodo para poder asignar la informacion que se obtiene del bean
   * al objeto de request
   */
  assingInformationFromBeanToRequest() {
    this.request.idCntr = this.datosContrato.idContrato;
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
   * Metodo para poder realizar el guardado de la parametria
   * adicional
   */
  saveParametriaAdicional() {
    /** Se llama el metodo que llenara el objeto de request */
    this.getValuesForParametrosAdicionales();
    /** Validacion para determinar que el objeto esta vacio o no */
    if (this.validateRequestObject()) {
      /** Se realiza la peticion del guardado */
      this.sendRequestToSave();
    }
  }

  /**
   *Abrir modal de aguardado
   */
  openModalGuardar(){
    const dialogo = this.dialog.open(ModalGuardarParametriaAdicionalDosComponent);
    dialogo.afterClosed().subscribe(result=> {
      if(result === "ok"){
        this.saveChqSeg();
      }else if(result === "guardarTodo"){
        this.saveParametriaAdicional();
      }
    });
  }

  /**
   * Metodo para poder realizar la validacion
   * de si el objeto request esta vacio o no
   */
  validateRequestObject() {
    var bandera = true;
      
        if (this.request.bandSpeiFueraHorario === "") {
          return bandera = false;
        }
    
        if (this.request.bandSpeiFueraHorario === "A" && (this.request.speiMaxAcumulado === "" || this.request.speiMaxPorOper === "")) {
    
          this.globals.loaderSubscripcion.emit(false);
          this.open(
            this.translate.instant('modals.parametriadicional.error'),
            this.translate.instant('modals.parametriadicional.error.spei.importe.noindicado'),
            'error');
    
          return bandera = false;
        }
    
        if (this.request.folioEnc === "" || this.request.idCntr === "") {
          return bandera = false;
        }
    
        if (this.request.bandSpeiFueraHorario === "A" && (this.request.speiMaxAcumulado <= 8000 || this.request.speiMaxPorOper <= 8000)) {
    
          this.globals.loaderSubscripcion.emit(false);
          this.open(
            this.translate.instant('modals.parametriadicional.error'),
            this.translate.instant('modals.parametriadicional.error.spei.montomaximo.menorpermitido'),
            'error');
    
          return bandera = false;
        }
    
        if (this.request.bandSpeiFueraHorario === "A" && (Number(this.request.speiMaxAcumulado) < Number(this.request.speiMaxPorOper))) {
          this.globals.loaderSubscripcion.emit(false);
          this.open(
            this.translate.instant('modals.parametriadicional.error'),
            this.translate.instant('modals.parametriadicional.error.spei.montoporoperacion.minimopermitido'),
            'error');
    
          return bandera = false;
        }
    return bandera;
  }

  /**
   * Metodo para poder obtener los valores
   * necesarios para el objeto de parametros adicionales
   */
  getValuesForParametrosAdicionales() {
    if(this.request.bandSpeiFueraHorario === "A") {
      this.request.speiMaxAcumulado =  this.getValuesFromInputs("speiMaxAcumulado").replace(/[^0-9.]+/g, '');
      this.request.speiMaxPorOper =  this.getValuesFromInputs("speiMaxPorOper").replace(/[^0-9.]+/g, '');
    }
  }

  /**
   * Metodo para poder obtener los valores de los inputs
   * de ip del cliente y cod bice
   */
  getValuesFromInputs(idInput: string) {
    return (<HTMLInputElement>document.getElementById(idInput)).value;
  }

  /**
   * Metodo para obtener si el checkbox esta activo o no
   */
  getTheCheckboxWhenIsChecked(e: any, optionFill: string) {
    switch (optionFill) {
      case "SPEIMAYOR":
        this.request.bandSpeiFueraHorario = this.getValueToAssingActiveOrInactive(e);
        this.getCheckValueToEnableDisableElemetns();
        break;
      case "GENREPCHQSEG":
        this.request.bandRepChqSeg = this.getValueToAssingActiveOrInactive(e);
        break;
      case "ENTREPNEX":
        this.request.bandEntRepNex = this.getValueToAssingActiveOrInactive(e);
        break;
      default:
        break;
    }
  }

  getCheckValueToEnableDisableElemetns() {
    if (this.request.bandSpeiFueraHorario === "A") {
      this.banderaDisableItem = false;
    } else {
      this.banderaDisableItem = true;
    }
  }

  /**
   * Metodo para pode regresar el valor de activo o inactivo para asignarse
   */
  getValueToAssingActiveOrInactive(e: any) {
    if (e.target.checked) {
      return "A";
    } else {
      return "I";
    }
  }

  /**
   * Metodo para almacenar los datos de Chequera Seguridad
   */
  private async saveChqSeg(){
    try{
      this.parametriaAdicionalDosService.saveParametrosDosChqSeg(this.request).then(
        async (result: any) => {
          if(result.error == 'OK00000'){
            this.globals.loaderSubscripcion.emit(false);
            this.open(this.translate.instant('modals.parametriadicional.info'), 
            this.translate.instant('modals.parametriadicional.info.guardado'),
            'info');
            this.getPreloadByNumContrato();
          }else{
            this.globals.loaderSubscripcion.emit(false);
              this.open(
              this.translate.instant('modals.parametriadicional.error'), 
              this.translate.instant('modals.parametriadicional.error.guardado'),
              'info');
          }
        })
    }catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
      this.translate.instant('modals.parametriadicional.error'), 
      this.translate.instant('modals.parametriadicional.error.guardado'),
      'error');
    }
  }

  /**
   * Se llama el metodo que realizara el envio de la peticion
   * de guardar
   */
  private async sendRequestToSave() {
    try {
      this.parametriaAdicionalDosService.saveParametrosDosSPEI(this.request).then(
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
   * Metodo para poder realizar la limpieza de los valores nuevos por los antiguos
   */
  limpiarValues() {
    if (this.request.bandSpeiFueraHorario === "A") {
      var chkSpeiMayorOchomilFueraHorario: any = document.getElementById("activaSpeiMayorOchomilFueraHorario");
      chkSpeiMayorOchomilFueraHorario.checked = false;
    }
    if(this.request.bandRepChqSeg === "A"){
      var chkRep: any = document.getElementById("activaRepChqSeg");
      chkRep.checked = false;
    }
    if(this.request.bandEntRepNex === "A"){
      var chkEnt: any = document.getElementById("activaEntRepNex");
      chkEnt.checked = false;
    }
    this.request.bandSpeiFueraHorario = "I";
    this.request.bandEntRepNex = "I";
    this.request.bandRepChqSeg = "I";
    this.request.speiMaxAcumulado = "";
    this.request.speiMaxPorOper = "";
    this.beanParametrosSPEI.speiMaxAcumulado = "";
    this.beanParametrosSPEI.speiMaxPorOper = "";
    this.getCheckValueToEnableDisableElemetns();
  }

  /** Funcion que deshabilita todos los elementos de la pantalla en caso de que el contrato no sea activo */
  disabledAllElements() {
    //this.banderaDisableSave = true;
    this.banderaDisableItem = true;
    this.banderaDisabledChkAtivaSpeiMayorOchomilFueraHorario = true;
  }

  /**Funcion que deshabilita todos los elementos de la pantalla en caso de que el contrato no sea activo o la band
   * de ChqSeg sea inactivo
   */
  disabledAllChqSeg(){
    this.banderaDisableChqSeg = true;
  }
}