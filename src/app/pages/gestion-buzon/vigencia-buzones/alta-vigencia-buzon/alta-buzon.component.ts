import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AltaBuzon } from "src/app/bean/alta-vigencia-buzon.component";
import { Globals } from "src/app/bean/globals-bean.component";
import { ModalInfoBeanComponents } from "src/app/bean/modal-info-bean.component";
import { FuncionesComunesComponent } from 'src/app/components/funciones-comunes.component';
import { ModalInfoComponent } from "src/app/components/modals/modal-info/modal-info.component";
import { ContingenciaService } from "src/app/services/contingencia/contingencia.service";

@Component({
    selector: 'app-alta-buzon',
    templateUrl: './alta-buzon.component.html',
    styleUrls: ['./alta-buzon.component.css'],
    providers:[ContingenciaService]
})
export class AltaBuzonComponent implements OnInit {
    /** variable de control para saber si se realizo el submit del alta */
    submittedBuzonAlta = false;
    /** Bandera para habilitar el checkbox o no */
    banderaChecked = true;
    banderaUnChecked = false;

    /**
    * @description Formulario para alta y edicion de buzon
    * @type {FormGroup}
    * @memberOf ConsultarBuzonesComponent
    */
    formAltaEdicionBuzon:UntypedFormGroup;

    /**
    * @description objeto de buzon para la alta o modificacion
    * @type {AltaBuzon}
    * @memberOf ConsultarBuzonesComponent
    */
    altaBuzon:AltaBuzon;

    /**
    * Constructor de la clase
    * @param buzonesService - Elemento para realizar las peticiones de alta, baja etc
    * @param formBuilder - Elemento para generar el formulario y
    * aplicar las validaciones correspondientes
    * @param toastService -Servicio de alertas
    * @param router - Servicio para direccionar entre clientes
    */
    constructor(
        private formBuilder: UntypedFormBuilder,
        private buzonesService:ContingenciaService,
        private router:Router,
        private fc:FuncionesComunesComponent,
        private globals: Globals,
        public dialog: MatDialog,
        private translate: TranslateService
    ) { 
        this.altaBuzon = new AltaBuzon();

        /** Se crea el formulario para poder validar los campos */
        this.formAltaEdicionBuzon = this.formBuilder.group({
            nombreBuzon:[
                '',Validators.required
            ],
            vigenciaDias:[
                '',Validators.required
            ],
            expRegular:[
                ''
            ],
            statusLeido:[
                'N'
            ],
            respaldar:[
                'N'
            ]
        });
    }

    /**
    * @description Metodo para poder obtener el objeto de buzon
    * que se va a editar o inicializar el objeto alta de buzon
    */
    getOrCreateAltaBuzonFromLocal(){
        let objectLocalStorage = this.buzonesService.getSaveLocalStorage('buzon');

        if(objectLocalStorage.hasOwnProperty('id')){
            this.altaBuzon = this.buzonesService.getSaveLocalStorage('buzon');
        }else{
            this.altaBuzon.id = 0;
            this.altaBuzon.rutaMBox = '';
            this.altaBuzon.periodoVigencia = '';
            this.altaBuzon.fecha = '';
            this.altaBuzon.mbsize = '';
            this.altaBuzon.numMsg = '';
            this.altaBuzon.regex = '';
            this.altaBuzon.respaldar = 'N';
            this.altaBuzon.statusLeido = 'N';
        }
    }

    /**
    * Inicializacion de componentes
    */
    ngOnInit(): void {
        /** Se obtiene el objeto guardado en el localstorage */
        this.getOrCreateAltaBuzonFromLocal();
    }

    /**
    * @description Evento de KeyPress para el campo dias para permitir solo numeros
    * (keycode >= 48 && keycode <= 57) => numeros
    * @memberOf AltaBuzonesComponent
    */
    numericOnlyAndLimithDays(event:KeyboardEvent){
        if(typeof this.altaBuzon.periodoVigencia === 'undefined' || this.altaBuzon.periodoVigencia === ""){
            return this.fc.validateKeyCode(event);
        }else{
            if(this.altaBuzon.periodoVigencia.length > 0 && this.altaBuzon.periodoVigencia.length < 5){
                return this.fc.validateKeyCode(event);
            }else{
                return false;
            }
        }
    }

    /**
    * @description Evento del keyPress para validar que el campo solo reciba
    * valores alphanumericos
    */
    eventAlphaNumericOnly(event:KeyboardEvent){
        this.fc.alphaNumberOnly(event);
    }

