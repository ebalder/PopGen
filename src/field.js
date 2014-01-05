
define(['data', 'util'], function(data, util){

	var fieldType = data.fieldType;
	var loop = util.loop;
	var setAttributes = util.setAttributes;

	function makeField(field, name){
		var element;
		var type = field.type;
		field.name = name;
		if(fieldType.input.indexOf(field.type) >= 0){
			element = makeInput(field, name);
		} 
		else {
			element = makeNonInput(field, type);
		}
		/* add labels if exist and group them in a span */
		var group;
		if(field.label){
			element = makeLabel(element, field.label);
		} 
		return element;
	}

	function makeInput(field, name){
		var type = field.type;
		var element;
		if(type == 'list'){
			element = makeList(field, name);
			element.onchange = onChange;
		} 
		else if(type == 'radio' || type == 'checkbox'){
			element = makeRadioBox(field, name);
		}
		else {
			element = document.createElement('input');
			setAttributes(element, field, ['label', 'type', 'mask']);
			element.type = type;
			element.onchange = onChange;
		}
		return element;
	}

	function makeLabel(element, label){
		var lblElement = document.createElement('label');
		var span = document.createElement('span');
		/* If checkbox/radiobutton */
		span.appendChild(lblElement);
		if(element.type && ['checkbox', 'radio'].indexOf(element.type) >= 0){
			span.insertBefore(element, lblElement);
		}
		else{
			span.appendChild(element);
		}
		lblElement.innerHTML = label;
		if(element.id){
			lblElement.setAttribute('for', element.id);
		}
		element.label = lblElement;
		return {
			element: element,
			label: lblElement, 
			top: span
		};
	}

	function makeList(field){
		var element = document.createElement('input');
		setAttributes(element, field, ['label', 'type', 'mask']);
		element.setAttribute('list', field.id + '-dl');
		var dataList = document.createElement('dataList');
		dataList.id = field.id + '-dl';
		var opt = field.options;
		var curr;
		for(var key in opt){
			curr = document.createElement('option');
			curr.value = key;
			dataList.appendChild(curr);
		}
		element.appendChild(dataList);
		return element;
	}

	function makeNonInput(field, type){
		var element = document.createElement(type);
		setAttributes(element, field, ['label', 'type', 'mask']);
		element.onchange = onChange;
		if(type = 'select'){
			var opt = field.options;
			var curr;
			for(var key in opt){
				curr = document.createElement('option');
				curr.innerHTML = opt[key];
				curr.value = key;
				element.appendChild(curr);
			}
		}
		return element;
	}

	function makeRadioBox(field) {
		var element = document.createElement('span');
		setAttributes(element, field, ['label', 'type', 'mask']);
		var curr;
		var opt = field.options;
		for(var key in opt){
			curr = document.createElement('input');
			curr.onchange = onChange;
			field.value = key;
			field.id = field.id + '_' + key;
			setAttributes(curr, field, ['options', 'label', 'mask']);
			opt[key] = makeLabel(curr, opt[key]);
			element.appendChild(opt[key].top);
		}
		element.options = opt;
		return element;
	}

	function onChange(ev){
		var element = ev.target;
		var form = element.form;
		if(element.type == 'checkbox'){
			var opt = form.values[element.name] || [];
			if(element.checked){
				opt[opt.length-1] = element.value;
			}
			else{
				opt.splice(opt.indexOf(element.value),1);
			}
		}
		else{
			form.values[element.name] = element.value;
		}
		return false;
	}

	return function(field, name){
		var field = makeField(field, name);

		return field;
	}
})