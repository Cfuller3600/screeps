const roleAttacker = {
    run: function(creep) {
        //if not enough attackers then do nothing
        if (!this.hasEnoughAttackers()) {
            creep.say('Waiting...');
            return;
        }
        //if there are enough attackers then execute attack
        this.attackBehavior(creep);
    },

    hasEnoughAttackers: function() {
        const attackers = _.filter(Game.creeps, c => c.memory.role === 'attacker');
        //if attackers are 4 or more then return true to main function
        return attackers.length >= 4;
    },

    attackBehavior: function(creep) {
        // Move to target room
        if (creep.room.name !== creep.memory.targetRoom) {
            const exitDir = creep.room.findExitTo(creep.memory.targetRoom);
            const exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
            return;
        }

        // Attack enemies
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
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
