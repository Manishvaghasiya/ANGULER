import { Injectable } from '@angular/core';
import { ParameterModel } from 'src/app/models/parameter';
import { HttpClientService } from '../interceptors/http-client.service';

@Injectable({
    providedIn: 'root'
})
export class ParameterService {

    constructor(private httpService: HttpClientService) { }

    createParameter(parameter: ParameterModel) {
        return this.httpService.post(`api/parameters`, parameter);
    }

    getParameters() {
        return this.httpService.get(`api/parameters`);
    }

    updateParameter(parameter: ParameterModel) {
        return this.httpService.put(`api/parameters`, parameter);
    }

    getParameter(id: number) {
        return this.httpService.get(`api/parameters/${id}`);
    }

    deleteParameter(id: number) {
        return this.httpService.delete(`api/parameters/${id}`);
    }

}
