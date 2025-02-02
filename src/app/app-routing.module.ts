import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudioModule } from './studio/studio.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => StudioModule,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
