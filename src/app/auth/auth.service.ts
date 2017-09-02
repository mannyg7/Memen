import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Request, RequestOptions, RequestMethod} from '@angular/http';
import {Router} from '@angular/router';

@Injectable()

export class AuthService {

	constructor (private http: Http, private router: Router) {}

	/*
  	Validates if user over 18 and if the passwords are matching.
  	*/
	doValidation(bday: string, pwd: string, pwdConf: string) {
		var birthdate = new Date(bday);
		var year = birthdate.getFullYear();
		var month = birthdate.getMonth();
		var day = birthdate.getDate() + 1;
		var dateNow = new Date();
		var yearNow = dateNow.getFullYear();
		var monthNow = dateNow.getMonth();
		var dayNow = dateNow.getDate();
		
		var age = yearNow - year - 1;

		if (monthNow > month) {
			age = age + 1;
		}
		if (monthNow == month && day <= dayNow) {
			age = age + 1;
		}
		if (age < 18) {
			return "1";
		};
		if (pwd != pwdConf) {
			return "2";
		};
		return "0";
	}

  /*Login Function*/
	login(credentials): Promise<any> {
    // If so post to http
    return this.resource(RequestMethod.Post, "/login", credentials).then(r => {
    		var res = r.json()
            if (res.status == 200) {
            	// navigate to next place 
            	this.router.navigate(["/main"]);
              localStorage.setItem("payload", JSON.stringify(credentials));
              return res;
            } else {
                // useful for debugging, but remove in production
                throw new Error(res.statusText)
            }})
    .catch(e => this.handleError(e));
  }


  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  resource(methodStr: RequestMethod, endpoint:string, payload): Promise<any> {

    let headerss = new Headers();
    headerss.append('Content-Type', 'application/json');

    var options = new RequestOptions({
      url: endpoint,
      method: methodStr,
      headers: headerss,
    })

    if (payload)  {
      options = options.merge({body: JSON.stringify(payload)})
    }

    var myrequest = new Request(options)

    return this.http.request(myrequest).toPromise();
  }
}