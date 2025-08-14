import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/initial/initial.component').then((m) => m.InitialComponent),
    title: 'Seja bem-vindo ao Tá Feito!'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
    title: 'Tá Feito - Entrar'
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.component').then((m) => m.SignupComponent),
    title: 'Tá Feito - Cadastro'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Tá Feito - Página Principal'
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/new-checklist/new-checklist.component').then((m) => m.NewChecklistComponent),
    title: 'Tá Feito - Nova Checklist'
  }
];
