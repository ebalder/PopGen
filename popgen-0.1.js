
define(function(){


	var fieldType = {
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

	/* public funcs */

	function makeField(field, name){
		var element;
		var type = field.type;
		/* input type fields */
		if(fieldType.input.indexOf(field.type) >= 0){
			element = document.createElement('input');
			element.type = type;
			element.name = name;
			/* make data list structure */
			if(type == 'list'){
				element.setAttribute('list', field.id + '-dl');
				dataList = document.createElement('dataList');
				dataList.id = field.id + '-dl';
				var opt = field.options;
				var curr;
				for(var key in opt){
					curr = document.createElement('option');
					curr.value = key;
					dataList.appendChild(curr);
				}
				element.appendChild(dataList);
			} else if(type == 'radio' || type == 'checkbox'){
				element = document.createElement('span');
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
			}
		} 
		/* not-input type fields */
		else {
			element = document.createElement(type);
			element.name = name;
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
		}
		var label = field.label;
		delete field.label;
		delete field.type;
		/* set attributes */
		for(var key in field){
			element[key] = field[key];
		}
		/* add labels if exist and group them in a span */
		if(label){
			var lblElement = document.createElement('label');
			var span = document.createElement('span');
			span.appendChild(lblElement);
			span.appendChild(element);
			element = span;
			lblElement.innerHTML = label;
			if(field.id){
				lblElement.setAttribute('for', field.id);
			}
			element.label = lblElement;
		}
		return element;
	}
	function setSubmit(form){
		/* submit */
	}
	function setWrapper(element){
		this.wrapper = element;
		return true;
	}

	var popgen = {
		makeForm : function(id, fields, wrapper, submit){
			var center = document.createElement('div');
			center.id = "center";
			if(wrapper == null){
				wrapper = document.createElement('div');
				wrapper.id = 'formWrapper';
				center.appendChild(wrapper);
			}
			/* Generate the fields */
			var len = fields.length;
			var form = document.createElement('form');
			form.id = id;
			form.onsubmit = setSubmit(form);
			var ret = {
				form: form
			};
			for(var key in fields){
				ret[key] = makeField(fields[key], key);
				form.appendChild(ret[key]);
			}
			wrapper.appendChild(form);
			center.style.left = '50%';
			center.style.position = 'absolute';
			center.style.height = '0';
			wrapper.style.left = '-50%';
			wrapper.style.position = 'relative';
			document.body.appendChild(center);

			return ret;
		}
	}

	var self = popgen;
		
	return popgen
});