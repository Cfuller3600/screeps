const roleAttacker = {
    run: function(creep) {
        // If not enough attackers, do nothing
        if (!this.hasEnoughAttackers()) {
            creep.say('Waiting...');
            return;
        }
        
        // Assign the target room if not already assigned
        if (!creep.memory.targetRoom) {
            // Determine the current room's name
            const currentRoom = creep.room.name;

            // Get the room's coordinates (from room name)
            //use regex to match name format e.g. E17 S45 is current room
            const [x, y] = currentRoom.match(/([EW]\d+)([NS]\d+)/).slice(1, 3);

            // Calculate the room to the south by adjusting the Y-coordinate +1 is 1 room further south
            const southRoom = `${x}${parseInt(y.slice(1)) + 1}`;

            // Set target room as the room south of the current one
            //change this later to work round in a + from current location
            creep.memory.targetRoom = southRoom;

            console.log('Target room assigned:', creep.memory.targetRoom);
        }
            
        // If enough attackers, execute attack behavior
        this.attackBehavior(creep);
    },

    hasEnoughAttackers: function() {
        const attackers = _.filter(Game.creeps, c => c.memory.role === 'attacker');
        return attackers.length >= 4;  // Only proceed if there are 4 or more attackers
    },

    attackBehavior: function(creep) {
        // Move to target room if not in the correct room
        if (creep.room.name !== creep.memory.targetRoom) {
            const exitDir = creep.room.findExitTo(creep.memory.targetRoom);
            const exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
            return;
        }

        // Prioritize Hostile Creeps (e.g., enemy attackers, healers, etc.)
        let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

        // If no hostile creeps, prioritize hostile structures
        if (!target) {
            target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
        }

        // If a target is found, act accordingly
        if (target) {
            // If the target is within range for melee attack
            if (creep.pos.inRangeTo(target, 1)) {
                creep.attack(target); // Melee attack
            } 
            // If the target is within range for ranged attack
            else if (creep.pos.inRangeTo(target, 3)) {
                creep.rangedAttack(target); // Ranged attack
            } 
            // If neither, move towards the target
            else {
                creep.moveTo(target);
            }
        } else {
            // If no targets, patrol or hold position
            creep.say('No targets');
            this.patrol(creep);
        }

        // Optionally, heal itself if damaged
        if (creep.hits < creep.hitsMax * 0.5) {
            this.retreat(creep);
        }
    },

    // Patrol behavior when there are no immediate targets
    patrol: function(creep) {
        const randomPos = new RoomPosition(
            Math.floor(Math.random() * 50), 
            Math.floor(Math.random() * 50), 
            creep.room.name
        );
        creep.moveTo(randomPos); // Move to a random position within the room
    },

    // Retreat behavior when health is below a certain threshold
    retreat: function(creep) {
        const healers = _.filter(Game.creeps, c => c.memory.role === 'healer');
        const nearestHealer = creep.pos.findClosestByRange(healers);

        if (nearestHealer) {
            creep.moveTo(nearestHealer); // Move to a healer if available
        } else {
            // If no healer is nearby, retreat to a safe place (e.g., a room exit)
            const safeExit = creep.room.findExitTo('W1N1'); // Replace 'W1N1' with a specific room exit if needed
            const exit = creep.pos.findClosestByRange(safeExit);
            creep.moveTo(exit); // Move to a safe location
        }
    }
};

module.exports = roleAttacker;
