import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Http, Headers } from '@angular/http';
import {Request, RequestOptions, RequestMethod} from '@angular/http';
import { MainComponent } from '../main/main.component';
import { MainService } from '../main/main.service';

@Component({
  providers:[MainComponent, MainService],
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userName: string;
  currUserName: string;
  status: string = "";
  headers;
  options;
  avatar= "http://pictify.saatchigallery.com/files/works/black-square-1-1349462611_org.jpg";
  articleArray: Array<any> = [];

  constructor(private http: Http, private router: Router, private route: ActivatedRoute, private main: MainComponent, private _mainService: MainService) {
    this.headers = new Headers();
    this.headers.append('Access-Control-Allow-Origin', 'https://mrg7comp431folkzonesite1.surge.sh');
    this.options = new RequestOptions({ headers: this.headers, withCredentials: true});
  }

  ngOnInit() {
  	this.http.get("https://ricebookmrg7.herokuapp.com/email", this.options).subscribe(data =>  {
        if (data.status == 200) {
          this.currUserName = data.json().username;
        }
    });
  	this.route.paramMap.subscribe(params => {
      this.userName = params.get("user");
      this.http.get("https://ricebookmrg7.herokuapp.com/articles/" + this.userName, this.options).subscribe(data =>  {
        if (data.status == 200) {
          this.articleArray = data.json().articles;
        }
    });

    this.http.get("https://ricebookmrg7.herokuapp.com/headlines/" + this.userName, this.options).subscribe(data =>  {
        if (data.status == 200) {
          this.status = data.json().headlines[0];
        }
    });
    this.http.get("https://ricebookmrg7.herokuapp.com/avatars/" + this.userName, this.options).subscribe(data =>  {
	      if (data.status == 200) {
	        this.avatar = data.json().avatar[0];
	      }
	  });
    }, err => {
      console.log(err);
    });
  }

  logout() {
  	this.main.logout();
  }

  editArticles(ind, artAuthor) {
  	this.main.editArticles(ind, artAuthor);
  }

  submitArticleEdit(ind, artId) {
  	this.main.submitArticleEdit(ind, artId);
  }

  addComment(i) {
  	this.main.addComment(i);
  }

  submitComment(i, artId, artUser) {
  	this.main.submitComment(i, artId, artUser);
  }

  comments(i: string) {
  	this.main.comments(i);
  }

  editComments(ind, comAuthor) {
  	this.main.editComments(ind, comAuthor);
  }

  submitComEdit(i, comInd, ind, artId, artUser) {
  	this.main.submitComEdit(i, comInd, ind, artId, artUser);
  }


  getpic(url) {
    if(url != null) {
      return url.json().avatar[0];
    }
  }

}
