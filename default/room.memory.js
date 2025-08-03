module.exports.getSortedSourcesByPathFromSpawn = function (spawn) {
    console.log('room.memory script start');

    const room = spawn.room;
    const sources = room.find(FIND_SOURCES);

    const sourcesWithDistance = sources.map(source => {
        const path = spawn.pos.findPathTo(source.pos, {
            ignoreCreeps: true
        });
        return {
            source: source,
            pathLength: path.length
        };
    });

    sourcesWithDistance.sort((a, b) => a.pathLength - b.pathLength);

    const sortedSources = sourcesWithDistance.map(item => item.source);
    return sortedSources;
};


module.exports.getHarvestablePatches = function (spawn) {
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        const sources = room.find(FIND_SOURCES);

        // Ensure global source memory exists
        if (!Memory.sources) Memory.sources = {};

        for (const source of sources) {
            const sourceId = source.id;

            // Only calculate once
            if (!Memory.sources[sourceId]) {
                let openSpots = 0;
                
                //loops though all 8 squares around the source to see if it is a wall or a free harvesable spot
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        if (dx === 0 && dy === 0) continue;
                        
                        const x = source.pos.x + dx;
                        const y = source.pos.y + dy;
                        
                        const terrain = room.lookForAt(LOOK_TERRAIN, x, y);
                        if (terrain.length && terrain[0] !== 'wall') {
                            //add 1 to counter for each harvestable spot
                            openSpots++;
                        }
                    }
                }
                
                // Store info in memory
                Memory.sources[sourceId] = {
                    roomName: room.name,
                    pos: { x: source.pos.x, y: source.pos.y },
                    harvestSpots: openSpots,
                    assignedCreeps: []
                };
                
                console.log(`🧠 Source ${sourceId} has ${openSpots} harvestable spots.`);
            }
        }
    }
};
