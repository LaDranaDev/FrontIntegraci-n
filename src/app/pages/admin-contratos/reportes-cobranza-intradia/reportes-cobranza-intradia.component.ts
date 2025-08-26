import { Component, AfterViewInit, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DatosCuentaBeanComponent } from 'src/app/bean/datos-cuenta-bean.component';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalExportacionComponent } from 'src/app/components/modals/modal-exportacion/modal-exportacion.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import {
  ConfigReportIntadia,
  ContentCuentasIntradia,
  ContratCuentas,
  HoraiosIntradia,
  ListaCanales,
  ListaFormatos,
  LstclaconesIntradia,
} from 'src/app/models/reports-intradia';
import { ConfigReporCobranzaIntradiaService } from 'src/app/services/admin-contratos/config-repor-cobranza-intradia.service';
import { ComunesService } from 'src/app/services/comunes.service';

@Component({
  selector: 'app-reportes-cobranza-intradia',
  templateUrl: './reportes-cobranza-intradia.component.html',
  styleUrls: ['./reportes-cobranza-intradia.component.css'],
})
export class ReportesCobranzaIntradiaComponent implements OnInit {
  dataContract: DatosCuentaBeanComponent;
  hourSelected: string = '';
  claconSelected: string = '';
  showFileButton = false;
  listHours: HoraiosIntradia[] = [];
  listHoursSelected: HoraiosIntradia[] = [];
  listClacones: LstclaconesIntradia[] = [];
  listClaconesSelected: LstclaconesIntradia[] = [];
  listCanales: ListaCanales[] = [];
  listFormats: ListaFormatos[] = [];
  listCuentas: ContentCuentasIntradia[] = [];
  /** pagination **/
  pageIndex = 1;
  pageIndex1 = 1;
  pageCount = 1;
  formReportsIntradia: FormGroup = new FormGroup({});
  cantFilesRadioConsolid = 'A';
  optTipoContenido = '';
  disableFormByCancel = false;
  archivoSelected: any;


  listHorasSelectedIzquierda: string[] = [];
    listCuentasSelectedIzquierda: string[] = [];
    cuentasIzquierdas: string[] = [];
    /** contiene las horas seleccionadas */
    listHorasSelectedDerecha: string[] = [];
    listCuentasSelectedDerecha: string[] = [];
    cuentasDerechas: string[] = [];
    /** Lista que contiene las horas */
    listHorasFirstSelect: any = [];
    listCuentasFirstSelect: any = [];
    listHorasFirstSelectRespaldo: any = [];
    listCuentasFirstSelectRespaldo: any = [];
      listHorasSecondSelect: any = [];
    listHorasSecondSelectRespaldo: any = [];
    listCuentasSecondSelect: any = [];
    listCuentasSecondSelectRespaldo: any = [];
  
  clickSuscliption: Subscription | undefined;
  bandCierre: boolean;
  optClaAbono: boolean;
  optClaCarg: boolean;
  chkSigN: boolean;
  idFormatoMT940: number;
  idFormatoMT942: any;
  idCanalSwiftFin: string;
  idFormatoRepCobTXT: string;
  idCanalREPAL: string;
  valorRecArcxCta: string;
  constructor(
    private commonService: ComunesService,
    public dialog: MatDialog,
    private translateService: TranslateService,
    private reportIntradiaService: ConfigReporCobranzaIntradiaService,
    private globals: Globals,
    private fb: FormBuilder,
    private fc: FuncionesComunesComponent,
    
  ) {}

  async ngOnInit(): Promise<void> {
    this.clickSuscliption = this.commonService.clickAtion.subscribe(async (resp: any) => {
      const { codeMenu } = resp;
      if (codeMenu === 9) {
        this.dataContract = this.commonService.datosContrato;
        if (
          this.dataContract.descEstatus === 'CANCELADO' ||
          this.dataContract.descEstatus === 'INACTIVO'
        ) {
          this.disableForm();
        }
        this.getConfigContra();
      }
    });
  }
  async ngAfterViewInit(): Promise<void> {
    await this.getConfigContra();
  }

  getClientData(): any {
    return this.commonService.datosContrato;
  }

  addNewCuenta() {
    if (!this.listCuentasSelectedIzquierda.length) {
        this.open(
            this.translateService.instant('modals.edoCuentaConsolidado.error.title'),
            this.translateService.instant('modals.edoCuentaConsolidado.error.bodyIzq'),
            'alert',
            this.translateService.instant('modals.edoCuentaConsolidado.error.codeIzq'),
            this.translateService.instant('modals.edoCuentaConsolidado.error.sugerencia'),
        );
    } else {
        if (this.listCuentasSelectedIzquierda.indexOf('-1') >= 0) {
            this.validateAndAddCuentaToRigthSideSelectedTodos();
        } else {
            this.validateAndAddCuentaToRigthWithOutSelectedTodos();
        }
    }
  }

