import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastService, ConditionService } from 'src/app/core/services';
import { ConditionModel } from 'src/app/models';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.css']
})

export class ConditionsComponent implements OnInit {

  conditionForm: FormGroup;
  conditionId: number;
  conditions: ConditionModel[];
  condition: ConditionModel;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private matDialog: MatDialog,
    private toastService: ToastService,
    private conditionService: ConditionService
  ) { }

  ngOnInit(): void {
    this.getConditions();
    this.conditionForm = this.formBuilder.group({
      parameterName: new FormControl('', [Validators.required]),
      paramterValue: new FormControl('', [Validators.required]),
      resultingTemplate: new FormControl('', [Validators.required])
    });
  }

  openDialog(dialog: TemplateRef<any>, data?: ConditionModel) {
    if (data) {
      this.setConditionData(data);
    }
    this.matDialog.open(dialog, {
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: true
    });
  }

  setConditionData(condition: ConditionModel) {
    this.conditionForm.controls.parameterName.setValue(condition.parameterName);
    this.conditionForm.controls.paramterValue.setValue(condition.paramterValue);
    this.conditionForm.controls.resultingTemplate.setValue(condition.resultingTemplate);
  }

  getConditions() {
    this.conditionService.getConditions().subscribe((response: any) => {
      this.conditions = response.body;
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });
  }

  getCondition() {
    this.conditionService.getCondition(this.conditionId).subscribe((response: any) => {
      this.condition = response.body;
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });
  }

  createCondition() {
    if (this.conditionForm.invalid) {
      this.conditionForm.markAllAsTouched();
      return;
    }

    const condition: ConditionModel = {
      parameterName: this.conditionForm.value.parameterName,
      paramterValue: this.conditionForm.value.paramterValue,
      resultingTemplate: this.conditionForm.value.resultingTemplate
    };

    this.conditionService.createCondition(condition).subscribe(_ => {
      this.toastService.showSuccess('Condition created successfully');
      this.getConditions();
      this.matDialog.closeAll();
      this.conditionForm.reset();
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });

  }

  deleteCondition() {
    this.conditionService.deleteCondition(this.conditionId).subscribe(_ => {
      this.toastService.showSuccess('Condition deleted successfully');
      this.getConditions();
      this.matDialog.closeAll();
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });
  }

  updateCondition() {
    if (this.conditionForm.invalid) {
      this.conditionForm.markAllAsTouched();
      return;
    }

    const condition: ConditionModel = {
      id: this.conditionId,
      parameterName: this.conditionForm.value.parameterName,
      paramterValue: this.conditionForm.value.paramterValue,
      resultingTemplate: this.conditionForm.value.resultingTemplate
    };

    this.conditionService.updateCondition(condition).subscribe(_ => {
      this.toastService.showSuccess('Condition updated successfully');
      this.getConditions();
      this.matDialog.closeAll();
      this.conditionForm.reset();
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });

  }

}
