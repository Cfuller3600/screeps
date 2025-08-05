const sourcedist = require('room.memory');
const spawn = Game.spawns['Spawn1'];
const room = spawn.room;
const sortedSources = sourcedist.getSortedSourcesByPathFromSpawn(spawn);
// Max number of creeps per source
const CreepMultiplierPerSource = 1;


var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        //console.log('Builder script start');
        
        
        //---------------------------------------------------------------------------------------------------------------------------------------
        // Assign a source if not already done
        if (!creep.memory.sourceId) {
            for (let source of sortedSources) {
                const assigned = _.filter(Game.creeps, c => c.memory.sourceId === source.id);
                if (assigned.length < (Memory.sources[source.id].harvestSpots + 2) * CreepMultiplierPerSource) {
                    creep.memory.sourceId = source.id;
                    break;
                }
            }

            // If no available source, assign fallback (e.g. first source)
            if (!creep.memory.sourceId) {
                creep.memory.sourceId = sortedSources[0].id;
            }
        }

        const source = Game.getObjectById(creep.memory.sourceId);
        //---------------------------------------------------------------------------------------------------------------------------------------
        
        
	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                var spawnlocation = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN);
                    }
                });
                creep.moveTo(spawnlocation[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
	    }
	    else {
	        //harvest at assigned source
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }
	}
};

module.exports = roleBuilder;