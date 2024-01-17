const express = require('express');
//const { Roguelike, seed } = require('procedural-layouts');
const tilestrata = require('tilestrata');
const disk = require('tilestrata-disk');
const roguelikeTile = require('./generate-tile.js');
const { renderRogueLike, getLayer, getTile } = require('./generate-ascii-tile.js');
const cors = require('cors');

const createServer = async ()=>{
    const app = express();
    const port = 3000;
    
    app.use(express.static('.'));
    app.use(cors());
    
    
    app.get('/tiles/:layer/:x/:y', async (req, res) => {
        const layer = req.params.layer;
        const x = parseInt(req.params.x);
        const y = parseInt(req.params.y);
        let tile = null;
        try{
            tile = await getTile(layer, x, y);
        }catch(ex){ }
        res.send(tile);
    });
    
    app.get('/meta/:layer/:position', async (req, res) => {
        try{
            const layer = (await getLayer(req.params.layer));
            const data = layer.matrix;
            //data = data.reverse();
            var absolute = null;
            var target = null;
            var up = null;
            var down = null;
            const rows = data.length
            const cols = data[0].length
            for(var row=0; row < rows; row++){
                for(var col=0; col <  data[row].length; col++){
                    if(data[row][col] === '>'){
                        console.log('FOUND UP')
                        up = {
                            tile:{
                                x: Math.floor(col/16), 
                                y: Math.floor(row/16)
                            },
                            position:{
                                x:col,
                                y:row
                            },
                            facing: 'south'
                        };
                    }
                    if(data[row][col] === '<'){
                        console.log('FOUND DOWN')
                        down = {
                            tile:{
                                x: Math.floor(col/16), 
                                y: Math.floor(row/16)
                            },
                            position:{
                                x: col,
                                y: row
                            },
                            facing: 'south'
                        }
                    }
                    switch(req.params.position){
                        case 'up':
                            if(data[row][col] === '>'){
                                target = up;
                            }
                            break;
                        case 'down':
                            if(data[row][col] === '<'){
                                target = down;
                            }
                            break;
                        default: throw new Error(`Unrecognized position: ${eq.params.position}`)
                    }
                }
            }
            const tile = await getTile(layer, target.tile.x, target.tile.y);
            res.send( JSON.stringify({up, down, target, tile}) );
        }catch(ex){
            console.log('ERROR', ex);
        }
    });
    
    app.get('/concat/:layer/:x/:y', async (req, res) => {
        // c | d 
        //---+---
        // a | b
        
        const x = parseInt(req.params.x);
        const y = parseInt(req.params.y);
        try{
            console.log(`http://localhost:3000/concat/${req.params.layer}/${x}/${y}`)
            const a = await (await fetch(
                `http://localhost:3000/tiles/${req.params.layer}/${x}/${y}`
            )).text();
            const b = await (await fetch(
                `http://localhost:3000/tiles/${req.params.layer}/${x+1}/${y}`
            )).text();
            const c = await (await fetch(
                `http://localhost:3000/tiles/${req.params.layer}/${x}/${y+1}`
            )).text();
            const d = await (await fetch(
                `http://localhost:3000/tiles/${req.params.layer}/${x+1}/${y+1}`
            )).text();
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
    
    const strata = tilestrata();
    strata.layer('basemap').route('tile.png')
        .use(roguelikeTile())
        /*.use(disk.cache({
            maxage: 3600, 
            dir: './tiles/basemap'
        }));*/
    
    app
        .use(tilestrata.middleware({
            server: strata,
            prefix: '/minimap'
        }));
    
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    });
};

module.exports = {
    createServer
}