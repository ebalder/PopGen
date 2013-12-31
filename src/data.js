
define(function(){
	var data = {};
	/* Field categorizations */
	data.fieldType = {
		input: [
			'button',
			'checkbox',
			'color',
			'date',
			'date',
			'datetime',
			'datetime-local',
			'email',
			'list',
			'month',
			'number',
			'password',
			'radio',
			'range',
			'search',
			'submit',
			'tel',
			'text',
			'time',
			'time',
			'url',
			'week'
		],
		other: [
			'select'
		]
	};
	/* wrapper and parent attributes (for horizontal center) */
	data.wrapper = {
		style: {
			left: '-50%',
			position: 'relative',
		}
	};
	data.center = {
		id: 'center',
		style: {
			height: '0',
			left: '50%',
			position: 'absolute',
		}
	};
	return data;
})