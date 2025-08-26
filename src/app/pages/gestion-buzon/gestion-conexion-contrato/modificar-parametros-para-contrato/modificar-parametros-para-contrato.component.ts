import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GestionConexionContratoService } from 'src/app/services/gestion-buzon/gestion-conexion-contrato.service';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { MatDialog } from '@angular/material/dialog';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalConfirmComponent } from 'src/app/components/modals/modal-confirm/modal-confirm.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modificar-parametros-para-contrato',
  templateUrl: './modificar-parametros-para-contrato.component.html',
  styleUrls: ['./modificar-parametros-para-contrato.component.css']
})
export class ModificarParametrosParaContratoComponent implements OnInit{
  
  result:any;
  datos: any;
  paramsGet: any[] = [];
  paramsPut: any[] = [];
  idProtocol: number;
  paramNames: string[] = [];
  /**
   * @description Formulario para la busqueda de buzones
   * @type {FormGroup}
   * @memberOf ConsultarGestionConexionContratoComponent
  */
  parametrosContratoForm!: UntypedFormGroup;
  modifica = false;
  constructor(
    public gestionConexionContratoService: GestionConexionContratoService,
    private formBuilder: UntypedFormBuilder,
    private router:Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private globals: Globals,
    private fc: FuncionesComunesComponent,
    private translate: TranslateService

  ) {
  }

