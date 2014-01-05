
define(['data', 'util', 'popgen', 'field'], function(data, util, popgen, field){

	var setAttributes = util.setAttributes;
	var loop = util.loop;

	function makeForm(formData){
		var wrapper = util.makeWrapper(formData.wrapper);
		var fields = formData.fields;
		/* Generate the fields */
		var len = fields.length;
		var form = document.createElement('form');
		setAttributes(form, formData, ['fields']);
		form.fields = {};
		form.values = {};
		var aux = form.fields;
		for(var key in fields){
			fields[key].name = key;
			form.values[key] = null;
			aux[key] = new field(fields[key], key);
			form.appendChild(aux[key].top || aux[key]);
		}
		setAttributes(wrapper, data.wrapper);
		wrapper.appendChild(form);
		setEvents(form, formData)
		return form;
	}

	function setEvents(form){
		form.onsubmit = submitEvt;
	}

	function submitEvt(ev){
		var form = ev.target;
		var data = form.values;
		form.onSubmit(ev) || null;
		var xmlhttp;
		// code for IE7+, Firefox, Chrome, Opera, Safari
		if (window.XMLHttpRequest){
			xmlhttp = new XMLHttpRequest();
		}
		// code for IE6, IE5
		else{
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange = function(){
			if (xmlhttp.readyState == 4){
				if(xmlhttp.status == 200){
					console.log('Response');
				}
				else{
					console.log('ResponseError');
				}
			}
		} 
		xmlhttp.open('POST', form.target, true);
		xmlhttp.send(JSON.stringify(form.values));
		console.log("senshalalala");
		return false;
	}

		
	return function(formData){
		var form = makeForm(formData);
		return form;
	}
});