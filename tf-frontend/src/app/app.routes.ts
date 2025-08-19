import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/initial/initial.component').then((m) => m.InitialComponent),
    title: 'Seja bem-vindo(a) ao Tá Feito!'
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
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent), canActivate: [AuthGuard],
    title: 'Tá Feito - Página Principal'
  },
  {
    path: 'new-checklist',
    loadComponent: () => import('./pages/new-checklist/new-checklist.component').then((m) => m.NewChecklistComponent), canActivate: [AuthGuard],
    title: 'Tá Feito - Nova Checklist'
  },
  {
    path: 'edit-checklist/:id',
    loadComponent: () => import('./pages/edit-checklist/edit-checklist.component').then((m) => m.EditChecklistComponent), canActivate: [AuthGuard],
    title: 'Tá Feito - Editar Checklist'
  },
  {
    path: 'redefine-password',
    loadComponent: () => import('./pages/redefine-password/redefine-password.component').then((m) => m.RedefinePasswordComponent),
    title: 'Tá Feito - Redefinir Senha'
  },
  {
    path: 'confirm-email',
    loadComponent: () => import('./pages/confirm-email/confirm-email.component').then((m) => m.ConfirmEmailComponent),
    title: 'Tá Feito - Confirmar Email'
  }
];
