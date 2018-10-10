import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallbackComponent } from './callback.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { PointComponent } from './point/point.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path:'point/:id',
    component: PointComponent
  },
  {
    path:'about',
    component: AboutComponent
  },
  /*{
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [
      AuthGuard
    ]
  },
  {
    path: 'pengaduan-publik',
    component: PengaduanPublicComponent
  },
  {
    path: 'special',
    component: PrivateDealsComponent,
    canActivate: [
      AuthGuard
    ]
  },
  {
    path: 'profile',
    component: PrivateDealsComponent,
    canActivate: [
      AuthGuard
    ]
  },*/
  {
    path: 'callback',
    component: CallbackComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard],
  exports: [RouterModule]
})
export class AppRoutingModule { }
