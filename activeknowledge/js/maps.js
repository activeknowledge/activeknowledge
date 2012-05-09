/*
 * maps.js
 * 2012 Chris Mahoney
 * Maps for <<GAMENAME>>, contained within global array.
 * Format as follows:
 * maps[0]:
 * 	 maps[0][0]: map tile data. each character represents a different
 * 	     		 tile type (see below).
 *   maps[0][1]: map tile assignments. this is an array of key/value
 *   			 pairs for each tile type. the key is the index of tile
 *   			 in 'map_tiles' tileset, and the value is the actual
 *   			 character used in the ASCII data array.
 *   			 	 
 *   			 	 [ [null, ' '], [0, 'o'], [1, 'x'] ]
 *   				 * null value (space) is for empty tile slots
 *   				 * 'o' character = first tile in map_tiles (0)
 *   				 * 'x' = second tile in map_tiles (1), etc. etc.
 *   
 * LEVEL DIRECTORY (KEEP UPDATED!)
 * 0: Empty test room: Border of solid tiles around perimeter of canvas,
 * 	  only used for basic testing (map/enemy collision, etc.).
 * 1: Platform test room: Test room with platforms for movement testing.
 */
maps = [
        
// maps[0]: Small empty test room
[[
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
], 
[ 
	[null, ' '], 
	[0, 'o'], 
	[1, 'x'] 
]],

// maps[1]: Large empty test room
[[
"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"x                                       ooooooo                              x",
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
], 
[ 
	[null, ' '], 
	[0, 'o'], 
	[1, 'x'] 
]]

];