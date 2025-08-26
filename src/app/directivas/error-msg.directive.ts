import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[error-msg]'
})
export class ErrorMsgDirective implements OnInit {

  htmlElement: ElementRef<HTMLElement>;
  @Input() color: string = '#dc3545';
  @Input() mensaje: string = '';


  constructor(el:ElementRef<HTMLElement>) {
    this.htmlElement = el; 
  }
  ngOnInit():void{
    this.asignarColor()
    this.asignarMensaje();
  }
  asignarColor(){
    this.htmlElement.nativeElement.style.color = this.color;
    this.htmlElement.nativeElement.style.setProperty('font-size', '8px');
  }

  asignarMensaje():void{
    this.htmlElement.nativeElement.innerText = this.mensaje;
  }

}
