import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/bean/globals-bean.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsultaTrackingArchivoService } from 'src/app/services/monitoreo/consulta-tracking-archivo.service';
import { IPaginationRequest } from 'src/app/pages/contingencia/request/pagination-request.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-consulta-operacion',
  templateUrl: './consulta-operacion.component.html',
  styleUrls: ['./consulta-operacion.component.css']
})
export class ConsultaOperacionComponent implements OnInit {

  usuarioActual: string | null = '';
  operacion:any = undefined
  datos:any = undefined
  conten:any = undefined
  totalOperaciones:any
  archivo:any
  formSearchOperacion!:FormGroup;
  traking:any
  datosSuperior:any
  selectEstatus:any
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
   showBoundaryLinksOperacion: boolean = true;
   showDirectionLinksOperacion: boolean = true;

  objPageable:IPaginationRequest;
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
    this.formSearchOperacion = this.formBuilder.group({  /** Se inicializa el formulario para validar el search */
      estatus:['']
    });
    //Se inicializa el objeto pageable
    this.objPageable = {
      page:this.page,
      size:this.rowsPorPagina,
      ruta:''
    }
  }

  ngOnInit(): void {
    this.operacion = this.consultaTrackingArchivoService.getSaveLocalStorage('operacion');
    this.totalOperaciones = this.consultaTrackingArchivoService.getSaveLocalStorage('totalOperaciones');
    this.archivo = this.consultaTrackingArchivoService.getSaveLocalStorage('archivo');
    this.traking = this.consultaTrackingArchivoService.getSaveLocalStorage('traking');
    this.banderaArchDuplicados = this.consultaTrackingArchivoService.getSaveLocalStorage('archDupPage');

   if(this.operacion != null){
    this.consultaTrackingArchivoService.operaciones(this.archivo, this.traking, this.operacion).then((resp:any)=>{
      this.respuesta(resp)
      this.consultaTrackingArchivoService.tablaOperaciones( this.operacion, this.archivo,  this.fillObjectPag(0,10)).then((resp:any)=>{
        this.respuestaTabla(resp)
        this.globals.loaderSubscripcion.emit(false);
      })
    })
   }
   if(this.totalOperaciones != null){
    this.consultaTrackingArchivoService.totalOperaciones(this.totalOperaciones).then((resp:any)=>{
      this.respuesta(resp)
      this.consultaTrackingArchivoService.tablaTotalOperaciones(this.totalOperaciones, this.fillObjectPag(0,10)).then((resp:any)=>{
        this.respuestaTabla(resp)
        this.globals.loaderSubscripcion.emit(false);
      })

    })
  }
  }
  /**
   * @descripcion Metodo para poder generar y regresar el objeto con la paginacion
   *
   * @param numPage valor para indicar el numero de la pagina
   * @param totalItemsPage valor para indicar el total de elementos que se mostraran en la pagina
  */
   private fillObjectPag(numPage:number,totalItemsPage:number){
    this.objPageable.page = numPage,
    this.objPageable.size = totalItemsPage;
    return this.objPageable;
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
      this.open('Info',this.translate.instant('consultaTracking.menssage'), 'info');
    }
    this.globals.loaderSubscripcion.emit(false);
  }

  respuesta(data:any){
    this.datosSuperior = data.archivo
    this.selectEstatus = data.listEstatus
  }

  Historica(id:any){
    this.consultaTrackingArchivoService.setSaveLocalStorage('idReg', id);
    this.router.navigate(['/monitoreo/consultaTracking/consultaOperacionHistorica']);
  }
    /**
   * @description Evento de click al momento de usar la paginacion
   * @memberOf GestionPaisesComponent
  */
    async onPageChanged(event:any){
      this.page = 0
      this.page = event.page-1;
      this.conten = [];
      if(this.operacion != null){
          this.consultaTrackingArchivoService.tablaOperaciones( this.operacion, this.archivo,  this.fillObjectPag(this.page ,10)).then((resp:any)=>{
            this.respuestaTabla(resp)
            this.globals.loaderSubscripcion.emit(false);
          })
       }
       if(this.totalOperaciones != null){
          this.consultaTrackingArchivoService.tablaTotalOperaciones(this.totalOperaciones, this.fillObjectPag(this.page,10)).then((resp:any)=>{
            this.respuestaTabla(resp)
            this.globals.loaderSubscripcion.emit(false);
          })
       }
      }

   esta:any
    async exportar4(){
      var estatu = this.formSearchOperacion.value.estatus

      if(this.operacion != null){
       this.esta = this.operacion.idEstatus
      }
      if(this.totalOperaciones != null){
       this.esta = estatu || 0
      }


    try{
      await this.consultaTrackingArchivoService.exportarOperacion(this.archivo.idArchivo,this.esta,this.traking.cliente, this.usuarioActual, this.traking.codCliente).then(
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

    async buscarOperacion(){
      var estatu = this.formSearchOperacion.value.estatus
      if( estatu === ''){
        this.open(
          this.translate.instant('modals.catalogoDin.alerta'),
          this.translate.instant('SCB'), 'alert');
        return
      }
    try{
      await this.consultaTrackingArchivoService.buscarOperacion(this.archivo.idArchivo,estatu,this.traking.cliente,this.fillObjectPag(this.page,20)).then(
        async(tabla)=>{
        this.respuestaTabla(tabla)
        this.globals.loaderSubscripcion.emit(false);
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
    refrescar(){
      this.ngOnInit();
    }
    /**
   * Metodo para poder realizar la exportacion de archivos
   */
    regresar(){
      this.consultaTrackingArchivoService.setSaveLocalStorage('operacion', null);
      this.consultaTrackingArchivoService.setSaveLocalStorage('totalOperaciones', null);
      this.router.navigate(['/monitoreo/consultaTracking/consultaArchivo']);
    }
  onClickExportarGC(tipoExportacion: string) {
  if(tipoExportacion === 'xlsx' || tipoExportacion === 'csv'){
    tipoExportacion = 'xls'
  }
  /*this.monitor.exportar(tipoExportacion, expor).then((result: any) => {
      if (result.data) {
        /** Se manda la informacion para realizar la descarga del archivo *
        this.fc.convertBase64ToDownloadFileInExport(result);
        this.open('Éxito', 'Se descargo correctamente el archivo.');
        this.globals.loaderSubscripcion.emit(false);
      } else {
        if (result.code === '404') {
          this.openModalError('Error', result.message);
          this.globals.loaderSubscripcion.emit(false);
        }else{
          this.openModalError('Error', ' Ocurrió un error al realizar la exportación en formato PDF.');
          this.globals.loaderSubscripcion.emit(false);
        }
      }
    });*/
  }

}
