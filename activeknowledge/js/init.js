//Global game object
var maingame;

// On load, run loadResources
window.addEventListener('load', loadResources, false);

// Load media resources, and then call loadAll to pull resources and pass onto main().
function loadResources()
{
	// Initialize Akihabara with default settings, passing browser title
	help.akihabaraInit({
		title: 'Active Knowledge', 
		width: 640,
		height: 480,
		zoom: 1
	});

	// Add font letter image as 'font'
	gbox.addImage('font', 'res/img/font.png');
	
	// Add logo image
	gbox.addImage('logo', 'res/img/logo.png');
	
	// Minivan sprite TODO: animation
	gbox.addImage('player_sprite', 'res/img/32x64character.png');
	
	gbox.addTiles({
	    id:      'player_tiles', // set a unique ID for future reference
  	    image:   'player_sprite', // Use the 'sprites' image, as loaded above
  	    tileh:   64,
  	    tilew:   32,
  	    tilerow: 1,
  	    gapx:    0,
  	    gapy:    0
  	  }); 

	// Load map spritesheet
	gbox.addImage('map_spritesheet', 'res/img/map_sheet.png');
	
	// Load map tiles
	gbox.addTiles({
		id: 'map_tiles',
		image: 'map_spritesheet',
		tileh: 16,
		tilew: 16,
		tilerow: 1,
		gapx: 0,
		gapy: 0
	});
	
	// Sprite font parameters
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
	gbox.setGroups(['background', 'player', 'game']);
	
	// Create game object in 'game' group
	maingame = gamecycle.createMaingame('game', 'game');
	
	// Override difficulty menu and "Let's begin"
	maingame.gameMenu = function() { return true; };
	maingame.gameIntroAnimation = function() { return true; };
	
	/*
	 * gameTitleIntroAnimation(reset) override
	 * 		Replace default intro screen with scrolling logo
	 */
	maingame.gameTitleIntroAnimation=function(reset) {
		if (reset) {
			toys.resetToy(this, 'rising');
		}
		
		// Clear screen
		gbox.blitFade(gbox.getBufferContext(), { alpha: 1 });
		
		/* Draw ball
		var ballImage = gbox.getImage('ball');
		gbox.blitAll(gbox.getBufferContext(), ballImage, 
			{ 
			dx:gbox.getScreenW()/2-(gbox.getImage('ball').width/2), 
			dy:gbox.getScreenH()/2-(gbox.getImage('ball').height/2)
			});
		*/
		
		/* Logo rising from bottom on reset
		toys.logos.linear(this, 'rising', {
			image: 'logo',
			sx:	 gbox.getScreenW()/2-gbox.getImage('logo').width/2,
			sy:	 gbox.getScreenH(),
			x:   gbox.getScreenW()/2-gbox.getImage('logo').width/2,
			y:   20,
			speed: 1
		}); 
		*/
	}
	
	/*
	 * pressStartIntroAnimation(reset) override
	 * 		Replace default 'press to start' text (PRESS Z TO START)
	 */
	maingame.pressStartIntroAnimation=function(reset) {
		if (reset) {
			toys.resetToy(this, "default-blinker");
		} else {
			toys.text.blink(this, "default-blinker", gbox.getBufferContext(), 
				{
					font:"small",
					text:"PRESS Z TO START",
					valign:gbox.ALIGN_MIDDLE,
					halign:gbox.ALIGN_CENTER,
					dx:0,
					dy:Math.floor(gbox.getScreenH()/2),
					dw:gbox.getScreenW(),
					dh:Math.floor(gbox.getScreenH()/2)*2,
					blinkspeed:10
				});
			return gbox.keyIsHit("a");
		}
	}
	
	/*
	 * maingame.initializeGame(): Initialization area for all 
	 * 		players/objects in game.
	 */
	maingame.initializeGame = function() {
		// Add player
		addPlayer();
		
		// Add map
		addMap();
	};
	
	/* Map object consists of:
	 * - tileset: Tile set of map components
	 * - map: points to function that loads map from ASCII data
	 * - tileIsSolid: points to collision code for map tiles
	 */
	map = {
		tileset: 	 'map_tiles',
		map: 	 	 loadMap(),
		tileIsSolidCeil: function(obj, t) {
			return 0;
		},
		tileIsSolidFloor: function(obj, t) {
			return t != null;	
		}
	};
	// Set height and width parameters of map
	map = help.finalizeTilemap(map);
	
	// Create temp canvas for map with same width/height
	gbox.createCanvas('map_canvas', { w: map.w, h: map.h });
	// Draw map to temp canvas
	gbox.blitTilemap(gbox.getCanvasContext('map_canvas'), map);
	
	// Start game loop
	gbox.go();
}

