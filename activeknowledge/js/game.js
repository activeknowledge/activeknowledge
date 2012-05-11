//Global game object
var maingame;
var map;
var frameCount = 0;

//------------ CONSTANTS ------------//
// Special level pointers
LVL_EMPTY_TEST_SM = 0;			// Small empty test room
LVL_EMPTY_TEST_LG = 1;		// Large empty test room

// Camera
CAM_DEADZONE_X = 96;
CAM_DEADZONE_Y = 96;

// On load, run loadResources
window.addEventListener('load', loadResources, false);

// Load media resources, and then call loadAll to pull resources and pass onto main().
function loadResources()
{
	// Initialize Akihabara with default settings, passing browser title
	help.akihabaraInit({
		title: 'Active Knowledge', 
		width: 320,
		height: 240,
		zoom: 2
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
		id:		'plyr_btm_tiles',
		image:	'plyr_btm_sprite',
		tileh:	24,
		tilew:	24,
		tilerow: 6,
		gapx:	 0,
		gapy:	 0
	});
	// PLAYER: Top tiles
	gbox.addTiles({
		id:		'plyr_top_tiles',
		image:	'plyr_top_sprite',
		tileh:	24,
		tilew:	24,
		tilerow: 4,
		gapx:	 0,
		gapy:	 0
	});
	
	// PLAYER: Head tiles
	gbox.addTiles({
		id:		'plyr_head_tiles',
		image:	'plyr_head_sprite',
		tileh:	24,
		tilew:	24,
		tilerow: 6,
		gapx:	 0,
		gapy:	 0
	});
	
	// PLAYER: Helmet tiles
	gbox.addTiles({
		id:		'plyr_helm_tiles',
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
		tilerow: 2,
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
		map: loadMap(LVL_EMPTY_TEST_LG),
		
		tileIsSolidCeil: function(obj, t) {
			return t != null;
		},
		tileIsSolidFloor: function(obj, t) {
			// Change body if tile is a body part
			if (t == 2)
				obj.btm_type='legs';
			
			return (t != null) && (t < 2);	
		}
	};
	// Set height and width parameters of map
	map = help.finalizeTilemap(map);
	
	items = {
		tileset: 'item_tiles',
		map: loadItems(LVL_EMPTY_TEST_LG)
		
		// TODO: tile collision
		
	};
	items = help.finalizeTilemap(items);
	
	// Create temp canvas for map with same width/height
	gbox.createCanvas('map_canvas', { w: map.w, h: map.h });
	gbox.createCanvas('item_canvas', { w: items.w, h: items.h });
	// Draw map to temp canvas
	gbox.blitTilemap(gbox.getCanvasContext('map_canvas'), map);
	// Draw items to canvas
	gbox.blitTilemap(gbox.getCanvasContext('item_canvas'), items);
	
	// Start game loop
	gbox.go();
}

/*
 * loadMap(level): Loads level tile data from maps array at int index specified
 * 				   in level. First argument is ASCII data array index, second
 * 				   is location of translation info.
 */
function loadMap(level) {
	return help.asciiArtToMap(maps[level][0], maps[level][1]);
}
/*
 * loadItems(level): Returns item map
 */
function loadItems(level) {
	return help.asciiArtToMap(item_maps[level][0], item_maps[level][1]);
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

		first: function() {
			// Increment frame count
			// TODO: Modify to prevent rollover
			frameCount++;
		},
		
		blit: function() {
			// Clear canvas
			gbox.blitFade(gbox.getBufferContext(), { alpha: 1 });
			
			// Center camera on player
			followCamera(gbox.getObject('player', 'player_id'), { w: map.w, h: map.h });
			
			// Draw tilemap canvas to screen
			gbox.blit(gbox.getBufferContext(), gbox.getCanvas('map_canvas'), 
				{ 
				dx: 0, 
				dy: 0,
				dw: gbox.getCanvas('map_canvas').width,
				dh: gbox.getCanvas('map_canvas').height,
				sourcecamera: true
				});
			
			// Draw items to screen. These items will be removed on collision.
			
		}
	});
	
	gbox.addObject({
		id: 'items_id',
		group: 'items',
		
		first: function() {
			// TODO: Cleanup items picked up
			
		},
		blit: function() {
			// Clear canvas
			//gbox.blitFade(gbox.getBufferContext(), { alpha: 1 });
			
			// Center camera on player
			//followCamera(gbox.getObject('player', 'player_id'), { w: map.w, h: map.h });
			
			gbox.blit(gbox.getBufferContext(), gbox.getCanvas('item_canvas'), 
				{
				dx: 0,
				dy: 0,
				dw: gbox.getCanvas('item_canvas').width,
				dh: gbox.getCanvas('item_canvas').height,
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
		bottom_tileset: 'plyr_btm_tiles',	// sprite leg section
		top_tileset: 'plyr_top_tiles',		// sprite body section
		head_tileset: 'plyr_head_tiles',	// sprite head section
		helm_tileset: 'plyr_helm_tiles',	// sprite helm section
		
		// Starting body types
		btm_type: 'roller',
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
			
		// Set collision box for player
		// TODO: Test, may not need this for toys.platformer.
		// toys.topview object's default colh value is bottom half of tile,
		// so character can overlap map features.
		
		// Run once upon creation, initialize player object
		initialize: function() {
			// Initialize the player as a platformer object
			// to access helper methods
			toys.platformer.initialize(this, {});
			
			// Set default player position
			// TODO: Make default location a constant point
			this.x = 20;
			this.y = 20;
			
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
				legsRight:		  { speed: 3, frames: [1, 2] },
				legsStillLeft:	  { speed: 1, frames: [3] },
				legsLeft:		  { speed: 3, frames: [4, 5] },
				rollerStillRight: { speed: 1, frames: [6] },
				rollerRight: 	  { speed: 3, frames: [7, 8] },
				rollerStillLeft:  { speed: 1, frames: [9] },
				rollerLeft:		  { speed: 3, frames: [10, 11] }
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
			//alert('w:' + this.w + ' h:' + this.h);
			
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
			toys.platformer.handleAccellerations(this);
			
			// Apply forces through physics engine
			toys.platformer.applyGravity(this);
			
			/*
			 * Collision detection
			 * Tolerance value creates more organic collision box.
			 * TODO: Only check for vertical collision if this.y has changed.
			 */
			this.collisionCheck();
		},
		
		collisionCheck: function() {
			toys.platformer.verticalTileCollision(this, map, 'map');
			toys.platformer.horizontalTileCollision(this, map, 'map', 1);
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
