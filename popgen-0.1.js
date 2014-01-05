(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        //Allow using this built library as an AMD module
        //in another project. That other project will only
        //see this AMD call, not the internal modules in
        //the closure below.
        define(factory);
    } else {
        //Browser globals case. Just assign the
        //result to a property on the global.
        root.popgen = factory();
    }
}(this, function () {
    //almond, and your modules will be inlined here
/**
* @license almond 0.2.7 Copyright (c) 2011-2012, The Dojo Foundation All Rights Reserved.
* Available via the MIT or new BSD license.
* see: http://github.com/jrburke/almond for details
*/
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
* Given a relative module name, like ./something, normalize it to
* a real name that can be mapped to a path.
* @param {String} name the relative name
* @param {String} baseName a real name that the name arg is relative
* to.
* @returns {String} normalized name
*/
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
* Makes a name map, normalizing the name, and using a plugin
* for normalization if necessary. Grabs a ref to plugin
* too, as an optimization.
*/
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
* Just drops the config on the floor, but returns req in case
* the config return value is used.
*/
    req.config = function (cfg) {
        config = cfg;
        if (config.deps) {
            req(config.deps, config.callback);
        }
        return req;
    };

    /**
* Expose module registry for debugging and tooling
*/
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define('data',[],function(){
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
});

define('util',['data'], function(data){

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
});

define('field',['data', 'util'], function(data, util){

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
});

define('form',['data', 'util', 'popgen', 'field'], function(data, util, popgen, field){

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

define('popgen',['data', 'util', 'form'], function(data, util, form){
	return {form:form};
});
require(["popgen"]);
    //The modules for your project will be inlined above
    //this snippet. Ask almond to synchronously require the
    //module value for 'main' here and return it as the
    //value to use for the public API for the built file.
    return require('popgen');
}));