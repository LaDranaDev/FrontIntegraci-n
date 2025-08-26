import {
  Directive,
  HostListener,
  ElementRef,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
    selector: '[appInputDisabled]',
})
export class InputWasDisabled {

  @Input() appInputDisabled: String;

  /** Constructor de clase
   * @param el ElementRef
   * @param renderer Renderer2
   */
  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
  ) {
  }
  
  ngOnChanges() {
    //TODO: DEJAR COMO ACTIVO
    if(this.appInputDisabled === 'CANCELADO'){
      this.el.nativeElement.disabled = true;
    }else{
      this.el.nativeElement.disabled = false;
    }
  }
}
