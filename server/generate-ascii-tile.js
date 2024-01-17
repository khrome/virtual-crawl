const { Roguelike, seed } = require('procedural-layouts');

const getTile = async(name, tileX, tileY)=>{
    let result = [];
    let layer = null;
    try{
        layer = typeof name === 'string'?await getLayer(name):name;
        const x = tileX;
        const y = tileY;
        let row = '';
        for(var lcvy=16*y; lcvy < 16*(y+1); lcvy++){
            row = '';
            for(var lcvx=16*x; lcvx < 16*(x+1); lcvx++){
                row += layer.matrix[lcvy][lcvx] || ' ';
            }
            result.push(row);
        }
    }catch(ex){
        console.log('ERROR', ex)
    }
    const returnValue = result.length?result.reverse().join('\n'):`                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                `;
    return returnValue;
}

const renderRogueLike = (world)=>{
    let result = '';
    var row = '';
    for (var y = 0; y < world.length; y++) {
      row = '';
      for (var x = 0; x < world[y].length; x++) {
        var tile = world[y][x];
        if (tile === 0) {
          row += ' ';
        } else if (tile === 1) {
          row += '.';
        } else if (tile === 2) {
          row += '#';
        } else if (tile === 3) {
          row += '/';
        } else if (tile === 4) {
          row += 'X';
        } else if (tile === 5) {
          row += '<';
        } else if (tile === 6) {
          row += '>';
        } else {
          row += world[y][x];
        }
      }
      result += row + '\n';
    }
    return result;
}

const layers = {};

const getLayer = async = (name)=>{
    if(layers[name]) return layers[name];
    seed(name);
    console.log('SEED', name)
    let level = new Roguelike({
        width: 64, // Max Width of the world
        height: 64, // Max Height of the world
        retry: 100, // How many times should we try to add a room?
        special: true, // Should we generate a "special" room?
        room: {
            ideal: 35, // Give up once we get this number of rooms
            min_width: 3,
            max_width: 7,
            min_height: 3,
            max_height: 7
        }
    });
    const rendered = level.render();
    console.log(rendered);
    layers[name] = {
        level,
        rendered,
        matrix: rendered.split('\n').map((line)=>line.split('')).reverse()
    }
    //2d array row/col from origin in quadrant I
    if(layers[name].matrix[0].length===0){
        //trailing \n
        layers[name].matrix.shift();
    }
    //console.log(layers[name].matrix, layers[name].matrix.length, layers[name].matrix[1].length);
    //process.exit();
    return layers[name];
}

module.exports = {
    renderRogueLike, getLayer, getTile
}