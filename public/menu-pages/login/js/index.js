$('.message a').click(function(){
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});

function create(){
	var pw = document.getElementById('new_password').value;
	var cpw = document.getElementById('confirm_password').value;
	if(pw.localeCompare(cpw) == -1){
		confirm_password.setCustomValidity("Passwords Don't Match");
	}
}