  removeCuenta() {
    if (!this.listCuentasSelectedDerecha.length) {
        this.open(
            this.translateService.instant('modals.edoCuentaConsolidado.error.title'),
            this.translateService.instant('modals.edoCuentaConsolidado.error.bodyDer'),
            'alert',
            this.translateService.instant('modals.edoCuentaConsolidado.error.codeDer'),
            this.translateService.instant('modals.edoCuentaConsolidado.error.sugerencia'),
        );
    } else {
        if (this.listCuentasSelectedDerecha.indexOf('-1') >= 0) {
            this.validateAndRemoveCuentaToRigthSideSelectedTodos();
        } else {
            this.validateAndRemoveCuentaToRigthWithOutSelectedTodos();
        }
    }
}

validateAndRemoveCuentaToRigthSideSelectedTodos() {
  //Se selecciono la opcion todos
  var listadoCuentasRemove: any = [];
  var listCuentasRemoveUntilExist: any = [];
  for (var i = 0; i < this.listCuentasSecondSelect.length; i++) {
      var objRigthtHora = this.listCuentasSecondSelect[i];
      listCuentasRemoveUntilExist.push(objRigthtHora);
      var banderaExist = false;
      for (var j = 0; j < this.listCuentasFirstSelect.length; j++) {
          var objLeftHora = this.listCuentasFirstSelect[j];
          if (
              objRigthtHora['descripcionCatalogo'] ==
              objLeftHora['descripcionCatalogo']
          ) {
              banderaExist = true;
              j = this.listCuentasSecondSelect.length;
          }
      }
      if (!banderaExist) {
          listadoCuentasRemove.push(objRigthtHora);
      }
  }
  this.listCuentasFirstSelect = this.ordenateListForFirstSelectOrSecondCuenta(
      this.listCuentasFirstSelect,
      listadoCuentasRemove
  );
  //[...this.listHorasFirstSelect,...listadoHorasRemove];
  //Se eliminan los elementos seleccionados
  listCuentasRemoveUntilExist.forEach((option: any) => {
      this.listCuentasSecondSelect = this.listCuentasSecondSelect.filter(
          (ele: any) => {
              return ele['descripcionCatalogo'] != option['descripcionCatalogo'];
          }
      );
  });
}

validateAndRemoveCuentaToRigthWithOutSelectedTodos() {
        var listadoCuentasRemove: any = [];
        var listCuentasRemoveUntilExist: any = [];
        this.listCuentasSelectedDerecha.forEach((horaId:any) => {
            var banderaExist = false;
            var objHoraSelected = null;
            for (var i = 0; i < this.listCuentasSecondSelect.length; i++) {
                var objHora = this.listCuentasSecondSelect[i];
                if (objHora['idCatalogo'] === horaId.idCatalogo) {
                    objHoraSelected = objHora;
                    listCuentasRemoveUntilExist.push(objHoraSelected);
                    i = this.listCuentasSecondSelect.length;
                }
            }
            for (var i = 0; i < this.listCuentasFirstSelect.length; i++) {
                var objLeftHora = this.listCuentasFirstSelect[i];
                if (
                    objHoraSelected['descripcionCatalogo'] ==
                    objLeftHora['descripcionCatalogo']
                ) {
                    banderaExist = true;
                    i = this.listCuentasFirstSelect.length;
                }
            }
            if (!banderaExist) {
                listadoCuentasRemove.push(objHoraSelected);
            }
        });
        this.listCuentasFirstSelect = this.ordenateListForFirstSelectOrSecondCuenta(
            this.listCuentasFirstSelect,
            listadoCuentasRemove
        );
        //[...this.listHorasFirstSelect,...listadoHorasRemove];
        //Se eliminan los elementos seleccionados
        listCuentasRemoveUntilExist.forEach((option: any) => {
            this.listCuentasSecondSelect = this.listCuentasSecondSelect.filter(
                (ele: any) => {
                    return ele['descripcionCatalogo'] != option['descripcionCatalogo'];
                }
            );
        });

    }

  validateAndAddCuentaToRigthSideSelectedTodos() {
    //Se selecciono la opcion todos
    var listadoCuentaAdd: any = [];
    var listCuentaRemoveUntilExist: any = [];
    for (var i = 0; i < this.listCuentasFirstSelect.length; i++) {
        var objLeftHora = this.listCuentasFirstSelect[i];
        listCuentaRemoveUntilExist.push(objLeftHora);
        var banderaExist = false;
        for (var j = 0; j < this.listCuentasSecondSelect.length; j++) {
            var objRightHora = this.listCuentasSecondSelect[j];
            if (
                objLeftHora['descripcionCatalogo'] ==
                objRightHora['descripcionCatalogo']
            ) {
                banderaExist = true;
                j = this.listCuentasSecondSelect.length;
            }
        }
        if (!banderaExist) {
            listadoCuentaAdd.push(objLeftHora);
        }
    }
    this.listCuentasSecondSelect = this.ordenateListForFirstSelectOrSecondCuenta(
        this.listCuentasSecondSelect,
        listadoCuentaAdd
    );
    //[...this.listHorasSecondSelect,...listadoHorasAdd];
    //Se eliminan los elementos seleccionados
    listCuentaRemoveUntilExist.forEach((option: any) => {
        this.listCuentasFirstSelect = this.listCuentasFirstSelect.filter(
            (ele: any) => {
                return ele['descripcionCatalogo'] != option['descripcionCatalogo'];
            }
        );
    });
}
  
