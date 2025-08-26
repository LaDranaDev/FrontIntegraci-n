import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { GestionBancos } from 'src/app/interface/gestionBancosRespuesta.interface';
import { CpService } from 'src/app/services/administracion/cp.service';

@Component({
  selector: 'app-alta-codigo-postal',
  templateUrl: './alta-codigo-postal.component.html',
  styleUrls: ['./alta-codigo-postal.component.css']
})
export class AltaCodigoPostalComponent implements OnInit {

  /** variable de control para saber si se realizo el submit del alta */
  submittedAltaCP = false;
/**
 * @description Formulario para la busqueda de bancos
 * @type {FormGroup}
 * @memberOf ModificarBancoComponent
*/
altaCPForm: UntypedFormGroup;

claveBanco:any

statusNum : number;
cpValue:any
edit:boolean = false
pageNameTitle: boolean;
constructor(
  private fc:FuncionesComunesComponent,
  private formBuilder: UntypedFormBuilder,
  private router:Router,
  private globals: Globals,
  public dialog: MatDialog,
  public cp: CpService,
  private translate: TranslateService
  ) {
      /** Se inicia el formulario de busqueda */
      this.altaCPForm = this.initializeForm();
  }

  /**
   * Metodo para poder inicializar el formulario
   */
private initializeForm() {
  return this.formBuilder.group({
    codigoPostal:['',Validators.required],
    latitud:['',Validators.required],
    longitud:['',Validators.required],
    sucursal:['',Validators.required],
    calculoAutomatico:[''],
    direccion:[''],
  })
}
  ngOnInit(): void {
    this.cpValue = this.cp.getSaveLocalStorage('cp');
    let titulo ='Alta'
    if(this.cpValue !== null){
      titulo = 'Modificación'
      this.edit = true
      this.altaCPForm.patchValue({
        codigoPostal:[this.cpValue.cp],
        sucursal:this.cpValue.sucursal,
        calculoAutomatico:this.cpValue.calculo === 'A' ? true : false,
        direccion: this.cpValue.direccion,
      })
      if(this.altaCPForm.value.calculoAutomatico == true){
        this.altaCPForm.get('sucursal')?.disable();
      }
      this.altaCPForm.get('codigoPostal')?.disable();
      this.altaCPForm.get('direccion')?.disable();
    }else{
      this.edit = false
    }
    this.pageNameTitle = true;
    this.pageNameTitle = this.edit ? false : this.pageNameTitle;

  }

  cambioCalculo(cambio:any, editar:any){
    if(editar === true){
      if(cambio.target.checked == true){
        this.altaCPForm.get('sucursal')?.disable();
      }else{
        this.altaCPForm.get('sucursal')?.enable();
      }
    }
  }

  /**
* Metodo getter para utilziacion y validacion de formulario
* en la vista
*/
get formControlCP() {
  return this.altaCPForm.controls;
}

/**
* Metodo para regresar a la vista de consulta
* de bancos
*/
regresarToConsult(){
this.router.navigate(['/moduloAdministracion','codigosPostales']);
}

guardar(){
  this.submittedAltaCP = true;
  if(this.altaCPForm.value.codigoPostal !== ''){
    this.guar();
  }else if(this.altaCPForm.value.sucursal !== '' ){
      this.guar();
  } else {
    this.altaCPForm = this.initializeForm();
  }
}

async guar(){
  const cpvalue = {
    "cp":this.altaCPForm.value.codigoPostal,
    "latitud":this.altaCPForm.value.latitud,
    "longitud":this.altaCPForm.value.longitud,
    "sucursal":this.altaCPForm.value.sucursal,
    "calculo":this.altaCPForm.value.calculoAutomatico === true ? 'A' : 'I'
    }

    try{
      this.cp.guardarCp(cpvalue).then((result:any) => {
        if(result.error == 'ER00001'){
          this.globals.loaderSubscripcion.emit(false);
          this.open('',this.translate.instant('pantalla.administracion.mensajesError.CP.ER00001Observacion'), 'alert',this.translate.instant('pantalla.administracion.mensajesError.CP.ER00001Codigo'));
          this.altaCPForm = this.initializeForm();
        }else{
          this.globals.loaderSubscripcion.emit(false);
          this.router.navigate(['/moduloAdministracion','codigosPostales']);
          this.cp.setSaveLocalStorage('cpActualizado', cpvalue);
        }
      })
    }catch(e){
      this.globals.loaderSubscripcion.emit(false);
      this.open(this.translate.instant('modal.msjERRGEN0001Titulo'),this.translate.instant('modal.msjERRGEN0001Observacion'),'error',this.translate.instant('modal.msjERRGEN0001Codigo'),this.translate.instant('modal.msjERRGEN0001Sugerencia'));
    }
}

async actualizar(){
  if(this.altaCPForm.value.sucursal === ''){
    this.open('ERR03', this.translate.instant('pantalla.administracion.mensajesError.CP.Observacion'), 'alert');
    this.ngOnInit()
    return
  }
  const cpValue2 = {
    "cp":this.cpValue.cp,
    "sucursal":this.altaCPForm.value.sucursal || this.cpValue.sucursal,
    "sucursalAnt":this.cpValue.sucursal,
    "calculo":this.altaCPForm.value.calculoAutomatico === true ? 'A' : 'I'
    }

    try{
      await this.cp.updateCp(cpValue2).then(
        async (result:any) => {
        if(result.error == "ER00000"){
          this.globals.loaderSubscripcion.emit(false);
          this.open('Error',result.message,'error');
        }else{
          this.globals.loaderSubscripcion.emit(false);
          this.router.navigate(['/moduloAdministracion','codigosPostales']);
          this.cp.setSaveLocalStorage('cpActualizado', cpValue2);
        }
      })
    }catch(e){
      this.globals.loaderSubscripcion.emit(false);
      this.open(this.translate.instant('modal.msjERRGEN0001Titulo'),this.translate.instant('modal.msjERRGEN0001Observacion'),'error',this.translate.instant('modal.msjERRGEN0001Codigo'),this.translate.instant('modal.msjERRGEN0001Sugerencia'));
    }
}
 /**
   * @description evento para poder levantar el modal para
   * mostrar los mensajes de sucess o error
   * @param titulo indica si se ejecutara para error o success
   * @param contenido mensaje que se mostrara en el modal
  */

 open(titulo: String,
  contenido: String,
  type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
  code?: string,
  sugerencia?: string) {
  this.dialog.open(ModalInfoComponent, {
    data: new ModalInfoBeanComponents(titulo, contenido, type, code, sugerencia), hasBackdrop: true
  }
  );
}


}