function loadMap() {
	return help.asciiArtToMap([
	"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
	"x                                      x",
	"x                                      x",
	"x                                      x",
	"x                                      x",
	"x                                      x",
	"x                                      x",
	"x                                      x",
	"x                                      x",
	"x                                      x",
	"x                                      x",
	"x                                      x",
	"x                                      x",
	"x                                      x",
	"x                                      x",
	"x                                      x",
	"x                                      x",
	"x                                      x",
	"x                                      x",
	"x                                      x",
	"x                                      x",
	"x                                      x",
	"x                                      x",
	"x                                      x",
	"x                                      x",
	"x                                      x",
	"x                                      x",
	"x                                      x",
	"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
	], [ [null, ' '], [0, 'x'] ])
}

/*
 * addMap(): Creates map object and adds to game
 * Fields: id, group (rendering)
 * Methods: blit (draw)
 */
function addMap()
{
	gbox.addObject({
		id: 'background_id',	// object ID
		group: 'background',	// rendering group

		blit: function() {
			// Clear canvas
			gbox.blitFade(gbox.getBufferContext(), { alpha: 1 });
			
			// Draw tilemap canvas to screen
			gbox.blit(gbox.getBufferContext(), gbox.getCanvas('map_canvas'), 
				{ 
				dx: 0, 
				dy: 0,
				dw: gbox.getCanvas('map_canvas').width,
				dh: gbox.getCanvas('map_canvas').height,
				sourcecamera: true
				});
		}
	});
}

/*
 * addPlayer(): Creates a player object.
 * Fields: id, group (rendering), tileset
 * Methods: initialize, first (update), blit (draw)
 */
function addPlayer() 
{
	gbox.addObject({
		id: 'player_id',			// Reference ID
		group: 'player',			// Rendering group player belongs to
		tileset: 'player_tiles',	// Image set for sprite animation
			
		// Set collision box for player
		// TODO: Test, may not need this for toys.platformer.
		// toys.topview object's default colh value is bottom half of tile,
		// so character can overlap map features.
		colh: gbox.getTiles('player_tiles').tileh,
		
		// Run once upon creation, initialize player object
		initialize: function() {
			// Initialize the player as a platformer object
			// to access helper methods
			toys.platformer.initialize(this, {});
			
			// Set default player position
			// TODO: Make default location a constant point
			this.x = 20;
			this.y = 20;
		},
		
		// Step function performed during each cycle (*before* rendering)
		first: function() {
			// "Keys" methods apply acceleration based on direction pressed.
			toys.platformer.horizontalKeys(this, { left: 'left', right: 'right' });
			
			// Apply friction to acceleration to prevent crazy physics
			toys.platformer.handleAccellerations(this);
			
			// Apply forces through physics engine
			toys.platformer.applyGravity(this);
			
			/*
			 * Collision detection
			 * Tolerance value creates more organic collision box.
			 * TODO: Only check for vertical collision if this.y has changed.
			 */
			toys.platformer.verticalTileCollision(this, map, 'map');
			//toys.platformer.horizontalTileCollision(this, map, 'map', 1);
		},
		
		// Draw the player tile with updated position/properties
		blit: function() {
			var blitData = {
					tileset: this.tileset,
					tile:	 0, //this.frame,
					dx:		 this.x,
					dy:		 this.y,
					fliph:	 this.fliph,
					flipv:	 this.flipv,
					camera:	 this.camera,
					alpha:	 1.0
			};
			gbox.blitTile(gbox.getBufferContext(), blitData);
		}
	});
}