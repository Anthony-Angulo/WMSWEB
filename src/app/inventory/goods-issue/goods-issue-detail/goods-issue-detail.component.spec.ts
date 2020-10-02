import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsIssueDetailComponent } from './goods-issue-detail.component';

describe('GoodsIssueDetailComponent', () => {
  let component: GoodsIssueDetailComponent;
  let fixture: ComponentFixture<GoodsIssueDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsIssueDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsIssueDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
