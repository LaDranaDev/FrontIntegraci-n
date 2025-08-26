import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { AdministracionCertificadosService } from 'src/app/services/admin-cliente/administracion-certificados.service';
import { ComunesService } from 'src/app/services/comunes.service';

@Component({
  selector: 'app-administracion-certificados',
  templateUrl: './administracion-certificados.component.html',
  styleUrls: ['./administracion-certificados.component.css']
})
export class AdministracionCertificadosComponent implements OnInit {
  datos: any;
  abreTabla: boolean=false;
  banderaHasRows: boolean = false;
  datosTabla: { codigoClienteBUC: string; estatusCertificado: string; }[];
  totalElements: number;

  constructor(
    private service: ComunesService,
    private fc: FuncionesComunesComponent,
    private globals: Globals,
    private translate: TranslateService,
    public dialog: MatDialog,
    public certificadoService:AdministracionCertificadosService
  ) { }

  data: any = {
    codigoCliente: '',
    numContrato:'',
    id:''
  };
  
	clickSuscliption: Subscription | undefined;
  

  ngOnInit(): void {
    this.clickSuscliption = this.service.clickAtion.subscribe((resp: any) => {
			const { codeMenu } = resp;
			if (codeMenu === 2) {
				this.limpiar();
			}
		});
  }


  async descarga(data: any) {
    if(data.estatusCertificado != 'V'){
      this.open(
        '',
        '',
        'error',
        '',
        this.translate.instant('administracion.certificados.error.certificadonovigente')
      );
      return
    }
    const dat ={
      "buc": this.data.codigoCliente,
      "canal": "H2H",
      "numContrato": this.data.numContrato
  }
    try{
      await this.certificadoService.descargar(dat).then(
        async(result: any) => {
          /** Se manda la informacion para realizar la descarga del archivo */
          this.fc.convertBase64ToDownloadFileInExport(result);
          this.globals.loaderSubscripcion.emit(false);
          
        })
      }catch(e){
        this.open(
          '',
          '',
          'error',
          '',
          this.translate.instant('ED')
        );
        this.globals.loaderSubscripcion.emit(false);
      }
    
    
  }
  async buscar() {
    if(this.data.codigoCliente === ''){
      this.open(
        '',
        '',
        'error',
        '',
        this.translate.instant('administracion.buzon.msj.codigoCliente')
      );
      return
    }
    const data ={
      "buc": this.data.codigoCliente,
      "canal": "H2H",
      "numContrato": this.data.numContrato
  }
    try{
      await this.certificadoService.obtenerCertificado(data).then(
        async(result: any) => {
          if(result.codError === '9010'){
            this.open(
              '',
              '',
              'info',
              '',
              this.translate.instant('administracion.certificados.error.notienecertificado')
            );
            this.globals.loaderSubscripcion.emit(false);
            return
          }else{
            this.globals.loaderSubscripcion.emit(false);
            this.resultRequest(result.certificados)
          }
        })
      }catch(e){
        this.open(
          '',
          '',
          'error',
          '',
          this.translate.instant('ED')
        );
        this.globals.loaderSubscripcion.emit(false);
      }
    }



  resultRequest(data:any) { //result: any
    this.datosTabla= data
    this.totalElements = this.datosTabla.length
    if (this.totalElements > 0) {
      this.banderaHasRows = true;
      this.abreTabla = true
    } else {
      this.banderaHasRows = false;
      this.abreTabla = false
    }
  }
  limpiar(){
    this.data = {
			numContrato: '',
			codigoCliente: '',
		};
    this.abreTabla = false
  }

  async consultaDatosCliente() {
    try {
      if (this.data.codigoCliente != '') {
        this.data.codigoCliente = (this.data.codigoCliente as string).padStart(8, '0');
        console.log(this.data.codigoCliente);
        await this.certificadoService.consultaInformacionCliente(this.data.codigoCliente).then(
          async(resp: any) => {
            if (resp.codError == 'OK00000' && resp.bucCliente) {
              this.datos = resp
              this.data.codigoCliente = resp.bucCliente;
              this.data.id = resp.idContrato;
              this.data.numContrato = resp.numContrato;
              this.globals.loaderSubscripcion.emit(false);
            } else {
              this.open(
                'Error',
                'No existe un contrato para los datos proporcionados',
                'error',
                '',
                ''
              );
              this.limpiar();
              this.globals.loaderSubscripcion.emit(false);
            }
          });
      } else {
        alert('Favor de ingresar un número de cliente');
        this.limpiar();
      }
    }catch(e){
      this.open(this.translate.instant('modal.msjERRGEN0001Titulo'), this.translate.instant('modal.msjERRGEN0001Observacion'), 'error', this.translate.instant('modal.msjERRGEN0001Codigo'), this.translate.instant('modal.msjERRGEN0001Sugerencia'));
      this.globals.loaderSubscripcion.emit(false);
    }
  }
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

  open(titulo: String,
    contenido: String,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    code?: string,
    sugerencia?: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo,
        contenido,
        type,
        code,
        sugerencia), hasBackdrop: true
    }
    );
  }


}
