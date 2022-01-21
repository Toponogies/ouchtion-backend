const schema = {
	type: 'object',
	properties: {
		description: { type: 'string', maxLength: 9000 },
		upload_date: { type: 'string' },
	},
	required: ['description', 'upload_date'],
	additionalProperties: false,
};

export default schema;
