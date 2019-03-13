import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalkPage } from './walk.page';

describe('WalkPage', () => {
  let component: WalkPage;
  let fixture: ComponentFixture<WalkPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalkPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
