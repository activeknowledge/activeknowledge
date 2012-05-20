// TODO: Pause menu
// TODO: Reset objects on game start after game over

// Game variables
var maingame;
var map;
var items;
var timeStarted;
var secondsElapsed = 0;
var finishTime = 0;
var currentLevel;
var currentLives = 3;
var frameCount = 0;

// Game flags
var isGameActive = false;

//------------ CONSTANTS ------------//
// Display
DISPLAY_WIDTH = 320;
DISPLAY_HEIGHT = 240;
DISPLAY_ZOOM_LVL = 2;

// Timer
var TIME_LIMIT = 10;

// Special level pointers
var LVL_STARTING_LEVEL = 0;

// Camera
var CAM_DEADZONE_X = 96;
var CAM_DEADZONE_Y = 96;

// Object sizes
var SIZE_PLAYER_W = 16;
var SIZE_PLAYER_H = 64;
var SIZE_ITEM = 16;
var SIZE_TILE = 16;

// Map array pointers
var MAP_ARRAY_DATA = 0;
var MAP_TILE_DATA = 1;
var MAP_ITEM_DATA = 2;

// Game states
var GAME_STATE_LEVEL_COMPLETE = 400;
var GAME_STATE_LEVEL_INTRO = 401;
var GAME_STATE_LEVEL_START = 402;
var GAME_STATE_LOSE = 700;
var GAME_STATE_WIN = 801;

// On load, run loadResources
window.addEventListener('load', loadResources, false);

// Load media resources, and then call loadAll to pull resources and pass onto main().
function loadResources()
{
	// Initialize Akihabara with default settings, passing browser title
	help.akihabaraInit({
		title: 'Nobody Person - pacified citizen games', 
		width: DISPLAY_WIDTH,
		height: DISPLAY_HEIGHT,
		zoom: DISPLAY_ZOOM_LVL
	});

	// Add font letter image as 'font'
	gbox.addImage('font', 'res/img/font.png');
	
	// Add logo image
	gbox.addImage('title', 'res/img/title.png');
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
	// Create object groups
	gbox.setGroups(['background', 'items', 'player', 'game']);
	
	// Set initial level
	currentLevel = LVL_STARTING_LEVEL;
	
	
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
		gbox.blitAll(gbox.getBufferContext(),gbox.getImage('title'),{dx:0,dy:0});
				
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
					valign:gbox.ALIGN_TOP,
					halign:gbox.ALIGN_LEFT,
					dx:10,
					dy:10,
					dw:gbox.getScreenW(),
					dh:Math.floor(gbox.getScreenH()/2)*2,
					blinkspeed:10
				});
			return gbox.keyIsHit("a");
		}
	};
	
	// End level triggered by finish collision
	maingame.endlevelIntroAnimation=function(reset) {
 		if (reset) {
 			toys.resetToy(this, 'default-blinker');
 			toys.resetToy(this, 'timer_after_level');
 			finishTime = secondsElapsed;
 		} else {
 			// Write level complete message
 			//gbox.blitText(gbox.getBufferContext(),{font:'small',text:'STAGE CLEAR!',valign:gbox.ALIGN_MIDDLE,halign:gbox.ALIGN_CENTER,dx:0,dy:0,dw:gbox.getScreenW(),dh:gbox.getScreenH()});
 			//gbox.blitText(gbox.getBufferContext(), {font:'small',text:finishTime+' SEC',valign:gbox.ALIGN_MIDDLE,halign:gbox.ALIGN_CENTER,dx:0,dy:20,dw:gbox.getScreenW(),dh:gbox.getScreenH()});
 			
 			// Must stay alive 2 seconds after clear, 
 			// Otherwise clear is reversed, player is treated like crap and level starts over
 			var player_obj = gbox.getObject('player', 'player_id');
 			if (!toys.timer.after(this, 'timer_after_level', 60)) {
 				
 			} else {
 				return true;
 			}
 			
 			// Used to just fade out after a few seconds
 			// return toys.timer.after(this,'timer_after_level',60);
 		}
 		return false;
 	};
 	
 	// Animation between levels
	maingame.levelIntroAnimation=function(reset) {
		if (reset) {
			toys.resetToy(this, 'default-blinker');
			toys.resetToy(this, 'timer_between_level');
			
			// Increment level and load
			// TODO: Boundary on number of levels
			currentLevel++;
			loadLevel(currentLevel);
		} else {
			gbox.blitFade(gbox.getBufferContext(),{alpha:1});
			return toys.text.blink(this,"default-blinker",gbox.getBufferContext(),{font:"small",text:"GET READY!",valign:gbox.ALIGN_MIDDLE,halign:gbox.ALIGN_CENTER,dx:0,dy:0,dw:gbox.getScreenW(),dh:gbox.getScreenH(),blinkspeed:5,times:6});
		}
	}; 	
 	
 	// Game events runs on each frame, for global event checks
 	maingame.gameEvents=function() {
 		// Display any text based on game state
 		// On death (500): NOBODY DIED
 		// On level complete (400): STAGE CLEAR
 		displayStateText(maingame.state);
 	};
 	
 	// Runs on beginning of new life
 	maingame.newLife=function() {
 		// Reload level
 		loadLevel(currentLevel);
 	};
 	
 	maingame.gameIsOver=function() {
 		var player_obj = gbox.getObject('player', 'player_id');
 		if (player_obj.lives == 0) return true;
 	};
	
	/*
	 * maingame.initializeGame(): Initialization area for all 
	 * 		players/objects in game.
	 */
	maingame.initializeGame = function() {
		// Create HUD
		maingame.hud.setWidget('time_left', {
			widget: 'label',
			font:	'small',
			value:	0,
			dx:		10, // gbox.getScreenW()-40,
			dy: 	10,
			clear:	true
		});
		
		maingame.hud.setWidget('lives', {
			widget: 'label',
			font:	'small',
			value:	0,
			dx:		10,
			dy: 	25,
			clear:	true
		});
		
		loadLevel(currentLevel);
	};
	
 	maingame.changeLevel = function(level) {
 		// TODO: Do something with this
 	};	
	
	// TODO: Move to initialize for game if need be
	loadMap();
	
	// Start game loop
	gbox.go();
}

