const schema = {
	type: 'object',
	properties: {
		full_name: { type: 'string', maxLength: 100 },
		password: { type: 'string' },
		dob: {
			type: 'string',
		},
		address: { type: 'string', maxLength: 100 },
		email: {type: 'string'},
		newPassword: { type: 'string' },
	},
	additionalProperties: false,
};

export default schema;
