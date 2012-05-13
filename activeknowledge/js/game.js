//Global game object
var maingame;
var map;
var items;
var timeStarted;
var currentLevel;
var frameCount = 0;

//------------ CONSTANTS ------------//
// Display
DISPLAY_WIDTH = 320;
DISPLAY_HEIGHT = 240;
DISPLAY_ZOOM_LVL = 2;

// Timer
var TIME_LIMIT = 10;

// Special level pointers
var LVL_EMPTY_TEST_SM = 0;			// Small empty test room
var LVL_EMPTY_TEST_LG = 1;		// Large empty test room

// Camera
var CAM_DEADZONE_X = 96;
var CAM_DEADZONE_Y = 96;

// Object sizes
var SIZE_PLAYER_W = 16;
var SIZE_PLAYER_H = 64;
var SIZE_ITEM = 16;

// Map array pointers
var MAP_ARRAY_DATA = 0;
var MAP_TILE_DATA = 1;
var MAP_ITEM_DATA = 2;

// On load, run loadResources
window.addEventListener('load', loadResources, false);

// Load media resources, and then call loadAll to pull resources and pass onto main().
function loadResources()
{
	// Initialize Akihabara with default settings, passing browser title
	help.akihabaraInit({
		title: 'Active Knowledge', 
		width: DISPLAY_WIDTH,
		height: DISPLAY_HEIGHT,
		zoom: DISPLAY_ZOOM_LVL
	});

	// Add font letter image as 'font'
	gbox.addImage('font', 'res/img/font.png');
	
	// Add logo image
	gbox.addImage('logo', 'res/img/logo.png');
	
	// Player sprite
	gbox.addImage('player_sprite', 'res/img/playersheet.png');
	gbox.addImage('plyr_btm_sprite', 'res/img/bottomsheet.png');
	gbox.addImage('plyr_top_sprite', 'res/img/topsheet.png');
	gbox.addImage('plyr_head_sprite', 'res/img/headsheet.png');
	gbox.addImage('plyr_helm_sprite', 'res/img/helmetsheet.png');
	gbox.addImage('map_sprite', 'res/img/mapsheet.png');
	gbox.addImage('item_sprite', 'res/img/itemsheet.png');
	
	gbox.addTiles({
	    id:      'player_tiles', // set a unique ID for future reference
  	    image:   'player_sprite', // Use the 'sprites' image, as loaded above
  	    tileh:   64,
  	    tilew:   16,
  	    tilerow: 7,
  	    gapx:    0,
  	    gapy:    0
  	  });
	
	// PLAYER: Bottom tiles
	gbox.addTiles({
		id:		'plyr_tiles_btm',
		image:	'plyr_btm_sprite',
		tileh:	24,
		tilew:	24,
		tilerow: 6,
		gapx:	 0,
		gapy:	 0
	});
	// PLAYER: Top tiles
	gbox.addTiles({
		id:		'plyr_tiles_top',
		image:	'plyr_top_sprite',
		tileh:	24,
		tilew:	24,
		tilerow: 4,
		gapx:	 0,
		gapy:	 0
	});
	
	// PLAYER: Head tiles
	gbox.addTiles({
		id:		'plyr_tiles_head',
		image:	'plyr_head_sprite',
		tileh:	24,
		tilew:	24,
		tilerow: 6,
		gapx:	 0,
		gapy:	 0
	});
	
	// PLAYER: Helmet tiles
	gbox.addTiles({
		id:		'plyr_tiles_helm',
		image:	'plyr_helm_sprite',
		tileh:	24,
		tilew:	24,
		tilerow: 4,
		gapx:	 0,
		gapy:	 0
	});
	
	// Load map tiles
	gbox.addTiles({
		id: 'map_tiles',
		image: 'map_sprite',
		tileh: 16,
		tilew: 16,
		tilerow: 4,
		gapx: 0,
		gapy: 0
	});
	
	gbox.addTiles({
		id: 'item_tiles',
		image: 'item_sprite',
		tileh: 16,
		tilew: 16,
		tilerow: 4,
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
	gbox.setGroups(['background', 'items', 'player', 'game']);
	
	// Set initial level
	currentLevel = LVL_EMPTY_TEST_SM;
	
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
			// toys.resetToy(this, 'rising');
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
	};
	
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
	};
	
	/*
	 * maingame.initializeGame(): Initialization area for all 
	 * 		players/objects in game.
	 */
	maingame.initializeGame = function() {
		// Add player
		addPlayer();

		items = loadItems(currentLevel);
		
		// Add items
		for (var i in items)
		{
			addItem(items[i][0], items[i][1], items[i][2], items[i][3]);
		}
		
		// Add map
		addMap();
		
		// Get time for timer management
		timeStarted = (new Date()).getTime();
		
		// Create HUD
		maingame.hud.setWidget('time_left', {
			widget: 'label',
			font:	'small',
			value:	0,
			dx:		gbox.getScreenW()-40,
			dy: 	25,
			clear:	true
		});
	};
	
	/* Map object consists of:
	 * - tileset: Tile set of map components
	 * - map: points to function that loads map from ASCII data
	 * - tileIsSolidCeil, tileIsSolidFloor: Collision against world tiles
	 * 	 WORLD TILE COLLISION LOGIC
	 * 		* 4: Nonsolid to all. Background sky tile, items change to this color when picked up.
	 * 		* 'legs': 
	 * 		  Roller track (3) non-solid
	 * 		* 'roller:
	 * 		  Roller track (3) solid
	 */
	loadMap();
	
	// Start game loop
	gbox.go();
}

