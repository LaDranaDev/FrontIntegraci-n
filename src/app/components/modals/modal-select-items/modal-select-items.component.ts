import { Component, ElementRef, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from '../modal-info/modal-info.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-modal-select-items',
  templateUrl: './modal-select-items.component.html',
  styleUrls: ['./modal-select-items.component.css']
})
export class ModalSelectItemsComponent implements OnInit {

  @Input() contratosConfirmingList: any[];
  @Input() idContrato: number;
  @Input() idProducto: number;
  @ViewChild('divSelAll') selAll: ElementRef;
  @ViewChild('divUnselAll') unSelAll: ElementRef;
  @ViewChild('tabCatLayouts', { static: false }) tabCatLayouts: ElementRef;


  constructor(
    public modalRef: MdbModalRef<ModalSelectItemsComponent>,
    public dialog: MatDialog,
    private translateService: TranslateService,
    private renderer: Renderer2

  ) {

  }

  ngOnInit() {


  }


  nuevoContrato: string = '';
  getValue(event: Event): string {

    return (event.target as HTMLInputElement).value;
  }

  agregarNuevoContrato(): any {


    if (this.nuevoContrato.length == 11) {
      if (this.validaNoExisteContrato(this.nuevoContrato)) {

        this.contratosConfirmingList = [
          ...this.contratosConfirmingList,
          {
            idContratoConf: this.idContrato,
            idProducto: this.idProducto,
            numeroContratoConf: this.nuevoContrato,
            asignado: 'true',
            numCta: "M",
            divisa: "M",
            numCtaComision: "87654321",
            status: "A"
          }
        ]

        this.renderer.appendChild(this.tabCatLayouts.nativeElement, `<tr><td><input type='checkbox' id='chk${this.nuevoContrato}' name='${this.nuevoContrato}'  [checked]="contrato.asignado == 'true' ? true : false"  value='${this.nuevoContrato}' class='align-check'> ${this.nuevoContrato} 
           <label for="contrato${this.nuevoContrato}" class="col-form-label col-sm-8 text-style">${this.nuevoContrato}</label>
          </td><tr>`)
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
      return false;
    }
  }

  validaNoExisteContrato(contrato: string) {
    const found = this.contratosConfirmingList.find(item => item.numeroContratoConf === contrato);
    return found ? false : true;
  }

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
        if(checked) {
          item.status = "A";
          item.asignado = "true";
        }
      }
    });
  }

  
  validaSeleccionar() {
    const btnSel: HTMLElement = this.selAll.nativeElement
    const btnUnsel: HTMLElement = this.unSelAll.nativeElement

    const opciones = this.contratosConfirmingList.length
    if (opciones == 0) {
      //$('selTodoCnfmngDiv'+idProducto).attr('style','display:none;');
      btnSel.style.display = "none";
      btnUnsel.style.display = "block";
    } else {
      btnSel.style.display = "block";
      btnUnsel.style.display = "none";
      //$('selTodoCnfmngDiv'+idProducto).attr('style','display:block;');
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

  onClose() {
    this.modalRef.close( this.contratosConfirmingList )
  }

  selectAll(value: string) {
    this.contratosConfirmingList.map(item => {
      item.asignado = value
    })
  }
}
