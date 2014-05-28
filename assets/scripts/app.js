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
}