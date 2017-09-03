import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import {NgForm} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Request, RequestOptions, RequestMethod} from '@angular/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

@NgModule({
  imports: [
    FormsModule
  ]
})

export class ProfileComponent implements OnInit {

  accountInfo = {name: "", displayName: '', email: '', phone: '', dob: '', zipcode: '', password: '', passwordConfirm: ''};
  currAccountInfo = {name: '', displayName: '', email: '', phone: '123-123-1234', dob: '', zipcode: '', password: '', passwordConfirm: ''};
  loginInfo = {username: '', password: ''};
  name = this.currAccountInfo.name;
  initAvatar: string = "https://www.lumineers.me/images/core/profile-image-zabadnesterling.gif";
  headers;
  options;
  constructor(private http: Http) {
    this.headers = new Headers();
    this.headers.append('Access-Control-Allow-Origin', 'https://mrg7comp431folkzonesite1.surge.sh');
    this.options = new RequestOptions({ headers: this.headers, withCredentials: true });
  }

  ngOnInit() {
    this.http.get("https://ricebookmrg7.herokuapp.com/avatars", this.options).subscribe(data =>  {
        if (data.status == 200) {
          (<HTMLImageElement>document.getElementById("propic")).src = data.json().avatar[0];
        }
    }, err => {
        (<HTMLImageElement>document.getElementById("propic")).src = this.initAvatar;
    });

    this.http.get("https://ricebookmrg7.herokuapp.com/email", this.options).subscribe(data =>  {
        if (data.status == 200) {
          this.currAccountInfo['name'] = data.json().username;
          this.currAccountInfo['email'] = data.json().email;
        }
    });

    this.http.get("https://ricebookmrg7.herokuapp.com/zipcode", this.options).subscribe(data =>  {
        if (data.status == 200) {
          this.currAccountInfo['zipcode'] = data.json().zipcode;
        }
    });

    this.http.get("https://ricebookmrg7.herokuapp.com/dob", this.options).subscribe(data =>  {
        if (data.status == 200) {
          this.currAccountInfo['dob'] = data.json().dob;
        }
    });
  }

  reset() {
    document.getElementById("pwdsWrong").style.visibility = "hidden";
  }

  handleFiles() {
    const file = (<HTMLInputElement>document.getElementById('upload')).files[0];
    const fd = new FormData();
    fd.append('image', file);
    this.http.post("https://ricebookmrg7.herokuapp.com/avatar", fd, this.options).subscribe(data =>  {
        if (data.status == 200) {
          (<HTMLImageElement>document.getElementById("propic")).src = data.json().avatar;
        }
    }, err => {
        (<HTMLImageElement>document.getElementById("propic")).src = this.initAvatar;
    });
  }

  /*Updates the file*/
  onSubmitReg(f: NgForm) {
    // Does nothing is the form is invalid
  	if (f.invalid) {
  		return;
  	}

  	for (let key in this.accountInfo) {
  		if (this.accountInfo[key] != null && this.accountInfo[key] != "") {

        // if it is password checks for confirmation matching
  			if(key == "password") {
            this.http.put("https://ricebookmrg7.herokuapp.com/password", this.accountInfo, this.options).subscribe(data =>  {
                if (data.status == 200) {
                  this.currAccountInfo[key] = data.json().password;
                  this.accountInfo[key] = '';
                }
            });
        } else if(key == "zipcode") {
            this.http.put("https://ricebookmrg7.herokuapp.com/zipcode", this.accountInfo, this.options).subscribe(data =>  {
                if (data.status == 200) {
                  this.currAccountInfo[key] = data.json().zipcode;
                  this.accountInfo[key] = '';
                }
            });
        } else if(key == "email") {
            this.http.put("https://ricebookmrg7.herokuapp.com/email", this.accountInfo, this.options).subscribe(data =>  {
                if (data.status == 200) {
                  this.currAccountInfo[key] = data.json().email;
                  this.accountInfo[key] = '';
                }
            });
        } else {
          this.currAccountInfo[key] = this.accountInfo[key];
          this.accountInfo[key] = '';
        }
  		}
  	}
  }

  onSubmitLogin() {
    document.getElementById("invalidCreds").style.visibility = "hidden";

    // Check login creds are in the damn databsae
    this.http.post("https://ricebookmrg7.herokuapp.com/link", this.loginInfo, this.options).subscribe(data =>  {}, err => {
      document.getElementById("invalidCreds").style.visibility = "visible";
    });

    /* Use for localhost*/
    // this.login({username: this.loginInfo.username, password: this.loginInfo.password});
  }

  onSubmitThirdPartyLogin() {
    window.location.href="https://ricebookmrg7.herokuapp.com/login/google";
  }

  onSubmitLink() {
    this.http.post("https://ricebookmrg7.herokuapp.com/unlink", {text: "site"}, this.options).subscribe(data =>  {
    });
  }

  onSubmitThirdPartyLink() {
    this.http.post("https://ricebookmrg7.herokuapp.com/unlink", {text: "google"}, this.options).subscribe(data =>  {
    });
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  aboutMe() {
    document.getElementById("aboutme").classList.remove("hidden");
    document.getElementById("pp").classList.add("hidden");
    document.getElementById("details").classList.add("hidden");
    document.getElementById("al").classList.add("hidden");
  }

  updateDetails(el: HTMLElement) {
    document.getElementById("pp").classList.add("hidden");
    document.getElementById("details").classList.remove("hidden");
    document.getElementById("al").classList.add("hidden");
    this.scroll(el);
  }

  updateProPic(el: HTMLElement) {
    document.getElementById("pp").classList.remove("hidden");
    document.getElementById("details").classList.add("hidden");
    document.getElementById("al").classList.add("hidden");
    this.scroll(el);
  }

  accountLinking(el: HTMLElement) {
    document.getElementById("pp").classList.add("hidden");
    document.getElementById("details").classList.add("hidden");
    document.getElementById("al").classList.remove("hidden");
    this.scroll(el);
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
}
