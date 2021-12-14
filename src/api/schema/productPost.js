export const schema = {
    type: "object",
    properties: {
      category_id: {type: "string"},
      seller_id: {type: "string"},
      name: {type: "string"},
      end_at: {
        type: 'string',
        oneOf: [
          {
            format: "date-time-custom"     // YYYY-MM-DD HH:MM:SS
          },
          {
            format: 'date-time',
          }
        ]
      }, 
      init_price: {type: "integer"},
      step_price: {type: "integer"},
      buy_price: {type: "integer"},
    },
    required: ["category_id","seller_id","name","end_at","init_price"],
    additionalProperties: false,
}