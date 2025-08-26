import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import * as moment from 'moment';
import { IDownloadArchivoRequest } from '../pages/contingencia/request/idownloadarchivo-request.component';
import { TranslateService } from '@ngx-translate/core';


/**
 * Banco Santander (Mexico) S.A., Institucion de Banca Multiple, Grupo Financiero Santander Mexico
 * Todos los derechos reservados
 * funciones-comunes.component.ts
 * Control de versiones:
 * Version  Date            By                                   Company    Description
 * -------  -----------    ----------------------------------   --------   -------------------------------------------------------------
 * 1.0      04/09/2019 	   [851907: Ruth Villalpando Herrera]	 TCS	  Creacion de la clase funciones-comunes.ts con las funciones generales
 */

@Injectable()
export class FuncionesComunesComponent {

    /**
     * Descripcion: Funcion que recibe como parametro un String y valida si contiene informacion
     * @param dato Dato como objeto String
     * @param res Tipo de respuesta boolean
     */
    esUndefinedNullVacio(dato: any) {
        let res = false;
        if (dato === undefined || dato === null || dato === '') {
            res = true;
        }
        return res;
    }

    compareDateRangeBigger(ctrlEndDate: string, ctrlStartDate: string) {
        return (formGroup: UntypedFormGroup) => {
            const endDateM = moment(formGroup.controls[ctrlEndDate].value, this.formatDateString);
            const startDateM = moment(formGroup.controls[ctrlStartDate].value, this.formatDateString);
            var a = moment(endDateM);
            var b = moment(startDateM);
            var c = a.diff(b, 'days');
            if ((endDateM.isValid() && startDateM.isValid()) && (c > 90)) {
                formGroup.controls[ctrlEndDate].setErrors({ invalidRange: true });
                formGroup.controls[ctrlStartDate].setErrors({ invalidRange: true });
            }
        }
    }

    /** Descripcion: Metodo que se encarga de convertir el dato a mayusculas */
    upperCase(dato: any) {
        dato = this.esUndefinedNullVacio(dato) ? null : dato.toUpperCase();
        return dato;
    }
    /** Descripcion: Metodo que se encarga de convertir el dato a minusculas */
    lowerCase(dato: any) {
        dato = this.esUndefinedNullVacio(dato) ? null : dato.toLowerCase();
        return dato;
    }

    /* Descripcion: Metodo que se encarga de convertir un string a Capital Case */
    convertirCapitalCase(elemento: string) {
        let newsem = elemento.toLowerCase().split(' ');
        let sem = [];
        for (let word of newsem) {
            sem.push(word.charAt(0).toUpperCase() + word.slice(1));
        }
        return sem.join(' ');
    }

    /* Descripcion: Realiza la copia de un arreglo */
    copiarArreglo(arreglo: any) {
        const arregloTmp: any[] = [];
        arreglo.map((val: any) => {
            arregloTmp.push(Object.assign({}, val));
        });
        return arregloTmp;
    }
    /*
    * Descripcion: Funcion que realiza la busqueda de un valor en un arreglo devolviendo la posicion del
    *              elemento encontrado.
    * @params arrayElement Arreglo del cual se realiza la busqueda
    * @params propertyName Nombre de la propiedad del arreglo
    * @params searchPropertyValue Valor de la propiedad a buscar como cadena
    */
    indexOf(arrayElement: {}[], propertyName: string, searchPropertyValue: string) {
        let contador = -1;
        for (let index = 0; index < arrayElement.length; index++) {
            const element: any = arrayElement[index];
            if (element.hasOwnProperty(propertyName)) {
                if (String(element[propertyName]) === String(searchPropertyValue)) {
                    contador = index;
                    break;
                }
            }
        }
        return contador;
    }

    /**
     * Funcion que retorna un objeto de un arreglo segun la propiedad definida
     * @param arrayElement Arreglo sobre el que se busca el elemento
     * @param propertyName Nombre de la propiedad
     * @param searchPropertyValue Valor de la propiedad que se compara
     */
    getObjectByProperty(arrayElement: {}[], propertyName: string, searchPropertyValue: string): any {
        const indice = this.indexOf(arrayElement, propertyName, searchPropertyValue);
        return arrayElement[indice];
    }

