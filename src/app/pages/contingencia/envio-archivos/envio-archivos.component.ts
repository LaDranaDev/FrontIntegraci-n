import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { EnvioArchivosService } from 'src/app/services/contingencia/envio-archivos.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-envio-archivos',
  templateUrl: './envio-archivos.component.html',
  styleUrls: ['./envio-archivos.component.css']
})
export class EnvioArchivosComponent implements OnInit {
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
  bandShowBotones: boolean = false;
  /** Lista de formatos validos de archivos regex */
  lstFormatosArchExpReg: any;
  /** Lista de formatos validos de archivos */
  lstFormatosArch: any;
  /** Numero de contrato */
  hdnContratoFolio: any;
  /** Bandera para saber si la contingencia esta habilitada */
  contingenciaHabilitada: any;
  constructor(private fc: FuncionesComunesComponent,
    private globals: Globals,
    private service: EnvioArchivosService,
    public dialog: MatDialog,
    private translate: TranslateService,) { }

  ngOnInit(): void {
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
              this.datosContrato.bucCliente = resp.bucCliente;
              this.datosContrato.cuentaEje = resp.cuentaEje;
              this.datosContrato.numContrato = resp.numContrato;
              this.datosContrato.razonSocial = resp.razonSocial;
              this.datosContrato.descEstatus = resp.descEstatus;
              this.datosContrato.idContrato = resp.idContrato;
              this.lstFormatosArchExpReg = resp.lstFormatosArchExpReg;
              this.lstFormatosArch = resp.lstFormatosArch;
              this.hdnContratoFolio = resp.hdnContratoFolio;
              this.contingenciaHabilitada = resp.contingenciaHabilitada;
              this.bandShowBotones = true;
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
    this.bandShowBotones = false;
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
    this.archivoSelec = null;
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

  /** Metodo para enviar el archivo de cuentas ordenantes */
  async uploadArchivo() {
    if (this.archivoSelec == null) {
      this.showModalMsg(
        this.translate.instant('contingencia.msjINF002Titulo'),
        this.translate.instant('contingencia.msjINF002Observacion'),
        'alert',
        this.translate.instant('contingencia.msjINF002Codigo'),
        this.translate.instant('contingencia.msjINF002Sugerencia')
      );
    } else {
      if (this.validateNombreArchivo()) {
        try {
          let formDataArchivo: FormData = new FormData();
          formDataArchivo.append('archivo', this.archivoSelec);
          var archivo = formDataArchivo;
          await this.service.uploadArchivo(this.datosContrato, archivo).then(
            async (resp: any) => {
              if (resp.error === 'INF001') {
                // Limpiamos el nombre del archivo enviado
                this.resetBtnCargarArchivo();

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
            });
          this.globals.loaderSubscripcion.emit(false);
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
      } else {
        var extensionesValidas = "" + this.lstFormatosArch;
        if (extensionesValidas.indexOf(",") === 0) {
          extensionesValidas = extensionesValidas.substr(1);
        }
        this.showModalMsg(
          this.translate.instant('contingencia.msjERR003Titulo'),
          this.translate.instant('contingencia.msjERR003Observacion'),
          'alert',
          this.translate.instant('contingencia.msjERR003Codigo'),
          this.translate.instant('contingencia.msjERR003Sugerencia') + " " + extensionesValidas
        );
      }

    }
  }

  /** Metodo para validar el nombre del archivo */
  validateNombreArchivo() {
    var result = false;
    var nombre = this.archivoSelec.name;
    for (var xn = 0; xn < this.lstFormatosArch.length; xn++) {
      if (this.lstFormatosArch[xn] != undefined && this.lstFormatosArch[xn].length > 0 && this.endsWith(nombre, this.lstFormatosArch[xn])) {
        result = true;
        break;
      }
    }
    var regExp = this.lstFormatosArchExpReg;
    if (regExp.length > 0) {
      var extension = nombre.substring(nombre.lastIndexOf('.') + 1, nombre.length);
      //validamos que contenga la validacion de pain 00 segun la expresion regular
      if (extension.match(regExp)) {
        result = true;
      }
    }
    return result;
  }

  endsWith(str: any, suffix: any) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

}
