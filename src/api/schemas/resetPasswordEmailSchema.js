const schema = {
	type: 'object',
	properties: {
		email: { type: 'string' },
	},
	required: ['email'],
	additionalProperties: false,
};

export default schema;