/*
 * loadMap(): Populates map object to match current level.
 */
function loadMap() {
	map = {
		tileset: 	 'map_tiles',
		map: loadMapData(currentLevel),
		
		tileIsSolidCeil: function(obj, t) {
			var ceilingCheck = false;
			ceilingCheck = (t != 4);
			return ceilingCheck;
		},
		tileIsSolidFloor: function(obj, t) {
			var floorCheck = false;
			
			switch (obj.btm_type)
			{
				case 'legs':
				case 'spring':
				case 'jetpack':
					floorCheck = (t != 3);
					break;
				case 'roller':
					floorCheck = true;
					break;
					// Roller can move across 3 (roller track)
				default:
					alert('ERROR: Unhandled tile collision');
					break;
			}
			return (floorCheck && t != 4 && t != 5 && t != 6);
		}
	};
	// Set height and width parameters of map
	map = help.finalizeTilemap(map);
	
	// Create temp canvas for map and items
	gbox.createCanvas('map_canvas', { w: map.w, h: map.h });
	gbox.createCanvas('item_canvas', { w: map.w, h: map.h });
	// Draw map to temp canvas
	gbox.blitTilemap(gbox.getCanvasContext('map_canvas'), map);
}

/*
 * loadMapData(level): Loads level tile data from maps array at int index specified
 * 				   in level. First argument is ASCII data array index, second
 * 				   is location of translation info.
 */
function loadMapData(level) {
	return help.asciiArtToMap(maps[level][MAP_ARRAY_DATA], maps[level][MAP_TILE_DATA]);
} 

function loadItems(level) {
	return maps[level][2];
}

function callWhenColliding(obj,group,call) {
	for (var i in gbox._objects[group]) {
		
		if ((!gbox._objects[group][i].initialize)&&toys.platformer.collides(obj, gbox._objects[group][i], 2)) {
			if (gbox._objects[group][i][call]) {
				gbox._objects[group][i][call](obj);
				return i;
			}
		}
		
	}
	return false;
}

// Set game state on win/lose conditions
function gameOverWin() {
	maingame.setState(801);  //gameEndingIntroAnimation
}

function gameOverLose() {
	maingame.setState(700);	// gameoverIntroAnimation
}

