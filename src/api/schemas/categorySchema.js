const schema = {
	type: 'object',
	properties: {
		parent_category_id: { format: 'string-of-int' },
		name: { type: 'string' },
	},
	required: ['name', 'parent_category_id'],
	additionalProperties: false,
};

export default schema;
