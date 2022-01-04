export const schema = {
    type: 'object',
    properties: {
        seller_id: {format: 'string-of-int'}
    },
    required: ['seller_id'],
    additionalProperties: false,
};