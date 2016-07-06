// keep track all current account 
var currentAccount = null;
//alert("hahhads");

// create a new object for accessing the server
var serverInterface = new ServerInterface("localhost", 30110);
//alert("hello01");
function createAccount(){

	//alert("hi");
	var name = document.getElementById("newUserName").value;
	var password = document.getElementById("newPassword").value;
	var confirm_password = document.getElementById("confirmPassword").value;
	
	var n = password.localeCompare(confirm_password);
	if(n != 0){
		alert("the password does not match, please enter password again");
	}

	if(!name || ! password){
		console.log("No user name or password has been enter");
		alert("please enter name or password!");
	}else{
		currentAccount = {};
		currentAccount.name = name;
		currentAccount.password = password;

		//document.getElementById("save").disabled = true;
		document.getElementById("create").disabled = true;
		//alert("hi03");

		timerLoop();
		stopTimer();
	}


function timerLoop(){
	setTimeout(function(){
		if(currentAccount){
			timerLoop()
		}
	}, 1000);
}


function stopTimer(){
	//alert("hello03");
	serverInterface.addAccount(
		currentAccount.name,
		currentAccount.password,
		function (data){
			serverInterface.getData(function(err,data){
				if(err){
					console.log("Error getting data: " + err);
				}else{

				}
			});
		}
	);

	//document.getElementById("save").disabled = false;
	document.getElementById("create").disabled = true;
	document.getElementById("newUserName").value = "";
	document.getElementById("newPassword").value = "";
	alert("congradualation, you have successfully created an account, let go to login page!!!");
	currentAccount = null;
}
}

function init(){
	console.log("initializing go application");

	serverInterface.getData(function(err, data){
		if(err){
			console.log("Error getting data: "+ err);
			alert("Could not get data from server: "+err);
		}else{
			console.log(data);

		}
	});
}

