export const schema = {
    type: "object",
    properties: {
      name: {type: "string"},
      category_id: {type: "string"},
      end_at: {
        type: 'string',
        format: 'date-time',
      }, 
    },
    additionalProperties: false,
}