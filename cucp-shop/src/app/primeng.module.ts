import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToolbarModule } from 'primeng/toolbar';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule} from 'primeng/menu';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

//Modulos PrimeNg
const modPrime: any = [];

const modPrimeng: any = [
  CardModule,
  InputTextModule,
  ButtonModule,
  ToastModule
];

const modulosPrimeNG: any = [ 
  AvatarModule,
  ButtonModule,
  MenubarModule,
  ToolbarModule,
  TooltipModule,
  MenuModule,
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    modPrime,
    modulosPrimeNG,
    modPrimeng
  ],
  exports:[
    modPrime,  //Agregar Arreglo de Componentes
    modulosPrimeNG,
    modPrimeng
  ]
})
export class PrimengModule { }
