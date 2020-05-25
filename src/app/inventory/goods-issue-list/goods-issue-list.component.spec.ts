import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsIssueListComponent } from './goods-issue-list.component';

describe('GoodsIssueListComponent', () => {
  let component: GoodsIssueListComponent;
  let fixture: ComponentFixture<GoodsIssueListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsIssueListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsIssueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
