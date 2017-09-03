import { Component, OnInit, AfterViewInit} from '@angular/core';
import { MainService } from './main.service';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Router} from '@angular/router';
import {Request, RequestOptions, RequestMethod} from '@angular/http';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [MainService]
})
export class MainComponent implements OnInit {

  articleArray: Array<any> = [];
  allarticlesArray: Array<any> = [];
  newArticle: string = '';
  searchString: string = "";
  newFollower: string = '';
  articles: Array<any> = [];
  follower = {id: '', name: '', img: "", status: ""};
  imgs: Array<string> = [];
  date;
  currUser: string;
  currUserName: string;
  currPic = "http://pictify.saatchigallery.com/files/works/black-square-1-1349462611_org.jpg";
  status: string = "";
  followerUserArray: Array<any> = [];
  followerArray: Array<any> = [];
  pictureArray: Array<string> = [];
  tempArray: Array<any> = [];
  headers;
  options;
  initAvatar: string = "http://www.lumineers.me/images/core/profile-image-zabadnesterling.gif";
  constructor(private http: Http, private _mainService: MainService, private router: Router) {
    this.headers = new Headers();
    this.headers.append('Access-Control-Allow-Origin', 'https://mrg7comp431folkzonesite1.surge.sh');
    this.options = new RequestOptions({ headers: this.headers, withCredentials: true});
  }

  ngOnInit() {
    this.http.get("https://ricebookmrg7.herokuapp.com/avatars", this.options).subscribe(data =>  {
        if (data.status == 200) {
          this.currPic = data.json().avatar[0];
        }
    }, err => {
        (<HTMLImageElement>document.getElementById("propic")).src = this.initAvatar;
    });
    this.http.get("https://ricebookmrg7.herokuapp.com/email", this.options).subscribe(data =>  {
        if (data.status == 200) {
          this.currUserName = data.json().username;
        }
    });
    this.http.get("https://ricebookmrg7.herokuapp.com/following", this.options).subscribe(data =>  {
        if (data.status == 200) {
          this.currUser = data.json().username;
          this.followerUserArray = data.json().following;
        }

        for (let fol of this.followerUserArray) {
          this.follower = {id: '', name: '', img: "", status: ""}
          this.follower['id'] = fol;
          this.http.get("https://ricebookmrg7.herokuapp.com/avatars/" + fol, this.options).subscribe(data =>  {
              if (data.status == 200) {
                this.pictureArray[String(fol)] = data.json().avatar[0];
                this.follower['name'] = fol;
                this.follower['img'] = data.json().avatar[0];
              }
          });
          this.http.get("https://ricebookmrg7.herokuapp.com/headlines/" + fol, this.options).subscribe(data =>  {
              if (data.status == 200) {
                this.follower['status'] = data.json().headlines[0];
              }
          });
          this.followerArray.push(this.follower);
      }
    });

    this.http.get("https://ricebookmrg7.herokuapp.com/headlines", this.options).subscribe(data =>  {
        if (data.status == 200) {
          this.status = data.json().headlines[0];
        }
    });

    this.http.get("https://ricebookmrg7.herokuapp.com/articles", this.options).subscribe(data =>  {
        if (data.status == 200) {
          this.articleArray = data.json().articles;
          this.allarticlesArray = data.json().articles;
        }
    });
  }


  ngAfterViewInit() {
  	this.pictureArray[this.currUserName] = this.currPic;
  }

  reset() {
  	this.newArticle = '';
  }

  /*
  Function performed when the user clicks update status button.
  */
  updateStatus() {
  	var val = <HTMLTextAreaElement>(document.getElementById("txtStatus"))
  	var txt = val.value;
  	this.status = txt;
    this.http.put("https://ricebookmrg7.herokuapp.com/headline", {headline: this.status} ,this.options).subscribe(data =>  {});
    val.value = '';
  }

  logout() {
    this.http.put("https://ricebookmrg7.herokuapp.com/logout", {}, this.options).subscribe(data =>  {
        if (data.status == 200) {
          this.router.navigate(["/landing"]);
        }
    });
  }

