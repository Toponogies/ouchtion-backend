const schema = {
	type: 'object',
	properties: {
		email: { type: 'string' },
		password: { type: 'string' },
	},
	required: ['email'],
	additionalProperties: false,
};

export default schema;
