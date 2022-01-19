export const schema = {
    type: 'object',
    properties: {
        category_id: {type: 'string'},
        name: {type: 'string'},
        end_at: {
            type: 'string',
            format: 'date-time',
        }, 
        init_price: {format: 'string-of-int'},
        step_price: {format: 'string-of-int'},
        buy_price: {format: 'string-of-int'},
    },
    required: ['category_id','name','end_at','init_price'],
    additionalProperties: false,
};