import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NewField } from 'src/app/interface/consultaValidacionesCanal.interface';
import { GestionValidacionCanalService } from 'src/app/services/administracion/gestion-validacion-canal.service';
import { GestionValidacionesCanal } from '../../../../interface/consultaValidacionesCanal.interface';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { MatDialog } from '@angular/material/dialog';
import { ComunesService } from 'src/app/services/comunes.service';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-agregar-campo',
  templateUrl: './agregar-campo.component.html',
  //styleUrls: ['./agregar-campo.component.css']
})
export class AgregarCampoComponent implements OnInit {
  formNewField: FormGroup;
  type = [
    { name: 'Detalle', value: 'D' },
    { name: 'Sumario', value: 'S' },
    { name: 'Encabezado', value: 'E' },
    { name: 'Swift', value: 'MT' },
  ];
  showDefinitionField: boolean = false;
  validations: { idCatalogo: string; descripcion: string }[] = [];
  isNew: boolean = false;
  dataSelected: GestionValidacionesCanal;
  dataProductLayout = {
    idProduct: '',
    idLayout: '',
  };
  constructor(
    private fb: FormBuilder,
    private gestionValidacionService: GestionValidacionCanalService,
    private globals: Globals,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private commonFunctions: FuncionesComunesComponent,
    private translateService: TranslateService,
    private fc: FuncionesComunesComponent
  ) {}

  async ngOnInit(): Promise<void> {
    this.buildForm();
    this.route.queryParams.subscribe((r) => {
      this.dataSelected = r as GestionValidacionesCanal;
      if (r['idValidacion']) {
        this.isNew = false;
      } else {
        this.dataProductLayout = {
          idProduct: r['idProducto'],
          idLayout: r['idLayout'],
        };
        this.isNew = true;
      }
    });
    this.validations =
      await this.gestionValidacionService.getValidacionesCampo();
    this.globals.loaderSubscripcion.emit(false);
    if (!this.isNew) {
      this.patchForm();
    }
  }

  buildForm() {
    this.formNewField = this.fb.group<NewField>({
      clave: '',
      descripcion: '',
      numero: '',
      posInicial: '',
      posFinal: '',
      idValidacion: '',
      tipo: '',
      idProductoCampo: '',
      idLayoutCampo: '',
      id: '',
    });
  }

  async saveEditCampoValidacion(): Promise<void> {
    const saveRequest = this.formNewField.getRawValue();

    try {
      if (this.showDefinitionField) {
        saveRequest.numero = '0';
        saveRequest.posFinal = '0';
      }
      const formValid = this.validationsMessage(saveRequest);
      if (!formValid) return;
      if (this.isNew) {
        delete saveRequest.id;
        saveRequest.idProductoCampo = this.dataProductLayout.idProduct;
        saveRequest.idLayoutCampo = this.dataProductLayout.idLayout;
      } else {
        saveRequest.idProductoCampo = this.dataSelected.idProductoCampo;
      }
      const responseSaveField =
        (await this.gestionValidacionService.saveValidationFiel(
          saveRequest,
          this.isNew
        )) as { message: string; error: string };

      if (responseSaveField?.error !== 'OK00000') {
        this.open(
          this.translateService.instant('modal.msjERRGEN0001Titulo'),
          responseSaveField?.message,
          'error'
        );
        this.globals.loaderSubscripcion.emit(false);
        return;
      }
      this.open(
        this.translateService.instant('pantalla.archivo.consulta.msjERR005Titulo'),
        responseSaveField.message,
        'info',
        this.translateService.instant('gestionValidaciones.msjOKC0007Codigo'),
      );
      this.back();
      this.globals.loaderSubscripcion.emit(false);
    } catch (error) {
      this.open(
        this.translateService.instant('modal.msjERRGEN0001Titulo'),
        this.translateService.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translateService.instant('modal.msjERRGEN0001Codigo'),
        this.translateService.instant('modal.msjERRGEN0001Sugerencia')
      );
    }
  }

  patchForm() {
    this.formNewField.patchValue({
      clave: this.dataSelected.validacion,
      descripcion: this.dataSelected.descripcion,
      numero: this.dataSelected.numero,
      posInicial: this.dataSelected.posFinal,
      posFinal: this.dataSelected.posFinal,
      idValidacion: this.dataSelected.idValidacion,
      tipo: this.dataSelected.tipoCampo,
      idProductoCampo: this.dataSelected?.idProducto as string,
      idLayoutCampo: this.dataSelected.idLayoutCampo,
      id: this.dataSelected.id,
    });
  }

