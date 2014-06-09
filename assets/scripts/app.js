/*global FastClick */

function init() {
	FastClick.attach(document.body);
	addListeners();

	var margin = {top: 20, right: 50, bottom: 30, left: 50}
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

	var x = d3.time.scale().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	var yAxis = d3.svg.axis().scale(y).orient("left");

	var line = d3.svg.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.balance); });

	var svg = d3.select("#graph").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	d3.json('/api/transactions', function(err, data){
		//console.log(data)
		data.forEach(function(d) {
			// parse date from ISO format into Date object
			d.date = new Date(d.date);
			d.debit = d.balance;
		})

	  	x.domain(d3.extent(data, function(d) { return d.date; }));
	  	y.domain(d3.extent(data, function(d) { return d.balance; }));

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);

		svg.append("path")
			.datum(data)
			.attr("class", "line")
			.attr("d", line);
	})
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
    	acceptFileTypes: /(\.|\/)(csv)$/i,
        url: 'api/transaction',
        dataType: 'json',

        done: function (e, data) {
        	// populate table with data
			$('#statement-preview .transactions').render(data.result.sample);
			$('#statement-preview').removeClass('hidden');
			$('#statement-preview .actions .total').text(data.result.rowCount);

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
						$('#page-body').prepend('<div class="alert alert-danger">Err, something went wrong: '+ err +'</div>');
					}
				});
		    });
        },

        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            
            if(progress == 100){
            	$('#statement-form').remove();
            }
        },

		processfail: function(err, data){
			$('#page-body').prepend('<div class="alert alert-danger">You gotta upload a CSV file dumb dumb</div>');
		}
    });


}