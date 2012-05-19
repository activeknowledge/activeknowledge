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
 *   maps[0][2]: item data (one-indexed)
 *   
 * LEVEL DIRECTORY (KEEP UPDATED!)
 * 0: Empty test room: Border of solid tiles around perimeter of canvas,
 * 	  only used for basic testing (map/enemy collision, etc.).
 * 1: Platform test room: Test room with platforms for movement testing.
 */
maps = [
        
// maps[0]: Small empty test room
[
[
"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
"b                                      b",
"b                                      b",
"b                                      b",
"b                                      b",
"b                                      b",
"b                                      b",
"b                                      b",
"b                                      b",
"b                                      b",
"b                                      b",
"b                                      b",
"b                                      b",
"b                                      b",
"b                                      b",
"b                                      b",
"b                                      b",
"b                                      b",
"b                                      b",
"b                                      b",
"b                                      b",
"b                                      b",
"b                                      b",
"b               b                      b",
"b               b                      b",
"b               b                      b",
"b               b                      b",
"b               b                      b",
"b               b                      b",
"bbbbbbbbbbbbbbbbbggggggbbbbbbbbbbbbbbbbb"
], 
[ 
	[0, 'X'],
	[1, 'x'],
	[3, 'w'],
	[4, ' '],
	
	[2, 'b'],	
	[6, 'r'],
	[10, 'g'],
	[14, 'y']
],
[
	[5, 25, 'start', 0],
	[12, 21, 'helmGreen', 2],
	[24, 28, 'helmBlue', 3],
	[35, 28, 'finish', 1]
]
],

// maps[1]: Large empty test room
[
[
"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",	// 0
"b                                                                            b",
"b                                                                            b",
"b                                                                            b",
"b                                                                            b",
"b                                                                            b",	// 5
"b                                                                            b",
"b                                                                            b",
"b                                                                            b",
"b                                                                            b",
"b                                                                            b",	// 10
"b                                                                            b",
"b                                                                            b",
"b                                                                            b",
"b                                                                            b",
"b                                                                            b",	// 15
"b                                                                            b",
"b                                                                            b",
"b                                                                            b",
"b                                                                            b",
"b                                                                            b",	// 20
"b                                                                            b",
"b                                                                            b",
"b                                                                            b",
"b                                                                            b",
"b                                                                            b",	// 25
"b                                            rrrrrrrrrr                      b",
"b                                  rrrrrr                                    b",
"b                                                                            b",
"bbbbbwwwwbbbbbbwwwwwwwwwwwwwwwbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"	// 30
//    5    5    5    5    5    5    5    5    5    5    5    5    5    5    5
], 
[  
 	[0, 'X'],
	[1, 'x'],
	[3, 'w'],
	[4, ' '],
	
	[2, 'b'],	
	[6, 'r'],
	[10, 'g'],
	[14, 'y']	
],
[
 	[3, 25, 'start', 0],
	[13, 28, 'roller', 1],
	[32, 28, 'legs', 2],
	[24, 28, 'helmRed', 4],
	[49, 25, 'finish', 3]
]
],

//maps[1]: Large empty test room
[
[
"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",	// 0
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",	// 5
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",	// 10
"x                                                                            x",
"x                                                                            x",
"NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN",
"NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN",
"NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN",	// 15
"NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN",
"NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN",
"NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN",
"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
"x                                                                            x",	// 20
"x                                                                            x",
"x                                                                            x",
"x                                                                            x",
"x            xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx          xxxxxxxxxxxxxxxxxxxxxxxxx",
"x            xNNNNNNNNNNNNNNNNNNNNNNNNNNNNx          x",	// 25
"x            xNNNNNNNNNNNNNNNNNNNNNNNNNNNNx          x",
"x            xNNNNNNNNNNNNNNNNNNNNNNNNNNNNx          x",
"x            xNNNNNNNNNNNNNNNNNNNNNNNNNNNNx          x",
"xxxxxxxxxxxxxxNNNNNNNNNNNNNNNNNNNNNNNNNNNNxxxxxxxxxxxx"	// 30
//    5    5    5    5    5    5    5    5    5    5    5    5    5    5    5
], 
[  
 	[0, 'X'],
	[1, 'x'],
	[2, 'o'],
	[3, 'w'],
	[4, ' '],
	[null, 'N']
],
[
 	[5, 25, 'start', 0],
	[10, 28, 'jetpack', 1],
	[48, 28, 'finish', 2]
]
],

[
[
"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
"x                                      x",
"x                                      x",
"x                                      x",
"x                                      x",
"x                                      x",
"x                                      x",
"x              xxxxxxxxxxxxxxxxxxxxxxxxx",
"x              x",
"x              x",
"x              x",
"x              x",
"x              x",
"x              x",
"x              x",
"x              x",
"x              x",
"x              x",
"x              x",
"x              x",
"x              x",
"x              x",
"x              x",
"x              x",
"x              x",
"xooooo         x",
"x              x",
"x         ooooox",
"x              x",
"xxxxxxxxxxxxxxxx"
], 
[ 
	[0, 'X'],
	[1, 'x'],
	[2, 'o'],
	[3, 'w'],
	[4, ' '],
	[5, 'f'],
	[6, 'F']
],
[
	[7, 25, 'start', 0],
	[35, 28, 'finish', 1]
]
]

];