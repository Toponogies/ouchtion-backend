export const schema = {
    type: "object",
    properties: {
      description: {type: "string",maxLength: 9000}
    },
    required: ["description"],
    additionalProperties: false,
}