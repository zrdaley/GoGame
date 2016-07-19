// keep track all current account
var currentAccount = null;
//alert("hahhads");

// create a new object for accessing the server
var serverInterface = new ServerInterface("localhost", 30110);


function createAccount(){

	//alert("hi");
	var name = document.getElementById("newUserName").value;
	var password = document.getElementById("newPassword").value;
	var win = 0;
	var confirm_password = document.getElementById("confirmPassword").value;
	var win = 0; // 0 is initial for first account, no win, no lose
	if(!name || ! password){
		alert("Please enter a username and password.");
	}else{
		var n = password.localeCompare(confirm_password);
		if(n != 0){
			alert("Invalid password! Please try again.");
		}else{


			currentAccount = {};
			currentAccount.name = name;
			currentAccount.password = password;
			currentAccount.win = win;


			//document.getElementById("save").disabled = true;
			document.getElementById("create").disabled = true;
			//alert("hi03");


			//alert("hello03");
			serverInterface.addAccount(
				currentAccount.name,
				currentAccount.password,
				currentAccount.win,
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
			//document.getElementById("create").disabled = true;
			//document.getElementById("newUserName").value = "";
			//document.getElementById("newPassword").value = "";
			alert("Account creation successful!");
			//currentAccount = null;
			confirmPassword.value = '';
			newUserName.value = '';
			newPassword.value = '';

			window.location.href = "http://localhost:30110";

		}
	}
}

function searchAccount(object){
	var userName = document.getElementById("userName").value;
	var password = document.getElementById("password").value;

	var user = {name: userName, wins: 0};

	var checkPass = 0;
	//alert(object[1].name);
	//alert(object[1].password);
	for(var i = 0; i < object.length; i++){
		if(userName.localeCompare(object[i].name) == 0 && password.localeCompare(object[i].password) == 0){
			// console.log("the login successfully");
			// alert("Successful login!");
			checkPass = checkPass + 1;

			//store username/wins in server
			user.wins = object[i].win;
			var postXhr = new XMLHttpRequest();
    		postXhr.open("POST", "/userName", true);
    		postXhr.setRequestHeader("Content-type", "application/json");
    		postXhr.send(JSON.stringify(user));


			window.location.href="../oneplayer/new-oneplayer.html";
			break;
		}
	}

	if(checkPass == 0){
		alert("Invalid username and/or password! Please try again.");
	}


}

function getWins(object){
	var userName = document.getElementById("userName").value;
	var password = document.getElementById("password").value;

	var checkPass = 0;
	//alert(object[1].name);
	//alert(object[1].password);
	for(var i = 0; i < object.length; i++){
		if(userName.localeCompare(object[i].name) == 0 && password.localeCompare(object[i].password) == 0){
			// console.log("the login successfully");
			// alert("Successful login!");
			checkPass = checkPass + 1;
			window.location.href="../oneplayer/new-oneplayer.html";
			break;
		}
	}

	if(checkPass == 0){
		alert("Invalid username and/or password! Please try again.");
	}


}


function init(){
	console.log("Initializing Go application...");

	serverInterface.getData(function(err, data){
		if(err){
			console.log("Error getting data: "+ err);
			alert("Could not get data from server: "+err);
		}else{
			
			console.log(data);
			searchAccount(data);

		}
	});
}
