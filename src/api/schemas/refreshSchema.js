const schema = {
	type: 'object',
	properties: {
		refresh_token: { type: 'string' },
	},
	required: ['refresh_token'],
	additionalProperties: false,
};

export default schema;
