import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GestionMensajeErrorService } from 'src/app/services/administracion/gestion-mensaje-error.service';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mensaje-error',
  templateUrl: './mensaje-error.component.html',
  styleUrls: ['./mensaje-error.component.css'],
})
export class MensajeErrorComponent implements OnInit {
  /** variable de control para saber si se realizo el submit del alta */
  submittedMensajeError = false;

  /**
   * @description Formulario para la busqueda de bancos
   * @type {FormGroup}
   * @memberOf ModificarBancoComponent
   */
  mensajeErrorForm: UntypedFormGroup;

  mensajeError: any;
  idBack: number;
  back: any;
  title: string;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    public gestionMensajeErrorService: GestionMensajeErrorService,
    private globals: Globals,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {
    /** Se inicia el formulario de busqueda */
    this.mensajeErrorForm = this.initializeForm();
  }

  async ngOnInit() {
    this.mensajeError =
      this.gestionMensajeErrorService.getSaveLocalStorage('mensajeError');
    this.mensajeError
      ? (this.title = this.translate.instant(
          'menu.moduloAdministracion.mensajeError.title'
        ))
      : (this.title = this.translate.instant(
          'menu.moduloAdministracion.mensajeError.titleAlta'
        ));
    try {
      await this.gestionMensajeErrorService
        .backend()
        .then(async (backen: any) => {
          this.back = backen;
          this.globals.loaderSubscripcion.emit(false);
        });
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant('modal.msjERRGEN0001Sugerencia')
      );
    }
    try {
      if (this.mensajeError !== null) {
        this.gestionMensajeErrorService
          .idMensaje(this.mensajeError)
          .then((data: any) => {
            this.idBack = data.idBack;
            this.globals.loaderSubscripcion.emit(false);
            this.mensajeErrorForm.patchValue({
              codigoErrorBack: data.codErrBack,
              codigoPayext: data.codErrorH2h,
              mensajeBack: data.mensajeBack,
              mensajeH2H: data.mensajeH2h,
              componente: data.componente,
              origenCodigo: data.idBack,
              activo: data.bandActivo,
              tipoMensaje: data.tipoMensaje,
              banderaFinal: data.bandFinal,
              banderaPendientes: data.bandVerificacion,
              banderaReintentos: data.bandReintento,
              codigoCCBN: data.codCcbn,
            });
            this.esComponenteVacio();

          });
      }

    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant('modal.msjERRGEN0001Sugerencia')
      );
    }
  }

  /**
   * Metodo getter para utilziacion y validacion de formulario
   * en la vista
   */
  get formControl() {
    return this.mensajeErrorForm.controls;
  }

  /**
   * Metodo para poder inicializar el formulario
   */
  private initializeForm() {
    return this.formBuilder.group({
      codigoErrorBack: ['', Validators.required],
      codigoPayext: ['', Validators.required],
      origenCodigo: [''],
      mensajeBack: ['', Validators.required],
      mensajeH2H: ['', Validators.required],
      codigoCCBN: [''],
      componente: [{ value: '', disabled: true }],
      banderaReintentos: [false],
      banderaPendientes: [false],
      banderaFinal: [false],
      activo: [true],
      tipoMensaje: [''],
    });
  }

  limpiar() {
    this.mensajeErrorForm.reset();
  }
  regresar() {
    this.gestionMensajeErrorService.setSaveLocalStorage('mensajeError', null);
    this.router.navigate(['/moduloAdministracion', 'gestionMensajesError']);
  }

  validaCadaCampoObligatorioGuardar() {
    if (this.validar()) {
      this.preguntaGuardar();
    }
  }

  validaCadaCampoObligatorioActualizar() {
    if (this.validar()) {
      this.preguntaActualizar();
    }
  }

  async guardar() {
    this.submittedMensajeError = true;
    /** llenar el objeto con los nuevos valores */

    try {
      const guardar = {
        codErrBack: this.mensajeErrorForm.value.codigoErrorBack,
        codErrorH2h: this.mensajeErrorForm.value.codigoPayext,
        codCcbn: this.mensajeErrorForm.value.codigoCCBN,
        mensajeBack: this.mensajeErrorForm.value.mensajeBack,
        mensajeH2h: this.mensajeErrorForm.value.mensajeH2H,
        componente: 'F',
        bandReintento: this.mensajeErrorForm.value.banderaReintentos,
        bandVerificacion: this.mensajeErrorForm.value.banderaPendientes,
        bandActivo: this.mensajeErrorForm.value.activo,
        bandFinal: this.mensajeErrorForm.value.banderaFinal,
        tipoMensaje: this.mensajeErrorForm.value.tipoMensaje,
        idBack: Number(this.mensajeErrorForm.value.origenCodigo),
      };

      await this.gestionMensajeErrorService
        .guardar(guardar)
        .then(async (response: any) => {
          if (
            response.message ===
            'La información ha sido guardada correctamente.'
          ) {
            this.globals.loaderSubscripcion.emit(false);
            this.regresar();
          }
          if (response.message === 'No fue posible guardar la información.') {
            this.globals.loaderSubscripcion.emit(false);
          }
          if (response.code === '400') {
            this.globals.loaderSubscripcion.emit(false);
            this.open('', response.message, 'error', '');
          }
        });
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant('modal.msjERRGEN0001Sugerencia')
      );
    }
  }

  preguntaGuardar() {
    this.openConfirmGuardarYN(
      this.translate.instant(
        'pantalla.administracion.mensajesError.confirmacionGuardar.Titulo'
      ),
      this.translate.instant(
        'pantalla.administracion.mensajesError.confirmacionGuardar.Observacion'
      )
    );
  }

  preguntaActualizar() {
    this.openConfirmActualizarYN(
      this.translate.instant(
        'pantalla.administracion.mensajesError.confirmacionGuardar.Titulo'
      ),
      this.translate.instant(
        'pantalla.administracion.mensajesError.confirmacionGuardar.Observacion'
      )
    );
  }

  openConfirmGuardarYN(titulo: string, contenido: string) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, 'confirm', ''), hasBackdrop: true
    });
    dialogo.afterClosed().subscribe((result) => {
      if (result === 'ok') {
        this.guardar();
      }
    });
  }

  openConfirmActualizarYN(titulo: string, contenido: string) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(titulo, contenido, 'confirm', ''), hasBackdrop: true
    });
    dialogo.afterClosed().subscribe((result) => {
      if (result === 'ok') {
        this.actualizar();
      }
    });
  }

  async actualizar() {
    this.submittedMensajeError = true;
    /** llenar el objeto con los nuevos valores */
    try {
      const actualizar = {
        codErrBack: this.mensajeErrorForm.value.codigoErrorBack,
        codErrorH2h: this.mensajeErrorForm.value.codigoPayext,
        codCcbn: this.mensajeErrorForm.value.codigoCCBN,
        mensajeBack: this.mensajeErrorForm.value.mensajeBack,
        mensajeH2h: this.mensajeErrorForm.value.mensajeH2H,
        componente: this.mensajeErrorForm.value.componente,
        bandReintento: this.mensajeErrorForm.value.banderaReintentos,
        bandVerificacion: this.mensajeErrorForm.value.banderaPendientes,
        bandActivo: this.mensajeErrorForm.value.activo,
        bandFinal: this.mensajeErrorForm.value.banderaFinal,
        tipoMensaje: this.mensajeErrorForm.value.tipoMensaje,
        idBack: this.mensajeErrorForm.value.origenCodigo,
      };

      await this.gestionMensajeErrorService
        .put(this.mensajeError, actualizar)
        .then(async (response: any) => {
          if (response.code) {
            this.openModalError(
              'Error',
              response.message,
              'error',
              'MENSAJES9999'
            );
            this.globals.loaderSubscripcion.emit(false);
          }
          if (
            response.message ===
            'La información ha sido guardada correctamente.'
          ) {
            this.open(
              this.translate.instant('buzon.msjINFOOKTitulo'),
              this.translate.instant('administracion.mensajeerror.modificado'),
              'info',
              this.translate.instant('administracion.mensajeerror.modificadoCode')
            );
            this.globals.loaderSubscripcion.emit(false);
            this.regresar();
          }
        });
    } catch (e) {
      this.globals.loaderSubscripcion.emit(false);
      this.open(
        this.translate.instant('modal.msjERRGEN0001Titulo'),
        this.translate.instant('modal.msjERRGEN0001Observacion'),
        'error',
        this.translate.instant('modal.msjERRGEN0001Codigo'),
        this.translate.instant('modal.msjERRGEN0001Sugerencia')
      );
    }
  }

  validar() {
    if (this.mensajeErrorForm.value.codigoErrorBack === '') {
      this.open(
        'Error',
        this.translate.instant(
          'pantalla.administracion.mensajesError.validacion.back.Observacion'
        ),
        'error',
        this.translate.instant(
          'pantalla.administracion.mensajesError.validacion.Codigo'
        )
      );
      return false;
    }
    if (this.mensajeErrorForm.value.origenCodigo === '') {
      this.open(
        'Error',
        this.translate.instant(
          'pantalla.administracion.mensajesError.validacion.origen.Observacion'
        ),
        'error',
        this.translate.instant(
          'pantalla.administracion.mensajesError.validacion.Codigo'
        )
      );
      return false;
    }
    if (this.mensajeErrorForm.value.mensajeH2H === '') {
      this.open(
        'Error',
        this.translate.instant(
          'pantalla.administracion.mensajesError.validacion.h2h.Observacion'
        ),
        'error',
        this.translate.instant(
          'pantalla.administracion.mensajesError.validacion.Codigo'
        )
      );
      return false;
    }
    if (this.mensajeErrorForm.value.tipoMensaje === '') {
      this.open(
        'Error',
        this.translate.instant(
          'pantalla.administracion.mensajesError.validacion.tipoMensaje.Observacion'
        ),
        'error',
        this.translate.instant(
          'pantalla.administracion.mensajesError.validacion.Codigo'
        )
      );
      return false;
    }
    return true;
  }

  /**
   *
   * Abrir el modal de error
   */
  openModalError(
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
      ), hasBackdrop: true
    });
  }

  /**
   * @description evento para poder levantar el modal para
   * mostrar los mensajes de sucess o error
   * @param titulo indica si se ejecutara para error o success
   * @param contenido mensaje que se mostrara en el modal
   */
  open(
    titulo: String,
    contenido: String,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    code?: string,
    sugerencia?: string
  ) {
    const dialogo = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        contenido,
        type,
        code,
        sugerencia
      ), hasBackdrop: true
    });
  }

  esComponenteVacio() {
    const { origenCodigo } = this.mensajeErrorForm.value;

    const tmpComp = this.back.find((x:any) => x.idBack == origenCodigo)

    if (tmpComp.nombre === 'H2H') {
      this.mensajeErrorForm.controls['banderaReintentos'].patchValue(false);
      this.mensajeErrorForm.controls['banderaPendientes'].patchValue(false);
      this.mensajeErrorForm.controls['banderaFinal'].patchValue(true);
      this.mensajeErrorForm.controls['banderaPendientes'].disable();
      this.mensajeErrorForm.controls['banderaReintentos'].disable();
      this.mensajeErrorForm.controls['componente'].enable();
    } else {
      this.mensajeErrorForm.controls['banderaPendientes'].enable();
      this.mensajeErrorForm.controls['banderaReintentos'].enable();
      this.mensajeErrorForm.controls['componente'].disable();
      this.mensajeErrorForm.controls['componente'].patchValue('');
    }
  }

  seleccionarBandera(tipoBandera: string) {
    if (tipoBandera != 'banderaReintentos') {
      this.mensajeErrorForm.controls['banderaReintentos'].patchValue(false);
    }
    if (tipoBandera != 'banderaPendientes') {
      this.mensajeErrorForm.controls['banderaPendientes'].patchValue(false);
    }
    if (tipoBandera != 'banderaFinal') {
      this.mensajeErrorForm.controls['banderaFinal'].patchValue(false);
    }
  }
}
