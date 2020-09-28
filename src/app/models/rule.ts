import { ConditionModel, TemplateModel } from '.';

export interface CreateRuleModel {
    conditions?: ConditionModel[];
    id?: number;
    name?: string;
    templateId?: number;
    templatesDTO?: TemplateModel;
}

export interface RuleModel {
    conditions: ConditionModel[];
    drawBetweenTemplates: boolean;
    missingConditions: any;
    resultingTemplates: TemplateModel[];
    templates: TemplateModel;
}
