import { FormsModule } from '@angular/forms';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { HttpModule } from "@angular/http";
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Injectable, ReflectiveInjector } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { BaseRequestOptions, ConnectionBackend, Http, RequestOptions } from '@angular/http';
import { Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let backend: MockBackend;
  let lastConnection: MockConnection;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule,],
      declarations: [ ProfileComponent ], 
      providers: [ProfileComponent, MockBackend, BaseRequestOptions, 
      {
        provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should fetch users profile information', fakeAsync(inject(
    [MockBackend], (mockBackend) => {
    let profile = {"name": "mrg7", "displayName": "Manny", "email": "mrg7@rice.edu", "phone": "123-123-1234"};
    let result;
    // Mock the backend
    mockBackend.connections.subscribe((connection: MockConnection) => connection.mockRespond(new Response(new ResponseOptions({
       body: JSON.stringify({ data: profile }),
     }))));
    component.fetchProfiles("mrg7").then((res) => result = res);
    tick();
    expect(result).toEqual(profile);
  })));

  
});
