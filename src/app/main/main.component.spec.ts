import { FormsModule } from '@angular/forms';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { MainComponent } from './main.component';
import { HttpModule } from "@angular/http";
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Injectable, ReflectiveInjector } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { BaseRequestOptions, ConnectionBackend, Http, RequestOptions } from '@angular/http';
import { Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { MainService } from './main.service';
import {Router} from '@angular/router';


describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let backend: MockBackend;
  let lastConnection: MockConnection;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule, RouterTestingModule],
      declarations: [ MainComponent ],
      providers: [MainComponent, MainService, MockBackend, BaseRequestOptions, 
      {
        provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should update the search keyword', fakeAsync(() => {
    let context = fixture.debugElement.query(By.css('#searchbar')).nativeElement;
    context.value = "idk";
    context.dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();
    expect(component.searchString).toEqual("idk");

  }));

  it('should filter displayed articles by the search keyword', fakeAsync(() => {
    let articless = [{"id":1, "text": "idk", author: "me", date: "03/12/2001"}, {"id":2, "text": "gah", author: "idk", date: "03/12/2001"}, {"id":1, "text": "hah", author: "kk", date: "03/12/2001"}];
    component.allarticlesArray = articless;
    let context = fixture.debugElement.query(By.css('#searchbar')).nativeElement;
    context.value = "idk";
    context.dispatchEvent(new Event('input'));
    tick();
    component.searchArticles();
    fixture.detectChanges();
    expect(component.articles).toEqual([{"id":1, "text": "idk", author: "me", date: "03/12/2001"}, {"id":2, "text": "gah", author: "idk", date: "03/12/2001"}]);
  }));

  it('should render articles', fakeAsync(() => {
    let articless = [{"id":1, "text": "idk", author: "me", date: "03/12/2001"}, {"id":2, "text": "gah", author: "idk", date: "03/12/2001"}, {"id":1, "text": "hah", author: "kk", date: "03/12/2001"}];
    component.articles = articless;
    let context = fixture.debugElement.query(By.css('#newArticle')).nativeElement;
    fixture.detectChanges();
    tick();
    expect(context).toBeDefined();
  }));

  it('should dispatch actions to create a new article', fakeAsync(() => {
    var newArticleCreation = spyOn(component, "uploadPost").and.callThrough();
    let buttonPost = fixture.debugElement.query(By.css('#post')).nativeElement;
    buttonPost.click();
    tick();
    fixture.detectChanges();
    expect(component.uploadPost).toHaveBeenCalled();
  }));

  it('should update headline', fakeAsync(inject(
    [MockBackend], (mockBackend) => {
    let result;
    mockBackend.connections.subscribe((connection: MockConnection) => connection.mockRespond(new Response(new ResponseOptions({
       body: JSON.stringify({ status: 200 }),
     }))));
    component.updateHeadline("New headline").then((res) => result = res);
    tick();
    fixture.detectChanges();
    let context = fixture.debugElement.query(By.css('#headline')).nativeElement.innerHTML;
    expect(context).toEqual("New headline");
    expect(result).toEqual({ status: 200 });
  })));

});
