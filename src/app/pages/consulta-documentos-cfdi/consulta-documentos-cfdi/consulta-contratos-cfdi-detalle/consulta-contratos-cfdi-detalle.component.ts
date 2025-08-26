import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ConsultaDocumentosCFDIService } from 'src/app/services/consulta-documentos-cfdi/consulta-documentos-cfdi.service';

@Component({
  selector: 'app-consulta-contratos-cfdi-detalle',
  templateUrl: './consulta-contratos-cfdi-detalle.component.html',
})
export class ConsultaContratosCfdiDetalleComponent implements OnInit {
  /**
   * @description Formulario para la busqueda de las cuentas beneficiarias
   * @type {FormGroup}
   * @memberOf CuentasBeneficiariasContratosComponent
   */

  @Output() isBack: EventEmitter<boolean> = new EventEmitter();
  @Input() requestDetail: {
    contratoConfirmingCfdi: string;
    fechaInicioCfdi: string | Date;
    fechaFinCfdi: string | Date;
    numDocumentoClienteCfdi: string;
  };
  @Input() documentodetalle: any

  constructor(
    private consultaDocService: ConsultaDocumentosCFDIService,
    private globals: Globals
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.requestDetail.fechaInicioCfdi = format(
        this.requestDetail.fechaInicioCfdi as Date,
        'yyyy-MM-dd'
      );
      this.requestDetail.fechaFinCfdi = format(
        this.requestDetail.fechaFinCfdi as Date,
        'yyyy-MM-dd'
      );
      this.globals.loaderSubscripcion.emit(false);
    } catch (error) {
      this.globals.loaderSubscripcion.emit(false);
    }
  }

  /**
   * Metodo para regresar a la pantalla anterior
   */
  regresar() {
    /** Se hace el redirect a la vista de alta */
    this.isBack.emit(true);
  }
}
