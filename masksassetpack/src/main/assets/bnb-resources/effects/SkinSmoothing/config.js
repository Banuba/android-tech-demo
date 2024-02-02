'use strict';

const makeup = require('./makeup.js');

Object.assign(globalThis, makeup.m);
/* Feel free to add your custom code below */

function onDataUpdate(param){
    Skin.softening(param);
}