  validateAndAddCuentaToRigthWithOutSelectedTodos() {
    var listadoCuentaAdd: any = [];
    var listCuentaRemoveUntilExist: any = [];
    this.listCuentasSelectedIzquierda.forEach((horaId:any) => {
        var banderaExist = false;
        var objHoraSelected = null;
        for (var i = 0; i < this.listCuentasFirstSelect.length; i++) {
            var objHora = this.listCuentasFirstSelect[i];
            if (objHora['idCatalogo'] === horaId.idCatalogo) {
                objHoraSelected = objHora;
                listCuentaRemoveUntilExist.push(objHoraSelected);
                i = this.listCuentasFirstSelect.length;
            }
        }
        for (var i = 0; i < this.listCuentasSecondSelect.length; i++) {
            var objRightHora = this.listCuentasSecondSelect[i];
            if (
                objHoraSelected['descripcionCatalogo'] ==
                objRightHora['descripcionCatalogo']
            ) {
                banderaExist = true;
                i = this.listCuentasSecondSelect.length;
            }
        }
        if (!banderaExist) {
            listadoCuentaAdd.push(objHoraSelected);
        }
    });
    this.listCuentasSecondSelect = this.ordenateListForFirstSelectOrSecondCuenta(
        this.listCuentasSecondSelect,
        listadoCuentaAdd
    );
    //[...this.listHorasSecondSelect,...listadoHorasAdd];
    //Se eliminan los elementos seleccionados
    listCuentaRemoveUntilExist.forEach((option: any) => {
        this.listCuentasFirstSelect = this.listCuentasFirstSelect.filter(
            (ele: any) => {
                return ele['descripcionCatalogo'] != option['descripcionCatalogo'];
            }
        );
    });
}

ordenateListForFirstSelectOrSecondCuenta(
  listadooriginal: any,
  listadoAgregar: any
) {
  var listadoComplete: any = [...listadooriginal, ...listadoAgregar];

  listadoComplete.sort((a: any, b: any) => {
      var numberValidate: number = 0;
      let objHoraA = a['descripcionCatalogo'];
      let objHoraB = b['descripcionCatalogo'];

      if (objHoraA < objHoraB) {
          numberValidate = -1;
      }

      if (objHoraA > objHoraB) {
          numberValidate = 1;
      }

      return numberValidate;
  });

  return listadoComplete;
}


assingListadoHoraSelect(result1: any, result2: any, horaIzquierda: any, listaHoras: any) {
  this.listHorasFirstSelect = listaHoras;
  this.listHorasFirstSelectRespaldo = listaHoras;
  this.listHorasSecondSelect = horaIzquierda;
  this.listHorasSecondSelectRespaldo = horaIzquierda;

  this.listCuentasFirstSelect = result2;
  this.listCuentasFirstSelectRespaldo = result2;
  this.listCuentasSecondSelect = result1;
  this.listCuentasSecondSelectRespaldo = result1;
}

addNewHour() {
  if (!this.listHorasSelectedIzquierda.length) {
      this.open(
          this.translateService.instant('modals.edoCuentaConsolidado.error.title'),
          this.translateService.instant('modals.edoCuentaConsolidado.error.bodyIzq'),
          'alert',
          this.translateService.instant('modals.edoCuentaConsolidado.error.codeIzq'),
          this.translateService.instant('modals.edoCuentaConsolidado.error.sugerencia'),
      );

  } else {
      if (this.listHorasSelectedIzquierda.indexOf('-1') >= 0) {
          //Se selecciono la opcion de todos
          this.validateAndAddHoraToRigthSideSelectedTodos();
      } else {
          //Se selecciono 1 o mas opciones excepto el todos
          this.validateAndAddHoraToRigthWithOutSelectedTodos();
      }
  }
}

validateAndAddHoraToRigthWithOutSelectedTodos() {
  var listadoHorasAdd: any = [];
  var listHorasRemoveUntilExist: any = [];
  this.listHorasSelectedIzquierda.forEach((horaId) => {
      var banderaExist = false;
      var objHoraSelected = null;
      for (var i = 0; i < this.listHorasFirstSelect.length; i++) {
          var objHora = this.listHorasFirstSelect[i];
          if (objHora['idCatalogo'] === horaId) {
              objHoraSelected = objHora;
              listHorasRemoveUntilExist.push(objHoraSelected);
              i = this.listHorasFirstSelect.length;
          }
      }
      for (var i = 0; i < this.listHorasSecondSelect.length; i++) {
          var objRightHora = this.listHorasSecondSelect[i];
          if (
              objHoraSelected['descripcionCatalogo'] ==
              objRightHora['descripcionCatalogo']
          ) {
              banderaExist = true;
              i = this.listHorasSecondSelect.length;
          }
      }
      if (!banderaExist) {
          listadoHorasAdd.push(objHoraSelected);
      }
  });
  this.listHorasSecondSelect = this.ordenateListForFirstSelectOrSecond(
      this.listHorasSecondSelect,
      listadoHorasAdd
  );
  //[...this.listHorasSecondSelect,...listadoHorasAdd];
  //Se eliminan los elementos seleccionados
  listHorasRemoveUntilExist.forEach((option: any) => {
      this.listHorasFirstSelect = this.listHorasFirstSelect.filter(
          (ele: any) => {
              return ele['descripcionCatalogo'] != option['descripcionCatalogo'];
          }
      );
  });
  this.listHorasSelectedIzquierda = [];
}

validateAndAddHoraToRigthSideSelectedTodos() {
  //Se selecciono la opcion todos
  var listadoHorasAdd: any = [];
  var listHorasRemoveUntilExist: any = [];
  for (var i = 0; i < this.listHorasFirstSelect.length; i++) {
      var objLeftHora = this.listHorasFirstSelect[i];
      listHorasRemoveUntilExist.push(objLeftHora);
      var banderaExist = false;
      for (var j = 0; j < this.listHorasSecondSelect.length; j++) {
          var objRightHora = this.listHorasSecondSelect[j];
          if (
              objLeftHora['descripcionCatalogo'] ==
              objRightHora['descripcionCatalogo']
          ) {
              banderaExist = true;
              j = this.listHorasSecondSelect.length;
          }
      }
      if (!banderaExist) {
          listadoHorasAdd.push(objLeftHora);
      }
  }
  this.listHorasSecondSelect = this.ordenateListForFirstSelectOrSecond(
      this.listHorasSecondSelect,
      listadoHorasAdd
  );
  //[...this.listHorasSecondSelect,...listadoHorasAdd];
  //Se eliminan los elementos seleccionados
  listHorasRemoveUntilExist.forEach((option: any) => {
      this.listHorasFirstSelect = this.listHorasFirstSelect.filter(
          (ele: any) => {
              return ele['descripcionCatalogo'] != option['descripcionCatalogo'];
          }
      );
  });
}

ordenateListForFirstSelectOrSecond(
  listadooriginal: any,
  listadoAgregar: any
) {
  var listadoComplete: any = [...listadooriginal, ...listadoAgregar];

  listadoComplete.sort((a: any, b: any) => {
      var numberValidate: number = 0;
      let objHoraA = a['descripcionCatalogo'];
      let objHoraB = b['descripcionCatalogo'];

      if (objHoraA < objHoraB) {
          numberValidate = -1;
      }

      if (objHoraA > objHoraB) {
          numberValidate = 1;
      }

      return numberValidate;
  });

  return listadoComplete;
}

removeHour() {
  if (!this.listHorasSelectedDerecha.length) {
      this.open(
          this.translateService.instant('modals.edoCuentaConsolidado.error.title'),
          this.translateService.instant('modals.edoCuentaConsolidado.error.bodyDer'),
          'alert',
          this.translateService.instant('modals.edoCuentaConsolidado.error.codeDer'),
          this.translateService.instant('modals.edoCuentaConsolidado.error.sugerencia'),
      );
  } else {
      if (this.listHorasSelectedDerecha.indexOf('-1') >= 0) {
          //Se selecciono la opcion de todos
          this.validateAndRemoveHoraToRigthSideSelectedTodos();
      } else {
          //Se selecciono 1 o mas opciones excepto el todos
          this.validateAndRemoveHoraToRigthWithOutSelectedTodos();
      }
  }
}

validateAndRemoveHoraToRigthWithOutSelectedTodos() {
  var listadoHorasRemove: any = [];
  var listHorasRemoveUntilExist: any = [];
  this.listHorasSelectedDerecha.forEach((horaId) => {
      var banderaExist = false;
      var objHoraSelected = null;
      for (var i = 0; i < this.listHorasSecondSelect.length; i++) {
          var objHora = this.listHorasSecondSelect[i];
          if (objHora['idCatalogo'] === horaId) {
              objHoraSelected = objHora;
              listHorasRemoveUntilExist.push(objHoraSelected);
              i = this.listHorasSecondSelect.length;
          }
      }
      for (var i = 0; i < this.listHorasFirstSelect.length; i++) {
          var objLeftHora = this.listHorasFirstSelect[i];
          if (
              objHoraSelected['descripcionCatalogo'] ==
              objLeftHora['descripcionCatalogo']
          ) {
              banderaExist = true;
              i = this.listHorasFirstSelect.length;
          }
      }
      if (!banderaExist) {
          listadoHorasRemove.push(objHoraSelected);
      }
  });
  this.listHorasFirstSelect = this.ordenateListForFirstSelectOrSecond(
      this.listHorasFirstSelect,
      listadoHorasRemove
  );
  //[...this.listHorasFirstSelect,...listadoHorasRemove];
  //Se eliminan los elementos seleccionados
  listHorasRemoveUntilExist.forEach((option: any) => {
      this.listHorasSecondSelect = this.listHorasSecondSelect.filter(
          (ele: any) => {
              return ele['descripcionCatalogo'] != option['descripcionCatalogo'];
          }
      );
  });
  //this.listHorasSelectedDerecha = [];
}

validateAndRemoveHoraToRigthSideSelectedTodos() {
  //Se selecciono la opcion todos
  var listadoHorasRemove: any = [];
  var listHorasRemoveUntilExist: any = [];
  for (var i = 0; i < this.listHorasSecondSelect.length; i++) {
      var objRigthtHora = this.listHorasSecondSelect[i];
      listHorasRemoveUntilExist.push(objRigthtHora);
      var banderaExist = false;
      for (var j = 0; j < this.listHorasFirstSelect.length; j++) {
          var objLeftHora = this.listHorasFirstSelect[j];
          if (
              objRigthtHora['descripcionCatalogo'] ==
              objLeftHora['descripcionCatalogo']
          ) {
              banderaExist = true;
              j = this.listHorasSecondSelect.length;
          }
      }
      if (!banderaExist) {
          listadoHorasRemove.push(objRigthtHora);
      }
  }
  this.listHorasFirstSelect = this.ordenateListForFirstSelectOrSecond(
      this.listHorasFirstSelect,
      listadoHorasRemove
  );
  //[...this.listHorasFirstSelect,...listadoHorasRemove];
  //Se eliminan los elementos seleccionados
  listHorasRemoveUntilExist.forEach((option: any) => {
      this.listHorasSecondSelect = this.listHorasSecondSelect.filter(
          (ele: any) => {
              return ele['descripcionCatalogo'] != option['descripcionCatalogo'];
          }
      );
  });
}



