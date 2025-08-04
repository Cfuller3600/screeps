const sourcedist = require('room.memory');

// Define room
const spawn = Game.spawns['Spawn1'];
const room = spawn.room;

// Order sources
const sortedSources = sourcedist.getSortedSourcesByPathFromSpawn(spawn);

// Max number of creeps per source
const CreepMultiplierPreSource = 1;

var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
        
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
        
        
        if (creep.store.getFreeCapacity() === 0) {
            creep.memory.harvesting = false;
        }
        
        if (creep.store.getUsedCapacity() === 0) {
            creep.memory.harvesting = true;
        }


        // HARVEST LOGIC
        if (creep.memory.harvesting === true) {
            //creep.say('harv havesting');
            if (source) {
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            } else {
                creep.say('❌ No source');
            }
        }
        // TRANSFER LOGIC
        else {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        (structure.structureType === STRUCTURE_EXTENSION ||
                         structure.structureType === STRUCTURE_SPAWN ||
                         structure.structureType === STRUCTURE_TOWER ||
                         structure.structureType === STRUCTURE_CONTAINER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    );
                }
            });

            // Sort targets by priority
            targets.sort((a, b) => {
                const priority = {
                    [STRUCTURE_SPAWN]: 1,
                    [STRUCTURE_EXTENSION]: 2,
                    [STRUCTURE_TOWER]: 3,
                    [STRUCTURE_CONTAINER]: 4
                };
                return priority[a.structureType] - priority[b.structureType];
            });

            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                // Fallback: move to spawn
                const spawnLocation = creep.room.find(FIND_STRUCTURES, {
                    filter: (s) => s.structureType === STRUCTURE_SPAWN
                });
                if (spawnLocation.length > 0) {
                    creep.moveTo(spawnLocation[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    }
};

module.exports = roleHarvester;
