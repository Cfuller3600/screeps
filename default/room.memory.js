module.exports.getSortedSourcesByPathFromSpawn = function (spawn) {
    console.log('room.memory script start');

    const room = spawn.room;
    const sources = room.find(FIND_SOURCES);

    const sourcesWithDistance = sources.map(source => {
        const path = spawn.pos.findPathTo(source.pos, {
            ignoreCreeps: true
        });
        return {
            source: source,
            pathLength: path.length
        };
    });

    sourcesWithDistance.sort((a, b) => a.pathLength - b.pathLength);

    const sortedSources = sourcesWithDistance.map(item => item.source);
    return sortedSources;
};
