const schema = {
	type: 'object',
	properties: {
		reason: { type: 'string', maxLength: 300 },
	},
	required: ['reason'],
	additionalProperties: false,
};

export default schema;
