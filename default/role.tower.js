module.exports.placeTowerSouthOfSpawn = function(spawnName, distance = -7) {
    const spawn = spawnName;
    //console.log('Build tower');
    
    if (!spawn) {
        console.log(`❌ Spawn '${spawnName}' not found.`);
        return ERR_INVALID_TARGET;
    }

    const x = spawn.pos.x;
    const y = spawn.pos.y + distance;

    const result = spawn.room.createConstructionSite(x, y, STRUCTURE_TOWER);
    console.log(` x: ${x} y: ${y}`);


    if (result === OK) {
        console.log(`✅ Tower construction site placed at (${x}, ${y})`);
    } else {
        console.log(`❌ Failed to place tower: ${result}`);
    }

    return result;
};
