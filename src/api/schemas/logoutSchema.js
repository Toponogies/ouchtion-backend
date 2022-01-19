const schema = {
	type: 'object',
	properties: {
		access_token: { type: 'string' },
		refresh_token: { type: 'string' },
	},
	required: ['access_token', 'refresh_token'],
	additionalProperties: false,
};

export default schema;
