import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EatPage } from './eat.page';

describe('EatPage', () => {
  let component: EatPage;
  let fixture: ComponentFixture<EatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EatPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
