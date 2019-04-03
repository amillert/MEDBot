import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseInterviewsComponent } from './browse-interviews.component';

describe('BrowseInterviewsComponent', () => {
  let component: BrowseInterviewsComponent;
  let fixture: ComponentFixture<BrowseInterviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseInterviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseInterviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
