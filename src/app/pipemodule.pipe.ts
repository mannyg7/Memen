import { Pipe, PipeTransform } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import {Request, RequestOptions, RequestMethod , ResponseContentType} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

@Pipe({
  name: 'pipemodule'
})
export class PipemodulePipe implements PipeTransform {
  constructor(private http: Http) {}

  transform(url: string) {
  const headers = new Headers(); 
  headers.append('Access-Control-Allow-Origin', 'https://mrg7comp431folkzonesite1.surge.sh');
  return this.http.get("https://ricebookmrg7.herokuapp.com/avatars/" + url, new RequestOptions({headers: headers, withCredentials: true}));
  }
}
