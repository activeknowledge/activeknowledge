// Global game object
var game;

// On load, run loadResources
window.addEventListener('load', loadResources, false);

// Load media resources, and then call loadAll to pull resources and pass onto main().
function loadResources()
{
	// Initialize Akihabara with default settings, passing browser title
	help.akihabaraInit('Active Knowledge');

	// Add font letter image as 'font'
	gbox.addImage('font', 'res/img/font.png');

	// Add logo image as 'logo'
	gbox.addImage('logo', 'res/img/logo.png');

	gbox.addFont({
		id: 'small',
		image: 'font',
		firstletter: ' ',
		tileh: 8,
		tilew: 8, 
		tilerow: 255, 
		gapx: 0,
		gapy: 0
	});
	
	// Load all the queued resources, and then run passed method
	gbox.loadAll(main);
}

function main()
{
	alert('ahhh!');
}