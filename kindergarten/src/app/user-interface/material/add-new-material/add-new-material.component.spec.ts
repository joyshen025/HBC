import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewMaterialComponent } from './add-new-material.component';

describe('AddNewMaterialComponent', () => {
  let component: AddNewMaterialComponent;
  let fixture: ComponentFixture<AddNewMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewMaterialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