  /*
  Function performed when the user clicks upload post button.
  Adds the posts to the arrays and sets the new article text area to nothing.
  */
  uploadPost() {
    if ((<HTMLInputElement>document.getElementById('upload')).files == null || (<HTMLInputElement>document.getElementById('upload')).files.length ==0) {
      var fd = {text: this.newArticle}
      this.http.post("https://ricebookmrg7.herokuapp.com/article", fd ,this.options).subscribe(data =>  {
          if (data.status == 200) {
            this.newArticle = '';
            (<HTMLInputElement>document.getElementById('upload')).value = "";
            this.http.get("https://ricebookmrg7.herokuapp.com/articles", this.options).subscribe(data =>  {
                                if (data.status != 200) {
                                } else {
                                  this.articleArray = data.json().articles;
                                  this.allarticlesArray = data.json().articles;
                                }
                            });
          }
      });
      } else {
      var file = (<HTMLInputElement>document.getElementById('upload')).files[0];
      const fd = new FormData();
      fd.append('text', this.newArticle);
      fd.append('image', file);
      this.addPost(fd);
    }
    
  }

  addPost(payload) {
    this.http.post("https://ricebookmrg7.herokuapp.com/articleImg", payload ,this.options).subscribe(data =>  {
        if (data.status == 200) {
          this.newArticle = '';
          (<HTMLInputElement>document.getElementById('upload')).value = "";
          this.http.get("https://ricebookmrg7.herokuapp.com/articles", this.options).subscribe(data =>  {
                                if (data.status != 200) {
                                } else {
                                  this.articleArray = data.json().articles;
                                  this.allarticlesArray = data.json().articles;
                                }
                            });
        }
    });
  }

  editComments(ind, comAuthor) {
   var h = document.getElementById(ind).innerHTML;
    var str = "edit" + ind;
    var elems = document.getElementsByClassName(ind);
    (<HTMLElement>elems[0]).style.display = "none";
    (<HTMLElement>elems[1]).style.display = "block";
    document.getElementById(ind).innerHTML = '<br/><textarea class="form-control md-textarea" style="width:100%;min-height:20px;" id= "' + str + '">'+ h + '\r\n</textarea>';
    
  }

  submitComEdit(i, comInd, ind, artId, artUser) {
    var str = "edit" + ind;
    var h = (<HTMLTextAreaElement>document.getElementById(str)).value;
    var elems = document.getElementsByClassName(ind);
    (<HTMLElement>elems[0]).style.display = "block";
    (<HTMLElement>elems[1]).style.display = "none";
    document.getElementById(ind).innerHTML = h;
    
    this.http.put("https://ricebookmrg7.herokuapp.com/articles/" + artId, {text: h, commentId: ind} ,this.options).subscribe(data =>  {
        if (data.status == 200) {
          this.http.get("https://ricebookmrg7.herokuapp.com/articles", this.options).subscribe(data =>  {
                                if (data.status != 200) {
                                } else {
                                  //this.articleArray = data.json().articles;
                                  this.allarticlesArray = data.json().articles;
                                }
                            });
        }
    });
  }

  editArticles(ind, artAuthor) {
    var h = document.getElementById(ind).innerHTML;
    var str = "edit" + ind;
    var elems = document.getElementsByClassName(ind);
    (<HTMLElement>elems[0]).style.display = "none";
    (<HTMLElement>elems[1]).style.display = "block";
    document.getElementById(ind).innerHTML = '<br/><textarea class="form-control md-textarea" class="something" style="width: 100%;min-height:20px;" id= "' + str + '">'+ h + '\r\n</textarea>';
  }

  submitArticleEdit(ind, artId) {
    var str = "edit" + ind;
    var h = (<HTMLTextAreaElement>document.getElementById(str)).value;
    var elems = document.getElementsByClassName(ind);
    (<HTMLElement>elems[0]).style.display = "block";
    (<HTMLElement>elems[1]).style.display = "none";
    document.getElementById(ind).innerHTML = h;
    
    this.http.put("https://ricebookmrg7.herokuapp.com/articles/" + artId, {text: h} ,this.options).subscribe(data =>  {
        if (data.json().status == 200) {
          this.allarticlesArray = data.json().body.articles;
        }
    });
  }

  addComment(i) {
    var elems = document.getElementsByClassName('id'+i);
    (<HTMLElement>elems[0]).style.display = "inline-block";
    (<HTMLElement>elems[1]).style.display = "inline-block";
    (<HTMLElement>elems[2]).style.display = "none";
  }

