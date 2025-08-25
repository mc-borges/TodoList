import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/noauth.guard';
import { NotFoundGuard } from './guards/404.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/initial/initial.component').then(m => m.InitialComponent),
    title: 'Seja bem-vindo(a) ao Tá Feito!',
    canActivate: [NoAuthGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    title: 'Tá Feito - Entrar',
    canActivate: [NoAuthGuard]
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent),
    title: 'Tá Feito - Cadastro',
    canActivate: [NoAuthGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard],
    title: 'Tá Feito - Página Principal'
  },
  {
    path: 'new-checklist',
    loadComponent: () => import('./pages/new-checklist/new-checklist.component').then(m => m.NewChecklistComponent),
    canActivate: [AuthGuard],
    title: 'Tá Feito - Nova Checklist'
  },
  {
    path: 'checklist-tasks/:id',
    loadComponent: () => import('./pages/checklist-tasks/checklist-tasks.component').then(m => m.ChecklistTasksComponent),
    canActivate: [AuthGuard],
    title: 'Tá Feito - Tarefas'
  },
  {
    path: 'edit-checklist/:id',
    loadComponent: () => import('./pages/edit-checklist/edit-checklist.component').then(m => m.EditChecklistComponent),
    canActivate: [AuthGuard],
    title: 'Tá Feito - Editar Checklist'
  },
  {
    path: 'account',
    loadComponent: () => import('./pages/account/account.component').then(m => m.AccountComponent),
    canActivate: [AuthGuard],
    title: 'Tá Feito - Minha Conta'
  },
  {
    path: 'about-us',
    loadComponent: () => import('./pages/about-us/about-us.component').then(m => m.AboutUsComponent),
    title: 'Tá Feito - Sobre Nós'
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent),
    title: 'Tá Feito - Contato'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
    canActivate: [NotFoundGuard]
  }
];
