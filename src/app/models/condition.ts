import { ParameterModel, TemplateModel } from '.';

export interface ConditionModel {
    id?: number;
    name: string;
    parameterId: number;
    parameterValue: string;
    templateId: number;
    parametersDTO?: ParameterModel[];
    templatesDTO?: TemplateModel[];
}
