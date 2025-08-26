import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DatosCuentaBeanComponent } from 'src/app/bean/datos-cuenta-bean.component';
import { Globals } from 'src/app/bean/globals-bean.component';
import { ModalInfoBeanComponents } from 'src/app/bean/modal-info-bean.component';
import { ModalInfoComponent } from 'src/app/components/modals/modal-info/modal-info.component';
import { ArchivoModel, BuscarArchivoResponse, ListStatus, RequestBuscarArchivo, RequestCancelOpe } from 'src/app/interface/cancelOpeSearch.interface';
import { CancelacionOperacionesService } from 'src/app/services/administracion/cancelacion-operaciones.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ComunesService } from 'src/app/services/comunes.service';

@Component({
	selector: 'app-cancelacion-operaciones',
	templateUrl: './cancelacion-operaciones.component.html',
	styleUrls: ['./cancelacion-operaciones.component.css']
})
export class CancelacionOperacionesComponent implements OnInit {
	activar: boolean = false;
	activarbtn: boolean = false;
	datospersonales: any = {
		numContrato: '',
		bucCliente: '',
		descEstatus: '',
		nombreCompleto: '',
		personalidad: '',
		cuentaEje: '',
		idContrato: '',
		razonSocial: '',
		idEstatus: 0,
		archivo: '',
		estatusArchivo: '',
		check: false,
		checkPrincipal: false
	};
	/** Lista de valores del estatus del contrato */
	lstEstatusContrato: any;
	/** Id del estatus default del contrato */
	idEstatusDef: any;
	/** Id del estatus default del contrato */
	idEstatusContratoDef: any;
	/** Identificador del estatus del contrato*/
	idEstatus: any;
	datos: DatosCuentaBeanComponent;
   	returnedArray: any[] = [];
  	formOpeSearch: FormGroup;
  	filesByClient: ArchivoModel[] = [];
  	statusList: ListStatus[] = [];
  	operToCancel: RequestCancelOpe[] = [];
  	operTC: any = [];
  	pagConfig = {
    	currentRow: 0,
    	totalItems: 0
  	}
	isAllOpe = false;
	/** Variable para indicar el total de elementos que regresa la peticion */
	totalElements: number = 0;
	/** Variable para indicar el total de elementos que se mostraran por pagina */
	rowsPorPagina: number = 20;
	/** Bandera para inabilitar los campos de los datos del contrato */
	bandDisableAll: boolean = false;

	constructor(private fb: FormBuilder, public dialog: MatDialog, private translateS: TranslateService, private cancelOpeService: CancelacionOperacionesService, private globals: Globals,
		private serviceCancelacion: CancelacionOperacionesService, private fc: FuncionesComunesComponent, private comun: ComunesService,) { }

	ngOnInit(): void {
		this.createForm();
     	this.getStatus();
	}

	createForm(): void {
		this.formOpeSearch = this.fb.group({
		  nomArchivo: '',
		  estatus: '',
		  bucCliente: ''
		})
	}

	async getStatus(): Promise<void> {
		try {
		  const getSt = await this.serviceCancelacion.getlistasEstatus() as unknown as ListStatus[];
		  this.statusList = getSt;
		  this.globals.loaderSubscripcion.emit(false);
		} catch (error) {
		  this.globals.loaderSubscripcion.emit(false);
		}
	  }

	patch(data: any): void {
		this.datos = data
		this.formOpeSearch.patchValue({ bucCliente: this.datos.bucCliente })
	}

	async searchOpe(): Promise<void> {
		const formValue = this.formOpeSearch.value as RequestBuscarArchivo;
		try {
		  if (formValue.nomArchivo === '' && formValue.estatus === '') {
			this.openModalInfo(
				this.translateS.instant('CO.busqueda'),
				this.translateS.instant('CO.filtros'),
				'alert',
				'CNI001',
				this.translateS.instant('CO.campos'),
			)
		  } else {
			const request = {
				bucCliente: this.datospersonales.bucCliente,
				nomArchivo: formValue.nomArchivo,
				estatus: formValue.estatus
			}
			const getListResult = await this.serviceCancelacion.consultar(request);
			this.returnedArray = [];
			this.filesByClient = [];
			if (getListResult.content.length > 0) {
			  this.pagConfig.currentRow = getListResult.pageable.pageNumber;
			  this.totalElements = getListResult.totalElements;
			  this.pagConfig.totalItems = getListResult.totalElements;
			  this.filesByClient = getListResult.content;
			  this.returnedArray = this.filesByClient.slice(0, this.rowsPorPagina);
			} else {
			  this.openModalInfo(
				this.translateS.instant('CO.Titulo'),
				this.translateS.instant('CO.msjMONINF01Observacion'),
				'alert',
				this.translateS.instant('CO.msjMONINF01Codigo'),
				this.translateS.instant('CO.msjMONINF01Sugerencia'),
			  )
			}
		  }
		  this.globals.loaderSubscripcion.emit(false);
		} catch (error) {
		  this.globals.loaderSubscripcion.emit(false);
		}
	}

