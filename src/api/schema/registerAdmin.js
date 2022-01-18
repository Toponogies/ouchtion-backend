export const schema = {
    type: 'object',
    properties: {
        email: {type: 'string'},
        password: {type: 'string'},
        full_name: {type: 'string'},
        address: {type: 'string'},
        is_active: {format: 'string-of-int'},
    },
    required: ['email','password','full_name','address'],
    additionalProperties: false,
};