import {
    ProductParamsModel, TransactionParamsModel, UserParamsModel,
    VersionParamsModel, PlanParamsModel, LicenseParamsModel
} from '../../models';

export const PRODUCT_PARAMS: ProductParamsModel = {
    status: '',
    index: 0,
    size: 5
};

export const TRANSACTION_PARAMS: TransactionParamsModel = {
    index: 0,
    size: 5
};

export const USER_PARAMS: UserParamsModel = {
    index: 0,
    size: 5
};

export const VERSION_PARAMS: VersionParamsModel = {
    index: 0,
    size: 5
};

export const PLAN_PARAMS: PlanParamsModel = {
    edition: 'COMMON',
    index: 0,
    size: 5
};

export const LICENSOR_PARAMS: LicenseParamsModel = {
    index: 0,
    size: 5
};
