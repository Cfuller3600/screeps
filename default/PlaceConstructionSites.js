const sourcedist = require('room.memory');

module.exports = {
	placeHalfCircleExtensions: function(room) {
	    //this is acctually a full circle now
		console.log('construction sites calculator');
		const spawn = room.find(FIND_MY_SPAWNS)[0];
		if (!spawn) return;

		const centerX = spawn.pos.x;
		const centerY = spawn.pos.y;
		const numExtensions = 10;
		const radius = 4;
		const angleStep = 2 * Math.PI / (numExtensions - 1); // Half circle: 0 to π 2nd half pi to 2 pi

		for (let i = 0; i < numExtensions; i++) {
			const angle = 2 * Math.PI + angleStep * i; 
			const x = Math.round(centerX + radius * Math.cos(angle));
			const y = Math.round(centerY + radius * Math.sin(angle));

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

	placeCircleOfRoadRoundSpawn: function(room) {
		const spawn = room.find(FIND_MY_SPAWNS)[0];
		if (!spawn) return;

		const radius = 2;
		const centerX = spawn.pos.x;
		const centerY = spawn.pos.y;

		for (let dx = -radius; dx <= radius; dx++) {
			for (let dy = -radius; dy <= radius; dy++) {
				const x = centerX + dx;
				const y = centerY + dy;

				if (Math.sqrt(dx * dx + dy * dy) <= radius) {
					const terrain = room.getTerrain().get(x, y);
					if (terrain !== TERRAIN_MASK_WALL) {
						room.createConstructionSite(x, y, STRUCTURE_ROAD);
					}
				}
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
				(obj.type === 'terrain' && obj.terrain !== 'wall') ||
				(obj.type !== 'structure' && obj.type !== 'constructionSite')
			);

			if (isBuildable) {
				room.createConstructionSite(tile.x, tile.y, STRUCTURE_CONTAINER);
				console.log('build controller');
				break;
			}
		}
	},

	placeRoadsFromSpawn: function(room) {
		const spawns = room.find(FIND_MY_SPAWNS);
		if (!spawns.length) return;

		const sourtedsources = sourcedist.getSortedSourcesByPathFromSpawn(spawns[0]);
		if (!sourtedsources || sourtedsources.length === 0) return;

		const targetSource = sourtedsources[0];

		const path = PathFinder.search(spawns[0].pos, { pos: targetSource.pos, range: 1 }, {
			plainCost: 2,
			swampCost: 10,
			roomCallback: () => undefined
		}).path;

		for (let step of path) {
			room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
		}
	}
};
