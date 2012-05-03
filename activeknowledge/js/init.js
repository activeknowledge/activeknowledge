// Global game object
var maingame;

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
	// Create group for game to reside in
	gbox.setGroups(['game']);
	
	// Create game object in 'game' group
	maingame = gamecycle.createMaingame('game', 'game');
	
	maingame.gameTitleIntroAnimation=function(reset) {
		if (reset) {
			toys.resetToy(this, 'rising');
		}
		
		gbox.blitFade(gbox.getBufferContext(), { alpha: 1 });
		
		toys.logos.linear(this, 'rising', {
			image: 'logo',
			sx:	   gbox.getScreenW()/2-gbox.getImage('logo').width/2,
			sy:	   gbox.getScreenH(),
			x:     gbox.getScreenW()/2-gbox.getImage('logo').width/2,
			y:     20,
			speed: 1
		});
	}
	
	maingame.pressStartIntroAnimation=function(reset) {
		if (reset) {
			toys.resetToy(this, "default-blinker");
		} else {
			toys.text.blink(this, "default-blinker", gbox.getBufferContext(), {font:"small",text:"PRESS Z TO START",valign:gbox.ALIGN_MIDDLE,halign:gbox.ALIGN_CENTER,dx:0,dy:Math.floor(gbox.getScreenH()/3),dw:gbox.getScreenW(),dh:Math.floor(gbox.getScreenH()/3)*2,blinkspeed:10});
			return gbox.keyIsHit("a");
		}
	}
	
	// Start game loop
	gbox.go();
}