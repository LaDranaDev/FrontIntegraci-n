import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { DatePipe } from "@angular/common";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { MonitorOperacionesService } from 'src/app/services/monitoreo/monitor-operaciones.service';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  
  usuarioActual: string | null = '';
  operaciones:any
  /** Variable para identificar si el listado contiene o no valores*/
  banderaHasRows:boolean = false;
  totalElements: number = 0;
  conten:any = undefined
  ruta:any
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router:Router,
    public datePipe: DatePipe,
    private fc:FuncionesComunesComponent,
    private monitor: MonitorOperacionesService,
    private cd: ChangeDetectorRef,
    private globals: Globals,
    public dialog: MatDialog,
    private translate: TranslateService
  ) { }

  async ngOnInit() {    
    this.usuarioActual = localStorage.getItem('UserID');
    this.operaciones = this.monitor.getSaveLocalStorage('operaciones');
    this.ruta = this.monitor.getSaveLocalStorage('ruta');
    try{
      await this.monitor.historial(this.operaciones.idOperacion).then((resp:any)=>{
      this.respuestaTabla(resp)
       this.globals.loaderSubscripcion.emit(false);
    })
  }catch(e){
    this.globals.loaderSubscripcion.emit(false);
    this.openModalError('','Error al consultar el historial','error','','');  
  }
  }
  respuestaTabla(data:any){
    this.conten = data
    this.totalElements = data.length
    if(this.totalElements > 0){
      this.banderaHasRows = true;
    }else{
      this.banderaHasRows = false;
    }
  }

  regresar(){
    this.router.navigate([this.ruta]);
  }
  async exportar5(){
    try{
      await this.monitor.exportarHistorial(this.operaciones.idOperacion,this.usuarioActual).then(
        async (resp:any)=>{
        this.fc.convertBase64ToDownloadFileInExport(resp);
        this.globals.loaderSubscripcion.emit(false);
      })
    }catch(e){
      this.openModalError(this.translate.instant('modal.msjERRGEN0001Titulo'),this.translate.instant('modal.msjERRGEN0001Observacion'),'error',this.translate.instant('modal.msjERRGEN0001Codigo'),this.translate.instant('modal.msjERRGEN0001Sugerencia'));
    }
  }
  refrescar(){
    this.ngOnInit()
  }

  openModalError(titulo:String,contenido:String, type?: any, code?: string, sugerencia?: string){
    this.dialog.open(ModalInfoComponent, {
    data: new ModalInfoBeanComponents(titulo,contenido,type,code,sugerencia), hasBackdrop: true}
    );
  }
}
