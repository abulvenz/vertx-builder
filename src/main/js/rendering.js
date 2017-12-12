
import jsonPath from './jsonpath';
import utils from './utils';
var render = ({template = null, data = null, path = null}) => {
    var output = [];
    var appendTemplateCopyToOutput = value => {
        let t = utils.copy(template);
        utils.traverse(t, (root, member) => {
            if (utils.isString(root[member]) && root[member][0] === '$') {
                root[member] = jsonPath(value, root[member])[0];
            }
        });
        output.push(t);
    };
    if (data && path) {
        let result = jsonPath(data, path);
        result.map(appendTemplateCopyToOutput);
    } else {
        appendTemplateCopyToOutput(data);
    }
    return output;
};
export default render;
