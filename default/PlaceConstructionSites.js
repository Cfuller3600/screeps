const sourcedist = require('room.memory');

module.exports = {

	placeExtensions: function(room) {
		const spawn = room.find(FIND_MY_SPAWNS)[0];
		console.log('Construction site calculator');
		if (!spawn) return;

		const centerX = spawn.pos.x;
		const centerY = spawn.pos.y;
		const numExtensions = 20;
		const radius = 4;
		const angleStep = 2 * Math.PI / numExtensions;

		for (let i = 0; i < numExtensions; i++) {
			const angle = angleStep * i;
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
		console.log('Circle Road place');
		const spawn = room.find(FIND_MY_SPAWNS)[0];
		if (!spawn) return;

		const radius = 3;
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
		console.log('Place controller');
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
				console.log('Placed container near controller');
				break;
			}
		}
	},

	placeRoadsFromSpawn: function(room) {
		console.log('Place Roads');

		const spawn = room.find(FIND_MY_SPAWNS)[0];
		if (!spawn) return;

		const sortedSources = sourcedist.getSortedSourcesByPathFromSpawn(spawn);
		if (!sortedSources || sortedSources.length === 0) return;

		for (let i = 0; i < Math.min(2, sortedSources.length); i++) {
			const targetSource = sortedSources[i];

			const result = PathFinder.search(spawn.pos, { pos: targetSource.pos, range: 1 }, {
				plainCost: 2,
				swampCost: 10
			});

			const path = result.path;
			if (!path || path.length === 0) {
				console.log(`❌ No path found to source ${i}`);
				continue;
			}

			for (let step of path) {
				room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
			}
		}
	},

	repairRoadUnder: function(creep) {
		if (creep.store[RESOURCE_ENERGY] > 0) {
			const road = creep.pos.lookFor(LOOK_STRUCTURES).find(s =>
				s.structureType === STRUCTURE_ROAD && s.hits < s.hitsMax * 0.75
			);
			if (road) {
				console.log('Repairing road');
				creep.repair(road);
			}
		}
	}
};
