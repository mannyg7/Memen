import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from './auth.service';
import { NgForm } from '@angular/forms';
import {Router} from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map'
import {Request, RequestOptions, RequestMethod} from '@angular/http';
import { Injectable } from '@angular/core';


@Injectable()

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  providers: [AuthService]
})

export class AuthComponent implements OnInit {
  headers;
  options;
  constructor(private http: Http, private _authService: AuthService, private router: Router) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('Access-Control-Allow-Origin', 'https://mrg7comp431folkzonesite1.surge.sh');
    this.options = new RequestOptions({ headers: this.headers, withCredentials: true });
  }

  // Dictionary to hold all of the information from the registeratiion form
  accountInfo = {name: '', displayName: '', email: '', phone: '', dob: '', zipcode: '', password: '', passwordConfirm: ''};

  loginInfo = {username: '', password: ''};

  ngOnInit(): void {
    /*use for localhost*/
    //localStorage.clear();
  }

  reset() {
    document.getElementById("pwdsWrong").style.visibility = "hidden";
    document.getElementById("age").style.visibility = "hidden"; 
    document.getElementById("invalidCreds").style.visibility = "hidden";
    document.getElementById("register").style.visibility = "hidden";
  }

  /*
  Function performed when the user clicks register.
  */
  onSubmitReg() {
    document.getElementById("invalidReg").style.visibility = "hidden";
    document.getElementById("invalidCreds").style.visibility = "hidden";
    let loginCreds = {username: this.accountInfo.name, password: this.accountInfo.password};
    // Checks if the other other authorizations are valid
      this.http.post("https://ricebookmrg7.herokuapp.com/register", this.accountInfo, this.options).subscribe(data =>  {}, err => {
        console.log(err);
        document.getElementById("invalidReg").style.visibility = "visible";
      });
      // Check login creds are in the database
      this.http.post("https://ricebookmrg7.herokuapp.com/login", loginCreds, this.options).subscribe(data =>  {
          if (data.status == 200) {
            this.router.navigate(["/main"]);
          }
      }, err => {
          console.log(err);
          document.getElementById("invalidCreds").style.visibility = "visible";
      });
  }

  /*
  Function performed when the user clicks login.
  */
  onSubmitLogin() {
    document.getElementById("invalidCreds").style.visibility = "hidden";

    // Check login creds are in the database
    this.http.post("https://ricebookmrg7.herokuapp.com/login", this.loginInfo, this.options).subscribe(data =>  {
        if (data.status == 200) {
          this.router.navigate(["/main"]);
        }
    }, err => {
          console.log(err);
          document.getElementById("invalidCreds").style.visibility = "visible";
      });

    /*use for localhost*/
    //this._authService.login({username: this.loginInfo.username, password: this.loginInfo.password});
    //this.router.navigate(["/main"]);
  }

  onSubmitThirdPartyLogin() {
    window.location.href="http://ricebookmrg7.herokuapp.com/login/google";

    /*use for localhost*/
    //this.http.get("http://localhost:3000/login/google", this.options)
  }

  onSignUp() {
    document.getElementById("invalidCreds").style.visibility = "hidden";
    document.getElementsByClassName("btn-signup")[0].classList.add("hidden");
    document.getElementsByClassName("signup")[0].classList.remove("hidden");
    document.getElementsByClassName("signup")[0].classList.add("show");
    document.getElementsByClassName("login")[0].classList.remove("show");
    document.getElementsByClassName("login")[0].classList.add("hidden");
    document.getElementsByClassName("btn-login")[0].classList.remove("hidden");
  }
  
  onLogIn() {
    document.getElementById("invalidReg").style.visibility = "hidden";
    document.getElementsByClassName("btn-signup")[0].classList.remove("hidden");
    document.getElementsByClassName("signup")[0].classList.remove("show");
    document.getElementsByClassName("signup")[0].classList.add("hidden");
    document.getElementsByClassName("login")[0].classList.add("show");
    document.getElementsByClassName("login")[0].classList.remove("hidden");
    document.getElementsByClassName("btn-login")[0].classList.add("hidden");
  }

}
