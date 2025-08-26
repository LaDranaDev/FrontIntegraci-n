import { AbstractType, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ComunesService } from 'src/app/services/comunes.service';
import { DescargaLlavePublicaCanalService } from 'src/app/services/admin-cliente/descarga-llave-publica-canal.service';

@Component({
  selector: 'app-descarga-llave-publica-canal',
  templateUrl: './descarga-llave-publica-canal.component.html',
  styleUrls: ['./descarga-llave-publica-canal.component.css']
})
export class DescargaLlavePublicaCanalComponent implements OnInit {
  /**Se inicializa componente de los datos del contrato*/
  datosContrato: any = {
    numContrato: "", bucCliente: "", descEstatus: "", nombreCompleto: "",
    personalidad: "", cuentaEje: "", idContrato: "", razonSocial: "", idEstatus: ""
  };
  banderaHasRows: boolean = false;
  listLlavesPub: any;
  selKeyDownload: any;
  contrato: any;
  fechaCreacion: any;

  constructor(private fc: FuncionesComunesComponent,
    private globals: Globals,
    private service: DescargaLlavePublicaCanalService,
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
      await this.service.findContratoByBuc(this.datosContrato.bucCliente).then(
        async (resp: any) => {
          if (resp.codError == 'OK00000') {
            this.datosContrato.bucCliente = resp.bucCliente;
            this.datosContrato.cuentaEje = resp.cuentaEje;
            this.datosContrato.numContrato = resp.numContrato;
            this.datosContrato.razonSocial = resp.razonSocial;
            this.datosContrato.descEstatus = resp.descEstatus;
            this.datosContrato.idContrato = resp.idContrato;
          } else {
            this.showModalMsg(
              '',
              '',
              'alert',
              this.translate.instant('putget.msjCONT0011Codigo'),
              // this.translate.instant('putget.msjCONT0011Observacion'),
              'Nonexistent contract H2H',
            );
          }
          this.globals.loaderSubscripcion.emit(false);
        });
    } catch (e) {
      this.showModalMsg(
        '',
        '',
        'alert',
        this.translate.instant('putget.msjCONT0011Codigo'),
        // this.translate.instant('putget.msjCONT0011Observacion'),
        'Nonexistent contract H2H',
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
  }

  /**
   * Metodo que realiza la limpieza de los campos de la pantalla
   */
  clearScreen() {
    this.clearContrato();
    this.listLlavesPub = {};
    this.banderaHasRows = false;
    this.selKeyDownload = null;
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

  validateBucCert() {
    var buc = this.datosContrato.bucCliente;
    if (buc !== '' && buc.length < 8) {
      //rellenamos si tiene algun valor
      //rellenar ala izquierda
      this.datosContrato.bucCliente = this.rellenarIzq(buc);
      return;
    }
    if (this.datosContrato.bucCliente.length === 8) {
      this.findContratoByBuc();
    }
  }

  rellenarIzq(buc: any) {
    if (buc != '') {
      if (buc.length < 8) {
        for (var i = buc.length; i < 8; i = buc.length) {
          buc = '0' + buc;
        }
      }
    }
    return buc;
  }

  async findLlavePub() {
    if (this.datosContrato.bucCliente === '') {
      this.showModalMsg(
        this.translate.instant('putget.requerido.titulo'),
        '',
        'error',
        this.translate.instant('putget.requerido.numClte.code'),
        this.translate.instant('putget.requerido.numClte'),
      );
    } else {
      if (this.datosContrato.numContrato === '') {
        this.showModalMsg(
          this.translate.instant('putget.requerido.titulo'),
          '',
          'error',
          this.translate.instant('putget.requerido.numCntr.code'),
          this.translate.instant('putget.requerido.numCntr'),
        );
      } else {
        try {
          await this.service.findLlavesPub(this.datosContrato.numContrato).then(
            async (result: any) => {
              let code: any;
              let observation: any;
              if (result.codError === 'OK00000') {
                this.listLlavesPub = result.llavesData;
                this.banderaHasRows = true;
                return;
              } else if (result.codError === 'ERRWSGC3') {
                code = this.translate.instant('putget.msjERRWSGC3Codigo');
                observation = this.translate.instant('putget.msjERRWSGC3Observacion');
              } else if (result.codError === 'ERRWSGC4') {
                code = this.translate.instant('putget.msjERRWSGC4Codigo');
                observation = this.translate.instant('putget.msjERRWSGC4Observacion');
              } else if (result.codError === 'ERRWSGC0') {
                code = this.translate.instant('putget.msjERRWSGC0Codigo');
                observation = this.translate.instant('putget.msjERRWSGC0Observacion');
              } else if (result.codError === 'ERRWSGC1') {
                code = this.translate.instant('putget.msjERRWSGC1Codigo');
                observation = this.translate.instant('putget.msjERRWSGC1Observacion');
              } else if (result.codError === 'ERRWSGC2') {
                code = this.translate.instant('putget.msjERRWSGC2Codigo');
                observation = this.translate.instant('putget.msjERRWSGC2Observacion');
              }
              this.showModalMsg(
                '',
                '',
                'error',
                code,
                observation,
              );
            });
            this.globals.loaderSubscripcion.emit(false);
        } catch (e) {
          this.showModalMsg(
            '',
            '',
            'error',
            this.translate.instant('putget.msjERRWSGC4Codigo'),
            this.translate.instant('putget.msjERRWSGC4Observacion'),
          );
          this.globals.loaderSubscripcion.emit(false);
        }
      }

    }
  }

  async downloadLlavePub() {
    if (this.selKeyDownload === null || this.selKeyDownload === undefined) {
      this.showModalMsg(
        '',
        '',
        'alert',
        this.translate.instant('putget.msjERRPG01Codigo'),
        this.translate.instant('putget.msjERRPG01Observacion'),
      );
    } else {
      var arr = this.selKeyDownload.split("::");
      this.contrato = arr[0];
      this.fechaCreacion = arr[1];
      try {
        await this.service.dowloadLlavePub(this.contrato, this.fechaCreacion).then(
          async (result: any) => {
            let code: any;
            let observation: any;
            if (result.data !== '') {
              /** Se manda la informacion para realizar la descarga del archivo */
              this.fc.convertBase64ToDownloadFileInExport(result);
              this.globals.loaderSubscripcion.emit(false);
              return;
            } else if (result.codError === 'ERRWSL02') {
              code = this.translate.instant('putget.msjERRWSL02Codigo');
              observation = this.translate.instant('putget.msjERRWSL02Observacion');
            } else if (result.codError === 'ERRWSL03') {
              code = this.translate.instant('putget.msjERRWSL03Codigo');
              observation = this.translate.instant('putget.msjERRWSL03Observacion');
            } else if (result.codError === 'ERRWSL04') {
              code = this.translate.instant('putget.msjERRWSL04Codigo');
              observation = this.translate.instant('putget.msjERRWSL04Observacion');
            } else if (result.codError === 'ERRWSL05') {
              code = this.translate.instant('putget.msjERRWSL05Codigo');
              observation = this.translate.instant('putget.msjERRWSL05Observacion');
            }
            this.showModalMsg(
              '',
              '',
              'error',
              code,
              observation,
            );
          });
          this.globals.loaderSubscripcion.emit(false);
      } catch (e) {
        this.showModalMsg(
          '',
          '',
          'error',
          this.translate.instant('putget.msjERRWSL01Codigo'),
          this.translate.instant('putget.msjERRWSL01Observacion'),
        );
        this.globals.loaderSubscripcion.emit(false);
      }
    }
  }

  /**
  * Evento para el momento de seleccionar
  * una opcion del input type radio
  */
  onEventClickRadioButton(value: any) {
    this.selKeyDownload = value;
  }
}