  /**
   * Metodo que lee el contenido del archivo seleccionado y lo guarda en una variable para su uso posterior.
   */
  readArchivo(fileEvent: any): void {
    this.archivoSelected = fileEvent.target.files[0];
  }

  saveConfigIntradia(): void {
    if (this.disableFormByCancel) return;
    const isValid = this.isValidFormConfigIntradia();
    if (isValid) {
      this.open(
        this.translateService.instant(
          'config.cobranza.msjrealmenteDeseaGuardar'
        ),
        '',
        'confirm',
        '',
        this.translateService.instant('config.cobranza.msjGuardarConfiguracion')
      );
    } else {
      return;
    }
  }

  open(
    titulo: String,
    contenido: String,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    code?: string,
    sugerencia?: string
  ): void {
    const dialog = this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        contenido,
        type,
        code,
        sugerencia
      ), hasBackdrop: true 
    });

    dialog.afterClosed().subscribe(async (r) => {
      this.showFileButton = false
      if (r === 'ok') {
        const formValue = this.formReportsIntradia.value;
        this.listHoursSelected.forEach((r) => {
          delete r.estatusActivo;
          delete r.estatusFinal;
        });
        this.listClaconesSelected.forEach((r) => {
          delete r.estatusActivo;
          delete r.estatusFinal;
        });
        const request = {
          idContrato: Number(this.dataContract.idContrato),
          hdnContratoFolio: this.dataContract.numContrato,
          anulacionesValor: formValue.anulaciones ? 'A' : 'I',
          confGeneralCobranza: {
            optIntradia: formValue.optIntradia,
            optConsXDia: formValue.optConsXDia,
            optCantidad: this.cantFilesRadioConsolid,
            optTipoContenido: this.optTipoContenido,
            optCanal: formValue.optCanal,
            optFormato: formValue.optFormato,
            optFormatoConsolidado: formValue.optFormato,
            bandCierre: this.bandCierre,
            optClaAbono: this.optClaAbono,
            optClaCarg:  this.optClaCarg,
            horarios: this.listHorasSecondSelect,
            clacones:this.listCuentasSecondSelect
          },

          
          bandsCobranza: {
            signosNegativosMostrar: this.chkSigN === true ? 'A' : 'I',
            cuentaClabeMostrar: formValue.chkCta ? 'A' : 'I',
          },
        };

        try{
          const saveConfig = (await this.reportIntradiaService.saveConfigCobranza(
            request
          )) as { message: string };
          if (saveConfig.message === 'OKCCG1') {
            await this.getConfigContra();
            return this.open(
              '',
              this.translateService.instant('pantalla.reporteCobranzaConsolidadoIntradia.msjOKCCG1Observacion'),
              'info',
              this.translateService.instant('pantalla.reporteCobranzaConsolidado.msjOKCCG1Codigo'),
              this.translateService.instant('pantalla.reporteCobranzaConsolidado.msjOKCCG1Sugerencia'),
            );
          }
          this.globals.loaderSubscripcion.emit(false);
        }catch(e){
          this.globals.loaderSubscripcion.emit(false);
          this.dialog.open(ModalInfoComponent, {
            data: new ModalInfoBeanComponents(
              this.translateService.instant('modal.msjERRGEN0001Titulo'),
              this.translateService.instant('modal.msjERRGEN0001Observacion'),
              'error',
              '',
              this.translateService.instant('modal.msjERRGEN0001Sugerencia')
            ),
          });
        }
      }
    });
  }

  async dataClientChange(event: any): Promise<void> {
    this.dataContract = event;
    await this.getConfigContra();
  }

  async getConfigContra(): Promise<void> {
    this.formReportsIntradia = this.fb.group({
      idContratoCuenta: [''],
      optOperCierre: [],
      optIntradia: [],
      optConsXDia: [],
      optCantidad: [''],
      optTipoContenido: [''],
      optCanal: [''],
      optFormato: [''],
      optFormatoConsolidado: [''],
      bandCierre: [''],
      optClaAbono: [''],
      optClaCarg: [''],
      anulaciones: [''],
      chkSigN: [false],
      chkCta: [''],
    });
    try {
      if (this.dataContract) {
        const getReport = (await this.reportIntradiaService.getConfigReport(
          this.dataContract?.idContrato as string
        )) as ConfigReportIntadia;
        this.assingListadoHoraSelect(getReport.clacones.lstClacones, getReport.clacones.lstclaconesDisp, getReport.horarios.horasSel, getReport.horarios.lstHoras)
        if (
          getReport.confGeneral.banderaProdActivo === 'N' ||
          getReport.confGeneral.banderaProducto === 'N'
        ) {
          this, this.disableForm();
        }
  
        this.listHours = getReport.horarios.lstHoras
          .filter((v) => v !== undefined)
          .sort((x, y) =>
            x.descripcionCatalogo.localeCompare(y.descripcionCatalogo)
          );
        this.listHoursSelected = getReport.horarios.horasSel
          .filter((v) => v !== undefined)
          .sort((x, y) =>
            x.descripcionCatalogo.localeCompare(y.descripcionCatalogo)
          );
        this.listClacones = getReport.clacones.lstclaconesDisp
          .filter((v) => v !== undefined)
          .sort((x, y) =>
            x.descripcionCatalogo.localeCompare(y.descripcionCatalogo)
          );
        this.listClaconesSelected = getReport.clacones.lstClacones
          .filter((v) => v !== undefined)
          .sort((x, y) =>
            x.descripcionCatalogo.localeCompare(y.descripcionCatalogo)
          );
        this.listCanales = getReport.canalesFormatos.lstCanales;
        this.listFormats = getReport.canalesFormatos.lstFormatos;
        this.idFormatoMT940 = Number(getReport.canalesFormatos.idFormatoMT940)
        this.idFormatoMT942 = getReport.canalesFormatos.idFormatoMT942
        this.idCanalSwiftFin = getReport.canalesFormatos.idCanalSwiftFin
        this.idFormatoRepCobTXT = getReport.canalesFormatos.idFormatoRepCobTXT
        this.idCanalREPAL = getReport.canalesFormatos.idCanalREPAL,
        this.valorRecArcxCta = getReport.canalesFormatos.valorRecArcxCta
        this.listFormats =  this.listFormats.filter(item => item.idCatalogo !== this.idFormatoMT940)
        const getCuentas = (await this.reportIntradiaService.getCuentas(
          this.dataContract.idContrato,
          0
        )) as ContratCuentas;
        this.listCuentas = getCuentas.content;
        this.pageCount = getCuentas.totalPages;
        this.bandCierre = getReport.confGeneral.optOperCierre,
        this.optClaAbono = getReport.confGeneral.optClaAbono,
        this.optClaCarg = getReport.confGeneral.optClaCarg,
        this.chkSigN = getReport.bandsCobranza.chkSigN,
        this.formReportsIntradia.patchValue({
          bandCierre: getReport.confGeneral.optOperCierre,
          optClaCarg: getReport.confGeneral.optClaCarg,
          optClaAbono: getReport.confGeneral.optClaAbono,
          chkSigN: getReport.bandsCobranza.chkSigN,
          chkCta: getReport.bandsCobranza.chkCta,
          anulaciones: getReport.anulaciones.indicador === 'A' ? true : false,
          optCanal: getReport.confGeneral.optCanal
            ? getReport.confGeneral.optCanal
            : '',
          optFormato: getReport.confGeneral.optFormato
            ? getReport.confGeneral.optFormato
            : '',
        });
        this.cantFilesRadioConsolid = getReport.confGeneral.optCantidad;
        this.optTipoContenido = getReport.confGeneral.optTipoContenido;
        this.globals.loaderSubscripcion.emit(false);
      }
    } catch(err) {
      this.dialog.open(ModalInfoComponent, {
        data: new ModalInfoBeanComponents(
            this.translateService.instant('modal.msjERRGEN0001Titulo'),
            this.translateService.instant('modal.msjERRGEN0001Observacion'),
            'error',
            this.translateService.instant('modal.msjERRGEN0001Codigo'),
            this.translateService.instant('modal.msjERRGEN0001Sugerencia')
        ),
    });
    this.globals.loaderSubscripcion.emit(false);
    }
  }

  isValidFormConfigIntradia(): boolean {
    const formValue = this.formReportsIntradia.value;
    if (!this.cantFilesRadioConsolid) {
      this.open(
        '',
        this.translateService.instant('config.cobranza.msjVALDAT03Observacion'),
        'alert',
        'VALDAT03'
      );
      return false;
    }
    if (this.listHorasSecondSelect.length <= 0) {
      this.open(
        '',
        this.translateService.instant('pantalla.reporteCobranzaConsolidado.msjVALDAT02Observacion'),
        'alert',
        'VALDAT02'
      );
      return false;
    }
    if (!formValue.optFormato) {
      this.open(
        '',
        this.translateService.instant('config.cobranza.msjVALDAT05Observacion'),
        'alert',
        'VALDAT05'
      );
      return false;
    }
    if (!formValue.optCanal) {
      this.open(
        '',
        this.translateService.instant('config.cobranza.msjVALDAT06Observacion'),
        'alert',
        'VALDAT06'
      );
      return false;
    }
    if (!this.optTipoContenido) {
      this.open(
        '',
        this.translateService.instant('pantalla.reporteCobranzaConsolidado.msjVALDAT08Observacion'),
        'alert',
        'VALDAT08'
      );
      return false;
    }
    if (this.listCuentas.length <= 0) {
      this.open(
        '',
        this.translateService.instant('config.cobranza.cuentasFaltantes'),
        'error',
        'ERRCTAS1'
      );
      return false;
    }
    if (this.listCuentasSecondSelect.length <= 0) {
      this.open(
        '',
        this.translateService.instant('pantalla.reporteCobranzaConsolidado.VALDAT07Observacion'),
        'alert',
        this.translateService.instant('pantalla.reporteCobranzaConsolidado.VALDAT07Codigo')
      );
      return false;
    }
    if(formValue.optCanal !==''){
      if(formValue.optFormato !==''){
        if(formValue.optFormato !== this.idFormatoMT942 &&
          formValue.optCanal === this.idCanalSwiftFin) {
            this.open(
              this.translateService.instant('configuracionEstadosCuenta.msjINF00016Titulo'),
              this.translateService.instant('configuracionEstadosCuenta.msjINF00016Observacion'),
              'alert',
              this.translateService.instant('configuracionEstadosCuenta.msjINF00016Codigo'),
              this.translateService.instant('configuracionEstadosCuenta.msjINF00016Sugerencia'),
            );
            return false;
        }
        if(formValue.optFormato !== this.idFormatoRepCobTXT &&
          formValue.optCanal === this.idCanalREPAL){
            this.open(
              this.translateService.instant('pantalla.reporteCobranzaConsolidado.msjINF00017Titulo'),
              this.translateService.instant('pantalla.reporteCobranzaConsolidado.msjINF00017Observacion'),
              'alert',
              this.translateService.instant('pantalla.reporteCobranzaConsolidado.msjINF00017Codigo'),
              this.translateService.instant('pantalla.reporteCobranzaConsolidado.msjINF00017Sugerencia'),
            );
            return false;
       } 
       if(this.cantFilesRadioConsolid !== this.valorRecArcxCta &&
        formValue.optFormato === this.idFormatoRepCobTXT &&
        formValue.optCanal === this.idCanalREPAL){
          this.open(
            this.translateService.instant('configuracionEstadosCuenta.msjINF00018Titulo'),
            this.translateService.instant('configuracionEstadosCuenta.msjINF00018Observacion'),
            'alert',
            this.translateService.instant('configuracionEstadosCuenta.msjINF00018Codigo'),
            this.translateService.instant('configuracionEstadosCuenta.msjINF00018Sugerencia'),
          );
          return false
     }
        
      }

    }
    return true;
  }

  async chargeAccounts(): Promise<void> {
    if (this.showFileButton && this.archivoSelected) {
      const formDataArchivo: FormData = new FormData();
      formDataArchivo.append('archivo', this.archivoSelected);
      const file = formDataArchivo;
      const uploadDocumentAccounts =
        (await this.reportIntradiaService.uploadAccounts(
          this.dataContract.idContrato,
          file
        )) as { message: string };
      const codMessage = uploadDocumentAccounts?.message;
      if (codMessage === 'EXPOK1' || codMessage === 'OKCC01') {
        const dialog = this.dialog.open(ModalInfoComponent, {
          data: new ModalInfoBeanComponents(
            this.translateService.instant('config.cobranza.msjCargaOK'),
            '',
            'confirm',
           '',// this.translateService.instant('config.cobranza.codeCargaOK')
            this.translateService.instant('config.cobranza.msjCargaCuentas')
          ),
        });

        dialog.afterClosed().subscribe(async (r) => {
          this.showFileButton = false
          if (r === 'ok') {
            await this.downloadDetailAccounts();
          }
        });
      } else if (codMessage === 'OKCCG1') {
        this.open(
          this.translateService.instant('producto.msjERR002Titulo'),
          this.translateService.instant('config.cobranza.msjOKCCG1Observacion'),
          'info',
          this.translateService.instant('config.cobranza.msjOKCCG1Codigo'),
          this.translateService.instant('config.cobranza.msjOKCCG1Sugerencia')
        );
      } else if (codMessage === 'ERRORG9') {
        this.open(
          this.translateService.instant('producto.msjERR002Titulo'),
          this.translateService.instant(
            'config.cobranza.msjERRORG9Observacion'
          ),
          'error',
          this.translateService.instant('config.cobranza.msjERRORG9Codigo'),
          this.translateService.instant('config.cobranza.msjERRORG9Sugerencia')
        );
      } else if (codMessage === 'ERRORG99') {
        this.open(
          this.translateService.instant('producto.msjERR002Titulo'),
          this.translateService.instant(
            'config.cobranza.msjERRORG99Observacion'
          ),
          'error',
          this.translateService.instant('config.cobranza.msjERRORG99Codigo'),
          this.translateService.instant('config.cobranza.msjERRORG99Sugerencia')
        );
      } else {
        this.open(
          this.translateService.instant('config.cobranza.msjERRORoperacion'),
          '',
          'error',
          codMessage,
          ''
        );
      }
      if (uploadDocumentAccounts) this.globals.loaderSubscripcion.next(false);
    } else if (this.showFileButton && !this.archivoSelected) {
      return;
    }
    if (this.disableFormByCancel) return;
    this.showFileButton = true;
  }

  async downloadAccounts(): Promise<void> {
    if (this.disableFormByCancel) return;
    const getReportDetail =
      await this.reportIntradiaService.getReportDetailChargeAccounts(
        this.dataContract.idContrato
      );
    if (getReportDetail) {
      this.fc.convertBase64ToDownloadFileInExport(getReportDetail);
    }
    this.globals.loaderSubscripcion.next(false);
  }

  async downloadDetailAccounts(): Promise<void> {
    try {
      const getDetailAccountsCharge =
        await this.reportIntradiaService.getDetailAccountCharged(
          this.dataContract.idContrato
        );
      if (getDetailAccountsCharge) {
        this.fc.convertBase64ToDownloadFileInExport(getDetailAccountsCharge);
      }
    } catch (error) {
      this.open(
        this.translateService.instant('config.cobranza.msjERRORoperacion'),
        '',
        'error',
        '',
        ''
      );
    }
    this.globals.loaderSubscripcion.next(false);
  }

  exportReport(): void {
    const dialogo = this.dialog.open(ModalExportacionComponent, { hasBackdrop: true });
    dialogo.afterClosed().subscribe(async (result) => {
      if (result) {
        const type = result !== 'pdf' ? 'xls' : result;
        const request = {
          idContrato: this.dataContract.idContrato,
          numeroContrato: this.dataContract.numContrato,
          usuario:
            localStorage.getItem('UserID') !== (null || undefined)
              ? (localStorage.getItem('UserID') as string)
              : 'usuario',
        };
        const response = await this.reportIntradiaService.getExportFormat(
          type,
          request
        );
        if (response) {
          this.fc.convertBase64ToDownloadFileInExport(response);
        }
        this.globals.loaderSubscripcion.emit(false);
      }
    });
  }

  disableForm(): void {
    this.formReportsIntradia.disable();
    this.formReportsIntradia.get('anulaciones')?.enable();
    this.disableFormByCancel = true;
  }

  async paginacion(pageConsultar:any, pageActual?:any){
    let pageCon: any = Number.parseInt(pageConsultar);
    let pagina: any = ((pageCon < 1) ? 0 : pageCon - 1);
    const getCuentas = (await this.reportIntradiaService.getCuentas(
      this.dataContract.idContrato,
      pagina
    )) as ContratCuentas;
    this.listCuentas = getCuentas.content;
    this.pageCount = getCuentas.totalPages;
    this.globals.loaderSubscripcion.emit(false);
  }

  moveToPreviousPage() {
    if (this.canMoveToPreviousPage) {
      this.pageIndex--;
      var mas = this.pageIndex+1
      // consultar uno menos
      this.paginacion(this.pageIndex, this.pageIndex1)
    }
  }

  moveToLastPage() {
    var actual = this.pageIndex 
    this.pageIndex = this.pageCount;
    // consultar al ultimo
    this.paginacion(this.pageIndex, this.pageIndex1 )
  }

  moveToFirstPage() {
    var actual= this.pageIndex
    this.pageIndex = 1;
    // consultar al inicio
    this.paginacion(this.pageIndex, this.pageIndex1)
  }

  moveToNextPage() {
  if (this.canMoveToNextPage) {
      this.pageIndex++;
      // consultar uno mas
      this.paginacion(this.pageIndex, this.pageIndex1)
    }
  }

  get canMoveToNextPage() : boolean {
    return this.pageIndex < this.pageCount ? true : false;
  }

  get canMoveToPreviousPage() : boolean {
    return this.pageIndex >= 2 ? true : false;
  }

}
