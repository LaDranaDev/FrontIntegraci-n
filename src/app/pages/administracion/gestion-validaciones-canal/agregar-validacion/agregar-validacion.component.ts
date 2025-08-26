import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Globals } from 'src/app/bean/globals-bean.component';
import { MatDialog } from '@angular/material/dialog';
import { GestionValidacionCanalService } from 'src/app/services/administracion/gestion-validacion-canal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import {
  GestionValidacionesCanal,
  RequestToSaveEdit,
} from 'src/app/interface/consultaValidacionesCanal.interface';
import { TranslateService } from '@ngx-translate/core';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';

@Component({
  selector: 'app-agregar-validacion',
  templateUrl: './agregar-validacion.component.html',
  //styleUrls: ['./agregar-validacion.component.css']
})
export class AgregarValidacionComponent implements OnInit {
  formControlNuevaValidaciones: UntypedFormGroup = new UntypedFormGroup({});
  ce: { idCatalogo: string; descripcion: string }[] = [];
  isNew: boolean = false;
  dataSelected: GestionValidacionesCanal;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private globals: Globals,
    public dialog: MatDialog,
    private gestionService: GestionValidacionCanalService,
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private fc: FuncionesComunesComponent
  ) {}

  async ngOnInit(): Promise<void> {
    this.formControlNuevaValidaciones = this.initializeForm();
    await this.codigoError();
    this.route.queryParams.subscribe((r) => {
      this.dataSelected = r as GestionValidacionesCanal;
      if (r['idValidacion']) {
        this.isNew = false;
      } else {
        this.isNew = true;
      }
    });
    this.globals.loaderSubscripcion.emit(false);
    if (!this.isNew) {
      this.patchForm();
    }
  }

  async codigoError(): Promise<void> {
    const getCodErr = await this.gestionService.CE();
    this.ce = getCodErr;
    this.globals.loaderSubscripcion.emit(false);
  }

  /**
   * @description Metodo para poder inicializar el formulario y regresar dicho
   * formulario
   */
  private initializeForm() {
    return this.formBuilder.group({
      clave: [''],
      descripcion: [''],
      ce: [''],
      idValidacion: '',
    });
  }
  onClickLimpiar() {
    this.formControlNuevaValidaciones.reset();
    this.formControlNuevaValidaciones.get('ce')?.setValue('');
  }
  async guardar(): Promise<void> {
    if (this.formControlNuevaValidaciones.value.clave !== '' || null) {
      if (this.formControlNuevaValidaciones.value.descripcion !== '' || null) {
        if (this.formControlNuevaValidaciones.value.ce !== '' || null) {
          let validacion: RequestToSaveEdit = {
            clave: this.formControlNuevaValidaciones.value.clave,
            descripcion: this.formControlNuevaValidaciones.value.descripcion,
            idMsg: this.formControlNuevaValidaciones.value.ce,
          };
          if (!this.isNew) {
            validacion.idValidacion = this.dataSelected.idValidacion;
          } else {
          }
          const saveValidation = await this.gestionService.guardarValidacion(
            validacion,
            this.isNew
          );
          this.globals.loaderSubscripcion.emit(false);
          this.open(
            this.translateService.instant('pantalla.archivo.consulta.msjERR005Titulo'),
            saveValidation.message,
            'info',
            this.translateService.instant('gestionValidaciones.msjOKC0007Codigo')
          );
          this.formControlNuevaValidaciones.reset();
          this.regresar();
        } else {
          this.open(
            this.translateService.instant(
              'pantalla.moduloAdministracion.consultaValidacionesCanal.CamposVacios'
            ),
            this.translateService.instant(
              'modal.comun.mensaje.noCodError'
            ),
            'alert',
            this.translateService.instant(
              'modals.sucursales.alerta.campo.cp.vacio.VAL003Codigo'
            )
          );
        }
      } else {
        this.open(
          this.translateService.instant(
            'pantalla.moduloAdministracion.consultaValidacionesCanal.CamposVacios'
          ),
          this.translateService.instant(
            'modal.comun.mensaje.campos.descripcion'
          ),
          'alert',
          this.translateService.instant(
            'pantalla.moduloAdministracion.consultaValidacionesCanal.CamposVacios.INF00015Codigo'
          )
        );
      }
    } else {
      this.open(
        this.translateService.instant(
          'pantalla.moduloAdministracion.consultaValidacionesCanal.CamposVacios'
        ),
        this.translateService.instant('modal.comun.mensaje.campos.clave'),
        'alert',
        this.translateService.instant(
          'pantalla.moduloAdministracion.consultaValidacionesCanal.CamposVacios.INF00015Codigo'
        )
      );
    }
  }
  regresar() {
    this.router.navigate(
      ['/moduloAdministracion', 'gestionValidacionesCanal'],
      {
        queryParams: {
          idProducto: this.dataSelected.idProducto,
          idLayout: this.dataSelected.idLayout,
          asignado: this.dataSelected.asignado,
          getConsult: this.dataSelected.getConsult,
        },
      }
    );
  }

  open(
    titulo: String,
    contenido: String,
    prefij?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    errorCode?: string,
    sugerencia?: string
  ): void {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        contenido,
        prefij,
        errorCode,
        sugerencia
      ), hasBackdrop: true
    });
  }

  patchForm(): void {
    const getidCE = this.ce.find(
      (v) => v.descripcion === this.dataSelected.mensaje
    );
    this.formControlNuevaValidaciones.patchValue({
      clave: this.dataSelected.validacion,
      descripcion: this.dataSelected.descripcion,
      ce: getidCE?.idCatalogo,
      idValidacion: this.dataSelected.idValidacion,
    });
  }

  eventoPaste(event: ClipboardEvent): boolean {
    let textPasted = event.clipboardData?.getData('text') || '';
    let flag = true;
    for (let i = 0; i < textPasted.length; i++) {
      if (!this.fc.textoCopy(textPasted[i].charCodeAt(0))) {
        i = textPasted.length;
        flag = false;
      }
    }
    return flag;
  }

  disableEvent(event: any): boolean {
    event.preventDefault();
    return false;
  }
}
