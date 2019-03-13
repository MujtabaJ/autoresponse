import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntertainmentPage } from './entertainment.page';

describe('EntertainmentPage', () => {
  let component: EntertainmentPage;
  let fixture: ComponentFixture<EntertainmentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntertainmentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntertainmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
