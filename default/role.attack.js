
Game.spawns['Spawn1'].spawnCreep(
    [MOVE, MOVE, ATTACK, ATTACK], // Body parts
    'Attacker1',                   // Name of the creep
    {
        memory: { role: 'attacker', targetRoom: 'W8N3' }
    }
);

//add rule that attack when creep number hist a threshold e.g. 3
const roleAttacker = {
    run: function(creep) {
        // Move to the target room if not already there
        if (creep.room.name !== creep.memory.targetRoom) {
            const exitDir = creep.room.findExitTo(creep.memory.targetRoom);
            const exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
            return;
        }

        // Try to find and attack the closest enemy creep
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            // Optionally attack enemy structures (like spawns or towers)
            const structure = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
            if (structure) {
                if (creep.attack(structure) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            } else {
                creep.say('No targets');
            }
        }
    }
};

module.exports = roleAttacker;
