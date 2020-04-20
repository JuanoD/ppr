import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { AuthComponent } from './components/auth/auth.component';
import { ConstraintsInputComponent } from './components/constraints-input/constraints-input.component';
import { ResultComponent } from './components/result/result.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'signin', component: AuthComponent},
  {path: 'signup', component: AuthComponent},
  {path: 'ci', component: ConstraintsInputComponent},
  {path: 'result', component: ResultComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