  protocolo:any
  productoSeleccionado:any;
  modi:any
  protocoloTodo:any
  async ngOnInit() {
    this.datos = this.gestionConexionContratoService.getSaveLocalStorage('ConexionContrato');
    this.result = this.gestionConexionContratoService.getSaveLocalStorage('ModificarParametro');
    const consultarProtocolo = {
      "numeroContrato": this.datos.numeroContrato,
       "codigoCliente": this.datos.codigoCliente
    }
    try{
      await this.gestionConexionContratoService.protocolo(consultarProtocolo).then(
        async (protoco:any) =>{
        this.protocolo = protoco.respuestaProt
        this.protocoloTodo = protoco
        this.productoSeleccionado = protoco.idProt.toString()
        this.globals.loaderSubscripcion.emit(false);
      }) 

      this.data()
    }catch(e){
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant("pantalla.modificar.contrato.titulo.ERGC002"), 
        this.translate.instant('antalla.modificar.contrato.observacion.ERGC002'),
        'error',
        this.translate.instant('pantalla.modificar.contrato.codigo.ERGC002'),
        this.translate.instant('pantalla.modificar.contrato.sugerencia.ERGC002')
        )   
    }
  }

  async data(){
    try{
      if(this.result !== null){
        this.gestionConexionContratoService.modificar(this.result).then((modi:any)=>{
          this.globals.loaderSubscripcion.emit(false);
          this.modi = modi;
          this.activa = true
          this.modifica = true;
          for (const protocol of modi.respuestaProt) {
            if (Number(this.productoSeleccionado) == protocol.idProtocolo) {
              this.changeProtocol(protocol);
              this.activa = true
              this.globals.loaderSubscripcion.emit(false);
              break;
            }
          }
        })
      }
    }catch(e){
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant("pantalla.configurar.contrato.titulo.ERGC001"), 
        this.translate.instant('pantalla.configurar.contrato.observacion.ERGC001'),
        'error',
        this.translate.instant('pantalla.configurar.contrato.codigo.ERGC001'),
        this.translate.instant('pantalla.configurar.contrato.sugerencia.ERGC001')
        )       }
  }


  /**
   * Metodo que obtiene el producto seleccionado
   */
  activa= false
  valueChange(event:any){
    this.productoSeleccionado = event.target.value;
    this.activa = true
    this.modifica = false
    for (const protocol of this.protocolo) {
      if (Number(this.productoSeleccionado) == protocol.idProtocolo) {
        this.changeProtocol(protocol);
        this.globals.loaderSubscripcion.emit(false);
        return;
      }
    }
  }
  
  nombre:any
  changeProtocol(protocol: any) {
    this.idProtocol = protocol.idProtocolo;
    this.paramNames = protocol.nombreParametros
    this.paramsGet = protocol.parametrosGet;
    this.paramsPut = protocol.parametrosPut;
  }

  validarParametro(event: KeyboardEvent) {
    var valida = "/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzñÑ1234567890-_*. ";
    return valida.indexOf(event.key) >= 0;
  }


  enviar:any
  async guardarProto() {
    for(const z of this.paramsGet){
      z.tipoProcesamiento = 'GET'
    }for(const x of this.paramsPut){
      x.tipoProcesamiento = 'PUT'
    }
    const params = (this.paramsGet || []).concat(this.paramsPut || []);
    /*if (params.some(p => p.obliParametro == 1 && !p.valorParametro)) {
      this.open("Error",  this.translate.instant("obligarotio.azul"), "error", "VAL001", "");
      return;
    }*/
     const dialogo = this.dialog.open(ModalInfoComponent, {
       data: new ModalInfoBeanComponents(this.translate.instant("confirm"), this.translate.instant("administracion.general.mensajeConfirmacion"), "confirm"), hasBackdrop: true
     });
     dialogo.afterClosed().subscribe(async result => {
       if (result) {
        this.enviar = {
          "numeroContrato": this.datos.numeroContrato,
          "codigoCliente":  this.datos.codigoCliente,
          "idProtocolo":  this.productoSeleccionado ,
          "idRegistro": 0,
          "tipoProcesamiento": "",
          "parametrosGetPut": params
        }
        try{
          await this.gestionConexionContratoService.guardar(this.enviar).then(
            async (response:any) => {
            this.globals.loaderSubscripcion.emit(false);
            this.open(
              this.translate.instant("pantalla.configurar.contrato.titulo.EXGC001"), 
              this.translate.instant('pantalla.configurar.contrato.observacion.EXGC001'),
              'info',
              this.translate.instant('pantalla.configurar.contrato.codigo.EXGC001'),
              this.translate.instant('pantalla.configurar.contrato.sugerencia.EXGC001')
              )   
              this.cancelar();
          })
        }catch(e){
          this.globals.loaderSubscripcion.emit(false);
          this.open(
            this.translate.instant("pantalla.modificar.contrato.titulo.ERGC010"), 
            this.translate.instant('pantalla.modificar.contrato.observacion.ERGC010'),
            'info',
            this.translate.instant('pantalla.modificar.contrato.codigo.ERGC010'),
            this.translate.instant('pantalla.modificar.contrato.sugerencia.ERGC010')
            )   
        }
       }
     });
   
  }

  async actualizaPro() {
    for(const z of this.paramsGet){
    }
    const params = (this.paramsGet || []).concat(this.paramsPut || []);
    if (params.some(p => p.obliParametro == 1 && !p.valorParametro)) {
      this.open("Error", this.translate.instant("obligarotio.azul"), "error", "VAL001", "");
      return;
    }
     const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(this.translate.instant("confirm"), this.translate.instant("administracion.general.mensajeConfirmacion"), "confirm"), hasBackdrop: true
     });
     dialogo.afterClosed().subscribe(async result => {
       if (result) {
        this.enviar = {
          "numeroContrato": this.datos.numeroContrato,
          "codigoCliente":  this.datos.codigoCliente,
          "idProtocolo":this.productoSeleccionado ,
          "idRegistro": this.modi.idRegistro,
          "tipoProcesamiento": "",
          "parametrosGetPut": params
        }
        try{
          await this.gestionConexionContratoService.guardar(this.enviar).then(
            async (response:any) => {
            this.globals.loaderSubscripcion.emit(false);
            this.open(
              this.translate.instant("pantalla.configurar.contrato.titulo.EXGC001"), 
              this.translate.instant('pantalla.configurar.contrato.observacion.EXGC001'),
              'info',
              this.translate.instant('pantalla.configurar.contrato.codigo.EXGC001'),
              this.translate.instant('pantalla.configurar.contrato.sugerencia.EXGC001')
              )   
            this.cancelar();
          })
        }catch(e){
          this.globals.loaderSubscripcion.emit(false);
          this.open(
            this.translate.instant("pantalla.modificar.contrato.titulo.ERGC009"), 
            this.translate.instant('pantalla.modificar.contrato.observacion.ERGC009'),
            'error',
            this.translate.instant('pantalla.modificar.contrato.codigo.ERGC009'),
            this.translate.instant('pantalla.modificar.contrato.sugerencia.ERGC009')
            )           }
       }
     });
   
  }

  disableEvent(event:any) {
    event.preventDefault();
    return false;
  }

  /**
   * Evento para al momento de realizar el pegado
   * en cualquier input este evento no ocurra
   */
  eventoOnPasteBlock(event: ClipboardEvent) {
    return false;
  }


  /**
   * Evento para poder validar que el campo solo
   * se puedan ingresar alphabeto, numeros
   */
  caracteresEspeciales(event: KeyboardEvent) {
    this.fc.especial(event);
  }

  /**
   * Evento para poder validar que el campo solo
   * se puedan ingresar alphabeto, numeros
   */
  num(event: KeyboardEvent) {
    this.fc.numeros(event);
  }

  open(  titulo: String,  contenido: String,  type: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',  code: string,  sugerencia: string) {
      this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, type, code, sugerencia), hasBackdrop: true
    });
  }

  cancelar(){
    this.gestionConexionContratoService.setSaveLocalStorage('ModificarParametro',null);
    this.router.navigate(['gestionBuzon/modificarConexionContrato']);
  }
  
  limpiar(){
    for (let paramGet of this.paramsGet) {
      paramGet.valorParametro = '';
    }
    for (let paramPut of this.paramsPut) {
      paramPut.valorParametro = '';
    }
  }

}
