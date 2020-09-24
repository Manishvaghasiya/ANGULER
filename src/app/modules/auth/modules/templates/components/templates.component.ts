import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TemplateService, ToastService } from 'src/app/core/services';
import { TemplateModel } from 'src/app/models';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})

export class TemplatesComponent implements OnInit {

  templateForm: FormGroup;
  templateId: number;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private matDialog: MatDialog,
    private toastService: ToastService,
    private templateService: TemplateService
  ) { }

  ngOnInit(): void {
    this.templateForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('')
    });
  }

  openDialog(dialog: TemplateRef<any>, data?: TemplateModel) {
    if (data) {
      this.setTemplateData(data);
    }
    this.matDialog.open(dialog, {
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: true
    });
  }

  setTemplateData(template: TemplateModel) {
    this.templateForm.controls.name.setValue(template.name);
    this.templateForm.controls.description.setValue(template.description);
  }

  createTemplate() {
    if (this.templateForm.invalid) {
      this.templateForm.markAllAsTouched();
      return;
    }

    const template: TemplateModel = {
      name: this.templateForm.value.name,
      description: this.templateForm.value.description
    };

    this.templateService.createTemplate(template).subscribe(_ => {
      this.toastService.showSuccess('Template created successfully');
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });

  }

  deleteTemplate() {
    this.templateService.deleteTemplate(this.templateId).subscribe(_ => {
      this.toastService.showSuccess('Template deleted successfully');
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });
  }

  updateTemplate() {
    if (this.templateForm.invalid) {
      this.templateForm.markAllAsTouched();
      return;
    }

    const template: TemplateModel = {
      id: this.templateId,
      name: this.templateForm.value.name,
      description: this.templateForm.value.description
    };

    this.templateService.updateTemplate(template).subscribe(_ => {
      this.toastService.showSuccess('Template updated successfully');
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });

  }

}
