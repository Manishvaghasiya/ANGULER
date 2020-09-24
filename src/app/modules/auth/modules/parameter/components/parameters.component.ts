import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { PARAMETER_COLUMN, PARAMS } from '../../../../../shared/constant';
import { ToastService, ParameterService, PaginationService, TemplateService } from '../../../../../core/services';
import { ParameterModel, TemplateModel } from '../../../../../models';

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
  updateFlag = false;
  allTemplates: TemplateModel[];

  // tabuler var
  dataSource = new MatTableDataSource();
  displayedColumns = PARAMETER_COLUMN;
  filterText: string;

  // pagination var
  pageSizeOptions: number[] = [5, 10, 20, 100];
  pageIndex = 0;
  pageSize = 5;
  possibleIndex: number;
  totalDataLength: number;
  currentDataLength: number;

  params = PARAMS;
  templateParams = {
    index: 1,
    size: 2000
  };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private templateService: TemplateService,
    private matDialog: MatDialog,
    private paginationService: PaginationService,
    private toastService: ToastService,
    private parameterService: ParameterService
  ) {
    this.route.queryParams.subscribe(params => {
      this.pageIndex = this.params.index = params.index ?
        this.paginationService.verifyIndexParams(params.index) : this.pageIndex;
      this.pageSize = this.params.size = params.size ?
        this.paginationService.verifySizeParams(params.size) : this.pageSize;
      this.getParameters();
    });
  }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit(): void {
    this.getTemplates();
    this.parameterForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      templates: new FormControl('', [Validators.required])
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
      '/parameters'
    );
  }

  loadNextPage() {
    this.currentDataLength = this.paginationService.loadNextPage(
      this.pageIndex,
      this.pageSize,
      this.possibleIndex,
      '/parameters'
    );
  }

  loadPreviousPage() {
    this.currentDataLength = this.paginationService.loadPreviousPage(
      this.pageIndex,
      this.pageSize,
      '/parameters'
    );
  }

  goBack() {
    this.paginationService.goBackToHome('/dashboard');
  }

  openDialog(dialog: TemplateRef<any>, data?: ParameterModel) {
    if (data) {
      this.updateFlag = true;
      this.parameterId = data.id;
      this.setParameterData(data);
    } else {
      this.updateFlag = false;
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
    const templates = [];
    this.allTemplates.forEach((item) => {
      parameter.templates.forEach((x) => {
        if (item.id === x.id) {
          templates.push(item);
        }
      });
    });
    this.parameterForm.controls.templates.setValue(templates);
  }

  getParameters() {
    this.parameterService.getParameters(this.params).subscribe((response: any) => {
      this.totalDataLength = response.headers.get('X-Total-Count');
      this.possibleIndex = this.paginationService.getPossibleIndexNumber(
        this.totalDataLength, this.pageIndex, this.pageSize
      );
      this.currentDataLength = this.paginationService.returnCurrentDataLength();
      this.dataSource.data = this.parameters = response.body;
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

  getTemplates() {
    this.templateService.getTemplates(this.templateParams).subscribe((response: any) => {
      this.allTemplates = response.body;
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
      description: this.parameterForm.value.description,
      templates: this.parameterForm.value.templates
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
      description: this.parameterForm.value.description,
      templates: this.parameterForm.value.templates
    };

    this.parameterService.updateParameter(parameter).subscribe(_ => {
      this.toastService.showSuccess('Parameter updated successfully');
      this.getParameters();
      this.updateFlag = false;
      this.matDialog.closeAll();
      this.parameterForm.reset();
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });

  }

}
