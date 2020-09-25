import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CONDITION_COLUMN, PARAMS } from '../../../../../shared/constant';
import { ToastService, ConditionService, PaginationService, TemplateService, ParameterService } from '../../../../../core/services';
import { ConditionModel, ParameterModel, TemplateModel } from '../../../../../models';

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
  updateFlag = false;
  allTemplates: TemplateModel[];
  allParameters: ParameterModel[];

  // tabuler var
  dataSource = new MatTableDataSource();
  displayedColumns = CONDITION_COLUMN;
  filterText: string;

  // pagination var
  pageSizeOptions: number[] = [5, 10, 20, 100];
  pageIndex = 0;
  pageSize = 5;
  possibleIndex: number;
  totalDataLength: number;
  currentDataLength: number;

  params = PARAMS;
  altParams = {
    index: 0,
    size: 2000
  };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private paginationService: PaginationService,
    private parameterService: ParameterService,
    private matDialog: MatDialog,
    private toastService: ToastService,
    private templateService: TemplateService,
    private conditionService: ConditionService
  ) {
    this.route.queryParams.subscribe(params => {
      this.pageIndex = this.params.index = params.index ?
        this.paginationService.verifyIndexParams(params.index) : this.pageIndex;
      this.pageSize = this.params.size = params.size ?
        this.paginationService.verifySizeParams(params.size) : this.pageSize;
      this.getConditions();
    });
  }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit(): void {
    this.getTemplates();
    this.getParameters();
    this.conditionForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      parameterId: new FormControl('', [Validators.required]),
      parameterValue: new FormControl('', [Validators.required]),
      templateId: new FormControl('', [Validators.required])
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
      '/conditions'
    );
  }

  loadNextPage() {
    this.currentDataLength = this.paginationService.loadNextPage(
      this.pageIndex,
      this.pageSize,
      this.possibleIndex,
      '/conditions'
    );
  }

  loadPreviousPage() {
    this.currentDataLength = this.paginationService.loadPreviousPage(
      this.pageIndex,
      this.pageSize,
      '/conditions'
    );
  }

  goBack() {
    this.paginationService.goBackToHome('/dashboard');
  }

  openDialog(dialog: TemplateRef<any>, data?: ConditionModel) {
    if (data) {
      this.updateFlag = true;
      this.conditionId = data.id;
      this.setConditionData(data);
    } else {
      this.updateFlag = false;
    }
    this.matDialog.open(dialog, {
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: true
    });
  }

  setConditionData(condition: ConditionModel) {
    this.conditionForm.controls.name.setValue(condition.name);
    this.conditionForm.controls.parameterId.setValue(condition.parameterId);
    this.conditionForm.controls.parameterValue.setValue(condition.parameterValue);
    this.conditionForm.controls.templateId.setValue(condition.templateId);
  }

  getTemplates() {
    this.templateService.getTemplates(this.altParams).subscribe((response: any) => {
      this.allTemplates = response.body;
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });
  }

  getParameters() {
    this.parameterService.getParameters(this.altParams).subscribe((response: any) => {
      this.allParameters = response.body;
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });
  }

  getConditions() {
    this.conditionService.getConditions(this.params).subscribe((response: any) => {
      this.totalDataLength = response.headers.get('X-Total-Count');
      this.possibleIndex = this.paginationService.getPossibleIndexNumber(
        this.totalDataLength, this.pageIndex, this.pageSize
      );
      this.currentDataLength = this.paginationService.returnCurrentDataLength();
      this.dataSource.data = this.conditions = response.body;
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
      name: this.conditionForm.value.name,
      parameterId: this.conditionForm.value.parameterId,
      parameterValue: this.conditionForm.value.parameterValue,
      templateId: this.conditionForm.value.templateId
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
      name: this.conditionForm.value.name,
      parameterId: this.conditionForm.value.parameterId,
      parameterValue: this.conditionForm.value.parameterValue,
      templateId: this.conditionForm.value.templateId
    };

    this.conditionService.updateCondition(condition).subscribe(_ => {
      this.toastService.showSuccess('Condition updated successfully');
      this.getConditions();
      this.updateFlag = false;
      this.matDialog.closeAll();
      this.conditionForm.reset();
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });

  }

}
