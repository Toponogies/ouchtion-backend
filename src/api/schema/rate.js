export const schema = {
    type: 'object',
    properties: {
        product_id: {format: 'string-of-int'},
        rate: {enum: [1, -1]},
        comment: {type: 'string'},
    },
    required: ['product_id'],
    additionalProperties: false,
};