var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var room1 = require('room.level_1');
var room2 = require('room.level_2');

const planner = require('PlaceConstructionSites');
const sourcedist = require('room.memory');

// Define spawn and room once
const spawn = Game.spawns['Spawn1'];
const room = spawn.room;

module.exports.loop = function () {
    console.log('Loop start');
    console.log('Room energy available:', room.energyAvailable, '/', room.energyCapacityAvailable);
    console.log('CPU used this tick:', Game.cpu.getUsed().toFixed(2));


    // Should only run once
    if (!Memory.constructionPlanned) {
        planner.placeExtensions(room);
        planner.placeForController(room);
        Memory.constructionPlanned = true;
        console.log('Room construction planned');
    }

    // Clean memory of dead creeps
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Room-level logic
    if (room.controller.level <= 1 || room.energyCapacityAvailable < 400) {
        room1.run();
    } else if (room.controller.level <= 2 || room.energyCapacityAvailable >= 400) {
        room2.run();
    }

    // Gather role counts (do this before logging)
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');

    console.log('Harvesters: ' + harvesters.length);
    console.log('Builders: ' + builders.length);
    console.log('Upgraders: ' + upgraders.length);

    // Control creep behaviour
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
    }
};
