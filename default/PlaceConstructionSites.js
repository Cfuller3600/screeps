const sourcedist = require('room.memory');
const spawn = Game.spawns['Spawn1'];
const room = spawn.room;
const sourtedsources = sourcedist.getSortedSourcesByPathFromSpawn(spawn);

module.exports = {
		placeHalfCircleExtensions: function(room) {
		// Get the player's main spawn (assumes only one)
		console.log('construction sites calculator');
		const spawn = room.find(FIND_MY_SPAWNS)[0];
		if (!spawn) return;

		const centerX = spawn.pos.x;
		const centerY = spawn.pos.y;

		// Configuration
		const numExtensions = 10;
		const radius = 4; // Distance from spawn
		const angleStep = 2 * Math.PI / (numExtensions - 1); // Half circle: π radians

		for (let i = 0; i < numExtensions; i++) {
			// Angle ranges from 0 to π (180°), offset to point south
			const angle = 2 * Math.PI + (angleStep * i); // π to 2π for southern half  now goes from 0 to 2pi

			// Calculate position
			const x = Math.round(centerX + radius * Math.cos(angle));
			const y = Math.round(centerY + radius * Math.sin(angle));

			// Check terrain before placing
			const look = room.lookAt(x, y);
			const isBuildable = look.every(obj => 
				(obj.type === 'terrain' && obj.terrain !== 'wall') ||
				(obj.type !== 'structure' && obj.type !== 'constructionSite')
			);

			if (isBuildable) {
				room.createConstructionSite(x, y, STRUCTURE_EXTENSION);
			}
		}
	},

 
    placeForController: function(room) {
        const controller = room.controller;
        if (!controller) return;

        const adjacentTiles = [
            { x: controller.pos.x - 1, y: controller.pos.y - 1 },
            { x: controller.pos.x,     y: controller.pos.y - 1 },
            { x: controller.pos.x + 1, y: controller.pos.y - 1 },
            { x: controller.pos.x - 1, y: controller.pos.y },
            { x: controller.pos.x + 1, y: controller.pos.y },
            { x: controller.pos.x - 1, y: controller.pos.y + 1 },
            { x: controller.pos.x,     y: controller.pos.y + 1 },
            { x: controller.pos.x + 1, y: controller.pos.y + 1 }
        ];

        for (let tile of adjacentTiles) {
            const look = room.lookAt(tile.x, tile.y);
            const isBuildable = look.every(obj => 
                obj.type === 'terrain' && obj.terrain !== 'wall' ||
                obj.type !== 'structure' && obj.type !== 'constructionSite'
            );
            
            console.log('build location', tile.x, tile.y);

            if (isBuildable) {
                room.createConstructionSite(tile.x, tile.y, STRUCTURE_CONTAINER);
                console.log('build controller');
                break;
            }
        }
    },

    placeRoadsFromSpawn: function(room) {
        const spawns = room.find(FIND_MY_SPAWNS);
        const sources = room.find(FIND_SOURCES);

        /*
        for (let spawn of spawns) {
            for (let source of sources) {
                const path = PathFinder.search(spawn.pos, { pos: source.pos, range: 1 }, {
                    plainCost: 2,
                    swampCost: 10,
                    roomCallback: () => undefined
                }).path;

                for (let step of path) {
                    room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
                }
            }
        }
        */
        const selectedsourceforpath = sourtedsources[0];
        const path = PathFinder.search(spawns[0].pos, { pos: selectedsourceforpath.pos, range: 1 }, {
              plainCost: 2,
              swampCost: 10,
              roomCallback: () => undefined
        }).path;
        
        for (let step of path) {
                    room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
        }
    }
};
