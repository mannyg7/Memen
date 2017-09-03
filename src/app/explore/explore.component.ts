import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import {Router} from '@angular/router';
import {Request, RequestOptions, RequestMethod} from '@angular/http';
import { MainComponent } from '../main/main.component';
import { MainService } from '../main/main.service';
import { Pipe, PipeTransform } from '@angular/core';
import { PipemodulePipe } from '../pipemodule.pipe';
import { SafeurlPipe } from '../safeurl.pipe';

@Component({
  providers:[MainComponent, MainService],
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {

  articleArray: Array<any> = [];
  articlesSize = 0;
  status: string = "";
  currUserName: string;
  finished = false;
  avatar= "https://hyperallergic.com/wp-content/uploads/2015/11/Allais_blacksquare-HOME.jpg";
  elem: HTMLElement = <HTMLElement>document.getElementsByClassName('leftcolumn')[0];
  headers;
  options;

  constructor(private http: Http, private router: Router, private main: MainComponent, private _mainService: MainService) {
    this.headers = new Headers();
    this.headers.append('Access-Control-Allow-Origin', 'https://mrg7comp431folkzonesite1.surge.sh');
    this.options = new RequestOptions({ headers: this.headers, withCredentials: true});
  }

  ngOnInit() {
    this.http.get("https://ricebookmrg7.herokuapp.com/email", this.options).subscribe(data =>  {
        if (data.status == 200) {
          this.currUserName = data.json().username;
          this.http.get("https://ricebookmrg7.herokuapp.com/headlines/" + this.currUserName, this.options).subscribe(data =>  {
              if (data.status == 200) {
                this.status = data.json().headlines[0];
              }
          });
          this.http.get("https://ricebookmrg7.herokuapp.com/avatars/" + this.currUserName, this.options).subscribe(data =>  {
              if (data.status == 200) {
                this.avatar = data.json().avatar[0];
              }
          });
        }
    });

    this.http.get("https://ricebookmrg7.herokuapp.com/explore/0", this.options).subscribe(data =>  {
        if (data.status == 200) {
          this.articleArray = data.json().articles[0];
        }
    });
    
  }

  onScrollDown (ev) {
    this.http.get("https://ricebookmrg7.herokuapp.com/explore/" + this.articleArray.length, this.options).subscribe(data =>  {
        if (data.status == 200) {
          if (data.json().articles[0].length == 0) {
            this.finished = true;
          }
          this.articleArray = this.articleArray.concat(data.json().articles[0]);
        }
    }, err => {
      this.finished = true;
    });
  }

  logout() {
    this.main.logout();
  }

  getpic(url) {
    if(url != null) {
      return url.json().avatar[0];
    }
  }

}
