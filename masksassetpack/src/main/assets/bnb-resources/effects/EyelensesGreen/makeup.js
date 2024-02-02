'use strict';

require('./modules/scene/index.js');
const modules_eyes_index = require('./modules/eyes/index.js');
const modules_index = require('./modules/index.js');

bnb.log(`\n\nMakeup API version: ${"1.4.0-200ddf99b3885969665155012037c0ac4ac587e9"}\n`);

const Eyes = new modules_eyes_index.Eyes();

const setState = modules_index.createSetState({
    Eyes,
});

const m = /*#__PURE__*/Object.freeze({
    __proto__: null,
	Eyes: Eyes,
    setState: setState
});

exports.m = m;
