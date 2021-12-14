export const schema = {
    type: "object",
    properties: {
      name: {type: "string"},
      category_id: {type: "string"},
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
    },
    additionalProperties: false,
}