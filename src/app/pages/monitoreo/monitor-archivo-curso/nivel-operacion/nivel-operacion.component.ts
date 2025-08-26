import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, UntypedFormControl, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Globals } from 'src/app/bean/globals-bean.component';
import { MonitorArchivosEnCurso } from 'src/app/services/monitor-archivos-en-curso.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ConsultaTrackingArchivoService } from 'src/app/services/monitoreo/consulta-tracking-archivo.service';

@Component({
  selector: 'app-nivel-operacion',
  templateUrl: './nivel-operacion.component.html',
  styleUrls: ['./nivel-operacion.component.css']
})
export class NivelOperacionComponent implements OnInit {
  register: any;
  submittedBuzonSearch = false;
  gestionMonitorArchivoCursoForm!:FormGroup;
  datosNivelOper: any;
  catEstatus: any;
  estatus = new UntypedFormControl('', []);
  matForm = this.fb.group({
    estatus: this.estatus
  });
  constructor(
    private formBuilder: FormBuilder,
    private fb: UntypedFormBuilder,
    private service: MonitorArchivosEnCurso,
    private globals: Globals,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    public consultaTrackingArchivoService: ConsultaTrackingArchivoService,
    private fc: FuncionesComunesComponent
  ) {
    /** Se inicializa el formulario gestionMonitorArchivoCursoForm */
    this.gestionMonitorArchivoCursoForm = this.formBuilder.group({  /** Se inicializa el formulario para validar el search */
      producto:['',Validators.required],
      estatusOperacion:['',Validators.required],
    });
    this.route.paramMap.subscribe((params) => {
      this.register = JSON.parse(atob(params.get('register') || '{}'));
    });
   }

  ngOnInit(): void {
    this.consultarNivelOperacion();
  }

  consultaCatEstatusProd(){
    this.service.consultaCatEstatusProd().then(
      (resp: any) => {
       this.catEstatus = resp;
       this.globals.loaderSubscripcion.emit(false);

     });
  }

  goBack(): void {
    this.location.back();
  }

  go(element: any){
    let jsons = {
      archivo: this.register.archivo[0],
      producto: element
    }
    this.router.navigateByUrl(
      `/monitoreo/monitorArchivosEnCurso/nivelProducto/nivelOperacion/nivelOperacionHistorico/${btoa(
        JSON.stringify(jsons)
      )}`
    );
   
  }

  refrescar(){
    this.ngOnInit();
  }

  consultarNivelOperacion(){
    this.service.consultaNivelOperacion(this.register.archivo[0].idArchivo, this.register.producto.idProd, this.register.producto.idEstatus).then(
      (resp: any) => {
       this.datosNivelOper = resp.monitorDeArchivosEnCursoOperacion;
       this.consultaCatEstatusProd();
       this.globals.loaderSubscripcion.emit(false);

     });
  }

  onClickClean(){
    this.submittedBuzonSearch = false;
    this.gestionMonitorArchivoCursoForm.reset();
  }

  eventoConsultar() {
    let status = 0;
    if(this.estatus.value){
      try{
        status = Number(this.estatus.value);
      }catch{
        status = 0;
      }
    }
    this.service.consultaNivelOperacion(this.register.archivo[0].idArchivo, this.register.producto.idProd, status).then(
      (resp: any) => {
       this.datosNivelOper = resp.monitorDeArchivosEnCursoOperacion;
       this.globals.loaderSubscripcion.emit(false);

     });
  }

  exportaOperacion(){
    this.consultaTrackingArchivoService.exportarOperacionFiltroProducto(this.register.archivo[0].idArchivo, this.register.producto.idProd, this.estatus.value ? this.estatus.value : this.register.producto.idEstatus, this.register.archivo[0].cliente ,null,this.register.archivo[0].buc).then(
     async(tabla)=>{
       if (tabla.data) {
         /** Se manda la informacion para realizar la descarga del archivo */
         this.fc.convertBase64ToDownloadFileInExport(tabla);
         this.globals.loaderSubscripcion.emit(false);
       } else {
         if (tabla.code === '404') {
         
           this.globals.loaderSubscripcion.emit(false);
         }else{
           
           this.globals.loaderSubscripcion.emit(false);
         }
       }
   })
 }

}
