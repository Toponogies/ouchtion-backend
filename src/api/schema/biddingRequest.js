export const schema = {
    type: "object",
    properties: {
        product_id: {format: "string-of-int"},
        user_id: {format: "string-of-int"},
    },
    required: ["product_id","user_id"],
    additionalProperties: false,
}