function levelCompleteWin() {
	// TODO: Show win state, wait for keypress for next level
	loadLevel(LVL_EMPTY_TEST_LG);
}

function loadLevel(level) {
	currentLevel = level;
	loadMap();
	maingame.initializeGame();
}

function addItem(tile_x, tile_y, item_type, object_id) {
	gbox.addObject({
		id: 	'item_id' + object_id,
		group:	'items',
		tileset: 'item_tiles',
		colh:	gbox.getTiles('item_tiles').tileh,
		colw:	gbox.getTiles('item_tiles').tilew,
		item_type: item_type,
		
		isActive: false,
	
		initialize: function() {
			var coord_x = tile_x*SIZE_ITEM;
			var coord_y = tile_y*SIZE_ITEM;
		
			this.x = coord_x;
			this.y = coord_y;
			this.isActive = true;
			
			// Item tile setup
			this.itemTileList = {
					start:		{ speed: 1, frames: [0] },
					finish:		{ speed: 1, frames: [1] },
					
					legs:		{ speed: 1, frames: [4] },
					roller:		{ speed: 1, frames: [5] },
					spring:		{ speed: 1, frames: [6] },
					jetpack:	{ speed: 1, frames: [7] },
					
					blueHelm:	{ speed: 1, frames: [8] },
					yellowHelm: { speed: 1, frames: [9] },
					redHelm:	{ speed: 1, frames: [10] },
					greenHelm:	{ speed: 1, frames: [11] }
			};
			this.itemTileIndex = item_type;	
		},
		
		first: function() {
			this.obj = gbox.getObject('player', 'player_id');
			
			//if (frameCount % this.itemTileList[this.itemTileIndex].speed == 0) {
				if (this.isActive) {
					this.frame = help.decideFrame(frameCount, this.itemTileList[this.itemTileIndex]);
				} else {
					this.frame = 0;
				}
			//}
			
			// TODO: Other item update activity
		},
		
		blit: function() {
			// Only draw this object if isActive == true
			//if (this.isActive) {
				var itemBlitData = {
					tileset: 	this.tileset,
					tile:		this.frame,
					dx:			this.x,
					dy:			this.y,
					fliph:		this.fliph,
					flipv:		this.flipv,
					camera:		this.camera,
					alpha:		1.0
				};
				
				// Draw item tile to map canvas (TODO: simplify for single frame items?)
				//if (this.isActive) {
					gbox.blitTile(gbox.getCanvasContext('item_canvas'), itemBlitData);
				//}
			//}
		},
		
		destroy: function() {
			this.isActive = false;
		},
		
		pickupItem: function(obj) {
			if (this.item_type == 'finish') {
				levelCompleteWin();
			} else {
			
				// Kill self
				if (this.isActive)
					this.destroy();
				
				// Set player based on item
				switch(this.item_type)
				{
					case 'legs':
					case 'roller':
						obj.setBodyBottom(this.item_type);
						break;
					default:
						break;
				}
				
			}
		}
	});
}

/*
 * addMap(): Creates map canvas object
 * 			 Also creates item canvas object
 * Fields: id, group (rendering)
 * Methods: blit (draw)
 */
