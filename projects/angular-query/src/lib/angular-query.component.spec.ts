import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularQueryComponent } from './angular-query.component';

describe('AngularQueryComponent', () => {
  let component: AngularQueryComponent;
  let fixture: ComponentFixture<AngularQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngularQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
