const schema = {
	type: 'object',
	properties: {
		parent_category_id: { format: 'string-of-int' },
		name: { type: 'string' },
	},
	required: ['name'],
	additionalProperties: false,
};

export default schema;
