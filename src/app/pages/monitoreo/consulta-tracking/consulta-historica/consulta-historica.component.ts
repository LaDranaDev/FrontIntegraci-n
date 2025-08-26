import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/bean/globals-bean.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsultaTrackingArchivoService } from 'src/app/services/monitoreo/consulta-tracking-archivo.service';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-consulta-historica',
  templateUrl: './consulta-historica.component.html',
  styleUrls: ['./consulta-historica.component.css']
})
export class ConsultaHistoricaComponent implements OnInit {

  usuarioActual: string | null = '';
  operacion:any = undefined
  datos:any = undefined
  conten:any = undefined
  traking:any
  id:any
  objPageable:IPaginationRequest;
  banderaBtnExportar: boolean = true;
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows:boolean = false;
  /** Variable para indicar en que pagina se encuentra */
  page: number = 0;
  /** Variable para indicar el total de elementos que regresa la peticion */
  totalElements: number = 0;
  /** Variable para indicar el total de elementos que se mostraran por pagina */
  rowsPorPagina: number = 10;
  /** Variables para mostrar las vinetas de ultimo y primero */
  showBoundaryLinksHistorica: boolean = true;
  showDirectionLinksHistorica: boolean = true;
  banderaArchDuplicados: any

  constructor(
    public consultaTrackingArchivoService: ConsultaTrackingArchivoService,
    private globals: Globals,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router,
    private fc: FuncionesComunesComponent,
    private translate: TranslateService
  ) {
    this.usuarioActual = localStorage.getItem('UserID');
     //Se inicializa el objeto pageable
     this.objPageable = {
      page:this.page,
      size:this.rowsPorPagina,
      ruta:''
    }
  }
  private fillObjectPag(numPage:number,totalItemsPage:number){
    this.objPageable.page = numPage,
    this.objPageable.size = totalItemsPage;
    return this.objPageable;
  }

  ngOnInit(): void {
    this.traking = this.consultaTrackingArchivoService.getSaveLocalStorage('traking');
    this.id = this.consultaTrackingArchivoService.getSaveLocalStorage('idReg');
    this.banderaArchDuplicados = this.consultaTrackingArchivoService.getSaveLocalStorage('archDupPage');

    this.consultaTrackingArchivoService.iniciaNivelOperacionHistorica(this.id, this.traking.cliente).then((resp:any)=>{
      this.respuesta(resp)
      this.consultaTrackingArchivoService.iniciaNivelOperacionHistoricaTabla(this.id,  this.fillObjectPag(0,10)).then((resp:any)=>{
        this.respuestaTabla(resp)
        this.globals.loaderSubscripcion.emit(false);
      })
    })
  }

  respuestaTabla(data:any){
    this.conten = data.content
    this.totalElements = data.totalElements
    if(this.totalElements > 0){
      this.banderaHasRows = true;
      this.banderaBtnExportar =true
    }else{
      this.banderaHasRows = false;
      this.banderaBtnExportar =false
    }
  }

  respuesta(data:any){
    this.datos = data
  }

    async onPageChanged(event:any){
      this.page = 0
      this.page = event.page-1;
      this.conten = [];
      this.consultaTrackingArchivoService.iniciaNivelOperacionHistoricaTabla(this.id,  this.fillObjectPag(this.page,10)).then((resp:any)=>{
        this.respuestaTabla(resp)
        this.globals.loaderSubscripcion.emit(false);
      })
    }

    regresar(){
      this.consultaTrackingArchivoService.setSaveLocalStorage('idReg', null);
      this.router.navigate(['/monitoreo/consultaTracking/consultaOperacion']);
    }
    async exportar5(){
      try{
        await this.consultaTrackingArchivoService.exportarHistorica(this.id,this.traking.cliente,this.usuarioActual).then(
          async(tabla)=>{
            if (tabla.data) {
              /** Se manda la informacion para realizar la descarga del archivo */
              this.fc.convertBase64ToDownloadFileInExport(tabla);
              this.globals.loaderSubscripcion.emit(false);
            } else {
              if (tabla.code === '404') {
                this.open('Error', tabla.message, 'error');
                this.globals.loaderSubscripcion.emit(false);
              }else{
                this.open(
                  this.translate.instant('modal.msjERRGEN0001Titulo'),
                  this.translate.instant('modal.msjERRGEN0001Observacion'),
                  'error',
                  this.translate.instant('modal.msjERRGEN0001Codigo'),
                  this.translate.instant('modal.msjERRGEN0001Observacion')
                );
                this.globals.loaderSubscripcion.emit(false);
              }
            }
        })
        }catch(e){
          this.datos = {};
          this.globals.loaderSubscripcion.emit(false);
          this.open(
            this.translate.instant('modal.msjERRGEN0001Titulo'),
            this.translate.instant('modal.msjERRGEN0001Observacion'),
            'error',
            this.translate.instant('modal.msjERRGEN0001Codigo'),
            this.translate.instant('modal.msjERRGEN0001Observacion')
          );
        }
    }
    refrescar(){
      this.ngOnInit()
    }
    open(
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
}