  submitComment(i, artId, artUser) {
    var elems = document.getElementsByClassName('id'+i);
    var k = (<HTMLTextAreaElement>elems[0]).value;
    (<HTMLTextAreaElement>elems[0]).value = "";
    (<HTMLElement>elems[0]).style.display = "none";
    (<HTMLElement>elems[1]).style.display = "none";
    (<HTMLElement>elems[2]).style.display = "inline-block";

    this.http.put("https://ricebookmrg7.herokuapp.com/articles/" + artId, {text: k, commentId: "-1"} ,this.options).subscribe(data =>  {
        if (data.status == 200) {
          this.http.get("https://ricebookmrg7.herokuapp.com/articles", this.options).subscribe(data =>  {
                                if (data.status != 200) {
                                } else {
                                  this.articleArray = data.json().articles;
                                  this.allarticlesArray = data.json().articles;
                                }
                            });
        }
    });
  }

  /*
  Creates new follower with set image and status. Only the name is updated.
  */
  addFollower() {
    this.follower = {id: '', name: '', img: "", status: ""}
  	if (this.newFollower != '') {
        this.http.put("https://ricebookmrg7.herokuapp.com/following/" + this.newFollower, {}, this.options).subscribe(data =>  {
            if (data.status == 200) {
              this.followerUserArray = data.json().following;
              this.follower['id'] = this.newFollower;
              this.follower['name'] = this.newFollower;
              this.http.get("https://ricebookmrg7.herokuapp.com/avatars/" + this.newFollower, this.options).subscribe(data =>  {
                  if (data.status == 200) {
                    this.follower['img'] = data.json().avatar[0];
                    this.pictureArray[this.newFollower] = data.json().avatar[0];
                    this.http.get("https://ricebookmrg7.herokuapp.com/headlines/" + this.newFollower, this.options).subscribe(data =>  {
                          if (data.status == 200) {
                            this.follower['status'] = data.json().headlines[0];
                            this.followerArray.push(this.follower);
                            this.newFollower = '';
                            this.follower = {id: '', name: '', img: '', status: ''};
                            this.http.get("https://ricebookmrg7.herokuapp.com/articles", this.options).subscribe(data =>  {
                                if (data.status == 200) {
                                  this.articleArray = data.json().articles;
                                  this.allarticlesArray = data.json().articles;
                                }
                            });
                          }
                      });
                  }
              });
            }
        });
        
  	}
  }

  resetU() {
    document.getElementById("invalidUser").style.visibility = "hidden";
  }

  /*Delete the follower*/
  deleteFollower(ind) {
    var userId = this.followerArray[ind].id;
  	this.followerArray.splice(ind, 1);
    this.http.delete("https://ricebookmrg7.herokuapp.com/following/" + userId, this.options).subscribe(data =>  {
        if (data.status == 200) {
          this.followerUserArray = data.json().following;
          this.http.get("https://ricebookmrg7.herokuapp.com/articles", this.options).subscribe(data =>  {
            if (data.status == 200) {
              this.articleArray = data.json().articles;
              this.allarticlesArray = data.json().articles;
            }
        });
        }
    });  
  }

  /*
  Fitlers through the articles based on the search string.
  */
  searchArticles() {
  	if (this.searchString == "") {
      // if empty string, shows all articles
  		this.articles = this.allarticlesArray.slice();
  	} else {
  		var temp: Array<any> = [];
  		for (let entry of this.allarticlesArray) {
        // for every entry checks if the string is in the article 
  			if (entry['text'].search(this.searchString) >= 0) {
          // if so adds to array
  				temp.push(entry);
  			} else if (entry['author'].search(this.searchString) >= 0) {
  				temp.push(entry);
  			}
  		}
  		this.articles = temp;
  	}
  }

  /*Show and hide comments*/
  comments(i: string) {
    var x = document.getElementsByClassName('id'+i);
    if (x != null) {
      for (var j = 0; j < x.length; j++) {
        if (j >= 3) {
          var elem = <HTMLElement>x[j];
            if (elem.style.display == "none") {
              elem.style.display = "block";
            } else {
              elem.style.display = "none";
            }
        }
      }
    }
  }

  getPic(postAuthor: string) {
    if(this.currUserName != null && postAuthor == this.currUserName) return this.currPic;
    if(!(postAuthor in this.pictureArray)) {
      return "http://www.lumineers.me/images/core/profile-image-zabadnesterling.gif";
    }
    return this.pictureArray[postAuthor];
  }

}
