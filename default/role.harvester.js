const sourcedist = require('room.memory');

//define room
const spawn = Game.spawns['Spawn1'];
const room = spawn.room;

//order sources
const sourtedsources = sourcedist.getSortedSourcesByPathFromSpawn(spawn);
            
var roleHarvester = {
    
    /** @param {Creep} creep **/
    /* get energy if it can get energy */ 
    run: function(creep) {
	    if(creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            
            // Sort by priority: closest node first



            if(creep.harvest(sourtedsources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sourtedsources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER ||
                                structure.structureType == STRUCTURE_CONTAINER) && 
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            }); 
            
            // Sort by priority: Spawn first, then Extension, then Tower
            //target[0] will now always be the highest priority
            targets.sort((a, b) => {
                const priority = {
                    [STRUCTURE_SPAWN]: 1,
                    [STRUCTURE_EXTENSION]: 2,
                    [STRUCTURE_TOWER]: 3
                    };
                return priority[a.structureType] - priority[b.structureType];
            });

            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
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
	}
};

module.exports = roleHarvester;