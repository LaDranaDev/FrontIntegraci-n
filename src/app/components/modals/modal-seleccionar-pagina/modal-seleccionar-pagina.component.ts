import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Globals } from 'src/app/bean/globals-bean.component';

@Component({
  selector: 'app-modal-seleccionar-pagina',
  templateUrl: './modal-seleccionar-pagina.component.html',
  styleUrls: ['./modal-seleccionar-pagina.component.css']
})
export class ModalSeleccionarPaginaComponent implements OnInit {
  comprobanteForm!: UntypedFormGroup;
  
  constructor(public dialogRef: MatDialogRef<ModalSeleccionarPaginaComponent>,
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

