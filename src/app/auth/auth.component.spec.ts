import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Injectable, ReflectiveInjector } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { BaseRequestOptions, ConnectionBackend, Http, RequestOptions } from '@angular/http';
import { HttpModule } from "@angular/http";
import { Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { AuthComponent } from './auth.component';
import { AuthService } from './auth.service';
import {Router} from '@angular/router';

describe('AuthComponent', () => {
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(() => {
    this.injector = ReflectiveInjector.resolveAndCreate([
      {provide: ConnectionBackend, useClass: MockBackend},
      {provide: RequestOptions, useClass: BaseRequestOptions},
      {provide: Router, useValue: mockRouter },
      Http,
      AuthService,
    ]);
    this.authService = this.injector.get(AuthService);
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

  it('should log user in',  fakeAsync(() => {
     let result;
     this.authService.login({ username: 'mrg7', password: 'let-me-in' }).then((res) => result = res);
     this.lastConnection.mockRespond(new Response(new ResponseOptions({
       body: JSON.stringify({ status: 200 }),
     })));
     tick();
     expect(mockRouter.navigate).toHaveBeenCalledWith(['/main']);
     expect(result).toEqual({ status: 200 });
   }));

   it('should not log invlid user in',  fakeAsync(() => {
     let result;
     let catchedError;
     this.authService.login({ username: 'invalid', password: 'user' })
     .then((res) => result = res)
     .catch((error: any) => catchedError = error);
     this.lastConnection.mockRespond(new Response(new ResponseOptions({
       body: JSON.stringify({ status: 404, statusText: "Incorrect Credentials" }),
     })));
     tick();
     expect(result).toBeUndefined();
     expect(catchedError).toBeDefined();
   }));

   it('resource should be a resource', fakeAsync(() => {
     let result;
     // Uses the resource to return the body
     this.authService.login({ username: 'mrg7', password: 'let-me-in' })
     .then((res) => result = res);
     this.lastConnection.mockRespond(new Response(new ResponseOptions({
       body: JSON.stringify({ status: 200 }),
     })));
     tick();
     expect(result).toBeDefined();
   }));

   it('should update error message', fakeAsync(() => {
     let result;
     let catchedError;
     this.authService.login({ username: 'invalid', password: 'user' })
     .then((res) => result = res)
     .catch((error: any) => catchedError = error);
     this.lastConnection.mockRespond(new Response(new ResponseOptions({
       body: JSON.stringify({ status: 404, statusText: "Incorrect Credentials" }),
     })));
     tick();
     expect(result).toBeUndefined();
     expect(catchedError).toEqual("Incorrect Credentials");
   }));

   it('should give the http error', fakeAsync(() => {
     let result;
     let catchedError;
     this.authService.login({ username: 'invalid', password: 'user' })
     .then((res) => result = res)
     .catch((error: any) => catchedError = error);
     this.lastConnection.mockRespond(new Response(new ResponseOptions({
       body: JSON.stringify({ status: 404, statusText: "Incorrect Credentials" }),
     })));
     tick();
     expect(result).toBeUndefined();
     expect(catchedError).toBeDefined();
   }));

   it('resource should be postable', fakeAsync(() => {
     let result;
     // Uses the resource to return the payload
     this.authService.login({ username: 'mrg7', password: 'let-me-in' })
     .then((res) => result = res);
     this.lastConnection.mockRespond(new Response(new ResponseOptions({
       body: JSON.stringify({ status: 200 }),
     })));
     tick();
     expect(result).toBeDefined();
     // Uses the payload that was sent in post
     expect(localStorage.setItem).toHaveBeenCalledWith("payload", '{"username":"mrg7","password":"let-me-in"}');
   }));


});
