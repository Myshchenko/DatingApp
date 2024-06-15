import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent {
  @Input() member: Member | undefined;
  @Output() onDelete = new EventEmitter<String>();

  constructor(public presenceService: PresenceService, private membersService: MembersService, private toastr : ToastrService) {
  }

  isLiked(username: string) : boolean{
    return this.membersService.likedUsernames.includes(username.toLowerCase());
  }

  addLike(member : Member){
    this.membersService.addLike(member.userName).subscribe({
      next: () => {
        this.toastr.success('You have liked ' + member.knownAs);
        this.membersService.likedUsernames.push(member.userName);
      }
    })
  }

  deleteLike(member : Member){
    this.membersService.deleteLike(member.userName).subscribe({
      next: () => {
        this.toastr.success('The like has been removed for ' + member.knownAs);
        this.membersService.getLikedUsernames();
      }
    })
    this.onDelete.emit(member.userName);
  }
}