	sendOperToCancel(): void {
		const formValue = this.formOpeSearch.value as RequestBuscarArchivo;
		if (this.operTC.length <= 0) {
		  this.openModalInfo(
			this.translateS.instant('CO.Titulo'),
			this.translateS.instant('CO.seleecionar'),
			'alert',
			this.translateS.instant('CO.code'),
			this.translateS.instant('CO'),
		  )
		}
		const request = {
		  bucCliente: this.datospersonales.bucCliente,
		  nomArchivo: formValue.nomArchivo,
		  estatus: formValue.estatus,
		  idRegistros: this.operTC
		}
		if (!this.isAllOpe) {
		  const modalAsk = this.dialog.open(ModalInfoComponent, {
			disableClose: true,
			data: new ModalInfoBeanComponents(
			  this.translateS.instant('modals.sucursales.confirmacion'),
			  this.translateS.instant('modals.parametros.confirmacion.contenido'),
			  'confirm',
			  '',
			  this.translateS.instant('modals.parametros.confirmacion'),
			),
		  });
		  modalAsk.afterClosed().subscribe(async (t) => {
			if (t === 'ok') {
			  try {
				this.serviceCancelacion.cancelar(request,"1").then((result: any) => {
				  this.updateSend();
				  this.messageSuccesCancelOpe();
				  this.globals.loaderSubscripcion.emit(false);
				});
			  } catch (error) {
				this.globals.loaderSubscripcion.emit(false);
			  }
			}
		  })
		} else {
		  const confirmModalAction = this.dialog.open(ModalInfoComponent, {
			disableClose: true,
			data: new ModalInfoBeanComponents(
			  this.translateS.instant('selectOptionCancelOpe'),
			  '',
			  'selectAction',
			  '',
			  ''
			),
		  });
		  confirmModalAction.afterClosed().subscribe(async (y) => {
			if (y === '0') {
			  try {
				this.serviceCancelacion.cancelar(request,"1").then((result: any) => {
				  this.updateSend();
				  this.messageSuccesCancelOpe();
				  this.globals.loaderSubscripcion.emit(false);
				});
			  } catch (error) {
				this.globals.loaderSubscripcion.emit(false);
			  }
			} else if (y === '1') {
			  try {
				const formValue = this.formOpeSearch.value;
				this.serviceCancelacion.cancelar(request,"0").then((result: any) => {
				  this.updateSend();
				  this.messageSuccesCancelOpe();
				  this.globals.loaderSubscripcion.emit(false);
				});
			  } catch (error) {
				this.globals.loaderSubscripcion.emit(false);
			  }
			}
		  })
		}
	  }
	
	  async updateSend(): Promise<void>{
		const formValue = this.formOpeSearch.value as RequestBuscarArchivo;
		const request = {
			bucCliente: this.datospersonales.bucCliente,
			nomArchivo: formValue.nomArchivo,
			estatus: formValue.estatus
		  }
		this.serviceCancelacion.consultar(request).then((result: any) => {
			this.operTC = [];
			this.returnedArray = [];
			this.filesByClient = [];
			if (result.content.length > 0) {
			  this.pagConfig.currentRow = result.pageable.pageNumber;
			  this.totalElements = result.totalElements;
			  this.pagConfig.totalItems = result.totalElements;
			  this.filesByClient = result.content;
			  this.returnedArray = this.filesByClient.slice(0, this.rowsPorPagina);
			  const checkF = <HTMLInputElement>document.getElementById("chklist");
        	  checkF.checked = false;
			}
		});
	  }
	
	  messageSuccesCancelOpe(): void {
		this.openModalInfo(
		  this.translateS.instant('CO.Titulo'),
		  '',
		  'alert',
		  this.translateS.instant('CO.code3'),
		  this.translateS.instant('CO.obervacion'),
		);
	  }
	
	  openModalInfo(
		titulo: String,
		sugerencia: String,
		type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
		code?: string,
		contenido?: string
	  ) {
		this.dialog.open(ModalInfoComponent, {
		  data: new ModalInfoBeanComponents(
			titulo,
			sugerencia,
			type,
			code,
			contenido,
		  ),
		});
	  }
	
	  addDeleteOpeArr(event: any, oper: any, index: number) {
		const isAdd = event.target.checked;
		if (isAdd) {
		  this.operTC.push(oper.idRegistro);
		} else {
		  this.operTC.splice(index, 1);
		}
	  }
	
