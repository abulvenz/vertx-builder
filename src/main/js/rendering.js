
import jsonPath from './jsonpath';
import utils from './utils';

var render = input => {
    var output = [];

    let template = input.template || null;

    var appendTemplateCopyToOutput = value => {
        let t = utils.copy(template);
        utils.traverse(t, (root, member) => {
            if (utils.isString(root[member]) && root[member][0] === '$') {
                root[member] = jsonPath(value, root[member])[0];
            }
        });
        output.push(t);
    };

    if (input.data && input.path) {
        let result = jsonPath(input.data, input.path);
        result.map(appendTemplateCopyToOutput);
    } else {
        appendTemplateCopyToOutput(input.data);
    }
    return output;
};

export default render;
