import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskEditPaneComponent } from './task-edit-pane.component';

describe('TaskEditPaneComponent', () => {
  let component: TaskEditPaneComponent;
  let fixture: ComponentFixture<TaskEditPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskEditPaneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskEditPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
