const express = require('express');
const LevelRoguelike = require('roguelike/level/roguelike');

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
    let level = LevelRoguelike({
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
    //console.log(level);
    const rendered = renderRogueLike(level.world);
    console.log(rendered);
    layers[name] = {
        level,
        rendered,
        matrix: rendered.split('\n').map((line)=>line.split('')).reverse()
    }
    //2d array row/col from origin in quadrant I
    return layers[name];
}

const createServer = async ()=>{
    const app = express();
    const port = 3000;
    
    app.use(express.static('.'));
    
    app.get('/tiles/:layer/:x/:y', async (req, res) => {
        let result = [];
        try{
            const layer = await getLayer(req.params.layer);
            const x = parseInt(req.params.x);
            const y = parseInt(req.params.y);
            let row = '';
            for(var lcvy=16*y; lcvy < 16*(y+1); lcvy++){
                row = '';
                for(var lcvx=16*x; lcvx < 16*(x+1); lcvx++){
                    row += layer.matrix[lcvy][lcvx] || ' ';
                }
                result.push(row);
            }
        }catch(ex){
            
        }
        res.send(result.length?result.reverse().join('\n'):`                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                `);
        
    });
    
    app.get('/concat/:layer/:x/:y', async (req, res) => {
        // c | d 
        //---+---
        // a | b
        
        const x = parseInt(req.params.x);
        const y = parseInt(req.params.y);
        try{
            console.log(`http://localhost:3000/concat/${req.params.layer}/${x}/${y}`)
            const a = await (await fetch(`http://localhost:3000/tiles/${req.params.layer}/${x}/${y}`)).text();
            const b = await (await fetch(`http://localhost:3000/tiles/${req.params.layer}/${x+1}/${y}`)).text();
            const c = await (await fetch(`http://localhost:3000/tiles/${req.params.layer}/${x}/${y+1}`)).text();
            const d = await (await fetch(`http://localhost:3000/tiles/${req.params.layer}/${x+1}/${y+1}`)).text();
            const bParts = b.split('\n');
            const combinedAB = a.split('\n').map((item, index)=>{
                return item + bParts[index];
            });
            const dParts = d.split('\n');
            const combinedCD = c.split('\n').map((item, index)=>{
                return item + dParts[index];
            });
            res.send( combinedCD.concat(combinedAB).join('\n') );
        }catch(ex){
            console.log('ERROR', ex);
        }
    });
    
    /*app.get('/tiles/:layer/:x/:y', async (req, res) => {
        const layer = await getLayer(req.params.layer);
        console.log('L', layer)
        const x = parseInt(req.params.x);
        const y = parseInt(req.params.y);
        let result = '';
        let row = '';
        for(var lcvy=16*y; lcvy < 16*(y+1); lcvy++){
            row = '';
            for(var lcvx=16*x; lcvx < 16*(x+1); lcvx++){
                console.log(lcvy, lcvx, layer[lcvy][lcvx]);
                row += layer[lcvy][lcvx];
            }
            result += row + '\n';
        }
        res.send(result);
    });*/
    
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    });
};

module.exports = {
    createServer
}