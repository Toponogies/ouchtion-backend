export const schema = {
    type: "object",
    properties: {
      page: {format: "string-of-int"},
      query: {type: "string"},
      category: {format: "string-of-int"},
      sort: {type: "string"}
    },
    additionalProperties: false,
}