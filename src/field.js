
define(['data', 'util'], function(data, util){

	var fieldType = data.fieldType;
	var loop = util.loop;
	var setAttributes = util.setAttributes;

	function makeField(field, name){
		var element;
		var type = field.type;
		if(fieldType.input.indexOf(field.type) >= 0){
			element = makeInput(field, name);
		} 
		else {
			element = makeNonInput(field, type);
		}
		var label = field.label;
		/* set attributes */
		setAttributes(element, field, ['label', 'type']);
		/* add labels if exist and group them in a span */
		if(label){
			element = makeLabel(element, label);
		}
		element.name = name;
		return element;
	}

	function makeInput(field, name){
		var type = field.type;
		var element;
		if(type == 'list'){
			element = makeList(field);
		} 
		else if(type == 'radio' || type == 'checkbox'){
			element = makeRadioBox(field);
		}
		else {
			element = document.createElement('input');
			element.type = type;
		}
		return element;
	}

	function makeLabel(element, label){
		var lblElement = document.createElement('label');
		var span = document.createElement('span');
		span.appendChild(lblElement);
		span.appendChild(element);
		element = span;
		lblElement.innerHTML = label;
		if(element.id){
			lblElement.setAttribute('for', element.id);
		}
		element.label = lblElement;
		return element;
	}

	function makeList(field){
		var element = document.createElement('input');
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
		var curr, lbl;
		var opt = field.options;
		for(var key in opt){
			var cont = document.createElement('span');
			curr = document.createElement('input');
			curr.type = field.type;
			curr.name = name;
			curr.value = key;
			lbl = document.createElement('label') 
			lbl.innerHTML = opt[key];
			lbl.setAttribute('for', field.id);
			cont.appendChild(curr);
			cont.appendChild(lbl);
			element.appendChild(cont);
		}
		return element;
	}

	return function(field, name){
		var field = makeField(field, name);

		return field;
	}
})