    /** Método para validar y obtener el valor de una propiedad de un objeto
    * @param objeto Objeto sobre el que se busca la propiedad
    * @param propiedad Nombre de la propiedad
    */
    getPropertyObject(objeto: any, propiedad: string): string {
        let valor = '';
        if (objeto && objeto[propiedad]) {
            valor = objeto[propiedad];
        }
        return valor;
    }

    /** Método para validar si una fecha es menor a otra
    * @param fechaInicio fecha inicial
    * @param fechaFin fecha final
    */
    validateDateRange(fechaInicio: string, fechaFin: string): boolean {
        if (fechaInicio !== '' && fechaFin !== '') {
            let fchInSplit = fechaInicio.split('/');
            let fchInDate = new Date(parseInt(fchInSplit[2]), parseInt(fchInSplit[1]) - 1, parseInt(fchInSplit[0]));
            let fchFnSplit = fechaFin.split('/');
            let fchFnDate = new Date(parseInt(fchFnSplit[2]), parseInt(fchFnSplit[1]) - 1, parseInt(fchFnSplit[0]));

            return new Date(fchInDate).valueOf() < new Date(fchFnDate).valueOf();
        } else {
            return true;
        }
    }

    /**
     * Descripcion: Formatea un valor de antrada a un valor numerico
     * @param numeroFormatear Valor a transformar
     */
    obtieneValorNumerico(numeroFormatear: any): number {
        if (numeroFormatear === '' || numeroFormatear === undefined || numeroFormatear === null) {
            numeroFormatear = 0;
        } else {
            numeroFormatear = parseFloat(numeroFormatear.toString());
        }
        return numeroFormatear;
    }

    /**
     * Descripcion: Permite obtener la fecha/hora del sistema
     */
    obtenFechaHoraSistema() {
        let date = new Date();
        let anio = date.getFullYear();
        let dia = date.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
        let month = date.getMonth();
        let hours = date.getHours().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
        let minutes = date.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
        let seconds = date.getSeconds().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
        let hora = (`${hours}${minutes}${seconds}`).toString();
        let fecha = (`${dia}${(month + 1).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}${anio}`).toString();
        return `${fecha}_${hora}`
    }

    /**
    * Funcion que define si viene informado un SI o NO para devolver un booleano
    * @param valor Valor a evaluar
    */
    obtieneValorBooleanoCheckBox(valor: string): boolean {
        let valorAEvaluar = `${valor}`;
        if (valorAEvaluar.toUpperCase().includes('S')) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Transforma un booleano a una cadena S o N segun corresponda
     * @param valor Valor a ser tranformado
     */
    transformaBooleano(valor: boolean): string {
        if (valor) {
            return 'S';
        } else {
            return 'N';
        }
    }

    /**
   * Transforma  a un null Cuando no hay datos en BD
   * @param valor Valor a transformar
   */
    transformarValor(valor: any): string {
        let valorAnt = `${valor}`;
        if (valorAnt === '' || valorAnt === null || valorAnt === undefined) {
            return 'null';
        } else {
            return valor;
        }
    }

    /**
     * Funcion que elimina el estilo que se queda en los campos que son alterados por la directiva inputMask
     * Al limpiar los campos, la limpieza se hace de manera programatica, por tanto, no hay un evento del teclado
     * que informe al inputMask que se ha eliminado el contenido del input.
     * Por tanto, para eliminar el estilo negro (que se aplica tambien al place holder por estar en el input),
     * se debe acceder a su referencia html y quitar el atributo style
     * @param listadoInput
     */
    eliminaBadBoyAlertStyle(listadoInput: any): void {
        for (let valor = 0; valor < listadoInput.length; valor++) {
            const item = listadoInput[valor];
            item.removeAttribute('style');
        }
    }

    /**
    * Aplica marcara a Nombre de documento (25 carateres ...)
    * @param valor Valor a transformar
    */
    aplicaMascara(valor: string): string {
        let respuesta = valor;
        if (valor) {
            respuesta = `${valor.substring(0, 65)}...`;
        }
        return respuesta;
    }

    /**
    * @description Evento onkeypress para permitir solo valores alphanumericos y /
    * (keycode >= 65 && keycode <= 90) => alphabeto mayusculas
    * (keycode >= 97 && keycode <= 122) => alphabeto minusculas
    * (keycode >= 48 && keycode <= 57) => numeros
    * (keycode == 47) => /
    * @param event:KeyboardEvent Evento que se activo en el input al dar click en una tecla
    * @memberOf ConsultarBuzonesComponent
    */
    alphaNumberOnly(event: KeyboardEvent) {
        var charCode = (event.which) ? event.which : event.keyCode;
        if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    /**
    * @description Evento onkeypress para permitir solo valores alphanumericos y /
    * (keycode >= 65 && keycode <= 90) => alphabeto mayusculas
    * (keycode >= 97 && keycode <= 122) => alphabeto minusculas
    * (keycode >= 48 && keycode <= 57) => numeros
    * (keycode == 44) => ,
    * @param event:KeyboardEvent Evento que se activo en el input al dar click en una tecla
    * @memberOf ConsultarBuzonesComponent
    */
    alphaNumberAndComaOnly(event: KeyboardEvent) {
        var charCode = (event.which) ? event.which : event.keyCode;
        if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57) || (charCode ===8) || (charCode ===44) || (charCode ===32)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

     /**
   * @description Evento paste para permitir solo valores alphanumericos y /
   * (keycode >= 65 && keycode <= 90) => alphabeto mayusculas
   * (keycode >= 97 && keycode <= 122) => alphabeto minusculas
   * (keycode >= 48 && keycode <= 57) => numeros
   * (keycode == 44) => coma
   * @param event:KeyboardEvent Evento que se activo en el input al dar click en una tecla
   * @memberOf ConsultarBuzonesComponent
   */
     alphaNumberAndComaOnlyPasteEvent(charCode: number) {
        if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57) || (charCode ===8) || (charCode ===44) || (charCode ===32)) {
            return true;
        } else {
            return false;
        }
    }

