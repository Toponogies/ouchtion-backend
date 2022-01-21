const schema = {
	type: 'object',
	properties: {
		old_password: { type: 'string' },
		new_password: { type: 'string' },
	},
	required: ['new_password'],
	additionalProperties: false,
};

export default schema;
