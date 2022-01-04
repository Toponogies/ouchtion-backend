export const schema = {
    type: 'object',
    properties: {
        product_id: {format: 'string-of-int'},
    },
    required: ['product_id'],
    additionalProperties: false,
};