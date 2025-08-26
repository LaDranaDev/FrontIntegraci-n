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
import { ProcesarDatos } from '../procesar-datos';



@Component({
  selector: 'app-detalles-operaciones-alta-masiva-duplicadas',
  templateUrl: './detalles-operaciones-alta-masiva-duplicadas.component.html',
  styleUrls: ['./detalles-operaciones-alta-masiva-duplicadas.component.css']
})
export class DetallesOperacionesAltaMasivaDuplicadasComponent implements OnInit {

  operaciones:any
  bloqueado = true
  datosForm!: UntypedFormGroup;
  id:any
  idEstatus:any
  producto:any
  horario:any
  rechazo: boolean= false;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router:Router,
    public datePipe: DatePipe,
    private fc:FuncionesComunesComponent,
    private monitor: MonitorOperacionesService,
    private cd: ChangeDetectorRef,
    private globals: Globals,
    public dialog: MatDialog,
    private translate: TranslateService,
    private procesarCl: ProcesarDatos,

  ) {
      this.datosForm = this.initializeForm();
    }

  async ngOnInit() {
    this.monitor.setSaveLocalStorage('regrese', null);
    this.operaciones = this.monitor.getSaveLocalStorage('operaciones');
    let det = {
      'idProducto': this.operaciones.idProducto,
      'idOperacion': this.operaciones.idOperacion,
    }
    try{
      await this.monitor.detalles(det).then(
        async (resp:any)=>{
          if(resp.code === '500'){
            this.open('Error', resp.message, 'error');
          }
        this.id = resp.idProducto
        this.idEstatus= resp.idEstatus
        this.datosForm.patchValue({
          nombreEmpleado: resp.nombreEmpleado,
          rfc: resp.rfc,
          numEmpleado:resp.numEmpleado,
          bucEmpleado:resp.bucEmpleado,
          fechaAplic:resp.fechaAplic,
          idEstatus:resp.idEstatus,
          numTarjeta:resp.numTarjeta,
          numeroCuenta:resp.numeroCuenta,
          sucTutora: resp.sucTutora,
          estatus: resp.estatus,
          descripcion:resp.descripcion,
          comentario:resp.mensaje
        })
        this.globals.loaderSubscripcion.emit(false);
      })
    }catch(e){
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
  private initializeForm() {
    return this.formBuilder.group({
      nombreEmpleado:[{value:'' , disabled: true}],
      rfc:[{value: '', disabled: true}],
      numEmpleado:[{value: '', disabled: true}],
      bucEmpleado:[{value: '', disabled: true}],
      fechaAplic:[{value: '', disabled: true}],
      idEstatus:[{value: '', disabled: true}],
      numTarjeta:[{value: '', disabled: true}],
      numeroCuenta:[{value: '', disabled: true}],
      sucTutora:[{value: '', disabled: true}],
      estatus:[{value: '', disabled: true}],
      descripcion:[{value: '', disabled: true}],
      comentario:[{value: '', disabled: true}],
      razonRechazo:['']
    })
  }

  regresar2(){
    this.monitor.setSaveLocalStorage('regrese', 'si');
    this.router.navigate(['/duplicados/monitorOperacionesDuplicadas']);
  }
  cancel1(){
    this.rechazo=false
    this.datosForm.patchValue({
      razonRechazo:'',
    })
  }

  rechazar2(){
    this.rechazo= true
  }
  refrescar2(){
    this.ngOnInit()
  }
  procesar2(){
    this.procesarCl.procesar(this.rechazo, this.datosForm.get('razonRechazo')?.value, this.operaciones.idArchivo, this.operaciones.nomArch);
    this.cancel1()
  }


  open(titulo:String,contenido:String, type?: any, code?: string, sugerencia?: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo,contenido,type,code,sugerencia), hasBackdrop: true
    }
    );
  }

}
