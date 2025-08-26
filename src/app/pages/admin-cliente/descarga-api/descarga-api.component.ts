import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { DescargaApiService } from 'src/app/services/admin-cliente/descargaApi.service';
import { ComunesService } from 'src/app/services/comunes.service';

@Component({
  selector: 'app-descarga-api',
  templateUrl: './descarga-api.component.html',
  styleUrls: ['./descarga-api.component.css'],
})
export class DescargaApiComponent implements OnInit {

  data: any = {
    usuario: '',
  };
  
  clickSuscliption: Subscription | undefined;
  claveUsuario: string | null;
  constructor(
    private api: DescargaApiService,
    private globals: Globals,
    public dialog: MatDialog,
    private fc: FuncionesComunesComponent,
    private comunService: ComunesService,
    private translate: TranslateService,
  ) {
    this.claveUsuario = localStorage.getItem('UserID');
   }

   ngOnInit(): void {
    this.clickSuscliption = this.comunService.clickAtion.subscribe((resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 1) {
        this.data.usuario = this.claveUsuario
      }
    }); 
   }

  async descargar() {
    try{
      await this.api.descargaApi().then(
        async(result: any) => {
          if (result.data !== '') {
            /** Se manda la informacion para realizar la descarga del archivo */
            this.fc.convertBase64ToDownloadFileInExport(result);
            this.globals.loaderSubscripcion.emit(false);
          }
            if (result.error === 'ERR001') {
              this.openModalError('Error',  this.translate.instant('modal.error.msjDescargaObservacion'), 'error', 'ERR001'); //Traducir falta
              this.globals.loaderSubscripcion.emit(false);
            }else if(result.error === 'errorParam'){
                this.openModalError('Error', this.translate.instant('EANED'), 'error', 'ERR001');
              this.globals.loaderSubscripcion.emit(false);
            }else if(result.error === 'OK00000'){
              this.openModalError('confirm', this.translate.instant('parametrosBD.PBD0001.descripcion'), 'confirm', 'OK0000');
              this.globals.loaderSubscripcion.emit(false);
            }else {
              this.openModalError(
                'Error',
                this.translate.instant('EDA'),
                'error'
              );
              this.globals.loaderSubscripcion.emit(false);
            }
        });
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
  
  open(
    titulo: string,
    obser: string,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    code?: string,
    sug?: string
  ) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, obser, type, code, sug),
    });
  }

  openModalError(
    titulo: string,
    obser: string,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    code?: string
  ) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, obser, type, code),
    });
  }

}
