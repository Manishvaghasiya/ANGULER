import { Injectable } from '@angular/core';
import { TemplateModel } from 'src/app/models/template';
import { HttpClientService } from '../interceptors/http-client.service';

@Injectable({
    providedIn: 'root'
})
export class TemplateService {

    constructor(private httpService: HttpClientService) { }

    createTemplate(template: TemplateModel) {
        return this.httpService.post(`api/templates`, template);
    }

    getTemplates() {
        return this.httpService.get(`api/templates`);
    }

    updateTemplate(template: TemplateModel) {
        return this.httpService.put(`api/templates`, template);
    }

    getTemplate(id: number) {
        return this.httpService.get(`api/templates/${id}`);
    }

    deleteTemplate(id: number) {
        return this.httpService.delete(`api/templates/${id}`);
    }

}