function addMap()
{
	gbox.addObject({
		id: 'background_id',	// object ID
		group: 'background',	// rendering group

		first: function() {
			// Increment frame count
			// TODO: Modify to prevent rollover
			frameCount++;
			
			// Manage timer
			secondsElapsed = ((new Date()).getTime() - timeStarted) / 1000;
			
			// Set hud timer to current time left.
			maingame.hud.setValue('time_left', 'value', Math.ceil(secondsElapsed));
		    maingame.hud.redraw();
			
			if (secondsElapsed >= TIME_LIMIT) {
				//gameOverLose();	
			}
		},
		
		blit: function() {
			
			// Clear canvas
			gbox.blitFade(gbox.getBufferContext(), { alpha: 1 });
			
			// Center camera on player
			followCamera(gbox.getObject('player', 'player_id'), { w: map.w, h: map.h });
			
			// Draw tilemap canvas to screen
			var mapBlitData = {
				dx: 0, 
				dy: 0,
				dw: gbox.getCanvas('map_canvas').width,
				dh: gbox.getCanvas('map_canvas').height,
				sourcecamera: true	
			};
			var itemBlitData = {
				dx: 0, 
				dy: 0,
				dw: gbox.getCanvas('item_canvas').width,
				dh: gbox.getCanvas('item_canvas').height,
				sourcecamera: true	
			};
			gbox.blit(gbox.getBufferContext(), gbox.getCanvas('map_canvas'), mapBlitData);
			gbox.blit(gbox.getBufferContext(), gbox.getCanvas('item_canvas'), itemBlitData);
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
		
		bottom_tileset: 'plyr_tiles_btm',	// sprite leg section
		top_tileset: 'plyr_tiles_top',		// sprite body section
		head_tileset: 'plyr_tiles_head',	// sprite head section
		helm_tileset: 'plyr_tiles_helm',	// sprite helm section
		
		// Starting body types
		btm_type: 'legs',
		top_type: 'body',
		head_type: 'face',
		helm_type: 'helmGreen',
		
		// Relative body part locations from player (0, 0)
		// TODO: Set collision box to appropriately fit parts
		btm_x: -4,
		btm_y: 40,
		top_x: -4,
		top_y: 19,
		head_x: -4,
		head_y: 0,
		helm_x: -4,
		helm_y: -1,
		
		colw: SIZE_PLAYER_W,
		colh: SIZE_PLAYER_H,
		
		// Run once upon creation, initialize player object
		initialize: function() {
			// Initialize the player as a platformer object
			// to access helper methods
			toys.platformer.initialize(this, {});
			
			// Set default player position
			// TODO: Make default location a constant point
			this.x = 32;
			this.y = 32;
			this.w = SIZE_PLAYER_W,
			this.h = SIZE_PLAYER_H,
			
			// Set list of frames for each animation
			this.animList = {
				StillRight:	{ speed: 1, frames: [0]	},
				Right:		{ speed: 3, frames: [1, 2] },
				StillLeft:	{ speed: 1, frames: [3]	},
				Left:		{ speed: 3, frames: [4, 5] }
			};
			this.animIndex = 'StillRight';			
			
			// Bottom animations
			this.topAnimList = {
				bodyStillRight:	  { speed: 1, frames: [0] },
				bodyStillLeft:	  { speed: 1, frames: [2] },
				bodyRight:		  { speed: 1, frames: [1] },
				bodyLeft:		  { speed: 1, frames: [3] }
			};
			this.topAnimIndex = this.top_type+this.animIndex;
			
			// Top animations
			this.btmAnimList = {
				legsStillRight:	  { speed: 1, frames: [0] },
				legsRight:		  { speed: 3, frames: [1, 2, 3] },
				legsStillLeft:	  { speed: 1, frames: [6] },
				legsLeft:		  { speed: 3, frames: [7, 8, 9] },
				rollerStillRight: { speed: 1, frames: [12] },
				rollerRight: 	  { speed: 3, frames: [13, 14] },
				rollerStillLeft:  { speed: 1, frames: [15] },
				rollerLeft:		  { speed: 3, frames: [16, 17] }
			};
			this.btmAnimIndex = this.btm_type+this.animIndex;	

			this.headAnimList = {
				faceStillRight: { speed: 1, frames: [0] },
				faceRight:		{ speed: 3, frames: [1, 2] },
				faceStillLeft:	{ speed: 1, frames: [3] },
				faceLeft:		{ speed: 3, frames: [4, 5] }
			};
			this.headAnimIndex = this.head_type+this.animIndex;
			
			this.helmAnimList = {
				helmBlueRight: 		{ speed: 3, frames: [8, 9] },
				helmYellowRight: 	{ speed: 1, frames: [10, 11] },
				helmRedRight: 		{ speed: 1, frames: [12, 13] },
				helmGreenRight: 	{ speed: 1, frames: [14, 15] },
				helmBlueLeft: 		{ speed: 1, frames: [16, 17] },
				helmYellowLeft: 	{ speed: 1, frames: [18, 19] },
				helmRedLeft: 		{ speed: 1, frames: [20, 21] },
				helmGreenLeft: 		{ speed: 1, frames: [22, 23] },	
				
				helmBlueStillRight: 	{ speed: 1, frames: [0] },
				helmYellowStillRight: 	{ speed: 1, frames: [1] },
				helmRedStillRight: 		{ speed: 1, frames: [2] },
				helmGreenStillRight: 	{ speed: 1, frames: [3] },
				helmBlueStillLeft: 		{ speed: 1, frames: [4] },
				helmYellowStillLeft: 	{ speed: 1, frames: [5] },
				helmRedStillLeft: 		{ speed: 1, frames: [6] },
				helmGreenStillLeft: 	{ speed: 1, frames: [7] }
			};
			this.helmAnimIndex = this.helm_type+this.animIndex;
		},
		
		// Step function performed during each cycle (*before* rendering)
		first: function() {
			
			// "Keys" methods apply acceleration based on direction pressed.
			toys.platformer.horizontalKeys(this, { left: 'left', right: 'right' });
			
			// Can only jump if using legs
			if (this.btm_type == 'legs')
				toys.platformer.jumpKeys(this, { jump: 'a' });
			
			// TODO: Last left or last right variables to determine which way to face.
			// Or, just check against what the last animation was?
			if (this.accx == 0 && this.accy == 0) {
				if (this.animIndex == 'Right')
				{
					this.animIndex = 'StillRight';
					this.btmAnimIndex = this.btm_type+this.animIndex;
					this.topAnimIndex = this.top_type+this.animIndex;
					this.headAnimIndex = this.head_type+this.animIndex;
					this.helmAnimIndex = this.helm_type+this.animIndex;
				}
				if (this.animIndex == 'Left')
				{
					this.animIndex = 'StillLeft';
					this.btmAnimIndex = this.btm_type+this.animIndex;
					this.topAnimIndex = this.top_type+this.animIndex;
					this.headAnimIndex = this.head_type+this.animIndex;
					this.helmAnimIndex = this.helm_type+this.animIndex;
				}
			}
			if (this.accx > 0 && this.accy == 0)
			{
				this.animIndex = 'Right';
				this.btmAnimIndex = this.btm_type+this.animIndex;
				this.topAnimIndex = this.top_type+this.animIndex;
				this.headAnimIndex = this.head_type+this.animIndex;
				this.helmAnimIndex = this.helm_type+this.animIndex;
			}
			if (this.accx < 0 && this.accy == 0)
			{
				this.animIndex = 'Left';
				this.btmAnimIndex = this.btm_type+this.animIndex;
				this.topAnimIndex = this.top_type+this.animIndex;
				this.headAnimIndex = this.head_type+this.animIndex;
				this.helmAnimIndex = this.helm_type+this.animIndex;
			}
			
			// Set the animation
			if (frameCount % this.animList[this.animIndex].speed == 0) {
				//this.frame = help.decideFrame(frameCount, this.animList[this.animIndex]);
				this.btmFrame = help.decideFrame(frameCount, this.btmAnimList[this.btmAnimIndex]);
				this.topFrame = help.decideFrame(frameCount, this.topAnimList[this.topAnimIndex]);
				this.headFrame = help.decideFrame(frameCount, this.headAnimList[this.headAnimIndex]);
				this.helmFrame = help.decideFrame(frameCount, this.helmAnimList[this.helmAnimIndex]);
			}
			
			// Apply friction to acceleration to prevent crazy physics
			// Apply gravity force
			toys.platformer.handleAccellerations(this);
			toys.platformer.applyGravity(this);
			
			/*
			 * Collision detection
			 * Tolerance value creates more organic collision box.
			 * TODO: Only check for vertical collision if this.y has changed.
			 */
			this.wallCollisionCheck();
			
			// Check collisions with object groups
			callWhenColliding(this, 'items', 'pickupItem');
		},
		
		// Draw the player tile with updated position/properties
		blit: function() {
			/* Whole character from playersheet.png
			var blitData = {
					tileset: this.tileset,
					tile:	 this.frame,
					dx:		 this.x,
					dy:		 this.y,
					fliph:	 this.fliph,
					flipv:	 this.flipv,
					camera:	 this.camera,
					alpha:	 1.0
			};
			*/
			
			// Draw legs
			var btmBlitData = {
				tileset: this.bottom_tileset,
				tile: 	 this.btmFrame,
				dx:		 this.x+this.btm_x,
				dy:		 this.y+this.btm_y,
				fliph:	 this.fliph,
				flipv:	 this.flipv,
				camera:  this.camera,
				alpha:	 1.0
			};
			
			// Draw body
			var topBlitData = {
				tileset: this.top_tileset,
				tile:	 this.topFrame,
				dx:		 this.x+this.top_x,
				dy:		 this.y+this.top_y,
				fliph:	 this.fliph,
				flipv:	 this.flipv,
				camera:	 this.camera,
				alpha:	 1.0
			};
			
			// Draw head
			var headBlitData = {
				tileset: this.head_tileset,
				tile:	 this.headFrame,
				dx:		 this.x+this.head_x,
				dy:		 this.y+this.head_y,
				fliph:	 this.fliph,
				flipv:	 this.flipv,
				camera:	 this.camera,
				alpha:	 1.0
			};
			
			// Draw head
			var helmBlitData = {
				tileset: this.helm_tileset,
				tile:	 this.helmFrame,
				dx:		 this.x+this.helm_x,
				dy:		 this.y+this.helm_y,
				fliph:	 this.fliph,
				flipv:	 this.flipv,
				camera:	 this.camera,
				alpha:	 1.0
			};
			
			// gbox.blitTile(gbox.getBufferContext(), blitData);
			gbox.blitTile(gbox.getBufferContext(), btmBlitData);
			gbox.blitTile(gbox.getBufferContext(), topBlitData);
			gbox.blitTile(gbox.getBufferContext(), headBlitData);
			gbox.blitTile(gbox.getBufferContext(), helmBlitData);
		},
		
		wallCollisionCheck: function() {
			toys.platformer.verticalTileCollision(this, map, 'map');
			toys.platformer.horizontalTileCollision(this, map, 'map', 1);
		},
		
		setBodyBottom: function(btm) {
			this.btm_type = btm;
		},
		setBodyTop: function(top) {
			this.top_type = top;
		},
		setBodyFace: function(face) {
			this.face_type = face;
		},
		setBodyHelm: function(helm) {
			this.helm_type = helm;
		}		
	});
}

function followCamera(obj, viewdata) {
	xbuf = CAM_DEADZONE_X;
	ybuf = CAM_DEADZONE_Y;
	xcam = gbox.getCamera().x;
	ycam = gbox.getCamera().y;
	
	// Follow object when it exits dead zone on the right side
	if ((obj.x - xcam) > (gbox._screenw - xbuf)) 
		gbox.setCameraX(xcam + (obj.x - xcam)-(gbox._screenw - xbuf), viewdata);
	// Follow object to left
	if ((obj.x - xcam) < (xbuf)) 
		gbox.setCameraX(xcam + (obj.x - xcam) - (xbuf), viewdata);
	
	// Follow up or down
	if ((obj.y - ycam) > (gbox._screenh - ybuf)) 
		gbox.setCameraY(ycam + (obj.y - ycam)-(gbox._screenh - ybuf), viewdata);
	if ((obj.y - ycam) < (ybuf)) 
		gbox.setCameraY(ycam + (obj.y - ycam) - (ybuf), viewdata);
}
