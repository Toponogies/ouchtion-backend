const schema = {
	type: 'object',
	properties: {
		product_id: { format: 'string-of-int' },
		user_id: { format: 'string-of-int' },
		type: { enum: ['DENY', 'APPROVE'] },
	},
	required: ['product_id', 'user_id', 'type'],
	additionalProperties: false,
};

export default schema;
