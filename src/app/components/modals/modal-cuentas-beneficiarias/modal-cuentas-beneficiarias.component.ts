import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Component, Inject } from '@angular/core';
import { Globals } from 'src/app/bean/globals-bean.component';

@Component({
  selector: 'app-modal-cuentas-beneficiarias',
  templateUrl: './modal-cuentas-beneficiarias.component.html',
  styleUrls: ['./modal-cuentas-beneficiarias.component.css']
})
export class ModalCuentasBeneficiariasComponent{

  cuentaBeneficiariaForm!: UntypedFormGroup;
  img: string;
  typeTitle: string;
  color: string;
  constructor(public dialogRef: MatDialogRef<ModalCuentasBeneficiariasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    private globals: Globals,
    ) { 
      
    this.cuentaBeneficiariaForm = this.initializeForm(); 
    }

  /***Funcion: realiza la peticion de la exportacion */
  enviar(){
    this.dialogRef.close(this.cuentaBeneficiariaForm.value);
    this.delegateType();
  }

  ngOnInit(){
    this.globals.loaderSubscripcion.emit(false);
    this.delegateType();
  }


  delegateType(){
        this.img = '/assets/img/alerts/ayuda.gif';
        this.typeTitle = "Ayuda";
        this.color = "#1DA8AF";
  }

  /**
   * Metodo para poder inicializar el formulario
   */
  private initializeForm() {
    return this.formBuilder.group({
      radio:['B']
    })
  
  }


}
