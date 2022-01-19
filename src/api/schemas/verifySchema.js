const schema = {
	type: 'object',
	properties: {
		token: { type: 'string' },
	},
	required: ['token'],
	additionalProperties: false,
};

export default schema;
