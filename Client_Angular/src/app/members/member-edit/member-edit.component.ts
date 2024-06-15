import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Photo } from 'src/app/_models/photo';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit{
  @ViewChild('editForm') editForm : NgForm | undefined;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any){
    if(this.editForm?.dirty){
      $event.returnValue = true;
    }
  }
  member: Member | undefined;
  user: User | null = null;

  private regex? = /^[A-Za-z -]+$/;
  
  constructor(private accountService: AccountService, private memberService: MembersService,
    private toastr: ToastrService, public presenceService : PresenceService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
  }
  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    if(!this.user){
      return;
    }
    this.memberService.getMember(this.user.username).subscribe({
      next: member => this.member = member
    })
  }

  updateMember(){
    if(!this.member?.city || !this.member.country){
      this.toastr.error("You cant leave blank field about your country or city");
      return;
    }

    if(!this.regex?.test(this.member.city) || !this.regex.test(this.member.country)){
      this.toastr.error("Country or city can contain only letters, space or '-'");
      return;
    }

    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: _ => {
        this.toastr.success('Profile updated successfully');
        this.editForm?.reset(this.member);
      }
    });
  }
}
