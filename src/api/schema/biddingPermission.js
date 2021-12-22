export const schema = {
    type: "object",
    properties: {
        product_id: {format: "string-of-int"},
        user_id: {format: "string-of-int"},
        type: {enum: ["DENY", "APPROVE"]},
        reason: {type: "string"}
    },
    required: ["product_id","user_id","reason","type"],
    additionalProperties: false,
}