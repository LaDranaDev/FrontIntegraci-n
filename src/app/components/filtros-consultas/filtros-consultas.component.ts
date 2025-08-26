import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import {
  NgbCalendar,
  NgbDate,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ConsultasComisionesService } from 'src/app/services/consultas-comisiones.service';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/bean/globals-bean.component';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { format } from 'date-fns';

function padNumber(value: number | null) {
  if (value !== null) {
    return `0${value}`.slice(-2);
  }
  return '';
}

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct | null {
    if (value) {
      const split = value.split('-');
      let dateObj: NgbDateStruct = {
        day: parseInt(split[0]),
        month: parseInt(split[1]),
        year: parseInt(split[2]),
      };
      return dateObj;
    }
    return null;
  }

  static formatDate(date: NgbDateStruct | NgbDate | null): string {
    return date
      ? `${date.year || ''}-${padNumber(date.month)}-${padNumber(date.day)}`
      : '';
  }

  format(date: NgbDateStruct | null): string {
    return NgbDateCustomParserFormatter.formatDate(date);
  }
}

@Component({
  selector: 'app-filtros-consultas',
  templateUrl: './filtros-consultas.component.html',
  styleUrls: ['./filtros-consultas.component.css'],
})
export class FiltrosConsultasComponent implements OnInit {
  public activeLang = 'es';
  model!: NgbDateStruct;
  model1!: NgbDateStruct;
  formConsulta: any;
  datePickerConfig: Partial<BsDatepickerConfig> = Object.assign({}, {
    dateInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-red',
    showWeekNumbers: false,
    adaptivePosition: true
});

  estatus: any[] = [];
  productos: any[] = [];

  @Output() filtroConsulta = new EventEmitter<any>();
  @Output() limpia = new EventEmitter<any>();


  constructor(
    public datePipe: DatePipe,
    public translate: TranslateService,
    private fc: FuncionesComunesComponent,
    private service: ConsultasComisionesService,
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
    private globals: Globals,
    private currencyPipe: CurrencyPipe,
  ) {
    this.translate.setDefaultLang(this.activeLang);
  }


  ngOnInit(): void {
    this.catalogEstatus();
    this.catalogProductos();
    this.initForm();
  }

  initForm(): void{
    this.formConsulta = new UntypedFormGroup({
      aliasSubs: new UntypedFormControl(''),
      bucCte: new UntypedFormControl(''),
      bucSubs: new UntypedFormControl(''),
      iniImporte: new UntypedFormControl(this.currencyPipe.transform('0', '$')),
      finImporte: new UntypedFormControl(this.currencyPipe.transform('0', '$')),
      idEstatus: new UntypedFormControl(''),
      idProd: new UntypedFormControl(''),
      iniFecha: new UntypedFormControl(new Date()),
      finFecha: new UntypedFormControl(new Date()),
      numCta: new UntypedFormControl(''),
      page: new UntypedFormControl(''),
      perPage: new UntypedFormControl(''),
    });
  }

  buscarConsulta() {
    try {
      const data = { ...this.formConsulta.value };
      data.iniImporte = data.iniImporte?.replace('$', '')?.replace(',', '').replace('$ ', '');
      data.finImporte = data.finImporte?.replace('$', '')?.replace(',', '').replace('$ ', '');
  
      const { numCta, finImporte, iniImporte, iniFecha, finFecha } = data;
  
      if (this.formConsulta.value.iniImporte !== '' && this.formConsulta.value.iniImporte !== null
        || this.formConsulta.value.finImporte !== '' && this.formConsulta.value.finImporte !== null) {
        if (!this.validaImportes(iniImporte, finImporte)) {
          return false;
        }
      }
  
      if (this.formConsulta.value.numCta !== '' && this.formConsulta.value.numCta !== null) {
        if (!this.validaNumCta(numCta)) {
          return false;
        }
      }
      if (iniFecha) {
        const formatDate = format(iniFecha as Date, 'yyyy-MM-dd')
        data.iniFecha = formatDate;
      } else {
        data.iniFecha = null;
      }
  
      if (finFecha) {
        const formatDateFin = format(finFecha as Date, 'yyyy-MM-dd')
        data.finFecha = formatDateFin;
      } else {
        data.finFecha = null;
      }
  
      if (data.iniFecha && data.finFecha && !this.validaFechas(data.iniFecha, data.finFecha)) {
        return false;
      }
  
      /*Object.keys(data).forEach(function (key) {
        if (data[key] == '' || data[key] == null) {
          delete data[key];
        }
      });*/
      this.filtroConsulta.emit(data);
      this.limpia.emit(true);
      return true;
    } catch (error) {
      return false
    }
  
  }

