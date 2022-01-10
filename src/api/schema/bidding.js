export const schema = {
    type: 'object',
    properties: {
        bid_price: {format: 'string-of-int'},
        product_id: {format: 'string-of-int'},
    },
    required: ['product_id','bid_price'],
    additionalProperties: false,
};