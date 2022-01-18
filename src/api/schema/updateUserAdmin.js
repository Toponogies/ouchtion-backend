export const schema = {
    type: 'object',
    properties: {
        full_name: {type: 'string',maxLength: 100},
        password: {type: 'string'},
        dob: {
            type: 'string',
            format: 'date'
        },
        address: {type: 'string',maxLength: 100},
        email: {type: 'string'},
        is_active: {format: 'string-of-int'},
    },
    additionalProperties: false,
};