var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var towerBuilder = require('role.tower');

//allows the modules here to be called
const planner = require('PlaceConstructionSites');
const sourcedist = require('room.memory');

//define room
const spawn = Game.spawns['Spawn1'];
const room = spawn.room;

//----------------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------------
const room2 = {
    run: function () {
        
        const extensions = room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_EXTENSION }
        });
        
        const extensionSites = room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: { structureType: STRUCTURE_EXTENSION }
            
        });
        
        const maxExtensions = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][room.controller.level];
        

        if (extensions.length >= maxExtensions) {
            console.log('✅ Max extensions built')
            console.log(`extensions.length}/${maxExtensions}`);
            
            planner.placeCircleOfRoadRoundSpawn(room);
            planner.placeRoadsFromSpawn(room);
            
            //only place 1 tower as that is max for this level (lv3)
            if (!Memory.towerPlaced) {
                towerBuilder.placeTowerSouthOfSpawn(spawn);
                Memory.towerPlaced = true;
                console.log('Tower Built');
            }
        }
        
        if((extensionSites.length + extensions.length) >= maxExtensions && extensions.length < maxExtensions) {
            console.log(`Max extenions being built 🧱 Extensions: ${extensions.length}/${maxExtensions}`);
            }
        else {
            console.log(`🧱 Extensions: ${extensions.length}/${maxExtensions}`);
            planner.placeExtensions(room);
            }
        
        
        
        
        
        
        //Should only run once
        if (!Memory.constructionPlanned) {
        planner.placeHalfCircleExtensions(room);
        planner.placeForController(room);
        //planner.placeRoadsFromSpawn(room);
        
            Memory.constructionPlanned = true;
            console.log('Room sources calculated');
        }
        
        //Wipe memory of dead creeps avoid mem overflow
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
        
        
        
        //-----------------------------------------------------------------------------------------------------------------------------------
        //Spawn haversters and builders
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    
        if(harvesters.length <= 1) {
            var newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
                {memory: {role: 'harvester'}});
        }
        if(harvesters.length >= 1 && harvesters.length <= 7 && room.energyCapacityAvailable >= 400 && room.energyAvailable >= 400) {
            var newName = 'HarvesterBig' + Game.time;
            console.log('Spawning new big harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, WORK ,CARRY, CARRY,MOVE, MOVE], newName, 
                {memory: {role: 'harvester'}});
        }
        
        //-------------------
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        //outputs count of number of harvesters     
        
        
        if(builders.length >= 0 && builders.length <= 4 && harvesters.length >= 5 && room.energyAvailable >= 400) {
            var newName = 'BuilderBig' + Game.time;
            console.log('Spawning new big builder: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, WORK,CARRY,CARRY,MOVE,MOVE], newName, 
                {memory: {role: 'builder'}});
        }
    
        //---------------------
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        //outputs count of number of upgraders
        //console.log('Harvesters: ' + harvesters.length);

        if(upgraders.length < 3 && harvesters.length > 4 && room.energyCapacityAvailable >= 400 && room.energyAvailable >= 400) {
            var newName = 'UpgraderBig' + Game.time;
            console.log('Spawning new big upgrader: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, WORK ,CARRY, CARRY,MOVE, MOVE], newName, 
                {memory: {role: 'upgrader'}});
        }
    
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
module.exports = room2;