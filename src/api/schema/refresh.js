export const schema = {
    type: 'object',
    properties: {
        accessToken: {type: 'string'},
        refreshToken: {type: 'string'}
    },
    required: ['accessToken','refreshToken'],
    additionalProperties: false,
};