	  selectAllOpe(event: any): void {
		const comp = document.getElementsByName("opeChk");
		this.isAllOpe = event.target.checked;
		this.operTC = [];
		comp.forEach((r: any, i) => {
		  r.checked = this.isAllOpe;
		  this.addDeleteOpeArr(event, this.returnedArray[i], i);
		});
	  }
	
	  onPageChanged(event: PageChangedEvent): void {
		const checkF = <HTMLInputElement>document.getElementById("chklist");
    	checkF.checked = false;
		this.operTC = [];
    	this.returnedArray = [];
		const startItem = (event.page - 1) * event.itemsPerPage;
		const endItem = event.page * event.itemsPerPage;
		this.returnedArray = this.filesByClient.slice(startItem, endItem);
	  }
	
	
	  clean(): void{
		this.bandDisableAll = false;
		this.formOpeSearch.patchValue({
		  nomArchivo: '',
		  estatus: '',
		})
		this.filesByClient = [];
	  }

	  /**
	 * Metodo que valida que se ingresen solo numero, en caso de que se quieran ingresar datos diferentes no se permitira
	 */
	validateOnlyNumeros(event: KeyboardEvent) {
		this.fc.numberOnly(event);
	}

	async getContratoByBuc() {
		try {
			if (this.datospersonales.bucCliente != '') {
				await this.serviceCancelacion
					.getContratoByBuc(this.datospersonales.bucCliente)
					.then(async (resp: any) => {
						if (resp.codError == 'OK00000') {
							this.bandDisableAll = true;
							this.datospersonales.bucCliente = resp.bucCliente;
							this.datospersonales.cuentaEje = resp.cuentaEje;
							this.datospersonales.numContrato = resp.numContrato;
							this.datospersonales.razonSocial = resp.razonSocial;
							this.datospersonales.descEstatus = resp.descEstatus;
							this.datospersonales.idContrato = resp.idContrato;
							this.datospersonales.idEstatus = resp.idEstatus;
							//this.valueChange.emit(this.datospersonales);
							this.idEstatus = resp.idEstatus;
							this.idEstatusDef = this.idEstatus;
							this.globals.loaderSubscripcion.emit(false);
							this.activar = true
							this.activarbtn = true
						} else {
							this.limpiarContrato();
							this.openModalInfo(
								this.translateS.instant('contingencia.msjERR007Titulo'),
								this.translateS.instant('contingencia.msjERR007Sugerencia'),
								'info',
								this.translateS.instant('contingencia.msjERR007Codigo'),
								this.translateS.instant('contingencia.msjERR007Observacion'),
							);
							this.globals.loaderSubscripcion.emit(false);
						}
					});
			} else {
				this.openModalInfo(
					this.translateS.instant('contingencia.msjERR007Titulo'),
					this.translateS.instant('contingencia.msjERR007Sugerencia'),
					'alert',
					this.translateS.instant('admonContratos.msjCONT0011Codigo'),
					this.translateS.instant('contingencia.msjERR007Observacion'),
				);
				this.globals.loaderSubscripcion.emit(false);
			}
		} catch (e) {
			this.openModalInfo(
				this.translateS.instant('modals.altacontratos.error'),
				this.translateS.instant('modals.altacontratos.error.consulta.contrato.buc'),
				'error'
			);
			this.globals.loaderSubscripcion.emit(false);
		}
	}

	/**
	 * Metodo para pode realizar la limpieza del objeto
	 * que contendra la informacion del contrato del cliente
	 */
	limpiarContrato() {
		this.datospersonales = {
			numContrato: '',
			bucCliente: '',
			descEstatus: '',
			nombreCompleto: '',
			personalidad: '',
			cuentaEje: '',
			idContrato: '',
			razonSocial: '',
			archivo: '',
			estatusArchivo: '',
		};
		this.bandDisableAll = false;
		this.activarbtn = false
		this.activar = false
		this.idEstatusDef = '40';
		this.comun.datosContratoObtenido(false);
		this.comun.otro(false);
	}
	
	/**
	 * Metodo que valida que se peguen solo numeros en los inputs
	 */
	pasteOnlyNumeros(event: ClipboardEvent) {
		let textPasted = event.clipboardData?.getData('text') || '';
		let flag = true;
		for (let element of textPasted) {
			if (!this.fc.numberOnlyForPasteEvent(element.charCodeAt(0))) {
				flag = false;
			}
		}
		return flag;
	}

	/**
	 * Metodo que valida el tamaño del campo código de cliente, en caso de que sea menor a 8 dígitos lo completa con ceros.
	 */
	validateTamanoBuc(event: any) {
		let buc = event.target.value;
		let tamanio = buc.length;
		let relleno = 8 - tamanio;
		this.datospersonales.bucCliente =
			tamanio > 0 ? new Array(relleno + 1).join('0') + buc : buc;
	}
}
