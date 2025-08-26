import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  Canal,
  Cliente,
  clienteTransformacion,
} from 'src/app/models/clienteTransformacion';
import { ClientesService } from 'src/app/services/open-roads/clientes.service';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { ModalInfoComponent } from '../modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/bean/globals-bean.component';

@Component({
  selector: 'app-modal-edit-cliente',
  templateUrl: './modal-edit-cliente.component.html',
  styleUrls: ['./modal-edit-cliente.component.css'],
})
export class ModalEditClienteComponent implements OnInit {
  active!: Boolean;
  Inactive!: Boolean;
  id!: string;
  nombre!: string;
  descripcion!: string;
  numboc!: string;
  validacion!: Boolean;

  //Variables de la tabla, pendientes de editar
  public clteTrnArray: Array<any> = [];
  public selectFO: Array<any> = [];
  public selectFOA: Array<any> = [];
  public selectFD: Array<any> = [];
  public selectFDE: Array<any> = [];
  public selectCA: Array<any> = [];
  public selectCAAdd: Array<any> = [];

  public id_CANL_PK: Canal = [
    {
      id_CANL_PK: 0,
    },
  ];

  public idClte: Cliente = [
    {
      idClte: 0,
    },
  ];

  public cTransformacion: clienteTransformacion = {
    valSent: '',
    canal: this.id_CANL_PK,
    flgBandActi: '',
    cliente: this.idClte,
  };

  public newCteTransf: any = {};
  public editCteTransf: any = {};

  enableEditIndex = null;
  isEditing: boolean = false;
  sort: any;
  //fin de variables

  //validaciones
  validarNumerico = new UntypedFormControl(null, [
    Validators.pattern('/^[0-9]*$/'),
  ]);
  validarANumerico = new UntypedFormControl(null, [
    Validators.pattern('/^[a-zA-ZÀ-ú\u00d1 ]*$/'),
  ]);
  validarSelect = new UntypedFormControl(null, [
    Validators.required,
    Validators.nullValidator,
    Validators.pattern('/^[0-9]*$/'),
  ]);

  constructor(
    public modalRef: MdbModalRef<ModalEditClienteComponent>,
    public dataService: ClientesService,
    public dialog: MatDialog,
    private translateService: TranslateService,
    private globals: Globals
  ) {}

