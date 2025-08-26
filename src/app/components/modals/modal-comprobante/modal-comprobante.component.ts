import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalInfoBeanComponents } from '../../../bean/modal-info-bean.component';
import { Globals } from 'src/app/bean/globals-bean.component';

@Component({
  selector: 'app-modal-comprobante',
  templateUrl: './modal-comprobante.component.html',
  styleUrls: ['./modal-comprobante.component.css']
})
export class ModalComprobanteComponent{

  comprobanteForm!: UntypedFormGroup;
  
  constructor(public dialogRef: MatDialogRef<ModalComprobanteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    private globals: Globals,
    ) { 
      
    this.comprobanteForm = this.initializeForm(); 
    }

    img: string;
    typeTitle: string;
    color: string;

  /***Funcion: realiza la peticion de la exportacion */
  enviar(){
    this.dialogRef.close(this.comprobanteForm.value);
  }

  /**
   * Metodo para poder inicializar el formulario
   */
  private initializeForm() {
    return this.formBuilder.group({
      radio:['1']
    })
  
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

}
