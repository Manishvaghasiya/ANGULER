import { Injectable } from '@angular/core';
import { ParameterModel, Params } from '../../models';
import { HttpClientService } from '../interceptors/http-client.service';

@Injectable({
    providedIn: 'root'
})
export class ParameterService {

    constructor(private httpService: HttpClientService) { }

    createParameter(parameter: ParameterModel) {
        return this.httpService.post(`api/parameters`, parameter);
    }

    getParameters(param: Params) {
        return this.httpService.get(`api/parameters?page=${param.index}&size=${param.size}`);
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

    addParamFile(file: any) {
        const formData: FormData = new FormData();
        formData.append('file', file.file);
        return this.httpService.postWithFile(`api/parameters/file`, formData);
    }

}
