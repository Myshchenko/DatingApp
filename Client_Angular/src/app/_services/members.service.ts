import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService implements OnInit{
  baseUrl = environment.apiUrl;
  paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>;
  likedUsernames: string[] = [];
  

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getLikedUsernames();
    console.log()
  }

  getMember(username: string){
    return this.http.get<Member>(this.baseUrl + 'users/'+ username)
  }

  getMembers(userParams : UserParams){
    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
    
    
    return getPaginatedResult<Member[]>((this.baseUrl + 'users'),params, this.http)
  }

  

  updateMember(member : Member){
    return this.http.put(this.baseUrl + 'users', member);
  }

  setMainPhoto(photoId: number){
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number){
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  addLike(username : string){
    return this.http.post(this.baseUrl + 'likes/' + username, {});
  }

  getLikes(predicate : string, pageNumber : number, pageSize : number){

    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    return getPaginatedResult<Member[]>(this.baseUrl + 'likes', params, this.http);
  }
  getLikedUsernames(){
    return this.http.get<string[]>(this.baseUrl + 'likes/allLiked', {}).subscribe({
      next: responce => this.likedUsernames = responce
    })
  }
  deleteLike(username : string){
    return this.http.delete(this.baseUrl + 'likes/' + username, {});
  }
}
