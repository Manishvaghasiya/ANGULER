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
  paramFileForm: FormGroup;
  parameterId: number;
  parameters: ParameterModel[];
  parameter: ParameterModel;
  updateFlag = false;
  allTemplates: TemplateModel[];

  // upload file
  fileErrorFlag: boolean;
  files: File[];
  name: string;
  fileTypeErrorFlag: boolean;

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
    index: 0,
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

    this.paramFileForm = this.formBuilder.group({
      file: new FormControl('', [Validators.required])
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

  openDialog(dialog: TemplateRef<any>, data?: ParameterModel) {
    if (data) {
      this.updateFlag = true;
      this.parameterId = data.id;
      this.setParameterData(data);
    } else {
      this.updateFlag = false;
      this.fileTypeErrorFlag = false;
      this.fileErrorFlag = false;
      this.name = '';
      this.files = [];
    }
    this.matDialog.open(dialog, {
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: true
    });
  }

  onSelectFile(event: { target: { files: File[]; }; }) {
    this.name = '';
    this.files = [];
    if (this.validateFile(event.target.files[0])) {
      this.files.push(event.target.files[0]);
      const reader = new FileReader();
      reader.readAsDataURL(this.files[0]);
      this.name = this.files[0].name;
    }
  }

  validateFile(file: File) {
    if (file && file.size < 10485760) {
      this.fileErrorFlag = false;
      const extension = file.name.split('.').pop().toLowerCase();
      if (!['csv'].includes(extension)) {
        this.name = '';
        this.files = [];
        this.fileTypeErrorFlag = true;
        return false;
      }
      this.fileTypeErrorFlag = false;
      return true;
    }
    this.fileErrorFlag = true;
    return false;
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

  getParamsFromFile() {
    if (this.paramFileForm.invalid) {
      this.fileErrorFlag = this.files[0] ? false : true;
      this.paramFileForm.markAllAsTouched();
      return;
    }

    const paramFile = {
      file: this.files[0]
    };

    this.parameterService.addParamFile(paramFile).subscribe((response: any) => {
      this.getParameters();
      this.matDialog.closeAll();
      this.paramFileForm.reset();
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });
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
