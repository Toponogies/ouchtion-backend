export const schema = {
    type: 'object',
    properties: {
        product_id: {format: 'string-of-int'},
        max_price: {format: 'string-of-int'},
    },
    required: ['product_id','max_price'],
    additionalProperties: false,
};