$(document).ready(init());

function init(){
	addListeners();
}

function addListeners(){

	$('#biometric-weight-form').submit(function(e){
		e.preventDefault();

		$.ajax({
			type: "POST",
			url: '/api/biometrics',
			data: $(this).serialize(), // serializes the form's elements.
			success: function(data){
				$('#page-body').prepend('<div class="alert alert-success">Well done fatty, now go for a run!</div>');
				$('#biometric-weight-form').remove();
			},
			error: function(err){
				$('#page-body').prepend('<div class="alert alert-error">Err, something went wrong: '+ err +'</div>');
			}
		});
	});

    $('#statement-upload').fileupload({
        url: 'api/transaction',
        dataType: 'json',

        done: function (e, data) {
        	// create and insert data sample as table
        	var headerHtml = '';
        	var bodyHtml = '';
        	console.log(data.result.columns)
        	$(data.result.columns).each(function(key, val){
        		if(val != null){
        			headerHtml += '<th>'+ val +'</th>';
        			bodyHtml += '<th>'+ data.result.sample[val] +'</th>'
        		}
        	})
        	var html = '<table class="table"><thead><tr>'+ headerHtml +'</tr></thead><tbody><tr>'+bodyHtml+'</tr></tbody></table>';
        	$('#transaction-form').append(html);

        	// now add the GO GO GO button
        	$('#transaction-form').append('This is the first record of '+data.result.rowCount+'. If it looks OK then lets do the lot');
        	$('#transaction-form').append('<div id="statement-save" class="btn btn-success">Do it!</div>');
		    $('#statement-save').click(function(){
		    	$.ajax({
					type: "POST",
					url: '/api/transaction/complete',
					success: function(data){
						$('#page-body').prepend('<div class="alert alert-success">All done!</div>');
						$('#transaction-form').remove();
					},
					error: function(err){
						$('#page-body').prepend('<div class="alert alert-error">Err, something went wrong: '+ err +'</div>');
					}
				});
		    });
        },

        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            
            if(progress == 100){
            	$('#statement-form').remove();
            }
        }
    });


}