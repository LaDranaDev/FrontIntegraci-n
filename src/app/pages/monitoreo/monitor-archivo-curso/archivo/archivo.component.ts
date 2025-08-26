import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, UntypedFormControl, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Globals } from 'src/app/bean/globals-bean.component';
import { MonitorArchivosEnCurso } from 'src/app/services/monitor-archivos-en-curso.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ConsultaTrackingArchivoService } from 'src/app/services/monitoreo/consulta-tracking-archivo.service';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component'
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-archivo',
  templateUrl: './archivo.component.html',
  styleUrls: ['./archivo.component.css']
})
export class ArchivoComponent implements OnInit {
  register: any;
  submittedBuzonSearch = false;
  gestionMonitorArchivoCursoForm!:FormGroup;
  datosNivelProd: any;
  catEstatus = null;
  catProductos = null;
  producto = new UntypedFormControl('', []);
  estatus = new UntypedFormControl('', []);
  matForm = this.fb.group({

    producto: this.producto,
    estatus: this.estatus
  });

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private fb: UntypedFormBuilder,
    private service: MonitorArchivosEnCurso,
    private globals: Globals,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private translate: TranslateService,
    public consultaTrackingArchivoService: ConsultaTrackingArchivoService,
    private fc: FuncionesComunesComponent  ) {
    /** Se inicializa el formulario gestionMonitorArchivoCursoForm */
    this.gestionMonitorArchivoCursoForm = this.formBuilder.group({  /** Se inicializa el formulario para validar el search */
      producto:['',Validators.required],
      estatusOperacion:['',Validators.required],
    });
    this.route.paramMap.subscribe((params) => {
      this.register = [JSON.parse(atob(params.get('register') || '{}'))];
    });
   }

  ngOnInit(): void {
    this.consultarNivelProducto();
  }

  consultaCatalogos(){
    this.service.consultaCatEstatusProd().then(
      (resp: any) => {
       this.catEstatus = resp;
       this.globals.loaderSubscripcion.emit(false);

     });

     this.service.consultaCatProductoProd().then(
      (resp: any) => {
       this.catProductos = resp;
       this.globals.loaderSubscripcion.emit(false);

     });
  }

  goBack(): void {
    this.location.back();
  }

  go(element: any, full?: boolean){
    let jsons = {
      archivo: this.register,
      producto: element
    }
    if(full){
      jsons.producto.idEstatus = 0;
    }
    this.router.navigateByUrl(
      `/monitoreo/monitorArchivosEnCurso/nivelProducto/nivelOperacion/${btoa(
        JSON.stringify(jsons)
      )}`
    );

  }

  refrescar(){
    this.ngOnInit();
  }

  consultarNivelProducto(){
     this.service.consultaNivelProducto(this.register[0].idArchivo, this.register[0].idProd ? parseInt(this.register[0].idProd) : 0, this.register[0].idEstatus ? parseInt(this.register[0].idEstatus) : 0).then(
       (resp: any) => {
        this.datosNivelProd = resp.monitorDeArchivosEnCurso;
        if(this.datosNivelProd.length === 0)
        this.open(
          this.translate.instant('buzon.msjINFOOKTitulo'),
          this.translate.instant('consultaTracking.menssage'),
          'info',
         "TRACKING007",
          ""
        );
        this.consultaCatalogos();
        this.globals.loaderSubscripcion.emit(false);

      });
  }

  open(
    titulo: string,
    contenido: string,
    type?: any,
    code?: string,
    sugerencia?: string
  ) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        contenido,
        type,
        code,
        sugerencia
      ), hasBackdrop: true
    });
  }

  onClickClean(){
    this.submittedBuzonSearch = false;
    this.gestionMonitorArchivoCursoForm.reset();
  }

  eventoConsultar() {
    this.service.consultaNivelProducto(this.register[0].idArchivo, this.producto.value ? this.producto.value : 0, this.estatus.value ? this.estatus.value : 0 ).then(
      (resp: any) => {
        if (resp.monitorDeArchivosEnCurso.length === 0) this.open(
            this.translate.instant('buzon.msjINFOOKTitulo'),
            this.translate.instant('consultaTracking.menssage'),
            'info',
            "TRACKING007",
            ""
          );
       this.datosNivelProd = resp.monitorDeArchivosEnCurso;
       this.globals.loaderSubscripcion.emit(false);

     });
  }

  exportaProducto(){
     this.consultaTrackingArchivoService.exportarProducto(this.register[0].idArchivo,this.estatus.value, this.producto.value ,this.register[0].buc,null).then(
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
