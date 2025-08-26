import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { UsuarioOperanteService } from 'src/app/services/usuario-operantes.service';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { ModalConfirmComponent } from 'src/app/components/modals/modal-confirm/modal-confirm.component'; 
import { ModalEditClienteComponent } from 'src/app/components/modals/modal-edit-cliente/modal-edit-cliente.component';
import { ModalDetailsClienteComponent } from 'src/app/components/modals/modal-details-cliente/modal-details-cliente.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Clientes } from 'src/app/models/clientes';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { UntypedFormControl, Validators } from '@angular/forms';
import { ClientesService } from 'src/app/services/open-roads/clientes.service';
import { ModalAddClienteComponent } from 'src/app/components/modals/modal-add-cliente/modal-add-cliente.component';
import { TranslateDefaultParser, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit, OnDestroy {
  /**Bandera que habilita la tabla de clientes */
  mostrarTablaCliente = true;
  /**Bandera que muestra la tabla de roles */
  mostrarTablaRoles= false;
  Identificador='';
  bucCliente='';
  bucNombreCliente='';
  nombreCliente='';
  descripcionCliente='';
  bloqueado=false;
  consultarCliente='';
  opcion!: string;
  codigoContrato='';
  public clientedata:MatTableDataSource<Clientes>;
  clienteSearch:Clientes={
    TXT_NMBR_CLTE: "", NUM_BUC: "",
    usuario: [],
    ID_CLTE_PK: 0,
    ID_USU_FK: 0,
    DSC_CLTE: ''
  };


  index: number | undefined;
  id: number | undefined;
  displayedColumns: string[] = [ 'txt_NMBR_CLTE', 'num_BUC', 'dsc_CLTE','acciones'];
  displayedColumnsRoles: string[] = ['sel', 'perfil'];
  dataSourceRoles = new MatTableDataSource<RolesElement>(ELEMENT_DATA_ROLES);
  //validaciones
  validarNombre = new UntypedFormControl(null, [
    Validators.pattern("/^[a-zA-ZÀ-ú\u00d1 ]*$/")
  ]);
  validarBUC = new UntypedFormControl(null, [
    Validators.pattern("/^[0-9]*$/")
  ]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  sort: any;

  constructor(private route: ActivatedRoute, private globals: Globals,private service: ComunesService,
    public serviceUOP: UsuarioOperanteService,public dialog: MatDialog,private clienteServicio:ClientesService,
    private modalService: MdbModalService, private translate: TranslateService) {

   }


  clickSuscliption: Subscription | undefined;

  ngOnInit(){
    //this.initForm();
    
    this.clickSuscliption = this.service.clickAtion.subscribe((resp:any) => {
      const { codeMenu } = resp;
      if (codeMenu === 1) {
        this.initForm();
      }
    });
  }

  initForm(){
    this.limpiar()
    this.obtenerClientes()
  }

  ngOnDestroy() {
    this.clickSuscliption?.unsubscribe();
  }

  refresh(){
    this.bucCliente='';
    this.bucNombreCliente='';
    this.obtenerClientes();
  }

  obtenerClientes(){
    this.clienteServicio.obtenerLista().then(
      (response:Clientes[])=>{
        this.clientedata = new MatTableDataSource(response);
        this.clientedata.sort = this.sort;
        setTimeout(() => this.clientedata.paginator = this.paginator);
        this.globals.loaderSubscripcion.emit(false);
      }
      
    );
  }

  obtenerClientesSearch(){
    this.clienteSearch.TXT_NMBR_CLTE=this.bucNombreCliente;
    this.clienteSearch.NUM_BUC=this.bucCliente;
    this.clienteServicio.obtenerBusqueda(this.clienteSearch).then(
      (response:Clientes[])=>{
        this.clientedata = new MatTableDataSource(response);
        this.clientedata.sort = this.sort;
        setTimeout(() => this.clientedata.paginator = this.paginator);
        this.limpiar()
        this.globals.loaderSubscripcion.emit(false);
      }
    );
  }

  openModalError(titulo:String,contenido:String, type?:any, errorCode?:string, sugerencia?:string) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo,contenido,type,errorCode,sugerencia), hasBackdrop: true}
      );
  }

    /**Funcion: realiza la consulta de la informacion del cliente */
  consultaDatosCliente(){
    if(this.bucCliente != ""){
        this.service.consultaInformacionCliente(this.bucCliente).then((resp: any) => {
          if(resp.status == "OK00000"){
            this.bucCliente = resp.result.bucCliente;
            this.descripcionCliente=resp.result.descripcion;
            this.nombreCliente= resp.result.nombre;
            this.globals.loaderSubscripcion.emit(false);
          }else{
            this.limpiar();
            this.globals.loaderSubscripcion.emit(false);
          }
        });
    }else{
      this.openModalError(this.translate.instant('pantalla.monitor.validacion.ErrorTitulo'),this.translate.instant('pantalla.monitor.validacion.IngreseNumero.Observacion'),'error');
      this.limpiar();
    }
  }

      /**Funcion que realiza el limpiado de los objetos */
  limpiar(){
    this.bucCliente='';
    this.bucNombreCliente='';
  }

  openConfirm(customerId: number) {
    this.id = customerId;
    const dialogo = this.modalService.open(ModalConfirmComponent,{
      modalClass: 'modal-dialog-centered modal-lg',
      data: {id: customerId}
    });
    dialogo.onClose.subscribe(() => {
      this.obtenerClientes();
    });
  }

  openAdd() {
    const dialogo = this.modalService.open(ModalAddClienteComponent,{
      modalClass: 'modal-dialog-centered modal-lg'
    });
    dialogo.onClose.subscribe(() => {
      this.obtenerClientes();
    });
  }

  openEdit(i: number, id_CLTE_PK: number, txt_NMBR_CLTE: string, num_BUC: string, dsc_CLTE: string) {
    this.id = id_CLTE_PK;
    this.index = i;
    const dialogRef = this.modalService.open(ModalEditClienteComponent, {
      modalClass: 'modal-dialog-centered modal-xl',
      data: {id: id_CLTE_PK, nombre: txt_NMBR_CLTE, descripcion: dsc_CLTE,numboc:num_BUC}
    });
    dialogRef.onClose.subscribe(() => {
      this.obtenerClientes();
    });
  }

  openDetails(i: number, id_CLTE_PK: number, txt_NMBR_CLTE: string, id_USU_FK: string, dsc_CLTE: string) {
    this.id = id_CLTE_PK;
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    const dialogRef = this.modalService.open(ModalDetailsClienteComponent, {
      modalClass: "modal-dialog-centered",
      data: {id: id_CLTE_PK, nombre: txt_NMBR_CLTE, identificador: id_USU_FK, descripcion: dsc_CLTE}
    });

  }

}
export interface RolesElement {
  perfil:string;
}

const ELEMENT_DATA_ROLES: RolesElement[] = [
  {perfil: 'PERFIL PERSONALIZADO ADMINISTRADOR H2H FC'},
  {perfil: 'PERFIL PERSONALIZADO AUTORIZAR H2H FC'},
  {perfil: 'PERFIL PERSONALIZADO CONSULTA H2H FC'},
  {perfil: 'PERFIL PERSONALIZADO REMESAS H2H FC'},
];



