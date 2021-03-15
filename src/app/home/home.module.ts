import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule } from '../layout/layout.module';

const routes : Routes = [
  {
    path : '',
    component: LandingComponent
  },
]

@NgModule({
  declarations: [LandingComponent],
  imports: [
    CommonModule,
    LayoutModule,
    RouterModule.forChild(routes)
  ]
})
export class HomeModule { }
