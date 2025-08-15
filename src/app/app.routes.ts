import { Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { UnderconstructionComponent } from './components/underconstruction/underconstruction.component';

export const routes: Routes = [
  { path: 'profile/:username', component: ProfileComponent },
  { path: '', component: UnderconstructionComponent, pathMatch: 'full' },
];
