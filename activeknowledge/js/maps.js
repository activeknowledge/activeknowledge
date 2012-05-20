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

[
[
"bbbbbbbbbbbb",
"b          b",
"b          b",
"b          b",
"b          b",
"b          b",
"b          b",
"bbbbbbbbbbbb"
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
	[2, 2, 'start', 0],
	[5, 6, 'helmGreen', 2],
	[9, 6, 'finish', 1]
]
],
        
// maps[1]
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

// maps[2]
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
"bbbbbwwwwbbbbbbwwwwwwwwwwwwwwwrbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"	// 30
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
	[29, 28, 'legs', 2],
	[24, 28, 'helmRed', 4],
	[49, 25, 'finish', 3]
]
],

// maps[3]
[
[
"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
"b                                                                            b",	// 20
"b                                                                            b",
"b                                                                            b",
"b                                                                            b",
"b            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb          bbbbbbbbbbbbbbbbbbbbbbbbb",
"b            bNNNNNNNNNNNNNNNNNNNNNNNNNNNNb          b",	// 25
"b            bNNNNNNNNNNNNNNNNNNNNNNNNNNNNb          b",
"b            bNNNNNNNNNNNNNNNNNNNNNNNNNNNNb          b",
"b            bNNNNNNNNNNNNNNNNNNNNNNNNNNNNb          b",
"bbbbbbbbbbbbbbNNNNNNNNNNNNNNNNNNNNNNNNNNNNbbbbbbbbbbbb"	// 30
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
	[14, 'y'],
	[null, 'N']
],
[
 	[5, 6, 'start', 0],
	[10, 9, 'jetpack', 1],
	[48, 9, 'finish', 2]
]
],

// map[4]
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
"b           yyybbbbbbbbrrrrbbbbbbbrrrbbb",
"b         yyyyyb",
"b        yyyyyyb",
"b       yyyyyyyb",
"b      yyyyyyyyb",
"b     yyyyyyyyyb",
"b    yyyyyyyyyyb",
"b   yyyyyyyyyyyb",
"b  yyyyyyyyyyyyb",
"bggggggggggggggb",
"b              b",
"b              b",
"b              b",
"b              b",
"b         gggggg",
"b              b",
"b              b",
"brrrrr         b",
"b              b",
"b         bbbbbb",
"b              b",
"bbbbbbbbbbbbbbbb"
], 
[ 
	[0, 'X'],
	[1, 'x'],
	[3, 'w'],
	[4, ' '],
	
	[2, 'b'],	
	[6, 'r'],
	[10, 'g'],
	[14, 'y'],
	[null, 'N']
],
[
	[7, 25, 'start', 0],
	[7, 22, 'helmRed', 1],
	[9, 20, 'helmGreen', 2],
	[14, 18, 'jetpack', 3],
	[15, 13, 'legs', 5],
	[1, 16, 'helmYellow', 6],
	[21, 1, 'helmRed', 7],
	[36, 7, 'finish', 4]
]
],

// map[5]
[
[
"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
"b     b                                                 b",
"b     b                                                 b",
"b     b                                                 b",
"b     b                                                 b",
"b   bbb                                                 b", // 5
"b  bbbb                                                 b",
"bbbbbbb                                                 b",
"b                                                       b",
"b                                                       b",
"b                                                       b", // 10
"b                                                       b",
"brrrbybybybybybbbbbbbbwwwwwwwwwwwwwwwwwwwy        y    yb"
//    5    5    5    5    5    5    5    5    5    5    5
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
	[2, 2, 'start', 0],
	[5, 1, 'helmRed', 2],
	[3, 11, 'helmYellow', 3],
	[22, 11, 'roller', 4],
	[40, 11, 'legs', 5],
	[55, 5, 'finish', 1]
]
]

];