  validaNumCta(numCta: any) {
    if (numCta.length > 0) {
      if (numCta.length == 11 || numCta.length == 16 || numCta.length == 18) {
        return true;
      } else {
        this.openMsg(
          this.translate.instant('modal.error.msjERRNE005Titulo'),
          this.translate.instant('traking.consultaComisiones.msjERRNE005Observacion'),
          'error',
          this.translate.instant('traking.consultaComisiones.msjERRNE005Codigo'),
          this.translate.instant('modal.error.msjERRNE005Sugerencia')
        );
        return false;
      }
    } else {
      return true;
    }
  }

  validaImportes(iniImporte: any, finImporte: any) {
    if (parseInt(iniImporte) > parseInt(finImporte)) {
      this.openMsg(
        this.translate.instant('traking.consultaComisiones.msjERROR00004Titulo'),
        this.translate.instant('traking.consultaComisiones.msjERROR00004Observacion'),
        'error',
        this.translate.instant('traking.consultaComisiones.msjERROR00004Codigo'),
        this.translate.instant('traking.consultaComisiones.msjERROR00004Sugerencia'),
      );
      return false;
    } else {
      return true;
    }
  }

  validaFechas(iniFecha: any, finFecha: any) {
    var fechaI = new Date(iniFecha);
    var fechaF = new Date(finFecha);
    if (fechaI > fechaF) {
      this.openMsg(
        'Error',
        'Fechas Inválidas, La Fecha Fin Debe ser Mayor a la Fecha de Inicio ',
        'error'
      );
      return false;
    } else {
      return true;
    }
  }

  catalogEstatus() {
    this.service.catalogoEstatus().then((data: any) => {
      if (data.code == 200) {
        this.estatus = data.result;
        this.globals.loaderSubscripcion.emit(false);
      }
    });
  }

  catalogProductos() {
    this.service.catalogoProductos().then((data: any) => {
      if (data.code == 200) {
        this.productos = data.result;
        this.globals.loaderSubscripcion.emit(false);
      }
    });
  }

  limpiar() {
    this.initForm();
    this.formConsulta.controls['idProd'].setValue('');
    this.formConsulta.controls['idEstatus'].setValue('');
    this.filtroConsulta.emit({clean: true});
    this.limpia.emit(false);
  }

  fechaInicial(date: NgbDate) {
    let datos = this.formConsulta.value;
    //datos.iniFecha = NgbDateCustomParserFormatter.formatDate(date);
    //this.formConsulta.controls['iniFecha'].setValue(datos.iniFecha);
    //datos.finFecha = NgbDateCustomParserFormatter.formatDate(date);
  }

  fechaFinal(date: NgbDate) {
    let datos = this.formConsulta.value;
    //datos.iniFecha = NgbDateCustomParserFormatter.formatDate(date);
    //datos.finFecha = NgbDateCustomParserFormatter.formatDate(date);
    //this.formConsulta.controls['finFecha'].setValue(datos.finFecha);
    // this.model1  = { year: 1789, month: 7, day: 14 };
  }

  openMsg(
    titulo: String,
    contenido: String,
    type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
    code?: string,
    sugerencia?: string
  ) {
    this.dialog.open(ModalInfoComponent, {
      data: new ModalInfoBeanComponents(
        titulo,
        contenido,
        type,
        code,
        sugerencia
      ),
      hasBackdrop: true
    });
  }

  numerico(event: KeyboardEvent) {
    this.fc.numberOnly(event);
  }
  alphaNumberSpace(event: KeyboardEvent) {
    this.fc.alphaNumberSpace(event);
  }
  transformAmount(event: any) {
    event.target.value = event.target.value?.replace('$', '')?.replace(',', '');
    event.target.value = this.currencyPipe.transform(event.target.value, '$');
  }

  getMinDate() {
    let fecha = this.datePipe.transform(Date.now(), 'yyyy/MM/dd') || '';
    /** Se obtiene el arreglo de las partes de la fecha */
    let partsDate = fecha.split('/');
    /** Se crea la variable de fecha y se crea la fecha maxima */
    const date = new Date();
    date.setDate(Number(partsDate[0]));
    date.setMonth((Number(partsDate[1]) - 1) + 6);
    date.setFullYear(Number(partsDate[2]) - 4);
    /** Se regresa la fecha maxima con formato de fecha */
    return date;
}
}
