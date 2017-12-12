
import m from 'mithril';
import utils from './utils';

export default class RenderJson {
    oninit(vnode) {
        vnode.state.collapsed = false;
    }
    toggleCollapsed(vnode, ev) {
        vnode.state.collapsed = !vnode.state.collapsed;
    }
    view(vnode) {
        return m('div', {style: vnode.attrs.indent ? 'margin-left:' + vnode.attrs.indent + 'px' : ''}, [
            vnode.attrs.elem ? vnode.attrs.elem + ':' : null,
            utils.propList(vnode.attrs.obj).length ?
                    [
                        '{',
                        m('span', {style: 'opacity:.5', onclick: utils.event(vnode, this.toggleCollapsed)},
                                [
                                    ' -- ',
                                    vnode.attrs.path ? vnode.attrs.path : '$'
                                ]),
                        m('br')
                    ]
                    : null,
            (!vnode.state.collapsed && utils.propList(vnode.attrs.obj).length) ?
                    utils.propList(vnode.attrs.obj).map(e =>
                m(RenderJson,
                        {
                            indent: (vnode.attrs.indent ? vnode.attrs.indent + 10 : 10),
                            obj: vnode.attrs.obj[e],
                            elem: e,
                            path: vnode.attrs.path ? vnode.attrs.path + '.' + e : '$.' + e
                        })
            ) : ('' + JSON.stringify(vnode.attrs.obj)), utils.propList(vnode.attrs.obj).length ? null : m('span', {style: 'opacity:.5'}, [' -- ', vnode.attrs.path ? vnode.attrs.path : '$']),
            utils.propList(vnode.attrs.obj).length ? '}' : null, ',', m('br')
        ]);
    }
}