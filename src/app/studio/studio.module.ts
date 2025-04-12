import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudioComponent } from './studio.component';
import { StudioRoutingModule } from './studio-routing.module';
import { SynthModule } from '../synth/synth.module';

@NgModule({
  declarations: [StudioComponent],
  imports: [CommonModule, StudioRoutingModule, SynthModule],
})
export class StudioModule {}