    /**
    * @description Metodo que se usara cuando se active el evento de pegar en el input
    * @memberOf AltaBuzonesComponent
    */
    onPaste(event:any){
        event.preventDefault();
        return false;
    }

    /**
     * @description evento para el evento de pegar en un input
     */
    onPasteCaracters(event: ClipboardEvent){
        let textPasted = event.clipboardData?.getData('text') || '';
        let flag = true;
        for(let i = 0;i < textPasted.length;i++){
            if(!this.fc.alphaNumberOnlyForPasteEvent(textPasted[i].charCodeAt(0))){
                i = textPasted.length;
                flag = false;
            }
        }
        return flag;
    }

    /**
    * Metodo getter para utilziacion y validacion de formulario
    * en la vista
    */
    get formControlBuzon() {
        return this.formAltaEdicionBuzon.controls;
    }

    /**
    * @description Metodo que se ejecutara al momento de dar click en guardar
    */
    saveAltaBuzon(){
        this.submittedBuzonAlta = true;

        if(this.formAltaEdicionBuzon.invalid){
            return;
        }

        /** Validacion para determinar si se actualiza o guarda el buzon */
        if(this.altaBuzon.id > 0){
            /** Se realiza la peticion al servicio de actualizar */
            this.sentRequestServiceUpdate();
        }else{
            /** Se realiza la peticion al servicio de guardar */
            this.sentRequestServiceSave();
        }
    }

    /**
    * @description Metodo para mandar la peticion al servicio de guardar buzon
    */
    private async sentRequestServiceSave(){
        try{
            await this.buzonesService.saveBuzon(this.altaBuzon).then(
                async (result:any) => {
                    this.globals.loaderSubscripcion.emit(false);
                    this.open('',result.message, 'info');
                    this.router.navigate(['/contingencia','consultaVigenciaBuzones']);
                }
            )
        }catch(e){
            this.globals.loaderSubscripcion.emit(false);
            this.open(
              this.translate.instant('modal.msjERRGEN0001Titulo'),
              this.translate.instant('modal.msjERRGEN0001Observacion'),
              'error',
              this.translate.instant('modal.msjERRGEN0001Codigo'),
              this.translate.instant('modal.msjERRGEN0001Observacion')
            );
        }
    }

    /**
    * @description Metodo para mardar la peticion al servicio de actlizar buzon
    */
    private async sentRequestServiceUpdate(){
        try{
            if(this.altaBuzon.respaldar==null){
                this.altaBuzon.respaldar='N';
            }
            await this.buzonesService.actualizarBuzon(this.altaBuzon).then(
                async (result:any) => {
                    this.globals.loaderSubscripcion.emit(false);
                    this.open('',result.message, 'info');
                    this.router.navigate(['/contingencia','consultaVigenciaBuzones']);
                }
            )
        }catch(e){
            this.globals.loaderSubscripcion.emit(false);
            this.open(
              this.translate.instant('modal.msjERRGEN0001Titulo'),
              this.translate.instant('modal.msjERRGEN0001Observacion'),
              'error',
              this.translate.instant('modal.msjERRGEN0001Codigo'),
              this.translate.instant('modal.msjERRGEN0001Observacion')
            );
        }
    }

    /**
    * @description Metodo que se ejecutara al momento de dar click en limpiar 
    */
    cleanForm(){
        this.submittedBuzonAlta = false;
        this.getOrCreateAltaBuzonFromLocal();
    }

    /**
    * @description Evento que se ejecutara al dar click sobre el checkbox
    * para habilitar y deshabilitar el check
    */
    eventCheckUnCheck(event:any,property:string){
        if(event.target.checked){
            if(property === "statusLeido"){
                this.altaBuzon.statusLeido = 'Y';
            }else{
                this.altaBuzon.respaldar = 'Y';
            }
        }else{
            if(property === "statusLeido"){
                this.altaBuzon.statusLeido = 'N';
            }else{
                this.altaBuzon.respaldar = 'N';
            }
        }
    }

    open(
      titulo: string,
      obser: string,
      type?: 'error' | 'info' | 'confirm' | 'alert' | 'help' | 'aviso',
      errorCode?: string,
      sugerencia?: string
    ) {
      this.dialog.open(ModalInfoComponent, {
        data: new ModalInfoBeanComponents(
          titulo,
          obser,
          type,
          errorCode,
          sugerencia
        ), hasBackdrop: true
      });
    }
  
}
