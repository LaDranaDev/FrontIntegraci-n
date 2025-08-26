import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',

  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  title = 'Front de Usuarios H2H';

  constructor() { }

  ngOnInit(): void {
  }

}
