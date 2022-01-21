const schema = {
	type: 'object',
	properties: {
		is_processed: { type: 'int' },
	},
	required: ['is_processed'],
	additionalProperties: false,
};

export default schema;
