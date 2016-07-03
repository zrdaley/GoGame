// Popup Functionality in Navbar
function popup(url) {
	newwindow=window.open(url,'name','height=500,width=650');
	if (window.focus) {newwindow.focus()}
	return false;
}
