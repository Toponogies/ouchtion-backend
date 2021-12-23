export const schema = {
    type: "object",
    properties: {
        user_id: {format: "string-of-int"},
        role: {enum: ["bidder", "seller", "admin"]},
    },
    required: ["user_id","role"],
    additionalProperties: false,
}