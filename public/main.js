(function(){
	var socket = io();
	var submitBtn = "#patronSubmitBtn";
	var formId = "#patronDetails"
	socket.on('statusReceived',function(data){
		console.log("Yes data received",data);
		$.each( data, function( key, value ) {
			$('#userstatus').append($('<li>').text(key + ": " + value));
		});
		$(submitBtn).attr("disabled",false);
		if(data.success){
			$("#userAuthenticated").addClass('list-group-item-success');     	
		}else{
			$("#userAuthenticated").addClass('list-group-item-danger');
		}
	});

	$(function() {

		var getAllVerificationType = function  getAllVerificationType(){

			$.ajax({
				type: "GET",
				url: "/api/verificationType",
				 dataType: "json", // expected format for response
				 success: function(data){
				 	$.each(data, function (key, val) {
				 		$('#vtype').append($('<option>', { 
				 			value: key,
				 			text : key 
				 		}));
				 	});
				 },
				 error:function(err){
				 	console.log("Error while fetching the verificationType  ",err);
				 
				 }
				});

		}
       getAllVerificationType();
		$(formId).submit(function(event){
			event.preventDefault();
			console.log($(formId).serialize());
			$(submitBtn).attr("disabled","disabled");
			$("#userAuthenticated").removeClass('list-group-item-success'); 
			$("#requestsend").removeClass('list-group-item-success');   
			$.ajax({
				type: "POST",
				url: "/api/verify",
				data: $("#patronDetails").serialize(),
				 dataType: "json", // expected format for response
				 contentType: "application/x-www-form-urlencoded",
				 success: function(data){
				 	console.log("The data is ",data);
				 	$("#requestsend").addClass('list-group-item-success'); 
				 },
				 error:function(err){
				 	console.log("The error is ",err);
				 	$("#requestsend").addClass('list-group-item-danger'); 
				 }
				});
			return false;
		})
	}); 
})();