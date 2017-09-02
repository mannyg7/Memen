import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Injectable, ReflectiveInjector } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { BaseRequestOptions, ConnectionBackend, Http, RequestOptions } from '@angular/http';
import { HttpModule } from "@angular/http";
import { Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { MainComponent } from './main.component';
import { MainService } from './main.service';
import {Router} from '@angular/router';

describe('MainService', () => {
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  beforeEach(() => {
    this.injector = ReflectiveInjector.resolveAndCreate([
      {provide: ConnectionBackend, useClass: MockBackend},
      {provide: RequestOptions, useClass: BaseRequestOptions},
      {provide: Router, useValue: mockRouter },
      Http,
      MainService,
    ]);
    this.mainService = this.injector.get(MainService);
    this.backend = this.injector.get(ConnectionBackend) as MockBackend;
    this.backend.connections.subscribe((connection: any) => this.lastConnection = connection);
  });

  beforeEach(function () {
    var store = {};

    spyOn(localStorage, 'getItem').and.callFake(function (key) {
      return store[key];
    });
    spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
      return store[key] = value + '';
    });
    spyOn(localStorage, 'clear').and.callFake(function () {
        store = {};
    });
  });

  it('should log user out',  fakeAsync(() => {
     let result;
     this.mainService.logout();
     this.lastConnection.mockRespond(new Response(new ResponseOptions({})));
     tick();
     expect(mockRouter.navigate).toHaveBeenCalledWith(['/landing']);
     expect(localStorage.setItem).toHaveBeenCalledWith("currUser", "");
   }));

   it('resource should navigate to landing',  fakeAsync(() => {
     let result;
     this.mainService.logout();
     this.lastConnection.mockRespond(new Response(new ResponseOptions({})));
     tick();
     expect(mockRouter.navigate).toHaveBeenCalledWith(['/landing']);
   }));

   it('should fetch articles',  fakeAsync(() => {
     let articles = {"articles": [{"id":1, "text":"test article"}]};
     let result;
     this.mainService.fetchArticles().then((res) => result = res);
     this.lastConnection.mockRespond(new Response(new ResponseOptions({
       body: JSON.stringify({ data: articles }),
     })));
     tick();
     expect(result).toEqual(articles);
   }));


});
