
import m from 'mithril';
import utils from './utils';

export default class RenderJson {
    constructor(vnode) {
        this.collapsed = false;
        this.updateState(vnode);
    }
    toggleCollapsed() {
        this.collapsed = !this.collapsed;
    }
    onbeforeupdate(vnode) {
        this.updateState(vnode);
    }
    updateState(vnode) {
        this.obj = vnode.attrs.obj;
        this.indent = vnode.attrs.indent;
        this.elem = vnode.attrs.elem;
        this.path = vnode.attrs.path;
    }
    hasSubprops() {
        return utils.propList(this.obj).length;
    }
    view(vnode) {
        return m('div', {style: this.indent ? 'margin-left:' + this.indent + 'px' : ''}, [
            this.elem ? this.elem + ': ' : null,
            this.hasSubprops() ?
                    [
                        '{',
                        m('span', {style: 'opacity:.5', onclick: e => this.toggleCollapsed()},
                                [
                                    ' -- ',
                                    this.path ? this.path : '$'
                                ]),
                        !this.collapsed ? m('br') : ' '
                    ]
                    : null,
            (!this.collapsed && this.hasSubprops()) ?
                    utils.propList(this.obj).map(e =>
                m(RenderJson,
                        {
                            indent: (this.indent ? this.indent + 10 : 10),
                            obj: this.obj[e],
                            elem: e,
                            path: this.path ? this.path + '.' + e : '$.' + e
                        })
            ) : ('' /*+ JSON.stringify(vnode.attrs.obj)*/),
            this.hasSubprops() ? null : m('span', {style: 'opacity:.5'}, [' -- ', this.path ? this.path : '$']),
            this.hasSubprops() ? '}' : null, ',', m('br')
        ]);
    }
}