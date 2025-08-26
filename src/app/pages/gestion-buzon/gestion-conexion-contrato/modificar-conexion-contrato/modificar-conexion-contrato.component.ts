import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { GestionConexionContratoService } from 'src/app/services/gestion-buzon/gestion-conexion-contrato.service';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ActivatedRoute, Router } from "@angular/router";
import { ModalConfirmacionYNComponent } from 'src/app/components/modals/modal-confirmacion-y-n/modal-confirmacion-y-n.component';

import { map, switchMap } from "rxjs/operators";
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modificar-conexion-contrato',
  templateUrl: './modificar-conexion-contrato.component.html',
  styleUrls: ['./modificar-conexion-contrato.component.css']
})
export class ModificarConexionContratoComponent implements OnInit {

  
  banderaHasRows: boolean = false;
   /**
   * @description objeto de parametro para el guardado 
   * de la informacion de respaldo
   */
   consultaData!:any;
   valor:string
   /**
   * @description Formulario para la busqueda de buzones
   * @type {FormGroup}
   * @memberOf ConsultarGestionConexionContratoComponent
  */
  gestionConexionContratoForm!: UntypedFormGroup;

  pageSize: number=0;
  tabla:any;
  tablaConexion: any;
  rowsPorPagina: number = 5;
  conexion = 1;

   /** Identificador del canal. */
   idChannel: number;
   /** Nombre del canal. */
   nombre: string = "";
   /** Descripcion del canal. */
   description: string = "";
   conexionProtocolos:any
   /**
    * Lista de protocolos asociados al canal
    */
   protocolos: any;

  constructor(
    private router:Router,
    public gestionConexionContratoService: GestionConexionContratoService,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private fc: FuncionesComunesComponent,
    private cd: ChangeDetectorRef,
    private globals: Globals,
    private translate: TranslateService
  ) {
    this.consultaData = this.gestionConexionContratoService.getSaveLocalStorage('ConexionContrato');
  }

  ngOnInit(): void {
    
    this.gestionConexionContratoForm = this.initializeForm();
    this.carga();
  }
  async carga(){
    try{
      await this.gestionConexionContratoService.conexionProtocolos(this.gestionConexionContratoForm.value).then(
        async (conexionProtocolos:any) => {
        this.conexionProtocolos = conexionProtocolos
        this.nombre = conexionProtocolos.nombreProtocolo;
        this.protocolos = conexionProtocolos.respuestaProt;
        this.banderaHasRows = true
        this.globals.loaderSubscripcion.emit(false);
      })
    }catch(e){
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        'Error',
        this.translate.instant("OE"),
        'error',
        '',
        ''
      );
    }
  }

  text:string
  envioCheck:any
  check(check:any, protocolo:any, event:any){
    this.envioCheck = {
        "numeroContrato": protocolo.idContratoP,
        "codigoCliente": protocolo.codClienteP,
        "idProtocolo": check.idProtocolo,
        "idRegistro": check.numeroRegistro,
        "tipoProcesamiento": check.tipoProcesamiento,
        "estadoValor": check.estadoValor
    }
    this.openConfirmYN(
      this.translate.instant("administracion.general.tituloConfirmacion"), 
      this.translate.instant("administracion.general.mensajeConfirmacion"), event, check.estadoValor)
    
  }

  /**
   * Metodo para poder inicializar el formulario
   */
  private initializeForm() {
    return this.formBuilder.group({
      numeroContrato: [{value: this.consultaData.numeroContrato, disabled: true}],
      codigoCliente: [{value: this.consultaData.codigoCliente, disabled: true}],
    })
  }

  activarCheck(data:any){
  }

   /**
   * Metodo para regresar a la vista de consulta
   * de catalogos y sub catalogos
  */
   regresar(){
    this.gestionConexionContratoService.setSaveLocalStorage('ConexionContrato',null);
    this.router.navigate(['/gestionBuzon','gestionConexionContrato']);
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.tabla = this.tablaConexion.slice(startItem, endItem); //Retrieve items for page
    this.cd.detectChanges();
  }

  agregarParametros(){
    this.gestionConexionContratoService.setSaveLocalStorage('ModificarParametro',null);
    this.router.navigate(['/gestionBuzon','agregarProtocolo']);
  }

  modificarParametros(modificar:any){
    const dato ={
      "numeroContrato": this.consultaData.numeroContrato,
      "codigoCliente": this.consultaData.codigoCliente,
      "idProtocolo": modificar.parametrosGet[0].idProtocolo,
      "idRegistro": modificar.parametrosGet[0].numeroRegistro,
      "tipoProcesamiento": modificar.parametrosGet[0].tipoProcesamiento
    }
    this.gestionConexionContratoService.setSaveLocalStorage('ModificarParametro',dato);
    this.router.navigate(['/gestionBuzon/modificarProtocolo']);
  }

  openConfirmYN(titulo: string, contenido: string, event:any, valor:any) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, "yesNo"), hasBackdrop: true});
    dialogo.afterClosed().subscribe(result => {

      if (result === 'si') {
        this.gestionConexionContratoService.check(this.envioCheck).then((check:any)=>{
         
          this.carga();
          this.open(
            this.translate.instant("PC"),
          this.translate.instant("LOE"), 'info','EXGC001','');
          
        })
      }else{
        if(this.envioCheck.estadoValor  == 'A'){
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
  open(
    titulo: string,
    obser: string,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    code?: string,
    sug?: string
  ) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, obser, type, code, sug), hasBackdrop: true
    });
  }
}
