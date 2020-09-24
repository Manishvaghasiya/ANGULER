import { TemplateModel } from './template';

export interface ParameterModel {
    id?: number;
    name: string;
    description?: string;
    templates: TemplateModel[];
}
