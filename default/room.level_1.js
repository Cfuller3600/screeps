var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');


//allows the modules here to be called
const planner = require('PlaceConstructionSites');
const sourcedist = require('room.memory');

//define room
const spawn = Game.spawns['Spawn1'];
const room = spawn.room;

//----------------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------------
const room1 = {
    run: function () {
        
        //define room
        const spawn = Game.spawns['Spawn1'];
        const room = spawn.room;
        
        
        
        
        const extensions = room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_EXTENSION }
        });
        
        const extensionSites = room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: { structureType: STRUCTURE_EXTENSION }
            
        });
        
        const maxExtensions = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][room.controller.level];
        

        if (extensions.length >= maxExtensions) {
            console.log('✅ Max extensions built');
            } 
        if(extensions.length >= maxExtensions) {
            console.log('Max extenions being built');
            }
        else {
            console.log(`🧱 Extensions: ${extensions.length}/${maxExtensions}`);
            planner.placeExtensions(room);
            }
        
        
        
        //-----------------------------------------------------------------------------------------------------------------------------------
        //Spawn haversters and builders
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        
        if(harvesters.length <= 3) {
            var newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
                {memory: {role: 'harvester'}});
        }
        
        //-------------------
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        //outputs count of number of harvesters 
        
        if(builders.length <= 3 && harvesters.length >= 3) {
            var newName = 'Builder' + Game.time;
            console.log('Spawning new builder: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
                {memory: {role: 'builder'}});
        }
        
        //---------------------
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        //outputs count of number of upgraders
        //console.log('Harvesters: ' + harvesters.length);
        
        if(upgraders.length < 2 && harvesters.length >= 4  && builders.length >= 3) {
            var newName = 'Upgrader' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
                {memory: {role: 'upgrader'}});
        }
        
        //if excess energy then spawn more builders
        if(upgraders.length >= 2 && harvesters.length >= 4) {
            var newName = 'Builder' + Game.time;
            console.log('Spawning new builder: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
                {memory: {role: 'builder'}});
        }
        
        //tell console what is spawning
        if(Game.spawns['Spawn1'].spawning) { 
            var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
            Game.spawns['Spawn1'].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns['Spawn1'].pos.x + 1, 
                Game.spawns['Spawn1'].pos.y, 
                {align: 'left', opacity: 0.8});
        }
    }
}
module.exports = room1;