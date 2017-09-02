import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Request, RequestOptions, RequestMethod} from '@angular/http';
import {Router} from '@angular/router';
@Injectable()

export class MainService {

	constructor(private http: Http, private router: Router) {}

	/*Logout function to be called*/
  	logout() {
  		return this.resource(RequestMethod.Get, "/logout", null)
  		.then(r => {
            	// set localStorage to empty
            	localStorage.setItem("currUser", "");
            	// Navigate back to old page
            	this.router.navigate(["/landing"]);
            })
    	.catch(e => this.handleError(e));
  	}


  	/*Fetch the artciles*/
  	fetchArticles(user: string): Promise<any> {
  		return this.resource(RequestMethod.Post, "/articles", {username: user})
  		.then(r => {
            	var articles = r.json()
            	return articles.data;
            })
    	.catch(e => this.handleError(e));
  	}

  	private handleError(error: any): Promise<any> {
	   return Promise.reject(error.message || error);
	}

	/*Resource method*/
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