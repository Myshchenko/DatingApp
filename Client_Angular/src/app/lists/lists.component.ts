import { Component, OnInit } from '@angular/core';
import { Member } from '../_models/member';
import { MembersService } from '../_services/members.service';
import { Pagination } from '../_models/pagination';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit{
  members: Member[] | undefined;
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 12;
  pagination : Pagination | undefined;

  constructor(private memberService : MembersService) {
  }

  ngOnInit(): void {
    this.memberService.getLikedUsernames();
    this.loadLikes();
  }

  onDelete(username: string) {
    const member = this.members?.find(members => members.userName === username)
    this.members = this.members?.filter(m => m != member)
}

  loadLikes(){
    this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
      next: response => {
        this.members = response.result;
        this.pagination = response.pagination
      }
    })
  }

  pageChanged(event: any){
    if(this.pageNumber !== event.page){
      this.pageNumber = event.page;
      this.loadLikes();
    }
  }

  isLiked(username: string) : boolean{
    return this.memberService.likedUsernames.includes(username.toLowerCase());
  }
}
