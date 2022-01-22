const schema = {
	type: 'object',
	properties: {
		description: { type: 'string', maxLength: 9000 },
		upload_date: { type: 'string' },
	},
	required: ['description'],
	additionalProperties: false,
};

export default schema;
