import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { GestionConexionContratoService } from 'src/app/services/gestion-buzon/gestion-conexion-contrato.service';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalConfirmacionYNComponent } from 'src/app/components/modals/modal-confirmacion-y-n/modal-confirmacion-y-n.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-configurar-conexion-contrato',
  templateUrl: './configurar-conexion-contrato.component.html'
})
export class ConfigurarConexionContratoComponent implements OnInit {

  banderaHasRows: boolean = false;
  pageSize: number=0;
  tabla:any;
  tablaConexion: any;
  rowsPorPagina: number = 5;
  conexion = 1;
  totalElements:any
  guard=false
  /**
  * @description objeto de parametro para el guardado 
  * de la informacion de respaldo
  */
  nombreProto:any
  consultaData!:any;

   /**
   * @description Formulario para la busqueda de buzones
   * @type {FormGroup}
   * @memberOf ConsultarGestionConexionContratoComponent
  */
   modificargestionConexionContratoForm!: UntypedFormGroup;

  constructor(
    private router:Router,
    public gestionConexionContratoService: GestionConexionContratoService,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    private fc: FuncionesComunesComponent,
    private cd: ChangeDetectorRef,
    private globals: Globals,
    private translate: TranslateService

  ) { 
    this.consultaData = this.gestionConexionContratoService.getSaveLocalStorage('ConexionContrato');
  }

  async ngOnInit() {
    this.gestionConexionContratoService.setSaveLocalStorage('path1',null);
    this.gestionConexionContratoService.setSaveLocalStorage('path2',null);
    this.modificargestionConexionContratoForm = this.initializeForm();

    const modificarConexion = {
      numeroContrato: this.consultaData.numeroContrato,
      codigoCliente: this.consultaData.codigoCliente,
      idContrato: this.consultaData.idContrato
    }

    try{
      await this.gestionConexionContratoService.putGet(modificarConexion).then(
        async (putGet:any) => {
          this.nombreProto  = putGet.protocoloActivo
          this.resultRequest(putGet);
          this.gestionConexionContratoService.setSaveLocalStorage('agregar',putGet);
          this.globals.loaderSubscripcion.emit(false);
      })
    }catch(e){
      this.globals.loaderSubscripcion.emit(false);
      this.open(
              this.translate.instant("modal.msjERRGEN0001Titulo"), 
              this.translate.instant("modal.msjERRGEN0001Observacion"), 
              "error",
              this.translate.instant('modal.msjERRGEN0001Codigo'),
              this.translate.instant("modal.msjERRGEN0001Sugerencia"), 
            );   
           }

    this.tablaConexion = []

    this.banderaHasRows = true
    //this.tabla = this.tablaConexion.slice(0, 5);
  }
  resultRequest(result:any){
    this.tabla= result.protocolos;
    this.totalElements = result.protocolos.length;
    if(this.totalElements > 0){
      this.banderaHasRows = true;
    }else{
      this.banderaHasRows = false;
    }
  }


   /**
   * Metodo para poder inicializar el formulario
   */
   private initializeForm() {
    return this.formBuilder.group({
      numeroContrato: [{value: this.consultaData.numeroContrato, disabled: true}],
      codigoCliente: [{value: this.consultaData.codigoCliente, disabled: true}],
      idContrato: [this.consultaData.idContrato],
    })
  }

  envio:any
  check(check:any, event:any){
    this.envio = {
      "idContrato": this.consultaData.idContrato,
      "idPtclPara": check.idPtclPara,
      "idPtclPath": check.idPtclPath,
      "estatus": check.estatus,
      "numeroContrato": this.consultaData.numeroContrato,
      "codigoCliente": this.consultaData.codigoCliente
    }
    this.openConfirmYN(
      this.translate.instant("administracion.general.tituloConfirmacion"), 
      this.translate.instant("administracion.general.mensajeConfirmacion"), event, check.estadoValor)

    
  }

  openConfirmYN(titulo: string, contenido: string, event:any, valor:any) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, "yesNo"), hasBackdrop: true});
    dialogo.afterClosed().subscribe((result:string) => {
      if (result === 'si') {
        this.gestionConexionContratoService.checkConfi(this.envio).then((check:any)=>{
          this.open(
            this.translate.instant("consultaadmonusuario.msjINF00001Titulo"), 
            this.translate.instant("pantalla.gestion.conexion.observacion.OK00000"), 
            "info",
            this.translate.instant("pantalla.gestion.codigo.observacion.OK00000"), 
            '', 
          );  

        })
      }else{
        if(this.envio.estatus  == 'A'){
          event.target.checked = true
        }else{
          event.target.checked = false
        }
        
      }
  });
  }
  /**
   * @description evento para poder levantar el modal para
   * mostrar los mensajes de sucess o error
   * @param titulo indica si se ejecutara para error o success
   * @param contenido mensaje que se mostrara en el modal
  */
  open(  titulo: String,  contenido: String,  type: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',  code: string,  sugerencia: string) {
    this.dialog.open(ModalInfoComponent, {
    data: new ModalInfoBeanComponents(titulo, contenido, type, code, sugerencia), hasBackdrop: true
  });
}

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.tabla = this.tablaConexion.slice(startItem, endItem); //Retrieve items for page
    this.cd.detectChanges();
  }

  /**
   * Metodo para regresar a la vista de consulta
   * de catalogos y sub catalogos
  */
  regresar(){
    this.router.navigate(['/gestionBuzon','gestionConexionContrato']);
  }

  agregar(){
    this.gestionConexionContratoService.setSaveLocalStorage('configurarParametro',null);
    this.router.navigate(['/gestionBuzon','putGet']);
  }

  modificarParametros(data:any, path1:any, path2:any){
    this.gestionConexionContratoService.setSaveLocalStorage('configurarParametro',data);
    this.gestionConexionContratoService.setSaveLocalStorage('path1',path1);
    this.gestionConexionContratoService.setSaveLocalStorage('path2',path2);
    this.router.navigate(['/gestionBuzon/putGet']);

  }
}
