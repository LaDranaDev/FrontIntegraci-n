import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Globals } from 'src/app/bean/globals-bean.component';
import { MonitorArchivosEnCurso } from 'src/app/services/monitor-archivos-en-curso.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ConsultaTrackingArchivoService } from 'src/app/services/monitoreo/consulta-tracking-archivo.service';

@Component({
  selector: 'app-nivel-operacion-historico',
  templateUrl: './nivel-operacion-historico.component.html',
  styleUrls: ['./nivel-operacion-historico.component.css']
})
export class NivelOperacionHistoricoComponent implements OnInit {
  register: any;
  submittedBuzonSearch = false;
  gestionMonitorArchivoCursoForm!:FormGroup;
  datosNivelOper: any;
  constructor(
    private formBuilder: FormBuilder,
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
    this.consultarNivelOperacionHistorica();
  }

  goBack(): void {
    this.location.back();
  }

  go(element: any){
    
   
  }

  refrescar(){
    this.ngOnInit();
  }

  consultarNivelOperacionHistorica(){
    this.service.consultaNivelOperacionHistorico(this.register.producto.idReg).then(
      (resp: any) => {
       this.datosNivelOper = resp.monitorDeArchivosEnCursoOperacion;
       this.globals.loaderSubscripcion.emit(false);

     });
  }

  onClickClean(){
    this.submittedBuzonSearch = false;
    this.gestionMonitorArchivoCursoForm.reset();
  }

  exportaOperacionHistorica(){
    this.consultaTrackingArchivoService.exportarHistorica(this.register.producto.idReg, this.register.archivo.cliente, null).then(
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