// For any state with default text, this function
// will display it when fired by gameEvents().
function displayStateText(state) {
	switch (maingame.state) {
		case 500:
			gbox.blitText(gbox.getBufferContext(),{font:'small',text:'NOBODY DIED',valign:gbox.ALIGN_MIDDLE,halign:gbox.ALIGN_CENTER,dx:0,dy:0,dw:gbox.getScreenW(),dh:gbox.getScreenH()});
			break;
		case 400:
			gbox.blitText(gbox.getBufferContext(),{font:'small',text:'STAGE CLEAR!',valign:gbox.ALIGN_MIDDLE,halign:gbox.ALIGN_CENTER,dx:0,dy:0,dw:gbox.getScreenW(),dh:gbox.getScreenH()});
			gbox.blitText(gbox.getBufferContext(), {font:'small',text:finishTime+' SEC',valign:gbox.ALIGN_MIDDLE,halign:gbox.ALIGN_CENTER,dx:0,dy:20,dw:gbox.getScreenW(),dh:gbox.getScreenH()});
			break;
	}
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
			// Don't collide with empty tiles or tiles matching helm
			ceilingCheck = (t != 4 && tileCheck(obj.helm_type, t));
			return ceilingCheck;
		},
		tileIsSolidFloor: function(obj, t) {
			var floorTest = floorCheck(obj.btm_type, t);
			
			var tileTest = tileCheck(obj.helm_type, t);
			
			// 20120519: Removed 5 and 6
			return ((floorTest || tileTest) && t != 4 && t != null);
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

//Tiles matching helmet are solid
function tileCheck(helm, tile) {
	
	var tileCheck = false;
	switch (helm)
	{
		case 'helmBlue':
			tileCheck = (tile == 2);
			break;
		case 'helmRed':
			tileCheck = (tile == 6);
			break;
		case 'helmGreen':
			tileCheck = (tile == 10);
			break;
		case 'helmYellow':
			tileCheck = (tile == 14);
			break;
		default:
			alert('ERROR: Unhandled color tile collision');
			break;
	}
	
	return tileCheck;
}

// Check for floor, given type of bottom body part
function floorCheck(btm, tile) {
	
	var floorCheck = false;
	var helmTiles = (tile != 2) && (tile != 6) && (tile != 10) && (tile != 14);
	switch (btm)
	{
		case 'legs':
		case 'spring':
		case 'jetpack':
			floorCheck = (tile != 3) && helmTiles;
			break;
		case 'roller':
			floorCheck = helmTiles;
			break;
			// Roller can move across 3 (roller track)
		default:
			alert('ERROR: Unhandled floor tile collision');
			break;
	}
	return floorCheck;
}

/*
 * loadMapData(level): Loads level tile data from maps array at int index specified
 * 				   via level. First argument is ASCII data array index, second
 * 				   is location of translation info.
 */
function loadMapData(level) {
	return help.asciiArtToMap(maps[level][MAP_ARRAY_DATA], maps[level][MAP_TILE_DATA]);
} 

/*
 * loadItems(level): Populates items array with series of objects specified in maps[level][2].
 */
function loadItems(level) {
	return maps[level][MAP_ITEM_DATA];
}

// Place player at the location of 'start' item
// TODO: Also return player to original item state
function resetPlayer() {
	var player_obj = gbox.getObject('player', 'player_id');
	
	// Reset position ('start' item * tile size)
	var startX = (maps[currentLevel][MAP_ITEM_DATA][0][0] * SIZE_TILE);
	var startY = (maps[currentLevel][MAP_ITEM_DATA][0][1] * SIZE_TILE);
	player_obj.x = startX;
	player_obj.y = startY;
	
	// Reset life
	player_obj.isKilled = false;
}

function resetClock() {
	timeStarted = (new Date()).getTime();
}

/*
 * callWhenColliding(obj, group, call): Trigger collision check by passing self, an object group name
 * 					and a function name to call when a collision is detected. Box-to-box detection.
 */
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
	maingame.setState(GAME_STATE_WIN);  //gameEndingIntroAnimation
}

