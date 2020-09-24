import { Injectable } from '@angular/core';
import { ConditionModel } from 'src/app/models/condition';
import { HttpClientService } from '../interceptors/http-client.service';

@Injectable({
    providedIn: 'root'
})
export class ConditionService {

    constructor(private httpService: HttpClientService) { }

    createCondition(condition: ConditionModel) {
        return this.httpService.post(`api/conditions`, condition);
    }

    getConditions() {
        return this.httpService.get(`api/conditions`);
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

}
