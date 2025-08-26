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
  selector: 'app-detalles-operaciones-alta-masiva',
  templateUrl: './detalles-operaciones-alta-masiva.component.html',
  styleUrls: ['./detalles-operaciones-alta-masiva.component.css']
})
export class DetallesOperacionesAltaMasivaComponent implements OnInit {

  operaciones:any
  bloqueado = true
  datosForm!: UntypedFormGroup;
  id:any
  idEstatus:any
  producto:any
  horario:any
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
    })
  
  }

  regresar2(){
    this.monitor.setSaveLocalStorage('regrese', 'si');
    this.router.navigate(['/monitoreo/monitorOperaciones']);
    /*regresar(){
      this.abrir = false;
       this.abrir1= true;
    }*/
  }

  historial2(){
    this.router.navigate(['/monitoreo/historial']); 
  }
  reintentar2(){
    var idEst='REPROCESAR'
    this.datosForm.patchValue({
      idEstatus:idEst,
    })
		this.reintentar(this.datosForm.value.idEstatus,  this.datosForm.value);
  }
  rechazar2(){
    var idEst='RECHAZADO'
    this.datosForm.patchValue({
      idEstatus:idEst,
    })
		this.reintentar(this.datosForm.value.idEstatus,  this.datosForm.value);
  }
  refrescar2(){
    this.ngOnInit()
  }
  procesar2(){
    var idEst='PROCESADO'
    this.datosForm.patchValue({
      idEstatus:idEst,
    })
		this.reintentar(this.datosForm.value.idEstatus,  this.datosForm.value);
  }

  reintentar(estatus:any, data:any){
    var idOperacion = data.idOperacion;
    var viewProd = data.vistProd;
    var tabla = data.tabla;
    var estatus = estatus;
    var idEstatus= data.idEstatus
    this.validaReintentos(idOperacion, idEstatus ,tabla, estatus,  Number(this.operaciones.cmbProducto) );
  }

  async validaReintentos(idOperacion:any, idEstatus:any, tabla:any, estatus:any, producto:any){
    try{
      var data ={
        'estatus':estatus,
        'idOperacion':idOperacion,
        'tabla':tabla
      }
      if(estatus === 'REINTENTO'){
        await this.monitor.horario(producto).then(
          async (resp:any)=>{
          this.horario = resp
        })
        if(this.horario){
          await this.monitor.cambiarEstatusOperacion(data).then(
            async(resp:any)=>{
              this.open('Info', this.translate.instant('pantalla.monitor.Inf02.mensaje'),'info', this.translate.instant('pantalla.monitor.Inf02.codigo'))
            if(producto === 21 || producto === 22 ||producto === 23){
              this.router.navigate(['/monitoreo/detallesPIF']);
            }else{
              this.router.navigate(['/monitoreo/detallesOperaciones']);
            }
          })
        }else{
          this.open('Info', this.translate.instant('pantalla.monitor.Inf03.mensaje'), 'info', this.translate.instant('pantalla.monitor.Inf03.codigo'))
        }
      }else{
        await this.monitor.cambiarEstatusOperacion(data).then(
          async(resp:any)=>{
            this.open('Info', this.translate.instant('pantalla.monitor.Inf02.mensaje'),'info', this.translate.instant('pantalla.monitor.Inf02.codigo'))
          if(producto === 21 || producto === 22 ||producto === 23){
            this.router.navigate(['/monitoreo/detallesPIF']);
          }else{
            this.router.navigate(['/monitoreo/detallesOperaciones']);
          }
        })
      }
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

  open(titulo:String,contenido:String, type?: any, code?: string, sugerencia?: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo,contenido,type,code,sugerencia), hasBackdrop: true
    }
    );
  }

}
