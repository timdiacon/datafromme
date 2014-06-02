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
        // TODO Done not firing?
        done: function (e, data) {
        	var html = '<table class="table"><thead><tr>';
        	$(data.result.columns).each(function(key, val){
        		if(val != null){
        			html += '<th>'+ val +'</th>'
        		}
        	})
        	html += '</tr></thead><tbody><tr>';
        	$(data.result.sample).each(function(key, val){
        		if(val != null){
        			html += '<th>'+ val +'</th>'
        		}
        	})
        	html += '</tr></tbody></table>';
        	console.log(data.result)
        	$('#page-body').append(html);
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            console.log(progress);
        }
    });

    $('#statement-save').click(function(){
    	$.ajax({
			type: "POST",
			url: '/api/transaction/complete',
			success: function(data){
				$('#page-body').prepend('<div class="alert alert-success">Looks like it worked</div>');
			},
			error: function(err){
				$('#page-body').prepend('<div class="alert alert-error">Err, something went wrong: '+ err +'</div>');
			}
		});
    });

}