function gameOverLose() {
	maingame.setState(GAME_STATE_LOSE);	// gameoverIntroAnimation
}

/*
 * levelCompleteWin: Triggered on finish collision. Stop gameplay,
 * set LEVEL_COMPLETE game state, wait and then load next level.
 */
function levelCompleteWin() {
	isGameActive = false;
	isLevelComplete = true;
	maingame.setState(GAME_STATE_LEVEL_COMPLETE); // 400
}

function loadLevel(level) {
	// Clean up previous level
	gbox.trashGroup('items');
	gbox.purgeGarbage();
	
	currentLevel = level;
	
	// Add player
	addPlayer();

	// Get item array for current level
	items = loadItems(currentLevel);
	
	// Set player position based on 'start' item 
	resetPlayer();	
	
	// Add items
	for (var i in items)
	{
		addItem(items[i][0], items[i][1], items[i][2], items[i][3]);
	}
	
	// Add map
	addMap();
	
	// Load map from current level
	loadMap();
	
	// Get time for timer management
	resetClock();
	
	isGameActive = true;
	isLevelComplete = false;
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
					
					helmBlue:	{ speed: 1, frames: [8] },
					helmYellow: { speed: 1, frames: [9] },
					helmRed:	{ speed: 1, frames: [10] },
					helmGreen:	{ speed: 1, frames: [11] }
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
			if (this.isActive) {
			
				// Finish gate collision ends the level.
				if (this.item_type == 'finish') {
					this.isActive = false;
					levelCompleteWin();
				} else {
				
					// Kill self
					this.destroy();
				
					// Set player based on item
					switch(this.item_type)
					{
						case 'legs':
						case 'roller':
						case 'jetpack':
							obj.setBodyBottom(this.item_type);
							break;
						
						case 'helmBlue':
						case 'helmGreen':
						case 'helmRed':
						case 'helmYellow':
							obj.setBodyHelm(this.item_type);
							break;
						default:
							break;
					}
					
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
			var player_obj = gbox.getObject('player', 'player_id');
			
			// Increment frame count
			// TODO: Consider frameCount overflow
			frameCount++;
			
			// If gameplay is active or the level was just completed...
			if (isGameActive || isLevelComplete) {
				
				// Player safety checks
				// Make sure player is inside map, kill if not
				if ( help.getTileInMap(player_obj.x, player_obj.y, map, 'shit', 'map') == 'shit' )
				{
					if (!player_obj.isKilled) {
						player_obj.kill();
					}
				}
					
				// ...update level timer
				if (isGameActive) {
					secondsElapsed = ((new Date()).getTime() - timeStarted) / 1000;
					secondsElapsed = secondsElapsed.toFixed(3);
				}
				
				// Show HUD when game is running only
				// TODO: Run showWidgets only once
				if (isGameActive)
					maingame.hud.showWidgets(['time_left', 'lives']);
				else maingame.hud.hideWidgets(['time_left', 'lives']);
			} else {
				// Hide HUD during transitions
				maingame.hud.hideWidgets(['time_left', 'lives']);
			}
			// Set hud timer to current time.
			maingame.hud.setValue('time_left', 'value', 'TIME ' + secondsElapsed);
			maingame.hud.setValue('lives', 'value', 'LIVES ' + player_obj.lives);
		    maingame.hud.redraw();
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
		
		// Player game properties
		lives: currentLives,
		isKilled: false,
		
		// Starting body types
		btm_type: 'legs',
		top_type: 'body',
		head_type: 'face',
		helm_type: 'helmBlue',
		
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
		
		// Acceleration limits
		maxaccx: 6,
		
		// Run once upon creation, initialize player object
		initialize: function() {
			// Initialize the player as a platformer object
			// to access helper methods
			toys.platformer.initialize(this, {});
			
			// Set player size
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
				rollerLeft:		  { speed: 3, frames: [16, 17] },
				jetpackStillRight:  { speed: 1, frames: [24] },
				jetpackRight:		{ speed: 3, frames: [25, 26] },
				jetpackStillLeft:  	{ speed: 1, frames: [27] },
				jetpackLeft:		{ speed: 3, frames: [28, 29] }
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
			if (isGameActive) {
				toys.platformer.horizontalKeys(this, { left: 'left', right: 'right' });
				// Jetpack can lift with jump key
				if (this.btm_type == 'jetpack')
					toys.platformer.jumpKeys(this, { jetjump: 'a' });
					//toys.platformer.verticalKeys(this, { up: 'up' });
				
				// Legs can jump with jump key
				if (this.btm_type == 'legs')
					toys.platformer.jumpKeys(this, { jump: 'a' });
			} else {
				// TODO: Dance animation
				// this.accx = 0;
				// this.accy = 0;
			}
			
			// TODO: Last left or last right variables to determine which way to face.
			// Or, just check against what the last animation was?
			if (this.accx == 0 && this.accy == 0) {
				if (this.animIndex == 'Right')
				{
					this.animIndex = 'StillRight';
				}
				if (this.animIndex == 'Left')
				{
					this.animIndex = 'StillLeft';
				}
			}
			if (this.accx > 0 && this.accy == 0)
			{
				this.animIndex = 'Right';
			}
			if (this.accx < 0 && this.accy == 0)
			{
				this.animIndex = 'Left';
			}
			// TODO: Fix stupid way to trigger movement animation on jetpack lift
			// TODO: Fix all this movement determination it suuuuucks!
			if (this.animIndex == 'StillRight' && this.accy < 0)
			{
				this.animIndex = 'Right';
			}
			if (this.animIndex == 'StillLeft' && this.accy < 0)
			{
				this.animIndex = 'Right';
			}
			this.btmAnimIndex = this.btm_type+this.animIndex;
			this.topAnimIndex = this.top_type+this.animIndex;
			this.headAnimIndex = this.head_type+this.animIndex;
			this.helmAnimIndex = this.helm_type+this.animIndex;
			
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
		
		kill: function() {
			this.isKilled = true;
			isGameActive = false;
			// maingame.hud.addValue('lives','value',-1); // Then decrease the lives count.
			maingame.playerDied({wait:50});
			currentLives--;
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