  resetFrom(): void {
    if (this.isNew) {
      this.formNewField.reset();
    } else {
      this.formNewField.get('clave')?.reset();
      this.formNewField.get('descripcion')?.reset();
      this.formNewField.get('numero')?.reset();
      this.formNewField.get('posInicial')?.reset();
      this.formNewField.get('posFinal')?.reset();
      this.formNewField.get('idValidacion')?.reset();
      this.formNewField.get('tipo')?.reset();
    }
  }

  back(): void {
    this.formNewField.reset();
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
  ) {
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

  num(event: KeyboardEvent) {
    this.commonFunctions.numeros(event);
  }

  getValueType() {
    const getValueSelectType = this.formNewField.get('tipo')?.value as string;
    this.formNewField.get('numero')?.setValue('');
    this.formNewField.get('posFinal')?.setValue('');
    this.showDefinitionField = getValueSelectType === 'MT' ? true : false;
  }

  validationsMessage(request: NewField): boolean {
    if (!request.clave) {
      this.open(
        this.translateService.instant(
          'pantalla.moduloAdministracion.consultaValidacionesCanal.CamposVacios'
        ),
        this.translateService.instant('modal.comun.mensaje.campos.clave'),
        'alert',
        this.translateService.instant(
          'modal.comun.mensaje.campos.tipo.VAL001Codigo'
        )
      );
      return false;
    }

    if (!request.tipo) {
      this.open(
        this.translateService.instant(
          'pantalla.moduloAdministracion.consultaValidacionesCanal.CamposVacios'
        ),
        this.translateService.instant('modal.comun.mensaje.campos.tipo'),
        'alert',
        this.translateService.instant(
          'modals.sucursales.alerta.campo.latitud.vacio.VAL004Codigo'
        )
      );
      return false;
    }

    if (!request.idValidacion) {
      this.open(
        this.translateService.instant(
          'pantalla.moduloAdministracion.consultaValidacionesCanal.CamposVacios'
        ),
        this.translateService.instant('modal.comun.mensaje.campos.validacion'),
        'alert',
        this.translateService.instant(
          'modal.comun.mensaje.campos.tipo.VAL007Codigo'
        )
      );
      return false;
    }

    if (!request.descripcion) {
      this.open(
        this.translateService.instant(
          'pantalla.moduloAdministracion.consultaValidacionesCanal.CamposVacios'
        ),
        this.translateService.instant('modal.comun.mensaje.campos.descripcion'),
        'alert',
        this.translateService.instant(
          'modal.comun.mensaje.campos.tipo.VAL002Codigo'
        )
      );
      return false;
    }

    if (!request.posInicial) {
      this.open(
        this.translateService.instant(
          'pantalla.moduloAdministracion.consultaValidacionesCanal.CamposVacios'
        ),
        this.translateService.instant(
          `modal.comun.mensaje.campos.${
            !this.showDefinitionField ? 'posIn' : 'definicion'
          }`
        ),
        'alert',
        this.translateService.instant(
          'modal.comun.mensaje.campos.tipo.VAL002Codigo'
        )
      );
      return false;
    }

    if (!request.numero && !this.showDefinitionField) {
      this.open(
        this.translateService.instant(
          'pantalla.moduloAdministracion.consultaValidacionesCanal.CamposVacios'
        ),
        this.translateService.instant('modal.comun.mensaje.campos.numero'),
        'alert',
        this.translateService.instant(
          'modal.comun.mensaje.campos.tipo.VAL003Codigo'
        )
      );
      return false;
    }

    if (!request.posFinal && !this.showDefinitionField) {
      this.open(
        this.translateService.instant(
          'pantalla.moduloAdministracion.consultaValidacionesCanal.CamposVacios'
        ),
        this.translateService.instant('modal.comun.mensaje.campos.posFin'),
        'alert',
        this.translateService.instant(
          'modal.comun.mensaje.campos.tipo.VAL006Codigo'
        )
      );
      return false;
    }
    return true;
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
}
