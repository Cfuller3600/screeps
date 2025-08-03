const sourcedist = require('room.memory');
const CreepMultiplierPreSource = 2;

const spawn = Game.spawns['Spawn1'];
const room = spawn.room;
const sortedSources = sourcedist.getSortedSourcesByPathFromSpawn(spawn);

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {


        //---------------------------------------------------------------------------------------------------------------------------------------
        // Assign a source if not already done
        if (!creep.memory.sourceId) {
            for (let source of sortedSources) {
                const assigned = _.filter(Game.creeps, c => c.memory.sourceId === source.id);
                if (assigned.length < Memory.sources[source.id].harvestSpots * CreepMultiplierPreSource) {
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
        
        
        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
	}
};

module.exports = roleUpgrader;