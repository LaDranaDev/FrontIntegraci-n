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
  selector: 'app-detalles-pif-duplicadas',
  templateUrl: './detalles-pif-duplicadas.component.html',
  styleUrls: ['./detalles-pif-duplicadas.component.css']
})
export class DetallesPIFDuplicadasComponent implements OnInit {

  operaciones:any
  bloqueado = true
  datosForm!: UntypedFormGroup;
  id:any
  idEstatus:any
  producto:any
  horario:any
  intradia = 's'
  rechazo: boolean=false;
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
          this.open(this.translate.instant('menu.sterling.historialBuzon.error'),resp.message,'error');
        }
        this.id = resp.idProducto
        this.idEstatus= resp.idEstatus
        this.datosForm.patchValue({
          producto: resp.producto,
          bucEmpleado: resp.bucEmpleado,
          estatus:resp.estatus,
          idEstatus:resp.idEstatus,
          fechaVenc:resp.fechaVenc,
          nomArch:resp.nomArch,
          referencia: resp.referencia,
          lineaCaptura:resp.lineaCaptura,
          concepto:resp.concepto,
          folioSua:resp.folioSua,
          nombreOrd:resp.nombreOrd,
          ctaCargo:resp.ctaCargo === '-1' ? 'ErrorCampo' : resp.ctaCargo,
          llavePago:resp.llavePago,
          plaza:resp.plaza,

          sucursal:resp.sucursal,
          numConvenio:resp.numConvenio,
          nombreConvenio:resp.nombreConvenio,
          numTarjeta:resp.numTarjeta,
          registroPat:resp.registroPat,
          periodoPago:resp.periodoPago,
          divisa:resp.divisa,
          importe:resp.importe,
          mensaje: resp.mensaje,
        })
        this.globals.loaderSubscripcion.emit(false);
      })
    }catch(e){
      this.globals.loaderSubscripcion.emit(false);
      this.open(this.translate.instant('modal.msjERRGEN0001Titulo'),this.translate.instant('modal.msjERRGEN0001Observacion'),'error',this.translate.instant('modal.msjERRGEN0001Codigo'),this.translate.instant('modal.msjERRGEN0001Sugerencia'));
    }
  }
  private initializeForm() {
    return this.formBuilder.group({
      producto:[{value:'' , disabled: true}],
      bucEmpleado:[{value: '', disabled: true}],
      estatus:[{value: '', disabled: true}],
      idEstatus:[{value: '', disabled: true}],
      fechaVenc:[{value: '', disabled: true}],
      nomArch:[{value: '', disabled: true}],
      referencia:[{value: '', disabled: true}],

      lineaCaptura:[{value: '', disabled: true}],
      concepto:[{value: '', disabled: true}],
      folioSua:[{value: '', disabled: true}],
      nombreOrd:[{value: '', disabled: true}],
      ctaCargo:[{value: '', disabled: true}],
      llavePago:[{value: '', disabled: true}],
      plaza:[{value: '', disabled: true}],

      sucursal:[{value: '', disabled: true}],
      numConvenio:[{value: '', disabled: true}],
      nombreConvenio:[{value: '', disabled: true}],
      numTarjeta:[{value: '', disabled: true}],
      registroPat:[{value: '', disabled: true}],
      periodoPago:[{value: '', disabled: true}],
      divisa:[{value: '', disabled: true}],
      importe:[{value: '', disabled: true}],

      mensaje:[{value: '', disabled: true}],
      razonRechazo:[''],
    })
  }

  regresarPIF(){
    this.monitor.setSaveLocalStorage('regrese', 'si');
    this.router.navigate(['/duplicados/monitorOperacionesDuplicadas']);
  }
  cancel11(){
    this.rechazo=false
    this.datosForm.patchValue({
      razonRechazo:'',
    })
  }
  rechazarPIF(){
    this.rechazo=true
  }
  refrescarPIF(){
    this.ngOnInit()
  }
  procesarPIF(){
    this.procesarCl.procesar(this.rechazo, this.datosForm.get('razonRechazo')?.value, this.operaciones.idArchivo, this.operaciones.nomArch);
    this.cancel11();
  }


  open(titulo:String,contenido:String, type?: any, code?: string, sugerencia?: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo,contenido,type,code,sugerencia), hasBackdrop: true
    }
    );
  }



}