  openModalInfo(
    titulo: String,
    contenido: String,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
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
      ),
      hasBackdrop: true 
    });
  }

  ngOnInit(): void {
    this.active = true;
    this.Inactive = false;
    this.obtenerClienteTransformaciones();
    this.llenaConbosFOrigen();
    this.llenaConbosFOrigenAdd();
    this.llenaComboCanal();
    this.llenaComboCanalA();

    this.globals.loaderSubscripcion.emit(false);
  }

  //obtener transformaciones
  obtenerClienteTransformaciones() {
    this.dataService.obtenerTransfCliente(this.id).then((response: any[]) => {
      this.clteTrnArray = response;
      this.clteTrnArray.sort = this.sort;
    });
  }

  //llenar combo de formato origen
  llenaConbosFOrigen() {
    this.dataService.obtenerFormatoO().then((response: Array<any>[]) => {
      this.selectFO = response;
    });
  }

  //llenar combo de formato origen
  llenaConbosFOrigenAdd() {
    this.dataService.obtenerFormatoO().then((response: Array<any>[]) => {
      this.selectFOA = response;
    });
  }

  //llenar combo de formato origen
  llenaComboCanal() {
    this.dataService.obtenerCanal().then((response: Array<any>[]) => {
      this.selectCA = response;
    });
  }

  llenaComboCanalA() {
    this.dataService.obtenerCanal().then((response: Array<any>[]) => {
      this.selectCAAdd = response;
    });
  }

  //llena combo Formato destino!!!
  llenarComboFD(id: number) {
    this.dataService.obtenerFormatoD(id).then(
      (response: Array<any>[]) => {
        this.selectFD = response;
        this.globals.loaderSubscripcion.emit(false);
      },
      (error: HttpErrorResponse) => {
        this.openModalInfo('Error', error.message, 'error');
        this.globals.loaderSubscripcion.emit(false);
      }
    );
  }

  onAddClientTransformation(): void {
    this.validacion = this.transformarData(
      this.newCteTransf.ID_LYT_IN,
      this.newCteTransf.ID_LYT_OUT
    );
    if (this.validacion == true) {
      this.dataService
        .addClientTransformacion(
          this.newCteTransf.ID_LYT_IN,
          this.newCteTransf.ID_LYT_OUT,
          this.cTransformacion
        )
        .then(
          (response: any) => {
            this.openModalInfo(
              this.translateService.instant(
                'modal.editCliente.msjINF0001Titulo'
              ),
              this.translateService.instant(
                'modal.editCliente.msjINF0001Observacion'
              ),
              'info',
              this.translateService.instant(
                'modal.addCliente.msjERR0001Codigo'
              ),
              this.translateService.instant(
                'modal.addCliente.msjERR0001Sugerencia'
              )
            );
            this.obtenerClienteTransformaciones();
            this.globals.loaderSubscripcion.emit(false);
          },
          (error: HttpErrorResponse) => {
            this.openModalInfo(
              this.translateService.instant(
                'modal.editCliente.msjERR0001Titulo'
              ),
              this.translateService.instant(
                'modal.editCliente.msjERR0001Observacion'
              ),
              'error',
              this.translateService.instant(
                'modal.editCliente.msjINF0001Codigo'
              ),
              this.translateService.instant(
                'modal.editCliente.msjINF0001Sugerencia'
              )
            );
            this.globals.loaderSubscripcion.emit(false);
          }
        );
    } else {
      this.openModalInfo(
        this.translateService.instant('modal.editCliente.msjERR0002Titulo'),
        this.translateService.instant(
          'modal.editCliente.msjERR0002Observacion'
        ),
        'error',
        this.translateService.instant('modal.editCliente.msjERR0002Codigo'),
        this.translateService.instant('modal.editCliente.msjERR0002Sugerencia')
      );
    }
    //recargar tabla
    this.newCteTransf = {};
    this.validacion = false;
  }

  async onEditClientTransformation(
    idTransformacion: number,
    id_lyt_in: number,
    id_lyt_out: number,
    index: number
  ) {
    this.transformarEditarData(index);
    if (idTransformacion.toString().match(/^[0-9]*$/)) {
      await this.dataService
        .editarClientTransformacion(
          idTransformacion,
          id_lyt_in,
          id_lyt_out,
          this.editCteTransf
        )
        .then(
          (response: any) => {
            this.openModalInfo(
              this.translateService.instant('modal.editCliente.msjINF0002Titulo'),
              this.translateService.instant('modal.editCliente.msjINF0002Observacion'),
              'info',
              this.translateService.instant('modal.editCliente.msjINF0002Codigo'),
              this.translateService.instant('modal.editCliente.msjINF0002Sugerencia'),
            );
            this.isEditing = false;
            this.enableEditIndex = null;
            this.obtenerClienteTransformaciones();
            this.globals.loaderSubscripcion.emit(false);
          },
          (error: HttpErrorResponse) => {
            this.openModalInfo(
              this.translateService.instant('modal.editCliente.msjERR0003Titulo'),
              this.translateService.instant('modal.editCliente.msjERR0003Observacion'),
              'error',
              this.translateService.instant('modal.editCliente.msjERR0003Codigo'),
              this.translateService.instant('modal.editCliente.msjERR0003Sugerencia'),
            );
            this.globals.loaderSubscripcion.emit(false);
          }
        );
      //recargar tabla
      this.newCteTransf = {};
    }
  }

  async onDeleteClientTransformation(index: number) {
    await this.dataService
      .obtenerTieneArchivos(index)
      .then((respuesta: any) => {
        if (respuesta == false) {
          this.dataService
            .deleteClientTreansformaciones(index)
            .then((response: any) => {
              this.openModalInfo(
                this.translateService.instant('modal.editCliente.msjINF0003Titulo'),
              this.translateService.instant('modal.editCliente.msjINF0003Observacion'),
              'info',
              this.translateService.instant('modal.editCliente.msjINF0003Codigo'),
              this.translateService.instant('modal.editCliente.msjINF0003Sugerencia'),
              );
              this.obtenerClienteTransformaciones();
              this.globals.loaderSubscripcion.emit(false);
            });
        } else {
          this.openModalInfo(
            this.translateService.instant('modal.editCliente.msjERR0004Titulo'),
            this.translateService.instant('modal.editCliente.msjERR0004Observacion'),
            'error',
            this.translateService.instant('modal.editCliente.msjERR0004Codigo'),
            this.translateService.instant('modal.editCliente.msjERR0004Sugerencia'),
          );
          this.globals.loaderSubscripcion.emit(false);
        }
      });
    //recargar tabla
    //this.obtenerClienteTransformaciones();
    this.newCteTransf = {};
  }

  //cambia la data de la tabla a tipo cliente Transformación
  transformarData(id_lyt_in: number, id_lyt_out: number) {
    if (
      id_lyt_in == 0 ||
      id_lyt_out == 0 ||
      this.newCteTransf.ID_CANAL == 0 ||
      this.newCteTransf.VAL_SENT == 'N'
    ) {
      return false;
    }
    if (
      id_lyt_in == undefined ||
      id_lyt_out == undefined ||
      this.newCteTransf.ID_CANAL == undefined ||
      this.newCteTransf.VAL_SENT == undefined
    ) {
      return false;
    }
    this.id_CANL_PK = { idCanl: this.newCteTransf.ID_CANAL };
    this.cTransformacion.canal = this.id_CANL_PK;

    this.idClte = { idClte: this.id };
    this.cTransformacion.cliente = this.idClte;

    this.cTransformacion.valSent = this.newCteTransf.VAL_SENT;
    if (this.newCteTransf.activo == true) {
      this.cTransformacion.flgBandActi = 'A';
    } else {
      this.cTransformacion.flgBandActi = 'I';
    }
    return true;
  }

  transformarEditarData(index: number) {
    this.id_CANL_PK = { idCanl: Number(this.clteTrnArray[index].ID_CANAL) };
    this.editCteTransf.canal = this.id_CANL_PK;

    if (this.clteTrnArray[index].FLAG == true) {
      this.editCteTransf.flgBandActi = 'true';
    } else {
      this.editCteTransf.flgBandActi = 'false';
    }

    this.editCteTransf.valSent = this.clteTrnArray[index].SENTIDO;
  }

  //llena combo Formato destino Editar!!
  llenarComboFDEditar(id: number) {
    this.dataService.obtenerFormatoD(id).then(
      (response: Array<any>[]) => {
        this.selectFDE = response;
        this.globals.loaderSubscripcion.emit(false);
      },
      (error: HttpErrorResponse) => {
        this.openModalInfo('Error', error.message, 'error');
        this.globals.loaderSubscripcion.emit(false);
      }
    );
  }

  //edita cliente descripción nada más
  async onEditClient(addForm: NgForm) {
    document.getElementById('add-client-form')?.click();
    await this.dataService.editClient(this.id, addForm.value).then(
      (response: any) => {
        this.openModalInfo(
          this.translateService.instant('modal.editCliente.msjINF0004Titulo'),
            this.translateService.instant('modal.editCliente.msjINF0004Observacion'),
            'error',
            this.translateService.instant('modal.editCliente.msjINF0004Codigo'),
            this.translateService.instant('modal.editCliente.msjINF0004Sugerencia'),
        );
        addForm.reset();
        this.modalRef.close();
        this.globals.loaderSubscripcion.emit(false);
      },
      (error: HttpErrorResponse) => {
        this.openModalInfo(
          this.translateService.instant('modal.editCliente.msjERR0005Titulo'),
            this.translateService.instant('modal.editCliente.msjERR0005Observacion'),
            'error',
            this.translateService.instant('modal.editCliente.msjERR0005Codigo'),
            this.translateService.instant('modal.editCliente.msjERR0005Sugerencia'),
        );
        addForm.reset();
        this.globals.loaderSubscripcion.emit(false);
      }
    );
  }

  onCancelClick(): void {
    this.modalRef.close();
  }

  stopEdit(): void {
    this.dataService.updateIssue(this.nombre, this.descripcion, this.numboc);
  }
  //métodos de la tabla
  addFieldValue() {
    this.clteTrnArray.push(this.newCteTransf);
    this.newCteTransf = {};
  }

  //Cambia a modo editar
  switchEditMode(i: any) {
    this.isEditing = true;
    this.enableEditIndex = i;
  }

  save() {
    this.isEditing = false;
    this.enableEditIndex = null;
  }

  deleteFieldValue(index: number) {
    this.clteTrnArray.splice(index, 1);
  }
  //fin de métodos de la tabla
}
