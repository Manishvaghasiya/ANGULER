import { Injectable } from '@angular/core';
import { ConditionModel, Params } from '../../models';
import { HttpClientService } from '../interceptors/http-client.service';

@Injectable({
    providedIn: 'root'
})
export class ConditionService {

    constructor(private httpService: HttpClientService) { }

    createCondition(condition: ConditionModel) {
        return this.httpService.post(`api/conditions`, condition);
    }

    getConditions(param?: Params) {
        return this.httpService.get(`api/conditions?eagerload=true`);
    }

    updateCondition(condition: ConditionModel) {
        return this.httpService.put(`api/conditions`, condition);
    }

    getCondition(id: number) {
        return this.httpService.get(`api/conditions/${id}`);
    }

    deleteCondition(id: number) {
        return this.httpService.delete(`api/conditions/${id}`);
    }

    createRules(data: ConditionModel[]) {
        const tmp = [{
            conditions: data
        }];
        return this.httpService.post(`api/conditions/evaluate`, tmp[0]);
    }

}
