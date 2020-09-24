import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastService, ParameterService } from 'src/app/core/services';
import { ParameterModel } from 'src/app/models/parameter';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.css']
})

export class ParametersComponent implements OnInit {

  parameterForm: FormGroup;
  parameterId: number;
  parameters: ParameterModel[];
  parameter: ParameterModel;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private matDialog: MatDialog,
    private toastService: ToastService,
    private parameterService: ParameterService
  ) { }

  ngOnInit(): void {
    this.getParameters();
    this.parameterForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('')
    });
  }

  openDialog(dialog: TemplateRef<any>, data?: ParameterModel) {
    if (data) {
      this.setParameterData(data);
    }
    this.matDialog.open(dialog, {
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: true
    });
  }

  setParameterData(parameter: ParameterModel) {
    this.parameterForm.controls.name.setValue(parameter.name);
    this.parameterForm.controls.description.setValue(parameter.description);
  }

  getParameters() {
    this.parameterService.getParameters().subscribe((response: any) => {
      this.parameters = response.body;
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });
  }

  getParameter() {
    this.parameterService.getParameter(this.parameterId).subscribe((response: any) => {
      this.parameter = response.body;
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });
  }

  createParameter() {
    if (this.parameterForm.invalid) {
      this.parameterForm.markAllAsTouched();
      return;
    }

    const parameter: ParameterModel = {
      name: this.parameterForm.value.name,
      description: this.parameterForm.value.description
    };

    this.parameterService.createParameter(parameter).subscribe(_ => {
      this.toastService.showSuccess('Parameter created successfully');
      this.getParameters();
      this.matDialog.closeAll();
      this.parameterForm.reset();
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });

  }

  deleteParameter() {
    this.parameterService.deleteParameter(this.parameterId).subscribe(_ => {
      this.toastService.showSuccess('Parameter deleted successfully');
      this.getParameters();
      this.matDialog.closeAll();
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });
  }

  updateParameter() {
    if (this.parameterForm.invalid) {
      this.parameterForm.markAllAsTouched();
      return;
    }

    const parameter: ParameterModel = {
      id: this.parameterId,
      name: this.parameterForm.value.name,
      description: this.parameterForm.value.description
    };

    this.parameterService.updateParameter(parameter).subscribe(_ => {
      this.toastService.showSuccess('Parameter updated successfully');
      this.getParameters();
      this.matDialog.closeAll();
      this.parameterForm.reset();
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });

  }

}
