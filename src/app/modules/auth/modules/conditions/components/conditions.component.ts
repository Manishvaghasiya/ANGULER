import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CONDITION_COLUMN, PARAMS } from '../../../../../shared/constant';
import {
  ToastService, ConditionService, PaginationService,
  TemplateService, ParameterService, RulesService
} from '../../../../../core/services';
import { ConditionModel, CreateRuleModel, ParameterModel, RuleModel, TemplateModel } from '../../../../../models';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.css']
})

export class ConditionsComponent implements OnInit {

  conditionForm: FormGroup;
  ruleForm: FormGroup;
  updateConditionForm: FormGroup;
  conditionId: number;
  conditions: ConditionModel[];
  condition: ConditionModel;
  updateFlag = false;
  allTemplates: TemplateModel[];
  allParameters: ParameterModel[];
  evaluatedResponse: RuleModel;

  // tabuler var
  dataSource = new MatTableDataSource();
  displayedColumns = CONDITION_COLUMN;
  filterText: string;
  selection = new SelectionModel<any>(true, []);

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
    private ruleService: RulesService,
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

    this.updateConditionForm = this.formBuilder.group({
      parameterValue: new FormControl('', [Validators.required])
    });

    this.ruleForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required])
    });

    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
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

  evaluteConditions() {
    this.conditionService.createRules(this.selection.selected).subscribe((response: any) => {
      this.evaluatedResponse = response;
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });
  }

  createRule() {
    if (this.ruleForm.invalid) {
      this.ruleForm.markAllAsTouched();
      return;
    }

    const ruleModel: CreateRuleModel = {
      conditions: this.selection.selected,
      name: this.ruleForm.value.name
    };

    this.ruleService.createRules(ruleModel).subscribe((response: any) => {
      this.toastService.showSuccess('Rule created successfully');
      this.matDialog.closeAll();
      this.ruleForm.reset();
      this.router.navigate(['/rules']);
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

  updateCondition(data: ConditionModel) {

    if (this.updateConditionForm.invalid) {
      this.updateConditionForm.markAllAsTouched();
      return;
    }

    const condition: ConditionModel = {
      id: data.id,
      name: data.name,
      parameterId: data.parameterId,
      parameterValue: this.updateConditionForm.value.parameterValue,
      templateId: data.templateId
    };

    this.conditionService.updateCondition(condition).subscribe(_ => {
      this.toastService.showSuccess('Condition updated successfully');
      this.getConditions();
      this.updateFlag = false;
      this.matDialog.closeAll();
      this.updateConditionForm.reset();
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });

  }

}
