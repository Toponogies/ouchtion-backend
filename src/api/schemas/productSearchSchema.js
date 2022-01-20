const schema = {
	type: 'object',
	properties: {
		page: { format: 'string-of-int' },
		query: { type: 'string' },
		category: { format: 'string-of-int' },
		sort: { type: 'string' },
		number: { format: 'string-of-int' },
	},
	additionalProperties: false,
};

export default schema;
