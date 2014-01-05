
requirejs.config({
	baseUrl : '../src',
    map: { 
      '*': { 'popgen': 'popgen' }
    }
});

requirejs(['popgen'], function(popgen){

	var button = document.getElementById('tehButton');
	button.onclick = function(ev){
		console.log('shalala');
		var form = new popgen.form(formData);
		console.log(form);
	}

	var formData = {
		id: 'testForm',
		wrapper: 'formWrapper',
		target: 'http://google.com',
		waitResponse: true,
		successResp: 'success!',
		failResp: 'error',
		timeout: 15000,
		onResponse: 'event',
		onError: 'event',
		onSuccess: 'event', 
		onSubmit: function(){},
		fields : {
			'text' : {
				type: 'text',
				label: 'Input Text: ',
				id: 'testText'
			},
			'select' : {
				type: 'select',
				label: 'Select: ',
				id: 'testSelect',
				options: {
					opt1: 'Option 1',
					opt2: 'Option 2',
					opt3: 'Option 3'
				}
			},
			'dataList' : {
				type: 'list',
				label: 'Data List: ',
				id: 'testData',
				options: {
					opt1: 'Option 1',
					opt2: 'Option 2',
					opt3: 'Option 3'
				}
			},
			'radio' : {
				type: 'radio',
				label: 'testRadio',
				id: 'testRadio',
				options: {
					opt1: 'Option 1',
					opt2: 'Option 2',
					opt3: 'Option 3'
				}
			},
			'submit' : {
				type: 'submit',
				value: 'Submit'
			}
		}
	};
});





