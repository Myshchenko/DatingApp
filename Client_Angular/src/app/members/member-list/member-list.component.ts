import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit{
  members: Member[] = [];
  pagination: Pagination | undefined;
  userParams : UserParams | undefined;
  user : User | undefined;
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}]

  constructor(private memberService: MembersService, private accountService : AccountService, private toastr : ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user){
          this.userParams = new UserParams(user);
          console.log(this.userParams);  
          this.user = user; 
        }
      }
    })
  }

  ngOnInit(): void {
    this.loadMembers();
    this.memberService.getLikedUsernames();
  }

  loadMembers(){
    if(this.checkUserAgeFilterParams()){
      if(!this.userParams) return;
    this.memberService.getMembers(this.userParams).subscribe({
        next: response => {
          if (response.result && response.pagination){
            this.members = response.result;
            this.pagination = response.pagination;
          }
        }
      })
    }

    
  }

  checkUserAgeFilterParams(){
    if(this.userParams!.minAge < 18 || this.userParams!.maxAge > 150
      || this.userParams!.minAge >= this.userParams!.maxAge
    ){
      this.toastr.error("Invalid 'Age from' or 'Age to', try correct values...")
      return false;
    }
    return true;
  }

  resetFilters(){
    if(this.user){
      this.userParams = new UserParams(this.user);
      this.loadMembers();
    }
  }

  pageChanged(event: any){
    if(this.userParams && this.userParams?.pageNumber !== event.page){
      this.userParams.pageNumber = event.page;
      this.loadMembers();
    }
  }
}
