const sourcedist = require('room.memory');
const CreepMultiplierPerSource = 1;

const spawn = Game.spawns['Spawn1'];
const room = spawn.room;
const sortedSources = sourcedist.getSortedSourcesByPathFromSpawn(spawn);

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // -----------------------------------------------------------------------
        // Assign a source if not already done
        if (!creep.memory.sourceId) {
            for (let source of sortedSources) {
                const sourceMemory = Memory.sources && Memory.sources[source.id];
                const maxCreeps = ((sourceMemory && sourceMemory.harvestSpots) || 1) * CreepMultiplierPerSource;

                const assigned = _.filter(Game.creeps, c => c.memory.sourceId === source.id);
                if (assigned.length < maxCreeps) {
                    creep.memory.sourceId = source.id;
                    break;
                }
            }

            // Fallback assignment if no source found
            if (!creep.memory.sourceId && sortedSources.length > 0) {
                creep.memory.sourceId = sortedSources[0].id;
            }
        }

        const source = Game.getObjectById(creep.memory.sourceId);

        // -----------------------------------------------------------------------
        // State switching between harvesting and upgrading
        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }

        if (!creep.memory.upgrading && creep.store.getFreeCapacity() === 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        // -----------------------------------------------------------------------
        // Action behavior
        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {
                    visualizePathStyle: { stroke: '#ffffff' }
                });
            }
        } 
        else {
            if (source) {
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {
                        visualizePathStyle: { stroke: '#ffaa00' }
                    });
                }
            } else {
                creep.say('❌ No source');
            }
        }
    }
};

module.exports = roleUpgrader;
