const schema = {
	type: 'object',
	properties: {
		email: { type: 'string' },
		password: { type: 'string' },
		full_name: { type: 'string' },
		address: { type: 'string' },
		dob: { type: 'string' },
		is_active: { format: 'string-of-int' },
		role: { type: 'string' },
	},
	required: ['email', 'password', 'full_name', 'address', 'dob'],
	additionalProperties: false,
};

export default schema;
