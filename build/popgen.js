
eval("\ndefine(\'popgen\',[],function(){\n\n\n\tvar fieldType = {\n\t\tinput: [\n\t\t\t\'button\',\n\t\t\t\'checkbox\',\n\t\t\t\'color\',\n\t\t\t\'date\',\n\t\t\t\'date\',\n\t\t\t\'datetime\',\n\t\t\t\'datetime-local\',\n\t\t\t\'email\',\n\t\t\t\'list\',\n\t\t\t\'month\',\n\t\t\t\'number\',\n\t\t\t\'password\',\n\t\t\t\'radio\',\n\t\t\t\'range\',\n\t\t\t\'search\',\n\t\t\t\'submit\',\n\t\t\t\'tel\',\n\t\t\t\'text\',\n\t\t\t\'time\',\n\t\t\t\'time\',\n\t\t\t\'url\',\n\t\t\t\'week\'\n\t\t],\n\t\tother: [\n\t\t\t\'select\'\n\t\t]\n\t};\n\n\t/* public funcs */\n\n\tfunction makeField(field, name){\n\t\tvar element;\n\t\tvar type = field.type;\n\t\t/* input type fields */\n\t\tif(fieldType.input.indexOf(field.type) >= 0){\n\t\t\telement = document.createElement(\'input\');\n\t\t\telement.type = type;\n\t\t\telement.name = name;\n\t\t\t/* make data list structure */\n\t\t\tif(type == \'list\'){\n\t\t\t\telement.setAttribute(\'list\', field.id + \'-dl\');\n\t\t\t\tdataList = document.createElement(\'dataList\');\n\t\t\t\tdataList.id = field.id + \'-dl\';\n\t\t\t\tvar opt = field.options;\n\t\t\t\tvar curr;\n\t\t\t\tfor(var key in opt){\n\t\t\t\t\tcurr = document.createElement(\'option\');\n\t\t\t\t\tcurr.value = key;\n\t\t\t\t\tdataList.appendChild(curr);\n\t\t\t\t}\n\t\t\t\telement.appendChild(dataList);\n\t\t\t} else if(type == \'radio\' || type == \'checkbox\'){\n\t\t\t\telement = document.createElement(\'span\');\n\t\t\t\tvar curr, lbl;\n\t\t\t\tvar opt = field.options;\n\t\t\t\tfor(var key in opt){\n\t\t\t\t\tvar cont = document.createElement(\'span\');\n\t\t\t\t\tcurr = document.createElement(\'input\');\n\t\t\t\t\tcurr.type = field.type;\n\t\t\t\t\tcurr.name = name;\n\t\t\t\t\tcurr.value = key;\n\t\t\t\t\tlbl = document.createElement(\'label\') \n\t\t\t\t\tlbl.innerHTML = opt[key];\n\t\t\t\t\tlbl.setAttribute(\'for\', field.id);\n\t\t\t\t\tcont.appendChild(curr);\n\t\t\t\t\tcont.appendChild(lbl);\n\t\t\t\t\telement.appendChild(cont);\n\t\t\t\t}\n\t\t\t}\n\t\t} \n\t\t/* not-input type fields */\n\t\telse {\n\t\t\telement = document.createElement(type);\n\t\t\telement.name = name;\n\t\t\tif(type = \'select\'){\n\t\t\t\tvar opt = field.options;\n\t\t\t\tvar curr;\n\t\t\t\tfor(var key in opt){\n\t\t\t\t\tcurr = document.createElement(\'option\');\n\t\t\t\t\tcurr.innerHTML = opt[key];\n\t\t\t\t\tcurr.value = key;\n\t\t\t\t\telement.appendChild(curr);\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\tvar label = field.label;\n\t\tdelete field.label;\n\t\tdelete field.type;\n\t\t/* set attributes */\n\t\tfor(var key in field){\n\t\t\telement[key] = field[key];\n\t\t}\n\t\t/* add labels if exist and group them in a span */\n\t\tif(label){\n\t\t\tvar lblElement = document.createElement(\'label\');\n\t\t\tvar span = document.createElement(\'span\');\n\t\t\tspan.appendChild(lblElement);\n\t\t\tspan.appendChild(element);\n\t\t\telement = span;\n\t\t\tlblElement.innerHTML = label;\n\t\t\tif(field.id){\n\t\t\t\tlblElement.setAttribute(\'for\', field.id);\n\t\t\t}\n\t\t\telement.label = lblElement;\n\t\t}\n\t\treturn element;\n\t}\n\tfunction setSubmit(form){\n\t\t/* submit */\n\t}\n\tfunction setWrapper(element){\n\t\tthis.wrapper = element;\n\t\treturn true;\n\t}\n\n\tvar popgen = {\n\t\tmakeForm : function(id, fields, wrapper, submit){\n\t\t\tvar center = document.createElement(\'div\');\n\t\t\tcenter.id = \"center\";\n\t\t\tif(wrapper == null){\n\t\t\t\twrapper = document.createElement(\'div\');\n\t\t\t\twrapper.id = \'formWrapper\';\n\t\t\t\tcenter.appendChild(wrapper);\n\t\t\t}\n\t\t\t/* Generate the fields */\n\t\t\tvar len = fields.length;\n\t\t\tvar form = document.createElement(\'form\');\n\t\t\tform.id = id;\n\t\t\tform.onsubmit = setSubmit(form);\n\t\t\tvar ret = {\n\t\t\t\tform: form\n\t\t\t};\n\t\t\tfor(var key in fields){\n\t\t\t\tret[key] = makeField(fields[key], key);\n\t\t\t\tform.appendChild(ret[key]);\n\t\t\t}\n\t\t\twrapper.appendChild(form);\n\t\t\tcenter.style.left = \'50%\';\n\t\t\tcenter.style.position = \'absolute\';\n\t\t\tcenter.style.height = \'0\';\n\t\t\twrapper.style.left = \'-50%\';\n\t\t\twrapper.style.position = \'relative\';\n\t\t\tdocument.body.appendChild(center);\n\n\t\t\treturn ret;\n\t\t}\n\t}\n\n\tvar self = popgen;\n\t\t\n\treturn popgen\n});\n//# sourceURL=/popgen.js");
