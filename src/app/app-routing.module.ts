import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { LoginComponent } from './pages/login/login.component';
import { HtmlFeatureHandlerComponent } from './pages/html-feature-handler/html-feature-handler.component';


const routes: Routes = [
{ path: '', redirectTo: 'htmlFeatureHandling', pathMatch: 'full' },
{ path: 'login', redirectTo: 'htmlFeatureHandling', pathMatch: 'full' },
{ path: 'login', component: LoginComponent },
{ path: 'htmlFeatureHandling', component: HtmlFeatureHandlerComponent },
{ path: 'pageNotFound', component: PageNotFoundComponent },
{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [  LoginComponent,   PageNotFoundComponent ]
