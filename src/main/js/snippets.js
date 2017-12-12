
class DataClass {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
    setX(x) {
        this.x = x;
    }
    toString() {
        return `(${this.x}, ${this.y})`;
    }
    setY(y) {
        this.y = y;
    }
}

class TestComponent {
    constructor(vnode) {
        this.data = vnode.attrs.dataAttr;
    }
    onbeforeupdate(vnode) {
        this.data = vnode.attrs.dataAttr;
    }
    view(vnode) {
        return [
            m('h1', 'TestComponent'),
            m('p', this.data.toString()),
            m('button', {onclick: e => this.data.setX(this.data.x + 1)}, 'x++'),
            m('button', {onclick: e => this.data.setY(this.data.y + 1)}, 'y++')
        ];
    }
}

class PageLayout_ {
    oninit(vnode) {
        this.data = [];
        this.data[0] = new DataClass();
        this.data[1] = new DataClass();
        this.currentIdx = 0;
    }
    view(vnode) {
        return m('.container',
                m('.well', [
                    m(TestComponent, {dataAttr: this.data[this.currentIdx]}),
                    m('button', {onclick: e => this.currentIdx = 1 - this.currentIdx}, 'Toggle ' + this.currentIdx)
                ]));
    }
}



m.mount(document.getElementById('app'), PageLayout_);


/*
 class DataClass {
 constructor() {
 this.x = 0;
 this.y = 0;
 }
 setX(x) {
 this.x = x;
 }
 toString() {
 return `(${this.x}, ${this.y})`;
 }
 setY(y) {
 this.y = y;
 }
 }

 class TestComponent {
 view(vnode) {
 console.log('view')
 return [
 m('h1', 'TestComponent'),
 m('p', vnode.attrs.data.toString()),
 m('button', {onclick: e => vnode.attrs.data.setX(vnode.attrs.data.x + 1)}, 'x++'),
 m('button', {onclick: e => vnode.attrs.data.setY(vnode.attrs.data.y + 1)}, 'y++')
 ];
 }
 }

 class PageLayout_ {
 oninit(vnode) {
 this.data = [];
 this.data[0] = new DataClass();
 this.data[1] = new DataClass();
 this.currentIdx = 0;
 }
 view(vnode) {
 return m('.container',
 m('.well', [
 m(TestComponent, {data: this.data[this.currentIdx]}),
 m('button', {onclick: e => this.currentIdx = 1 - this.currentIdx}, 'Toggle ' + this.currentIdx)
 ]));
 }
 }

 */

class VariableComponent {
    oninit(vnode) {
        vnode.state.tag = '';
        vnode.state.class = 'alert alert-warning';
//        setInterval(utils.event(vnode, v => console.log(vnode.state.class)), 1000);
    }
    applyClass(vnode, ev) {
        vnode.state.class = ev;
    }
    applyTag(vnode, ev) {
        vnode.state.tag = ev;
    }
    addChild(vnode, ev) {
        console.log(vnode.children);
        // vnode.children  ADD A DATAMODEL FOR THE TEMPLATE HEREs
    }
    view(vnode) {
        return  [
            Context.editMode ? m(Editbar, {
                t: vnode.state.tag,
                tc: utils.event(vnode, this.applyTag),
                c: vnode.state.class,
                cc: utils.event(vnode, this.applyClass)
            }) : null,
            m(vnode.state.tag, {class: vnode.state.class}, vnode.children),
            Context.editMode ? m(Adder, {cb: utils.event(vnode, this.addChild)}) : null];
    }
}


class RenderInRow {
    constructor() {
        this.message = 'HELLO ES6';
    }
    view(vnode) {
        return [m('h1', [vnode.attrs.id || this.message]), m(VariableComponent, '---'), m('.row', renderedTemplate.map(c => m(Wrapper, {obj: c})))];
    }
}


class Wrapper_ {
    view(vnode) {
        return !vnode.attrs.obj ? null : utils.isArray(vnode.attrs.obj) ?
                m('', vnode.attrs.obj.map(c => m(Wrapper, {obj: c}))) :
                m(vnode.attrs.obj.tag,
                        vnode.attrs.obj.attrs,
                        vnode.attrs.obj.children ?
                        vnode.attrs.obj.children.map(c => {
                            return utils.isString(c) ? c : m(Wrapper, {obj: c})
                        }) :
                        vnode.attrs.obj.text);
    }
}

let template = {
    templateID: 'page',
    class: 'container',
    children: [
        {
            class: 'row',
            children: [
                {
                    class: 'col-md-6',
                    children: [
                        {
                            class: ''
                        }
                    ]
                }
            ]
        }
    ]
};


var renderedTemplate = render({template: cardTemplate, data: data, path: '$..worldpopulation[:]'});
datasets.push({key: 'rederedStuff', data: renderedTemplate});

var findData = (key) => {
    for (var i = 0; i < datasets.length; i++) {
        if (key === datasets[i].key)
            return datasets[i].data;
    }
};


let applyValuesToPaths = (obj, paths, vals) => {
    let applyValueToPath = (obj, path, val) => {
        for (var pidx = 0; pidx < path.length - 1; pidx++)
            obj = obj[path[pidx]];
        obj[path[path.length - 1]] = val;
    };
    if (utils.isString(paths)) {
        paths = jsonPath(obj, paths, {resultType: 'LOCATION'})
    }

    if (!paths.length && !vals.length) {
// Both contain one value.
        console.log('This cannot happen, because paths should always be an array.');
    } else if (paths.length && vals.length && (paths.length === vals.length)) {
// Both contain the same number of values.
        paths.forEach((path, idx) => {
            applyValueToPath(obj, path, vals[idx]);
        });
        console.log('Both contain the same number of values.');
    } else if (paths.length && (!vals.length || vals.length === 1 || typeof vals == 'string')) {
        console.log('Multiple paths, but only one value.');
        paths.forEach((path) => {
            applyValueToPath(obj, path, vals);
        });
    } else {
        console.log('ERROR while applying', obj, paths, vals);
    }
};


class Editbar {
    oninit(vnode) {
        vnode.state.tags = ['button', 'div', 'article', 'nav', 'a', 'input'];
    }
    applyClassToParent(vnode, ev) {
        vnode.attrs.cc(ev.target.value);
    }
    applyTagToParent(vnode, ev) {
        vnode.attrs.tc(ev.target.value);
    }
    view(vnode) {
        return m('', 'Editbar', m('select', {onchange: utils.event(vnode, this.applyClassToParent)}, [
            m('option', 'alert alert-warning'),
            m('option', 'alert alert-success')]), m('select', {onchange: utils.event(vnode, this.applyTagToParent)}, [
            vnode.state.tags.map(t => m('option', t))
        ]));
    }
}