import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { CifradoDescifradoService } from 'src/app/services/contingencia/cifrado-descifrado.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ComunesService } from 'src/app/services/comunes.service';

@Component({
  selector: 'app-cifrado-descifrado',
  templateUrl: './cifrado-descifrado.component.html',
  styleUrls: ['./cifrado-descifrado.component.css']
})
export class CifradoDescifradoComponent implements OnInit {
  /**Se inicializa componente de los datos del contrato*/
  datosContrato: any = {
    numContrato: "", bucCliente: "", descEstatus: "", nombreCompleto: "",
    personalidad: "", cuentaEje: "", idContrato: "", razonSocial: "", idEstatus: ""
  };
  /**Bandera para determinar si se habilita el boton de cargar archivo*/
  banderaBtnCargarArchivo: boolean = true;
  /**Define la referencia al boton de cargar archivo*/
  @ViewChild('btnCargarArchivo', { static: false })
  /**Referencia al boton cargar archivo para resetear su valor despues de una error.*/
  btnCargarArchivo!: ElementRef;
  /**Variable para guardar el contenido del archivo seleccionado*/
  archivoSelec: any = null;
  /**Bandera para ocultar/mostrar los botones*/
  bandShowBotones: boolean = true;
  /** Lista de formatos validos de archivos regex */
  lstCanales: any;
  /** Numero de contrato */
  hdnContratoFolio: any;
  /** Bandera para saber si la contingencia esta habilitada */
  contingenciaHabilitada: any;
  operacion: any;
  idCanal: any;
  constructor(private fc: FuncionesComunesComponent,
    private globals: Globals,
    private service: CifradoDescifradoService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private comunService: ComunesService) { }

  clickSuscliption: Subscription | undefined;

