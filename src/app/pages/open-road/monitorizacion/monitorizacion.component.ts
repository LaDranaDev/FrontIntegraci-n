import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MonitorizacionService } from 'src/app/services/open-roads/monitorizacion.service';
import { ActivatedRoute } from '@angular/router';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { UsuarioOperanteService } from 'src/app/services/usuario-operantes.service';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ComunesService } from 'src/app/services/comunes.service';
import { ModalConfirmComponent } from 'src/app/components/modals/modal-confirm/modal-confirm.component'; 
import {ArchivoDiario} from 'src/app/models/archivodiario';
import { Subscription } from 'rxjs';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  element: string;
  symbol: string;
}


@Component({
  selector: 'app-monitorizacion',
  templateUrl: './monitorizacion.component.html',
  styleUrls: ['./monitorizacion.component.css']
})
export class MonitorizacionComponent implements OnInit, OnDestroy {
  /**Bandera que habilita la tabla de clientes */
  mostrarTablaCliente = true;
  /**Bandera que muestra la tabla de roles */
  mostrarTablaRoles= false;
  bloqueado=false;
  opcion!: string;
  codigoContrato='';
  NombreArchivo='';
  NombreCanal='';
  Sentido='';
  NombreCliente='';
  Formatodeentrada='';
  Estado='';
  Formatodesalida='';

  public fieldArray: Array<any> = [];
  public selectCl: Array<any> = []; 
  public selectFO: Array<any> = [];
  public selectFS: Array<any> = [];
  public selectCanal: Array<any> = [] 
  public selectEstado: Array<any> = []
  public newAttribute: any = {};
  enableEditIndex=null;
  isEditing: boolean = false;
  public archivodiariodata:MatTableDataSource<ArchivoDiario>;
  ArchivoDiarioSearch:ArchivoDiario={
    ID_ARCH_PK:0, 
    TXT_NMBR_ARCH:'',
    ESTADO:'',
    FCH_FECH_REG:'',
    CANAL: '',
    SENTIDO: '', 
    CLIENTE: '', 
    DESC_MAPA_IN: '',
    DESC_MAPA_OUT: ''
  };

  
  displayedColumns: string[] = ['ID_ARCH_PK','SENTIDO','CLIENTE','TXT_NMBR_ARCH','DESC_MAPA_IN','DESC_MAPA_OUT','CANAL','ESTADO','FCH_FECH_REG'];
  displayedColumnsRoles: string[] = ['sel', 'perfil'];
  dataSourceRoles = new MatTableDataSource<RolesElement>(ELEMENT_DATA_ROLES);
  

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  sort: any;

  constructor(private route: ActivatedRoute, private globals: Globals,private service: ComunesService,
    public serviceUOP: UsuarioOperanteService,public dialog: MatDialog,private archivodiarioServicio:MonitorizacionService) {

   }

   clickSuscliption: Subscription | undefined;

   ngOnInit(){
     //this.initForm();
     
     this.clickSuscliption = this.service.clickAtion.subscribe((resp:any) => {
      const { codeMenu } = resp;
      if (codeMenu === 3) {
        this.initForm();  
      }
     });
   }

   initForm(){
    this.limpiar();
    /***Se recupera el parametro de la url */
    this.obtenerArchivoDiario();
    this.llenaConboscliente();
    this.llenaConbosFOrigen();
    this.llenaConboscanal();
    this.llenaConbosestado();
    this.llenaConbosFSalida();
    this.globals.loaderSubscripcion.emit(false);
   }
 
   ngOnDestroy() {
     this.clickSuscliption?.unsubscribe();
   }


  limpiar(){

    this.NombreArchivo='';
  
    this.NombreCanal='';
  
    this.Sentido='';
  
    this.NombreCliente='';
  
    this.Formatodeentrada='';
  
    this.Estado='';
  
    this.Formatodesalida='';

    this.obtenerArchivoDiario();

    this.globals.loaderSubscripcion.emit(false);
  
  }

  //llenar combo de formato origen
  llenaConbosFOrigen(){
    this.archivodiarioServicio.obtenerFormatoO().then(
      (response:Array<any>[])=>{
        this.selectFO = response;
      }
    );
  }

  //llenar combo de formato salida
  private llenaConbosFSalida(){
    this.archivodiarioServicio.obtenerFormatoS().then(
      (response:Array<any>[])=>{
        this.selectFS = response;
      }
    );
  }

  //llenar combo cliente
  llenaConboscliente(){
    this.archivodiarioServicio.obtenerclientes().then(
      (response:Array<any>[])=>{
        this.selectCl = response;
      }
    );
  }

  //llenar combo canal
  llenaConboscanal(){
    this.archivodiarioServicio.obtenercanal().then(
      (response:Array<any>[])=>{
        this.selectCanal = response;
      }
    );
  }

  //llenar combo estado
  llenaConbosestado(){
    this.archivodiarioServicio.obtenerestado().then(
      (response:Array<any>[])=>{
        this.selectEstado = response;
      }
    );
  }
  obtenerArchivoDiario():void{
    this.archivodiarioServicio.obtenerListaArchivoDiario().then(
      (response:ArchivoDiario[])=>{
        this.archivodiariodata = new MatTableDataSource(response);
        this.archivodiariodata.sort = this.sort;
        setTimeout(() => this.archivodiariodata.paginator = this.paginator);
      }
    );
  }

  public obtenerArchivoDiarioSearch(){
    this.ArchivoDiarioSearch.TXT_NMBR_ARCH=this.NombreArchivo;
    this.ArchivoDiarioSearch.CANAL=this.NombreCanal;
    this.ArchivoDiarioSearch.SENTIDO=this.Sentido;
    this.ArchivoDiarioSearch.CLIENTE=this.NombreCliente;
    this.ArchivoDiarioSearch.DESC_MAPA_IN=this.Formatodeentrada;
    this.ArchivoDiarioSearch.ESTADO=this.Estado;
    this.ArchivoDiarioSearch.DESC_MAPA_OUT=this.Formatodesalida;
    this.archivodiarioServicio.obtenerArchivoDiario(this.ArchivoDiarioSearch).then(
      (response:ArchivoDiario[])=>{
        this.archivodiariodata = new MatTableDataSource(response);
        this.archivodiariodata.sort = this.sort;
        setTimeout(() => this.archivodiariodata.paginator = this.paginator);
        this.globals.loaderSubscripcion.emit(false);
      }
    );
  }

  openModalError(titulo:String,contenido:String, type?:any, errorCode?:string, sugerencia?:string){
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo,contenido,type,errorCode,sugerencia), hasBackdrop: true}
      );
  }

  openConfirm(customerId: string) {
    const dialogo = this.dialog.open(ModalConfirmComponent);
    dialogo.afterClosed().subscribe(result => {
      if (result) {
        
      }
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

