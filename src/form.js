
define(['data', 'util', 'popgen', 'field'], function(data, util, popgen, field){

	var setAttributes = util.setAttributes;
	var loop = util.loop;

	function jsonify(fields){
		/*
		function getRadioBoxValue(key){

		}
		function set(key){
			if(fields[key].element.nodeName == 'SPAN'){
				loopfields.[key].element.)
			}
			/* if its grouped with a label or not */
		// 	var element = fields[key].element || fields[key];
		// 	data[key] = element.value;
		// }
		// var data = {};
		// loop(fields, set, true);
		// return data;
	}

	function makeForm(formData){
		var wrapper = util.makeWrapper(formData.wrapper);
		var fields = formData.fields;
		/* Generate the fields */
		var len = fields.length;
		var form = document.createElement('form');
		form.id = formData.id;
		form.fields = {};
		form.values = {};
		var aux = form.fields;
		for(var key in fields){
			fields[key].name = key;
			aux[key] = new field(fields[key], key);
			form.appendChild(aux[key].top || aux[key]);
		}
		setAttributes(wrapper, data.wrapper);
		wrapper.appendChild(form);
		setEvents(form, formData)
		return form;
	}

	function setEvents(form, formData){
		/* On change update value array */
		function onChange(ev){
			var field = fields[key];
			field.value = ev.target.value;
		}
		function setChange(key, topKey){
			// console.log(key);
			// /* If it's not the bottom-most element */
			// if(fields[key].element){
			// 	if(!topKey){
			// 		topKey = key;
			// 	}
			// 	else{
			// 		key = topKey;
			// 	}
			// 	loop(form.fields, setChange, true, topKey);
			// }
			// else{
			// 	field.onchange = onChange;
			// }
		}
		var fields = form.fields;
		loop(fields, setChange, true);
		form.onsubmit = function(ev){
			submitEvt(form.fields, formData.onSubmit);
			return false;
		};
		/* submit */
	}

	function submitEvt(fields, callback){
		var data = jsonify(fields);
		console.log(data);
	}

		
	return function(formData){
		var form = makeForm(formData);
		return form;
	}
});