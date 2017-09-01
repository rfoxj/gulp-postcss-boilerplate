const someVar = require('./another.js');
const lala = 'yada';
const func = (someVar) => {
	const someLongVarName = someVar + 1;
	return 'hello!';
};

console.log(someVar);

require('./modules/module.js');