// user module
export const USER_TABLE_COLUMN = ['id', 'firstName', 'email', 'createdBy', 'createdDate',
    'authorities', 'actions'];
export const USER_AUTHORITY = [
    { name: 'User', id: 'ROLE_USER' }
];

// template columns
export const TEMPLATE_COLUMN = ['id', 'name', 'description', 'matchCount', 'actions'];

// condition table
export const CONDITION_COLUMN = ['id', 'parameterId', 'parameterValue', 'templateId', 'actions'];

// parameter table
export const PARAMETER_COLUMN = ['id', 'name', 'description', 'conditions', 'actions'];

// shared constants
export const STATUS = ['ACTIVE', 'INACTIVE'];
export const LST_OF_LANGUAGE = [{ id: 'en', name: 'English' }, { id: 'fr', name: 'French' }];
