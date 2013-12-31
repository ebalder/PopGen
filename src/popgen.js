
define(['data', 'field', 'util'], function(data, field, util){

	var setAttributes = util.setAttributes;
	var loop = util.loop;

	function makeForm(id, fields, wrapper, submit){
		wrapper = makeWrapper(wrapper);
		/* Generate the fields */
		var len = fields.length;
		var form = document.createElement('form');
		form.id = id;
		form.onsubmit = setSubmit(submit);
		var ret = {
			form: form
		};
		for(var key in fields){
			ret[key] = new field(fields[key], key);
			form.appendChild(ret[key]);
		}
		setAttributes(wrapper, data.wrapper);
		wrapper.appendChild(form);
		return ret;
	}

	function makeWrapper(wrapper){
		/* an element to center the dialog horizontally */
		var center = document.createElement('div');
		if(!wrapper){
			wrapper = document.createElement('div');
			wrapper.id = 'formWrapper';
			center.appendChild(wrapper);
		}
		setAttributes(center, data.center);
		document.body.appendChild(center);
		return wrapper;
	}

	function setSubmit(form){
		/* submit */
	}

		
	return {
		form: makeForm
	}
});