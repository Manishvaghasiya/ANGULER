import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { PARAMS, RULE_COLUMN } from '../../../../../shared/constant';
import { ToastService, RulesService, PaginationService, ConditionService } from '../../../../../core/services';
import { ConditionModel, CreateRuleModel, RuleModel } from '../../../../../models';
import { SelectionModel } from '@angular/cdk/collections';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css']
})

export class RulesComponent implements OnInit {

  ruleForm: FormGroup;
  ruleId: number;
  rules: RuleModel[];
  rule: RuleModel;
  allConditions: ConditionModel[];

  // tabuler var
  dataSource = new MatTableDataSource();
  displayedColumns = RULE_COLUMN;
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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private paginationService: PaginationService,
    private conditionService: ConditionService,
    private matDialog: MatDialog,
    private toastService: ToastService,
    private ruleService: RulesService
  ) {
    this.route.queryParams.subscribe(params => {
      this.pageIndex = this.params.index = params.index ?
        this.paginationService.verifyIndexParams(params.index) : this.pageIndex;
      this.pageSize = this.params.size = params.size ?
        this.paginationService.verifySizeParams(params.size) : this.pageSize;
      this.getRules();
    });
  }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit(): void {
    this.getConditions();
    this.ruleForm = this.formBuilder.group({
      conditions: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required])
    });
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  captureScreen() {
    const data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('MYPdf.pdf'); // Generated PDF
    });
  }

  pageSizeChange() {
    this.currentDataLength = this.paginationService.pageSizeChange(
      this.totalDataLength,
      this.pageIndex,
      this.pageSize,
      '/rules'
    );
  }

  loadNextPage() {
    this.currentDataLength = this.paginationService.loadNextPage(
      this.pageIndex,
      this.pageSize,
      this.possibleIndex,
      '/rules'
    );
  }

  loadPreviousPage() {
    this.currentDataLength = this.paginationService.loadPreviousPage(
      this.pageIndex,
      this.pageSize,
      '/rules'
    );
  }

  goBack() {
    this.paginationService.goBackToHome('/dashboard');
  }

  openDialog(dialog: TemplateRef<any>, data?: CreateRuleModel) {
    if (data) {
      this.ruleId = data.id;
      this.setRuleData(data);
    } else {
    }
    this.matDialog.open(dialog, {
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: true
    });
  }

  setRuleData(rule: CreateRuleModel) {
    this.ruleForm.controls.name.setValue(rule.name);
    const conditions = [];
    this.allConditions.forEach((item) => {
      rule.conditions.forEach((x) => {
        if (item.id === x.id) {
          conditions.push(item);
        }
      });
    });
    this.ruleForm.controls.conditions.setValue(conditions);
  }

  getConditions() {
    this.conditionService.getConditions().subscribe((response: any) => {
      this.allConditions = response.body;
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });
  }

  getRules() {
    this.ruleService.getRules(this.params).subscribe((response: any) => {
      this.totalDataLength = response.headers.get('X-Total-Count');
      this.possibleIndex = this.paginationService.getPossibleIndexNumber(
        this.totalDataLength, this.pageIndex, this.pageSize
      );
      this.currentDataLength = this.paginationService.returnCurrentDataLength();
      this.dataSource.data = this.rules = response.body;
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });
  }

  getRule() {
    this.ruleService.getRule(this.ruleId).subscribe((response: any) => {
      this.rule = response.body;
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });
  }

  updateRule() {
    if (this.ruleForm.invalid) {
      this.ruleForm.markAllAsTouched();
      return;
    }

    const ruleModel: CreateRuleModel = {
      id: this.ruleId,
      conditions: this.ruleForm.value.conditions,
      name: this.ruleForm.value.name
    };

    this.ruleService.updateRules(ruleModel).subscribe((response: any) => {
      this.toastService.showSuccess('Rule updated successfully');
      this.getRules();
      this.matDialog.closeAll();
      this.ruleForm.reset();
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });
  }

  deleteRule() {
    this.ruleService.deleteRules(this.ruleId).subscribe(_ => {
      this.toastService.showSuccess('Rule deleted successfully');
      this.getRules();
      this.matDialog.closeAll();
    }, error => {
      this.toastService.showDanger(error.error.detail);
    });
  }

}
