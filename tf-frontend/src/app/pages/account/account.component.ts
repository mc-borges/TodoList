import { Component, OnInit } from '@angular/core';
import { UserResponse } from '../../helpers/types/user.type';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';
import { finalize } from 'rxjs';
import { NgxMaskPipe } from 'ngx-mask';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [NgxMaskPipe],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit {
  user!: UserResponse;

  constructor(private auth: AuthService, private loading: LoadingService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData() {
    this.loading.on();

    this.auth.getUserData().pipe(finalize(() => this.loading.off())).subscribe({
      next: (data) => this.user = data,
      error: (e) => console.error(e),
    });
  }

  logout() {
    this.auth.logout();

    this.toastr.success('Logout realizado.');

    this.router.navigate(['/login']);
  }
}
