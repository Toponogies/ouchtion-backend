const schema = {
	type: 'object',
	properties: {
		old_password: { type: 'string' },
		new_password: { type: 'string' },
	},
	required: ['old_password', 'new_password'],
	additionalProperties: false,
};

export default schema;
