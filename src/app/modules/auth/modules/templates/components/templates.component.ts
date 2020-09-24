import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { PARAMS, TEMPLATE_COLUMN } from '../../../../../shared/constant';
import { PaginationService, TemplateService, ToastService } from '../../../../../core/services';
import { TemplateModel } from '../../../../../models';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})

export class TemplatesComponent implements OnInit {

  templateForm: FormGroup;
  templateId: number;
  templates: TemplateModel[];
  template: TemplateModel;
  updateFlag = false;

  // tabuler var
  dataSource = new MatTableDataSource();
  displayedColumns = TEMPLATE_COLUMN;
  filterText: string;

  // pagination var
  pageSizeOptions: number[] = [5, 10, 20, 100];
  pageIndex = 0;
  pageSize = 5;
  possibleIndex: number;
  totalDataLength: number;
  currentDataLength: number;

  params = PARAMS;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private paginationService: PaginationService,
    private toastService: ToastService,
    private templateService: TemplateService
  ) {
    this.route.queryParams.subscribe(params => {
      this.pageIndex = this.params.index = params.index ?
        this.paginationService.verifyIndexParams(params.index) : this.pageIndex;
      this.pageSize = this.params.size = params.size ?
        this.paginationService.verifySizeParams(params.size) : this.pageSize;
      this.getTemplates();
    });
  }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit(): void {
    this.templateForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('')
    });

    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  pageSizeChange() {
    this.currentDataLength = this.paginationService.pageSizeChange(
      this.totalDataLength,
      this.pageIndex,
      this.pageSize,
      '/templates'
    );
  }

  loadNextPage() {
    this.currentDataLength = this.paginationService.loadNextPage(
      this.pageIndex,
      this.pageSize,
      this.possibleIndex,
      '/templates'
    );
  }

  loadPreviousPage() {
    this.currentDataLength = this.paginationService.loadPreviousPage(
      this.pageIndex,
      this.pageSize,
      '/templates'
    );
  }

  goBack() {
    this.paginationService.goBackToHome('/dashboard');
  }

  openDialog(dialog: TemplateRef<any>, data?: TemplateModel) {
    if (data) {
      this.updateFlag = true;
      this.templateId = data.id;
      this.setTemplateData(data);
    } else {
      this.updateFlag = false;
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

  getTemplates() {
    this.templateService.getTemplates(this.params).subscribe((response: any) => {
      this.totalDataLength = response.headers.get('X-Total-Count');
      this.possibleIndex = this.paginationService.getPossibleIndexNumber(
        this.totalDataLength, this.pageIndex, this.pageSize
      );
      this.currentDataLength = this.paginationService.returnCurrentDataLength();
      this.dataSource.data = this.templates = response.body;
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });
  }

  getTemplate() {
    this.templateService.getTemplate(this.templateId).subscribe((response: any) => {
      this.template = response.body;
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });
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
      this.getTemplates();
      this.matDialog.closeAll();
      this.templateForm.reset();
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });

  }

  deleteTemplate() {
    this.templateService.deleteTemplate(this.templateId).subscribe(_ => {
      this.toastService.showSuccess('Template deleted successfully');
      this.getTemplates();
      this.matDialog.closeAll();
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
      this.getTemplates();
      this.updateFlag = false;
      this.matDialog.closeAll();
      this.templateForm.reset();
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });

  }

}
