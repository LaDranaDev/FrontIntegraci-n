import { Component, ElementRef, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from '../modal-info/modal-info.component';
import { ProductosContratoService } from 'src/app/services/admin-contratos/productos-contrato.service';
import { Globals } from 'src/app/bean/globals-bean.component';


@Component({
  selector: 'app-modal-productos-confirming',
  templateUrl: './modal-productos-confirming.component.html',
  styleUrls: ['./modal-productos-confirming.component.css']
})
export class ModalProductosConfirmingComponent implements OnInit {

  @Input() contratosConfirmingList: any[];
  @Input() buc: number;
  @ViewChild('divSelAll') seleccionaAll: ElementRef;
  @ViewChild('divUnselAll') unSeleccionaAll: ElementRef;
  @ViewChild('tabCatLayouts', { static: false }) tabCatLayouts: ElementRef;

  /** Declaracion de variables y constantes */
  nuevoContrato: string = '';


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public modalRef: MatDialogRef<ModalProductosConfirmingComponent>,
    private translateService: TranslateService,
    private renderer: Renderer2,
    public dialog: MatDialog,
    private service: ProductosContratoService,
    private globals: Globals,
  ) {
    this.contratosConfirmingList = this.data.listaDatos;
    this.buc = this.data.buc;
  }

  openDialog() { }

  ngOnInit(): void { }


  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }


  async addNewContrato() {
    if (this.nuevoContrato.length == 11) {
      if (this.validaNoExisteContrato(this.nuevoContrato)) {
        try {
          await this.service.validaCtaConfirming(this.nuevoContrato, this.buc).then(
            async (result: any) => {
              if (result.numCta) {
                this.contratosConfirmingList = [
                  ...this.contratosConfirmingList, {
                    idContratoConf:"",
                    idProducto:"",
                    numeroContratoConf: result.numeroContratoConf,
                    asignado:true,
                    numCta: result.numCta,
                    divisa: result.divisa,
                    numCtaComision:"",
                    status: "A"
                  }
                ]
              } else {
                this.open(
                  this.translateService.instant('admonContratos.msjERRWS001Titulo'),
                  this.translateService.instant('admonContratos.msjERRWS001Observacion'),
                  'info',
                  this.translateService.instant('admonContratos.msjERRWS001Codigo'),
                  this.translateService.instant('admonContratos.msjERRWS001Sugerencia'),
                )
              }
              this.globals.loaderSubscripcion.emit(false);
              return;
            });
        } catch (error) {
          this.open(
            this.translateService.instant('admonContratos.msjERRWS001Titulo'),
            this.translateService.instant('admonContratos.msjCONT0035Observacion'),
            'info',
            this.translateService.instant('admonContratos.msjCONT0035Codigo'),
            this.translateService.instant('admonContratos.msjERRWS001Sugerencia'),
          )
          this.globals.loaderSubscripcion.emit(false);
          return;
        }

        this.renderer.appendChild(this.tabCatLayouts.nativeElement, `<tr><td><input type='checkbox' id='chk${this.nuevoContrato}' name='${this.nuevoContrato}'  [checked]="contrato.asignado == 'true' ? true : false"  value='${this.nuevoContrato}' class='align-check'> ${this.nuevoContrato} 
           <label for="contrato${this.nuevoContrato}" class="col-form-label col-sm-8 text-style">${this.nuevoContrato}</label>
          </td><tr>`);
        this.validaSeleccionar();
      } else {
        this.open(
          this.translateService.instant('modal.seleccion.productos.titulo.CFERR02'),
          '',
          'info',
          this.translateService.instant('modal.seleccion.productos.codigo.CFERR02'),
          this.translateService.instant('modal.seleccion.productos.sugerencia.CFERR02'),
        )
      }
    } else {
      this.open(
        this.translateService.instant('modal.seleccion.productos.titulo.CFERR01'),
        this.translateService.instant('modal.seleccion.productos.observacion.CFERR01'),
        'info',
        this.translateService.instant('modal.seleccion.productos.codigo.CFERR01'),
        this.translateService.instant('modal.seleccion.productos.sugerencia.CFERR01'),
      )
    }
  }


  validaNoExisteContrato(contrato: string) {
    const found = this.contratosConfirmingList.find(item => item.numeroContratoConf === contrato);
    return found ? false : true;
  }


  /**
   * Metodo para seleccionar un contrato Confirming
   * @param event 
   * @param contrato 
   */
  selContratoConf(event: any, contrato: any) {
    this.getElementoCheck(event, contrato);
  }
  selDivisa(event: any, contrato: any) {
    this.getElementoCheck(event, contrato);
  }

  selCtaEje(event: any, contrato: any) {
    this.getElementoCheck(event, contrato);
  }


  /**
   * Seleccionamos el elemento y lo almacenamos en el arreglo
   * 
   * @param event 
   * @param contrato 
   */
  getElementoCheck(event: any, contrato: any) {
    const { checked, value } = event.target
    this.contratosConfirmingList.find((item: any) => {
      if (item.numeroContratoConf === contrato) {
        item.asignado = "false";
        item.status = "I";
        if (checked) {
          item.status = "A";
          item.asignado = "true";
        }
      }
    });
  }

  /**
   * Metodo para seleccionar / desSeleccionar los elementos Check
   * @param value 
   */
  seleccionarTodo(value: string) {
    var newStatus = 'A';
    if (value === "false") {
      newStatus = 'I';
    }
    // Cambiamos los status del Objeto
    this.contratosConfirmingList.map(item => {
      item.asignado = value;
      item.status = newStatus;
    })
  }



  validaSeleccionar() {
    const btnSel: HTMLElement = this.seleccionaAll.nativeElement
    const btnUnsel: HTMLElement = this.unSeleccionaAll.nativeElement

    const opciones = this.contratosConfirmingList.length
    if (opciones == 0) {
      btnSel.style.display = "none";
      btnUnsel.style.display = "block";
    } else {
      btnSel.style.display = "block";
      btnUnsel.style.display = "none";
    }
  }


  open(
    titulo: string,
    contenido: string,
    type?: any,
    errorCode?: string,
    sugerencia?: string
  ) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        contenido,
        type,
        errorCode,
        sugerencia
      ),
      hasBackdrop: true
    });
  }


  /**
   * Devolvemos la lista de Datos al Cerrar el Formulario
   */
  onClose() {
    this.modalRef.close(this.contratosConfirmingList);
  }


}
