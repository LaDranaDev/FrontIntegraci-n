import { CurrencyPipe } from '@angular/common';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { FuncionesComunesComponent } from '../components/funciones-comunes.component';

@Directive({
  selector: 'input[customCurrency]'
})
export class CustomCurrencyDirective {

  constructor(private _el: ElementRef,  private fc: FuncionesComunesComponent) {

   }
    lastValidValue: any
    @Input() maxL: number

  @HostListener('input', ['$event'])
  onInput(event:any) {
    // on input, run regex to only allow certain characters and format
    const initalValue = event.target.value;
    const reg = this.maxL === 21 ? /^([0-9]{0,21}(\.[0-9]{0,2})?)$/g: /^([0-9]{0,17}(\.[0-9]{0,2})?)$/g;
    const regExp = reg.test(initalValue)
    if(regExp){
        this.lastValidValue = initalValue
        this._el.nativeElement.value = initalValue
    }else{
        this._el.nativeElement.value = this.lastValidValue
    }
  }  

  @HostListener('focus', ['$event.target.value'])
  onFocus(value:any) {
    // on focus remove currency formatting
    this._el.nativeElement.value = value.replace(/[^0-9.]+/g, '');
    this._el.nativeElement.select();
    this.lastValidValue = this._el.nativeElement.value
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value:any) {
    // on blur, add currency formatting
    this._el.nativeElement.value = this.fc.commas(value);
  }

  @HostListener('keydown.control.z', ['$event.target.value'])
  onUndo(value:any) {
    this._el.nativeElement.value = '';
  }

  commas(valor: string){
    const u = valor
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
    return res
  }
}