    /**
    * @description Evento onkeypress para permitir solo valores alphanumericos y /
    * (keycode >= 65 && keycode <= 90) => alphabeto mayusculas
    * (keycode >= 97 && keycode <= 122) => alphabeto minusculas
    * (keycode >= 48 && keycode <= 57) => numeros
    * (keycode == 32) => espacio
    * (keycode == 46) => punto
    * @param event:KeyboardEvent Evento que se activo en el input al dar click en una tecla
    * @memberOf ConsultarBuzonesComponent
    */
    alphaNumberPointAndSpaceOnly(event: KeyboardEvent) {
        var charCode = (event.which) ? event.which : event.keyCode;
        if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57) || (charCode == 47)
            || (charCode == 46) || (charCode == 32)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    /**
   * @description Evento paste para permitir solo valores alphanumericos y /
   * (keycode >= 65 && keycode <= 90) => alphabeto mayusculas
   * (keycode >= 97 && keycode <= 122) => alphabeto minusculas
   * (keycode >= 48 && keycode <= 57) => numeros
   * (keycode == 32) => espacio
   * (keycode == 46) => punto
   * @param event:KeyboardEvent Evento que se activo en el input al dar click en una tecla
   * @memberOf ConsultarBuzonesComponent
   */
    alphaNumberPointAndSpaceOnlyPasteEvent(charCode: number) {
        if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57) || (charCode == 47)
            || (charCode == 46) || (charCode == 32)) {
            return true;
        } else {
            return false;
        }
    }


    /**
    * @description Evento paste para permitir solo valores numericos
    * (keycode >= 48 && keycode <= 57) => numeros
    * @param charCode: valor que se validara para determinar si el codeChart
    * es un numerico en caso de no cumplir se
    * regresara false
    * @memberOf ConsultarBuzonesComponent
    */
    numberOnlyForPasteEvent(charCode: number) {
        if ((charCode >= 48 && charCode <= 57)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @description Evento para solo permitir valores del alphabeto
     * (keycode >= 65 && keycode <= 90) => alphabeto mayusculas
     * (keycode >= 97 && keycode <= 122) => alphabeto minusculas
     * (keycode >= 48 && keycode <= 57) => numeros
     */
    onlyAlphabeticAndNumbers(event: KeyboardEvent) {
        var charCode = (event.which) ? event.which : event.keyCode;
        if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    /**
     * Evento para solo permitir valores del alphabeto
     * (keycode >= 65 && keycode <= 90) => alphabeto mayusculas
     * (keycode >= 97 && keycode <= 122) => alphabeto minusculas
     * (keycode >= 48 && keycode <= 57) => numeros
    */
    alphaNumerciOnlyForPasteEvent(charCode: number) {
        if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57)) {
            return true;
        } else {
            return false;
        }
    }

    /**
    * @description Evento paste para permitir solo valores numericos
    * (keycode >= 48 && keycode <= 57) => numeros
    * (keycode == 46) => punto decimal (decimal point)
    */
    numberOnlyAndPoint(event: KeyboardEvent) {
        var charCode = (event.which) ? event.which : event.keyCode;
        if ((charCode >= 48 && charCode <= 57) || charCode == 46) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

     /**
    * @description
    * (keycode >= 65 && keycode <= 90) => alphabeto mayusculas
     * (keycode >= 97 && keycode <= 122) => alphabeto minusculas
     * (keycode >= 48 && keycode <= 57) => numeros
     * . = 46
     * / = 47
     * , = 44
     * espacio = 32
    */
     nombre(event:KeyboardEvent){
        var charCode = (event.which) ? event.which : event.keyCode;
        if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57) || charCode ==46 || charCode == 47 || charCode ==  44 || charCode ==  32) {
            return true;
        }else{
            event.preventDefault();
            return false;
        }
    }



    /**
     * @description Evento para solo permitir que se
     * pegen valores de numeros y el punto
     * (keycode >= 48 && keycode <= 57) => numeros
     * (keycode == 46) => punto decimal (decimal point)
     */
    numbersAndPointForPasteEvent(charCode: number) {
        if ((charCode >= 48 && charCode <= 57) || charCode == 46) {
            return true;
        } else {
            return false;
        }
    }

    /**
    * @description Evento paste para permitir solo valores alphanumericos y /
    * (keycode >= 65 && keycode <= 90) => alphabeto mayusculas
    * (keycode >= 97 && keycode <= 122) => alphabeto minusculas
    * (keycode >= 48 && keycode <= 57) => numeros
    * (keycode == 47) => /
    * @param charCode: valor que se validara para determinar si el codeChart
    * es un numerico o pertenece al alphabeto en caso de no cumplir se
    * regresara false
    * @memberOf ConsultarBuzonesComponent
    */
    alphaNumberOnlyForPasteEvent(charCode: number) {
        if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57) || (charCode == 47)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @description Evento para solo permitir valores del alphabeto,numeros,
     * guion bajo y punto
     * (keycode >= 65 && keycode <= 90) => alphabeto mayusculas
     * (keycode >= 97 && keycode <= 122) => alphabeto minusculas
     * (keycode >= 48 && keycode <= 57) => numeros
     * (keycode) == 95 => guion
     * (keycode) == 46 => point
     */
    onlyAlphabeticAndNumbersAndGuionAndPoint(event: KeyboardEvent) {
        var charCode = (event.which) ? event.which : event.keyCode;
        if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57) || charCode == 95 || charCode == 46) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    /**
     * @description Evento para solo permitir valores del alphabeto,numeros,
     * guion bajo y punto
     * (keycode >= 65 && keycode <= 90) => alphabeto mayusculas
     * (keycode >= 97 && keycode <= 122) => alphabeto minusculas
     * (keycode >= 48 && keycode <= 57) => numeros
     * (keycode) == 95 => guion
     * (keycode) == 46 => point
     * (keycode) == 46 => guion bajo
     * (keycode) == 46 => espacio
     */
    onlyAlphabeticEspe(event: KeyboardEvent) {
        var charCode = (event.which) ? event.which : event.keyCode;
        if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) ||
            (charCode >= 48 && charCode <= 57) || charCode == 95 || charCode == 45 || charCode == 46 || charCode == 32) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    /**
     * @description Especial
     * (keycode >= 65 && keycode <= 90) => alphabeto mayusculas
     * (keycode >= 97 && keycode <= 122) => alphabeto minusculas
     * (keycode >= 48 && keycode <= 57) => numeros
     * (keycode) == 95 => guion
     * (keycode) == 46 => point
     * (keycode) == 46 => guion bajo
     * (keycode) == 46 => espacio
     * (keycode) == 46 => punto
     * (keycode) == 42 => *
     * (keycode) == 47 => /
     */
    especial(event: KeyboardEvent) {
        var charCode = (event.which) ? event.which : event.keyCode;
        if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) ||
            (charCode >= 48 && charCode <= 57) || charCode == 95 || charCode == 45 || charCode == 46 || charCode == 47 || charCode == 42) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }


    /**
     * @description Evento para solo permitir valores del alphabeto,numeros, 
     * guion bajo, punto, espacio, : y arroba
     * (keycode >= 65 && keycode <= 90) => alphabeto mayusculas
     * (keycode >= 97 && keycode <= 122) => alphabeto minusculas
     * (keycode >= 48 && keycode <= 57) => numeros
     * (keycode) == 95 => guion
     * (keycode) == 46 => point
     * (keycode) == 32 => espacio
     * (keycode) == 58 => :
     * (keycode) == 64 => @
     */
    onlyAlphabeticAndNumbersAndSomeCaracEsp(event: KeyboardEvent) {
        var charCode = (event.which) ? event.which : event.keyCode;
        if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57)
            || charCode == 95 || charCode == 46 || charCode == 32 || charCode == 58 || charCode == 64) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    /**
     * @description Evento para solo permitir valores del alphabeto,numeros, 
     * guion bajo, punto, espacio, : y arroba
     * (keycode >= 65 && keycode <= 90) => alphabeto mayusculas
     * (keycode >= 97 && keycode <= 122) => alphabeto minusculas
     * (keycode >= 48 && keycode <= 57) => numeros
     * (keycode) == 95 => guion
     * (keycode) == 46 => point
     * (keycode) == 32 => espacio
     * (keycode) ==  => 
     * (keycode) == 64 => @
     */
    esp(event: KeyboardEvent) {
        var charCode = (event.which) ? event.which : event.keyCode;
        if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57)
            || charCode == 95 || charCode == 46 || charCode == 32  || charCode == 64 || charCode == 36 || charCode == 38 || charCode == 47 || charCode == 40 || charCode == 41
            || charCode == 63 || charCode == 191 || charCode == 43 || charCode == 123 || charCode == 125  || charCode == 91  || charCode == 93  || charCode == 44  || charCode == 60 || charCode == 62
            || charCode == 32) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    /**
    * @description Metodo que se usara solo para validar si el keycode es numero
    * (keycode >= 48 && keycode <= 57) => numeros
    * @memberOf AltaBuzonesComponent
    */
    validateKeyCode(e: any) {
        var charCode = (e.which) ? e.which : e.keyCode;
        if ((charCode >= 48 && charCode <= 57)) {
            return true;
        } else {
            e.preventDefault();
            return false;
        }
    }

    

    /**
     * @description Metodo para tomar la fecha con formato de separacion
     * 01/01/2022 y cambiarlo por el formato de separcion de 01-01-2022
     * @param dateFormat
     * @returns nameMonth variable que contiene el formato de la fecha
     */
    parseFormatDate(dateFormat: string) {
        let nameMonth = "";
        let splitMonthArr = dateFormat.split('/');
        nameMonth = splitMonthArr[2] + '-' + splitMonthArr[1] + '-' + splitMonthArr[0];

        return nameMonth;
    }

    private formatDateString = "DD/MM/YYYY";
    /**
     * @description Metodo para validar que la fecha inicial no es mayor
     * a la fecha final
     * @param ctrlStartDate contiene la fecha inicial
     * @param ctrlEndDate contiene la fecha final
     * @returns
     */
    compareStartDateBiggerThanEnd(ctrlStartDate: string, ctrlEndDate: string) {
        return (formGroup: UntypedFormGroup) => {
            const startDateM = moment(formGroup.controls[ctrlStartDate].value, this.formatDateString);
            const endDateM = moment(formGroup.controls[ctrlEndDate].value, this.formatDateString);

            if (startDateM.isAfter(endDateM)) {
                formGroup.controls[ctrlStartDate].setErrors({ startDateMayor: true });
            } else {
                formGroup.controls[ctrlStartDate].setErrors(null);
            }
        }
    }

    /**
     * @description Metodo para validar que la fecha final no sea menor
     * a la fecha inicial
     * @param ctrlEndDate contiene la fecha final
     * @param ctrlStartDate contiene la fecha inicial
     * @returns
     */
    compareEndDateBiggerThanStart(ctrlEndDate: string, ctrlStartDate: string) {
        return (formGroup: UntypedFormGroup) => {
            const endDateM = moment(formGroup.controls[ctrlEndDate].value, this.formatDateString);
            const startDateM = moment(formGroup.controls[ctrlStartDate].value, this.formatDateString);

            if (endDateM.isBefore(startDateM)) {
                formGroup.controls[ctrlEndDate].setErrors({ endDateMenor: true });
            } else {
                formGroup.controls[ctrlEndDate].setErrors(null);
            }
        }
    }

    /**
     * @description Metodo para poder validar que los campos de fecha y el campo
     * numero de cliente o contrato sean campos obligatorios
     * @param ctrlDateStart contiene la fecha inicial
     * @param ctrlDateEnd contiene la fecha final
     * @param ctrlNumClient contiene el numero del cliente
     * @param ctrlContrato contiene el numero del contrato
     * @returns
     */
    validateDatesAndNumClienteOrContratoField(ctrlDateStart: string, ctrlDateEnd: string, ctrlNumClient: string, ctrlContrato: string) {
        return (formGroup: UntypedFormGroup) => {
            const startDate = moment(formGroup.controls[ctrlDateStart].value, this.formatDateString);
            const endDate = moment(formGroup.controls[ctrlDateEnd].value, this.formatDateString);
            const numCliente = formGroup.controls[ctrlNumClient].value;
            const contrato = formGroup.controls[ctrlContrato].value;

            if ((startDate.isValid() && endDate.isValid()) && numCliente === "" && contrato === "") {
                formGroup.controls[ctrlNumClient].setErrors({ numClienteEmpty: true });
                formGroup.controls[ctrlContrato].setErrors({ contratoEmpty: true });
            } else {
                formGroup.controls[ctrlNumClient].setErrors(null);
                formGroup.controls[ctrlContrato].setErrors(null);
            }
        }
    }

    /**
    * Metodo que obtendra el listado de ids que fueron seleccionados en la tabla
    *
    * @param NombreIdCheckbox nombre del id que tiene el checkbox
    */
    getAllCheckboxSelectedInTable(nombreIdCheck: string) {
        let arrayIds: number[] = [];
        let items: any = document.getElementsByName(nombreIdCheck);
        for (var i = 0; i < items.length; i++) {
            if (items[i]['checked'] === true) {
                arrayIds.push(Number(items[i]['value']));
            }
        }
        return arrayIds;
    }

    /**
    * Metodo para poder descargar el archivo
    *
    * @param listFilesDown contiene la lista de todos los archivos
    * que se descargaran
    */
    convertBase64ToDownloadFile(listFilesDown: any) {
        for (var i = 0; i < listFilesDown.length; i++) {
            var sampleArr = this.base64ToArrayBugffer(listFilesDown[i].srcfile);
            var blob = new Blob([sampleArr], { type: listFilesDown[i].mimetype });
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = listFilesDown[i].nameFile;
            link.click();
        }
    }

    /**
    * Metodo para poder descargar el archivo al
    * momento de realizar la exportacion
    * del pdf o csv o excel
    */
    convertBase64ToDownloadFileInExport(result: any) {
        var sampleArr = this.base64ToArrayBugffer(result.data);
        var blob = new Blob([sampleArr], { type: result.type });
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = result.name;
        link.click();
    }

    /**
    * Metodo para poder convertir la cadena en base64 a un arreglo de bytes
    * @param base64 Contiene la informacion del archivo en base64
    * @returns bytes contiene la informacion en arreglo de bytes
    */
    private base64ToArrayBugffer(base64: any) {
        var binaryString = window.atob(base64);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
            var ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes;
    }

    /**
    * Metodo para poder leer la tabla y obtener los renglones y celdas
    * para poder obtener el check habilitado y el nombre del archivo
    * @param nombreTable Contiene la nombre de la tabla
    */
    readTableFilesRar(nombreTable: string) {
        var myTab: any = document.getElementById(nombreTable);
        var arrFilesDownloadRar: IDownloadArchivoRequest[] = [];
        //Se recorre cada renglon de la tabla
        for (var i = 1; i < myTab['rows'].length; i++) {
            //Se identifica si el renglon contiene su checkbox checked o no
            var banderaCheck = false;
            //Variables para guardar informacion del archivo requerida
            var nameFile = "";
            var idArchivoPk = 0;
            //Se obtienen las celdas del renglon actual
            var myCells = myTab['rows'].item(i).cells;
            //Validacion para determinar si el renglon contiene checkbox o no
            if (myCells.item(0).children[0] !== undefined) {
                //Se recorre cada celda para poder realizar validaciones
                for (var j = 0; j < myCells.length; j++) {
                    if (j == 0 && myCells.item(j).children[0].checked) {
                        banderaCheck = true;
                        idArchivoPk = myCells.item(j).children[0].value;
                    } else if (j == myCells.length - 2 && banderaCheck) {
                        nameFile = myCells.item(j).textContent;
                    }
                }
                //Se valida si se crea el objeto y se agrega a un arreglo
                if (banderaCheck) {
                    arrFilesDownloadRar.push({
                        idSoliArch: idArchivoPk,
                        nombreFile: nameFile
                    })
                }
            }
        }
        return arrFilesDownloadRar;
    }

    /**
   * @description Evento onkeypress para permitir solo valores numericos
   * (keycode >= 48 && keycode <= 57) => numeros
   * (keycode == 47) => /
   * @param event:KeyboardEvent Evento que se activo en el input al dar click en una tecla
   * @memberOf ConsultarBuzonesComponent
   */

    numberOnly(event: KeyboardEvent) {
        const charCode = (event.which) ? event.which : event.keyCode;
        if ((charCode >= 48 && charCode <= 57)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    numberDecimal(event: KeyboardEvent) {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode==46 || (charCode >= 48 && charCode <= 57)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    /**
     * Solo numeros
     */

    numeros(event: KeyboardEvent) {
        const charCode = (event.which) ? event.which : event.keyCode;
        if ((charCode >= 48 && charCode <= 57)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    numerosP(charCode: number) {
        if ((charCode >= 48 && charCode <= 57)) {
            return true;
        } else {
            return false;
        }
    }


    /**
 * @description Evento onkeypress para permitir solo valores alphanumericos y espacios /
 * @param event:KeyboardEvent Evento que se activo en el input al dar click en una tecla
 */
    alphaNumberSpace(event: KeyboardEvent) {
        var regex = new RegExp("^[a-zA-Z0-9 ]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        } else {
            return true;
        }
    }

    /**
     * Testo nomas
     * 
     */
    texto(event: KeyboardEvent) {
        var charCode = (event.which) ? event.which : event.keyCode;
        if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) ||
            (charCode >= 48 && charCode <= 57) || (charCode == 32) || (charCode == 95) || (charCode == 45) ||
            (charCode == 58) || (charCode == 46) || (charCode == 63) || (charCode == 91) || (charCode == 93) ||
            (charCode == 123) || (charCode == 125) || (charCode == 60) || (charCode == 62) || (charCode == 38) ||
            (charCode == 37) || (charCode == 44) || (charCode == 40) || (charCode == 41) || (charCode == 61) || (charCode == 124)) { // Faltan 
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    textoCopy(charCode: number) {
        if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) ||
            (charCode >= 48 && charCode <= 57) || (charCode == 32) || (charCode == 95) || (charCode == 45) ||
            (charCode == 58) || (charCode == 46) || (charCode == 63) || (charCode == 91) || (charCode == 93) ||
            (charCode == 123) || (charCode == 125) || (charCode == 60) || (charCode == 62) || (charCode == 38) ||
            (charCode == 37) || (charCode == 44) || (charCode == 40) || (charCode == 41) || (charCode == 61) || (charCode == 124)) { // Faltan 
            return true;
        } else {
            return false;
        }
    }

    /**
     * Testo nomas
     * 
     */
    texto2(event: KeyboardEvent) {
        var charCode = (event.which) ? event.which : event.keyCode;
        if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) ||
            (charCode >= 48 && charCode <= 57) || (charCode == 32) || (charCode == 95) || (charCode == 45) ||
            (charCode == 58) || (charCode == 46) || (charCode == 63) || (charCode == 91) || (charCode == 93) ||
            (charCode == 123) || (charCode == 125) || (charCode == 60) || (charCode == 62) || (charCode == 38) ||
            (charCode == 37) || (charCode == 44) || (charCode == 40) || (charCode == 41) || (charCode == 61) ||
            (charCode == 124) || (charCode == 92)) { // Faltan 
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    textoCopy2(charCode: number) {
        if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) ||
            (charCode >= 48 && charCode <= 57) || (charCode == 32) || (charCode == 95) || (charCode == 45) ||
            (charCode == 58) || (charCode == 46) || (charCode == 63) || (charCode == 91) || (charCode == 93) ||
            (charCode == 123) || (charCode == 125) || (charCode == 60) || (charCode == 62) || (charCode == 38) ||
            (charCode == 37) || (charCode == 44) || (charCode == 40) || (charCode == 41) || (charCode == 61) ||
            (charCode == 124) || (charCode == 92)) { // Faltan 
            return true;
        } else {
            return false;
        }
    }

    /**
     * 
     * @param texto
     * @param numeros
     * @param espacio
     * @param guionBajo
     * @param guionMedio
     * @returns 
     */
    numerosCaracteres(event: KeyboardEvent) {
        var charCode = (event.which) ? event.which : event.keyCode;
        if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) ||
            (charCode >= 48 && charCode <= 57) || (charCode == 32) || (charCode == 95) || (charCode == 45)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    numerosCaracteresCopy(charCode: number) {
        if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) ||
            (charCode >= 48 && charCode <= 57) || (charCode == 32) || (charCode == 95) || (charCode == 45)) {
            return true;
        } else {
            return false;
        }
    }


    validaLetrasNumerosCaractEsp(event: KeyboardEvent) {

        var browserName = navigator.appName;
        var key = (event.charCode) ? event.charCode :
            ((event.keyCode) ? event.keyCode : ((event.which) ? event.which : 0));
        //alert(key);
        //(key >= 48 && key <= 57) numeros
        //(key >= 97 && key <= 122) a-z 
        //(key >= 65 && key <= 90)
        //241 209  
        //95 guion _
        //32 espacio //58 :  //64,46  @ y . 
        return ((key >= 48 && key <= 57)
            || (key >= 97 && key <= 122)
            || (key >= 65 && key <= 90)
            || key == 241 || key == 209 || key == 8
            || key == 95 || key == 32 || key == 58
            || key == 9 || key == 64 || key == 46);

    }

    validaKey(e:KeyboardEvent,nameInput? :string):any{
	    var key;
	    var specialKeys;
	    var letrasEspeciales;
	    var spaceComaPuntoDiagonal;
	    
	    window.event ? key = e.keyCode :  key = e.which;
	    specialKeys = (!window.event && (e.keyCode == 46 || e.keyCode == 37 || e.keyCode == 39)) ? true : false;
	    letrasEspeciales = (key == 241 || key == 209 || key == 193 || key == 201 || key == 205 || key == 211 || key == 218 || key == 225 || key == 233 || key == 237 || key == 243 || key == 250 )? true : false 
		spaceComaPuntoDiagonal = (key == 32 ||  key == 44 ||  key == 46 ||  key == 47 )? true : false 
        
	    if(nameInput =='nameBackend'){            
	    	return ((key >= 48 && key <= 57)||(key > 64 && key < 91) || (key > 96 && key < 123) || key == 8 || letrasEspeciales || spaceComaPuntoDiagonal || specialKeys);
    	
	    }else if(nameInput =='address'){
	    	return ((key >= 48 && key <= 57) || key == 46 || key == 8 || specialKeys);
	    }
        

    }

    commas(valor: string): string{
        const splitV = valor.split('.')
        const stringToconvert =splitV[0] as string;
        const decimalString = splitV[1] as string
        const u = stringToconvert
        let nums = new Array();
        const simb = ","
        nums = u.split("");
        const long = nums.length -1;
        const patron = 3;
        let prox =2;
        let res = '';
    
        while(long > prox){
          nums.splice((long -prox), 0, simb);
          prox += patron;
        }
    
        for(let i = 0; i<=nums.length-1; i++){
          res += nums[i]
        }
        return `$${res ? res: '0'}.${decimalString ? decimalString : '00'}`
      }
}
