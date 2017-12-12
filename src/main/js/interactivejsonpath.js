import m from 'mithril';
import utils from './utils';
import jsonPath from './jsonpath';

export default class InteractiveJsonPath {
    constructor(vnode) {
        this.path = '$';
        this.obj = vnode.attrs.obj || {text: 'test', caca: {text: 'help'}};
        this.resultType = 'VALUE';
        this.computeOutput();
        this.resultTypes = ["VALUE", "PATH", "LOCATION"];
    }
    changePath(path) {
        this.path = path;
        this.computeOutput()
    }
    onbeforeupdate(vnode) {
        this.obj = vnode.attrs.obj || {text: 'test', caca: {text: 'help'}};
    }
    computeOutput() {
        let tOut = JSON.stringify(jsonPath(this.obj, this.path, {resultType: this.resultType}), undefined, 2);
        if (tOut !== 'false')
            this.output = tOut;
    }
    changeResultType(resultType) {
        this.resultType = resultType;
        this.computeOutput();
    }
    view(vnode) {
        return m('.row', [
            m('.col-md-6', m('select', {onchange: e => this.changeResultType(e.target.value)}, this.resultTypes.map(d => m('option', d + '')))),
            m('.col-md-6', m('input', {onkeyup: e => this.changePath(e.target.value)})),
            m('.col-md-6', m('pre', this.output))
        ]);
    }
}