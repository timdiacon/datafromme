/*global FastClick */

function init() {
	FastClick.attach(document.body);
	addListeners();
}

$(document).ready(init());

function addListeners(){

	$('#biometric-weight-form').submit(function(e){
		e.preventDefault();

		$.ajax({
			type: 'POST',
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
        	// populate table with data
			$('#statement-preview .transactions').render(data.result.sample);
			$('#statement-preview').removeClass('hidden');

			var html = '<p>This is the first record of '+ data.result.rowCount +'. If it looks OK then lets do the lot</p>';
        	html += '<div id="statement-save" class="btn btn-success">Do it!</div></div>';
        	$('#transactions').append(html);

        	// add listeners...
		    $('#statement-save').click(function(){
		    	$.ajax({
					type: 'POST',
					url: '/api/transaction/complete',
					success: function(data){
						$('#transactions').prepend('<div class="alert alert-success">All done!</div></div>');
						$('#statement-preview').remove();
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