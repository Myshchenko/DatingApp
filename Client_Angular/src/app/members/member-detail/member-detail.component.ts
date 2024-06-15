import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TimeagoModule, TimeagoPipe } from 'ngx-timeago';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-detail',
  standalone: true, 
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
  imports : [CommonModule, TabsModule, GalleryModule, TimeagoModule]
})
export class MemberDetailComponent implements OnInit {
  member: Member | undefined;
  images: GalleryItem[] = []

  constructor(private membersService: MembersService, private route: ActivatedRoute,
    public presenceService: PresenceService, private toastr : ToastrService) {

  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    const username = this.route.snapshot.paramMap.get('username');
    if(!username) return;
    this.membersService.getMember(username).subscribe({
      next: member => {
        this.member = member,
        this.getImages()
      }
    })
  }

  getImages(){
    if(!this.member) return;
    for(const photo of this.member.photos){
      this.images.push(new ImageItem({
        src: photo.url,
        thumb: photo.url
      }))
    }
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
  }

  isLiked(username: string) : boolean{
    return this.membersService.likedUsernames.includes(username.toLowerCase());
  }
}
