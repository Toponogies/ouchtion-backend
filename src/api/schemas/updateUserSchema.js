const schema = {
	type: 'object',
	properties: {
		full_name: { type: 'string', maxLength: 100 },
		password: { type: 'string' },
		dob: {
			type: 'string',
			format: 'date',
		},
		address: { type: 'string', maxLength: 100 },
		newPassword: { type: 'string' },
	},
	additionalProperties: false,
};

export default schema;
