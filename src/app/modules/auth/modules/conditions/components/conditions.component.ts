import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CONDITION_COLUMN, PARAMS } from '../../../../../shared/constant';
import { ToastService, ConditionService, PaginationService } from '../../../../../core/services';
import { ConditionModel } from '../../../../../models';

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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private paginationService: PaginationService,
    private matDialog: MatDialog,
    private toastService: ToastService,
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
    this.getConditions();
    this.conditionForm = this.formBuilder.group({
      parameterName: new FormControl('', [Validators.required]),
      paramterValue: new FormControl('', [Validators.required]),
      resultingTemplate: new FormControl('', [Validators.required])
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
      this.conditionId = data.id;
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
      this.totalDataLength = response.headers.get('X-Total-Count');
      this.possibleIndex = this.paginationService.getPossibleIndexNumber(
        this.totalDataLength, this.pageIndex, this.pageSize
      );
      this.currentDataLength = this.paginationService.returnCurrentDataLength();
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
