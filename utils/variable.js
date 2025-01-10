
const variableManager = (function () {
    let variables = {};

    function setVariable (name, value) {
        variables[name] = value;
    }

    function getVariable (name) {
        return variables[name];
    }

    // Set default variables
    setVariable('lineClamp', '1');
    setVariable('maxHeight', '10px');

    return {
        setVariable,
        getVariable
    };
})();