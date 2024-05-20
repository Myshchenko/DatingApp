import { Component, EventEmitter, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @Output() cancelRegister = new EventEmitter();
  model : any = {};

  constructor(private accountService: AccountService, private toastr: ToastrService, private router: Router){

  }

  register(){
    this.accountService.register(this.model).subscribe({
      next: response => {
        this.cancel();
        this.router.navigateByUrl('/members');
      },
      error: error => this.toastr.error(error.error)
    })
  }

  cancel(){
    this.cancelRegister.emit(false);
}
}
