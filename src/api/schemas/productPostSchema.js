const schema = {
	type: 'object',
	properties: {
		category_id: { type: 'string' },
		name: { type: 'string' },
		end_at: {
			type: 'string',
			format: 'date-time',
		},
		init_price: { format: 'string-of-int' },
		step_price: { format: 'string-of-int' },
		buy_price: { format: 'string-of-int' },
		is_extendable: { enum: ['0', '1'] },
	},
	required: ['category_id', 'name', 'end_at', 'init_price', 'is_extendable'],
	additionalProperties: false,
};

export default schema;
