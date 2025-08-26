import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Subscription } from 'rxjs';
import { DatosCuentaBeanComponent } from 'src/app/bean/datos-cuenta-bean.component';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ConsultaContratosUsuarioService } from 'src/app/services/admin-contratos/consulta-contratos-usuario.service';
import { ComunesService } from 'src/app/services/comunes.service';
import { UsuarioOperanteService } from 'src/app/services/admin-contratos/usuario-operantes.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-consulta-contratos-usuario',
  templateUrl: './consulta-contratos-usuario.component.html',
  styleUrls: ['./consulta-contratos-usuario.component.css']
})
export class ConsultaContratosUsuarioComponent implements OnInit,OnDestroy {

  banderaHasRows: boolean = false;
  pageSize: number=0;
  tabla:any;
  tablaConexion: any;
  rowsPorPagina: number = 5;
  conexion = 1;
  banderaTabla = false
  /**Se inicializa componente*/
  datosContrato: DatosCuentaBeanComponent = { numContrato: "",bucCliente: "",descEstatus: "",nombreCompleto: "",
    personalidad: "",cuentaEje: "",idContrato: "",razonSocial: ""
  };
   /**
   * @description Formulario para la busqueda de buzones
   * @type {FormGroup}
   * @memberOf ConsultarGestionConexionContratoComponent
  */
   consultaContratosUsuarioForm!: UntypedFormGroup;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private fc: FuncionesComunesComponent,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private service: ComunesService,
    private globals: Globals,
    private translate: TranslateService,
    private consultaContratosUsuarioService: ConsultaContratosUsuarioService,
    private usuarioOperanteService: UsuarioOperanteService,
    private translateService: TranslateService,
    private router: Router,
  ) { }

  clickSuscliption: Subscription | undefined;

  ngOnInit(){
    this.initForm();

    this.clickSuscliption = this.service.clickAtion.subscribe((resp:any) => {
      const { codeMenu } = resp;
      if (codeMenu === 20) {
        this.initForm();
      }
    });
  }

  initForm(){
    this.consultaContratosUsuarioForm = this.initializeForm();
    this.tabla= [];
    this.banderaHasRows= false;
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }
  limpiar(){
    this.consultaContratosUsuarioForm.reset();
    this.tabla= [];
    this.banderaHasRows= false;
  }

  /**
   * Metodo para poder inicializar el formulario
   */
  private initializeForm() {
    return this.formBuilder.group({
      nombreUsuario: [{value: null, disabled: true}],
      codigoCliente: [{value: null, disabled: false}],
    })
  }

  data:any

  /**Funcion: realiza la consulta de la informacion del cliente */
  async consultaDatosCliente(){
    var tam = this.consultaContratosUsuarioForm.controls['codigoCliente'].value.length == 8
    if(this.consultaContratosUsuarioForm.controls['codigoCliente'].value != "" && tam){

      // await this.service.consultaInformacionCliente(this.consultaContratosUsuarioForm.controls['codigoCliente'].value).then(
      await this.usuarioOperanteService.recuperarDatosDeBucODH1({ 'buc': String(this.consultaContratosUsuarioForm.controls['codigoCliente'].value)}).then(
        async (resp: any) => {
        if(resp.buc == null || resp.buc === ""){
          this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(
                this.translateService.instant('modals.inexistente.usuarioOperantes.titulo'),
                this.translateService.instant('modals.inexistente.usuarioOperantes.descripcion'),
                'error',
                this.translateService.instant('modals.inexistente.usuarioOperantes.codigo'),
                this.translateService.instant('modals.inexistente.usuarioOperantes.sugerencia')
            ),
          });
          this.globals.loaderSubscripcion.emit(false);
        }else{
          this.data = resp;
          this.consultaContratosUsuarioForm.patchValue({nombreUsuario: resp.razonSocial + " " + resp.apellidoPaterno + resp.apellidoMaterno,
            codigoCliente: resp.buc});
          this.globals.loaderSubscripcion.emit(false);
        }
      })

    }else{
      alert("Favor de ingresar un número de cliente");
      this.limpiar();
    }
  }

  envio:any
  async buscarData(){
    if (this.consultaContratosUsuarioForm.controls['codigoCliente'].value == null || this.consultaContratosUsuarioForm.controls['codigoCliente'].value.length != 8) {
      this.openModalError(
        this.translate.instant('admonContratos.msjCTERR14Titulo'),
        this.translate.instant('admonContratos.msjCTERR14Observacion'),
        'info',
        this.translate.instant('admonContratos.msjCTERR14Codigo'),
        this.translate.instant('admonContratos.msjCTERR14Sugerencia')
      )
      return;
    }
    this.envio = {
      "codigoClienteBuc": this.data.buc,
      "nombreUsuario": this.data.razonSocial,
      "usr": localStorage.getItem('UserID')
    }
      await this.consultaContratosUsuarioService.consultaContratos(this.envio).then(
        async (resp:any) =>{
          
        if(resp.codeError === '200' || resp.contratosAsignados){
          
          this.banderaTabla = true;
          this.banderaHasRows=resp.contratosAsignados.length>0;
          this.tabla=resp.contratosAsignados;
          this.globals.loaderSubscripcion.emit(false);
        }else{
          this.openModalError(
            this.translate.instant('administracion.gestionCanales.ERGC011.Titulo'),
            this.translate.instant('administracion.gestionCanales.ERGC011.Observacion'),
            'error',
            this.translate.instant('administracion.gestionCanales.ERGC011.Codigo'),
            this.translate.instant('administracion.gestionCanales.ERGC011.Sugerencia')
          )
          this.globals.loaderSubscripcion.emit(false);
        }
      });
  }


  /**
   * Metodo para solo ingrese numeros
   * en el input de numero de contrato
   */
  eventOnlyNumbers(event: KeyboardEvent) {
    this.fc.numberOnly(event);
  }


  /**
   * @description evento para el evento de pegar en un input
   */
  onPaste(event: ClipboardEvent) {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let i = 0; i < textPasted.length; i++) {
      if (!this.fc.numberOnlyForPasteEvent(textPasted[i].charCodeAt(0))) {
        i = textPasted.length;
        flag = false;
      }
    }
    return flag;
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.tabla = this.tablaConexion.slice(startItem, endItem); //Retrieve items for page
    this.cd.detectChanges();
  }

  /**
   * Abrir el modal de exportar los datos
   */
  openModal(){
    const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
    dialogo.afterClosed().subscribe(result => {
      if (result) {
        this.onClickExportarGC(result,this.envio);
      }
    });
  }

   /**
   *
   * Abrir el modal de error
   */
   openModalError(titulo:String,contenido:String, type?: any, code?: string, sugerencia?: string){
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo,contenido,type,code,sugerencia), hasBackdrop: true }
      );
  }

   /**
   * @description evento para poder levantar el modal para
   * mostrar los mensajes de sucess o error
   * @param titulo indica si se ejecutara para error o success
   * @param contenido mensaje que se mostrara en el modal
  */
   open(titulo: string, contenido: string) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido), hasBackdrop: true 
    }
    );
  }

  /**
   * Metodo para poder realizar la exportacion de archivos
   */

  async onClickExportarGC(tipoExportacion: string, data:any) {
    if(tipoExportacion === 'xlsx' || tipoExportacion === 'csv'){
      tipoExportacion = 'xls'
    }
 
    await this.consultaContratosUsuarioService.exportarContratoUsuario(tipoExportacion, data).then(
      async (result: any) => {
        if (result.data) {
          /** Se manda la informacion para realizar la descarga del archivo */
          this.fc.convertBase64ToDownloadFileInExport(result);
          this.globals.loaderSubscripcion.emit(false);
        } else {
          if (result.code === '404') {
            this.openModalError('Error', result.message, 'error');
            this.globals.loaderSubscripcion.emit(false);
          }else{
            this.openModalError(
              this.translate.instant('modals.gestionComprobantes.error'),
              this.translate.instant('administracion.contratos.export.msjERR000Titulo'),
              'error',
              '',
              '',
            );
            this.globals.loaderSubscripcion.emit(false);
          }
        }
      });
  }

  envioDatos(contrato:any){
    this.service.datosContratoObtenido(true);
    this.service.otro(true);
    //revisar el envio de datos cambio la estructura
    this.service.setSaveLocalStorage('activarProducto', true);
    this.datosContrato.numContrato=contrato.cuentaOperante;
    this.datosContrato.bucCliente=contrato.bucContrato;
    this.datosContrato.idContrato=contrato.idCntr;
    this.datosContrato.idEstatus=contrato.idEstatus;
    this.datosContrato.razonSocial=contrato.razSocial;
    this.datosContrato.cuentaEje=contrato.cuentaEje;
    this.router.navigateByUrl(`/admin-contratos/productos/${btoa(JSON.stringify(this.datosContrato))}`);
  }

  validarTamanioBuc(field: string) {
    const value = this.consultaContratosUsuarioForm.controls['codigoCliente'].value;
    const tamanio = value.length;
    const relleno = 8 - tamanio;
    this.consultaContratosUsuarioForm.controls['codigoCliente'].setValue(
      (tamanio > 0) ?  '0'.repeat(relleno) + value : value
    );
  }

}
