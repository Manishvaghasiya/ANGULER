import { Injectable } from '@angular/core';
import { CreateRuleModel, Params } from '../../models';
import { HttpClientService } from '../interceptors/http-client.service';

@Injectable({
    providedIn: 'root'
})
export class RulesService {

    constructor(private httpService: HttpClientService) { }

    getRules(param: Params) {
        return this.httpService.get(`api/rules?page=${param.index}&size=${param.size}`);
    }

    updateRules(rules: CreateRuleModel) {
        return this.httpService.put(`api/rules`, rules);
    }

    getRule(id: number) {
        return this.httpService.get(`api/rules/${id}`);
    }

    deleteRules(id: number) {
        return this.httpService.delete(`api/rules/${id}`);
    }

    createRules(data: CreateRuleModel) {
        return this.httpService.post(`api/rules`, data);
    }

}
