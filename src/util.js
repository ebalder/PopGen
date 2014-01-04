
define(['data'], function(data){

	function loop(obj, callback, isKey, params){
		if(isKey){
			for(var key in obj){
				callback(key, params);
			}
		}
		else {
			var len = obj.length;
			for (var i = 0; i < len; i++){
				callback(i, params);
			}
		}
	}

	function makeWrapper(wrapper){
		/* an element to center the dialog horizontally */
		var center = document.createElement('div');
		wrapper = document.createElement('div');
		if(!wrapper){
			wrapper.id = 'formWrapper';
		}
		center.appendChild(wrapper);
		setAttributes(center, data.center);
		document.body.appendChild(center);
		return wrapper;
	}

	function setAttributes(element, attr, exclude){
		exclude = exclude || [];
		function set(key){
			function setStyle(key){
				if(exclude.indexOf('style.' + key) < 0){
					element.style[key] = attr.style[key];
				}
			}
			if(exclude.indexOf(key) < 0){
				if(key == 'style'){
					loop(attr[key], setStyle, true);
				}
				else{
					element[key] = attr[key];
				}
			}
		}
		loop(attr, set, true);
	}

	return {
		loop: loop,
		setAttributes: setAttributes,
		makeWrapper: makeWrapper
	}
})