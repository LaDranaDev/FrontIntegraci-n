import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GestionMensajeErrorService } from 'src/app/services/administracion/gestion-mensaje-error.service';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-detalle-mensaje-error',
  templateUrl: './detalle-mensaje-error.component.html',
  //styleUrls: ['./detalle-mensaje-error.component.css']
})
export class DetalleMensajeErrorComponent implements OnInit {

/**
 * @description Formulario para la busqueda de bancos
 * @type {FormGroup}
 * @memberOf ModificarBancoComponent
*/
mensajeErrorForm: UntypedFormGroup;

mensajeError:any
idBack:number
back:any
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router:Router,
    public gestionMensajeErrorService: GestionMensajeErrorService,
    private globals: Globals,
    public dialog: MatDialog,
    private route: ActivatedRoute,
  ) { 
    /** Se inicia el formulario de busqueda */
    this.mensajeErrorForm = this.initializeForm();
  }


  async ngOnInit() {
    this.mensajeError = this.gestionMensajeErrorService.getSaveLocalStorage('mensajeError');
    try{
      await this.gestionMensajeErrorService.backend().then(
        async (backen:any) => {
        this.back = backen
        this.globals.loaderSubscripcion.emit(false);
      });
    }catch(e){
      this.globals.loaderSubscripcion.emit(false);
      this.open('Error', 'Error al obtener los backends', 'error')
    }
    try{
      if(this.mensajeError !== null){
        this.gestionMensajeErrorService.idMensaje(this.mensajeError).then((data:any) => {
          this.idBack = data.idBack
          this.globals.loaderSubscripcion.emit(false);
          this.mensajeErrorForm.patchValue({
            codigoErrorBack: data.codErrBack,
            codigoPayext: data.codErrorH2h,
            mensajeBack: data.mensajeBack,
            mensajeH2H: data.mensajeH2h,
            componente:data.componente,
            origenCodigo: data.idBack,
            activo: data.bandActivo,
            tipoMensaje: data.tipoMensaje,
            banderaFinal:data.bandFinal,
            banderaPendientes:data.bandVerificacion,
            banderaReintentos:data.bandReintento,
            codigoCCBN:data.codCcbn
        })
      });
      }
    }catch(e){
      this.globals.loaderSubscripcion.emit(false);
      this.open('Error', 'Error al obtener los detalles del mensaje', 'error')
    }
  }

private initializeForm() {
  return this.formBuilder.group({
    codigoErrorBack:[{value:'', disabled:true}],
    codigoPayext:[{value:'', disabled:true}],
    origenCodigo:[{value:'', disabled:true}],
    mensajeBack:[{value:'', disabled:true}],
    mensajeH2H:[{value:'', disabled:true}],
    codigoCCBN:[{value:'', disabled:true}],
    componente: [{value:'', disabled:true}],
    banderaReintentos:[{value:'', disabled:true}],
    banderaPendientes:[{value:'', disabled:true}],
    banderaFinal:[{value:'', disabled:true}],
    activo:[{value:'', disabled:true}],
    tipoMensaje:[{value:'', disabled:true}]
  })
}

regresar(){
  this.gestionMensajeErrorService.setSaveLocalStorage('mensajeError', null);
  this.router.navigate(['/moduloAdministracion','gestionMensajesError']);

}
open(titulo: String,
  contenido: String,
  type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
  code?: string,
  sugerencia?: string){
  const dialogo = this.dialog.open(ModalInfoComponent, {
    data: new ModalInfoBeanComponents(titulo, contenido, type, code, sugerencia), hasBackdrop: true}
  );
}

}
