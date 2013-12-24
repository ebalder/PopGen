
requirejs.config({
	baseUrl : '../lib',
    map: { 
      '*': { 'popgen': '../popgen-0.1' }
    }
});

requirejs(['popgen'], function(popgen){

	var button = document.getElementById('tehButton');
	button.onclick = function(ev){
		console.log('shalala');
		var form = popgen.makeForm('form1', fields, null, null);
		console.log(form);
	}

	var fields = {
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
	    'data' : {
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
	};
	
});





