// product Module
export const PRODUCT_TABLE_COLUMN = ['id', 'name', 'edition', 'site',
    'slogan', 'status', 'actions'];
export const EDITION_TYPE = ['COMMUNITY', 'ENTERPRISE'];

// transaction module
export const TRANSACTION_TABLE_COLUMN = ['id', 'planId', 'createdOn', 'purchaseType',
    'status', 'transactionType', 'username', 'email'];
export const TRANSACTION_TYPE = ['PAYPAL', 'CREDITCARD'];

// user module
export const USER_TABLE_COLUMN = ['id', 'firstName', 'email', 'createdBy', 'createdDate',
    'authorities', 'actions'];
export const USER_AUTHORITY = [
    { name: 'User', id: 'ROLE_USER' }
];

// licensor module
export const LICENSOR_TABLE_COLUMN = ['id', 'productName', 'edition', 'plan', 'username', 'code',
    'status', 'licenseType', 'actions'];
export const LICENSE_TYPE = ['TRIAL', 'PAID'];

// plan module
export const PLAN_TABLE_COLUMN = ['id', 'name', 'description', 'status',
    'licenseType', 'edition', 'price', 'maximumExecutionLimit', 'validity', 'actions'];
export const PLAN_TYPE = ['DEFAULT', 'CUSTOM'];

// version module
export const VERSION_TABLE_COLUMN = ['id', 'version', 'name', 'status',
    'productName', 'edition', 'actions'];

// shared constants
export const STATUS = ['ACTIVE', 'INACTIVE'];
export const LST_OF_LANGUAGE = [{ id: 'en', name: 'English' }, { id: 'fr', name: 'French' }];