  ngOnInit(): void {
    this.clickSuscliption = this.comunService.clickAtion.subscribe((resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 4) {
        this.clearScreen();
      }
    });
  }

  /**
 * Metodo para poder realizar la obtencion de la informacion
 * del contato en base al codigo del cliente
 */
  async findContratoByBuc() {
    try {
      if (!this.validateBuc()) {
        this.showModalMsg(
          this.translate.instant('contingencia.msjINF004Titulo'),
          this.translate.instant('contingencia.msjINF004Observacion'),
          'alert',
          this.translate.instant('contingencia.msjINF004Codigo'),
          this.translate.instant('contingencia.msjINF004Sugerencia')
        );
      } else {
        await this.service.findContratoByBuc(this.datosContrato.bucCliente).then(
          async (resp: any) => {
            if (resp.codError == 'OK00000') {
              this.datosContrato.bucCliente = resp.contrato.bucCliente;
              this.datosContrato.cuentaEje = resp.contrato.cuentaEje;
              this.datosContrato.numContrato = resp.contrato.numContrato;
              this.datosContrato.razonSocial = resp.contrato.razonSocial;
              this.datosContrato.descEstatus = resp.contrato.descEstatus;
              this.datosContrato.idContrato = resp.contrato.idContrato;
              this.lstCanales = resp.lstCanales;
              this.hdnContratoFolio = resp.contrato.hdnContratoFolio;
              this.contingenciaHabilitada = resp.contrato.contingenciaHabilitada;
              this.bandShowBotones = false;
              this.banderaBtnCargarArchivo = false;
            } else {
              this.showModalMsg(
                this.translate.instant('contingencia.msjERR007Titulo'),
                this.translate.instant('contingencia.msjERR007Sugerencia'),
                'info',
                this.translate.instant('contingencia.msjERR007Codigo'),
                this.translate.instant('contingencia.msjERR007Observacion'),
              );
              this.clearContrato();
            }
            this.globals.loaderSubscripcion.emit(false);
          });
      }
    } catch (e) {
      this.showModalMsg(
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

  /**
   * Metodo que realiza la limpieza del objeto
   * que contendra la informacion del contrato del cliente
   */
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
    this.banderaBtnCargarArchivo = true;
    if (this.btnCargarArchivo) {
      this.resetBtnCargarArchivo();
    }
   this.bandShowBotones = true;
  }

  /**
   * Metodo que realiza la limpieza de los campos de la pantalla
   */
  clearScreen() {
    this.clearContrato();
    this.lstCanales = null;
    this.operacion = "01";
    this.idCanal = null;
    //this.bandShowBotones=false;
  }

  /**
  * Metodo que valida que se ingresen solo numero, en caso de que se quieran ingresar datos diferentes no se permitira
  */
  validateOnlyNumeros(event: KeyboardEvent) {
    this.fc.numberOnly(event);
  }

  /**
   * Metodo que valida que se peguen solo numeros en los inputs
   */
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

  /**
   * Metodo que lee el contenido del archivo seleccionado y lo guarda en una variable para su uso posterior.
   */
  readArchivo(fileEvent: any) {
    this.archivoSelec = fileEvent.target.files[0];
  }

  /**
   * Metodo para resetear el valor del boton de cargar archivo cuando se haya lanzado la petición
   * de crear buzon.
   */
  resetBtnCargarArchivo() {
    this.btnCargarArchivo.nativeElement.value = '';
  }

  /**
   * Metodo para levantar el modal para
   * mostrar los mensajes de sucess o error
   * 
   * @param titulo indica si se ejecutara para error o success
   * @param contenido mensaje que se mostrara en el modal
   */
  showModalMsg(
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

  /** Metodo para validar la longitud del buc ingresado */
  validateBuc() {
    if (this.datosContrato.bucCliente.length < 8) {
      this.clearContrato();
      return false;
    }
    return true;
  }

  onChange(e: any) {
    this.operacion = e.target.value;
  }

  onSelected(value: any) {
    this.idCanal = value;
  }

  /** Metodo para enviar el archivo de cuentas ordenantes */
  async uploadArchivo() {
    if (this.datosContrato.bucCliente === '') {
      this.showModalMsg(
        this.translate.instant('planCalidad.msjINF003Titulo'),
        this.translate.instant('planCalidad.msjINF003Observacion'),
        'alert',
        this.translate.instant('planCalidad.msjINF003Codigo'),
        this.translate.instant('planCalidad.msjINF003Sugerencia')
      );
    } else if (this.archivoSelec == null) {
      this.showModalMsg(
        this.translate.instant('contingencia.msjINF002Titulo'),
        this.translate.instant('contingencia.msjINF002Observacion'),
        'alert',
        this.translate.instant('contingencia.msjINF002Codigo'),
        this.translate.instant('contingencia.msjINF002Sugerencia')
      );
    } else {
      //se verifica que si se selecciono la opcion de Descifrado y canal este canal sea el CORE (1)
      if (this.validateCanal(this.idCanal, this.operacion)) {
        const dialogo = this.dialog.open(ModalInfoComponent, {
          data: new ModalInfoBeanComponents(this.translate.instant('planCalidad.msjCNF000Titulo'), this.translate.instant('planCalidad.msjCNF000Sugerencia'), 'confirm',
            this.translate.instant('planCalidad.msjCNF000Codigo'), this.translate.instant('planCalidad.msjCNF000Observacion')), hasBackdrop: true
        });
        dialogo.afterClosed().subscribe((result) => {
          if (result) {
            this.doUploadFile();
          }
        });
      } else {
        //el canal no es valido para la opcion de descifrado
        this.showModalMsg(
          this.translate.instant('planCalidad.msjERR009Titulo'),
          this.translate.instant('planCalidad.msjERR009Observacion'),
          'alert',
          this.translate.instant('planCalidad.msjERR009Codigo'),
          this.translate.instant('planCalidad.msjERR009Sugerencia')
        );
      }
    }
  }

  async doUploadFile() {
    try {
      let formDataArchivo: FormData = new FormData();
      formDataArchivo.append('archivo', this.archivoSelec);
      var archivo = formDataArchivo;
      await this.service.uploadArchivo(this.datosContrato.numContrato+'_'+this.operacion, this.operacion, this.idCanal, archivo).then(
        async (resp: any) => {
          if (resp.error == 'INF001') {
            this.showModalMsg(
              this.translate.instant('contingencia.msjINF001Titulo'),
              this.translate.instant('contingencia.msjINF001Observacion'),
              'info',
              this.translate.instant('contingencia.msjINF001Codigo'),
              this.translate.instant('contingencia.msjINF001Sugerencia')
            );
          } else {
            this.showModalMsg(
              this.translate.instant('contingencia.msjERR006Titulo'),
              this.translate.instant('contingencia.msjERR006Observacion'),
              'alert',
              this.translate.instant('contingencia.msjERR006Codigo'),
              this.translate.instant('contingencia.msjERR006Sugerencia')
            );
          }
          this.globals.loaderSubscripcion.emit(false);
        });
    } catch (e) {
      this.showModalMsg(
        this.translate.instant('contingencia.msjERR001Titulo'),
        this.translate.instant('contingencia.msjERR001Observacion'),
        'error',
        this.translate.instant('contingencia.msjERR001Codigo'),
        this.translate.instant('contingencia.msjERR001Sugerencia')
      );
      this.globals.loaderSubscripcion.emit(false);
      this.clearContrato();
    }
  }

  validateCanal(idCanal: any, opcion: any) {
    //cuando los datos incorrectos
    let respuesta = false;
    if( idCanal === null) {
      return false;
    }
    //Si la opcion de descifrado se valida que el canal sea valido
    if (opcion === '02') {
      if (idCanal === '1') {
        respuesta = true;
      } else {
        respuesta = false;
      }
    } else {
      respuesta = true;
    }
    return respuesta;
  }
}
