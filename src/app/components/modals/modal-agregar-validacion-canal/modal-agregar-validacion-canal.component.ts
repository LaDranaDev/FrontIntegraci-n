import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';


@Component({
  selector: 'app-modal-agregar-validacion-canal',
  templateUrl: './modal-agregar-validacion-canal.component.html',
  styleUrls: ['./modal-agregar-validacion-canal.component.css']
})
export class ModalAgregarValidacionCanalComponent {

  validacionForm!: UntypedFormGroup;
  idNew: boolean = false;
  color = '#1DA8AF';
  img = '/assets/img/alerts/ayuda.gif'
  constructor(public dialogRef: MatDialogRef<ModalAgregarValidacionCanalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { edit: boolean},
    private formBuilder: UntypedFormBuilder
    ) { 
      this.idNew = this.data ? false : true
      this.validacionForm = this.initializeForm(); 
    }

  /***Funcion: realiza la peticion de la exportacion */
  enviar(){
    this.dialogRef.close(this.validacionForm.value);
  }

  /**
   * Metodo para poder inicializar el formulario
   */
  private initializeForm() {
    return this.formBuilder.group({
      radio:[this.idNew ? 1 : 3]
    })
  
  }


}
