import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddresponsePage } from './addresponse.page';

describe('AddresponsePage', () => {
  let component: AddresponsePage;
  let fixture: ComponentFixture<AddresponsePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddresponsePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddresponsePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
