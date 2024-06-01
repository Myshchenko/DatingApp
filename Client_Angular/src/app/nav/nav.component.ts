import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PresenceService } from '../_services/presence.service';
import { Observable, map } from 'rxjs';
import { User } from '../_models/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit{
  model : any = {};
  onlineUsersCount$: Observable<number> | undefined;

  constructor(public accountService: AccountService, private router: Router,
    private toastr: ToastrService, public presenceService: PresenceService ) {
     }

  ngOnInit(): void {
    if(localStorage.getItem('user') != null && this.router.url == ''){
      this.router.navigateByUrl('members');
    }
    this.onlineUsersCount$ = this.presenceService.onlineUsers$.pipe(
      map(users => users ? Object.keys(users).length : 0)
    );
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: response => {
        this.router.navigateByUrl('/members');
      }
    })
  }

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
