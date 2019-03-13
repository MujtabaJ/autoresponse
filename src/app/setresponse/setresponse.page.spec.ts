import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetresponsePage } from './setresponse.page';

describe('SetresponsePage', () => {
  let component: SetresponsePage;
  let fixture: ComponentFixture<SetresponsePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetresponsePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetresponsePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
