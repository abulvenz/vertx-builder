import m from 'mithril';
import jsonPath from './jsonpath';
import { applyOperation } from 'fast-json-patch';
import render from './rendering';
import templateBuilder from './htmltohyperscript';
import utils from './utils';
import Alert from './alert';
import RenderJson from './renderjson';
import DataStore from './datastore';
import InteractiveJsonPath from './interactivejsonpath';

/** Later use https://github.com/j2css/j2c for css-json */


let Context = {
    editMode: false,
    online: false
};

console.log('before')
var templateStore = new DataStore('template');
var fusionStore = new DataStore('fusion');
var dataStore = new DataStore('data');
templateStore.fetchObjects(result => {
    console.log('done: ', result)
});
console.log('lost list', templateStore.getList())
//var id = templateStore.getList()[0]._id


//templateStore.delete(id, (r) => console.log(r))
//templateStore.save(cardTemplate);
//templateStore.save(booktemplate);
console.log('after')

class CrudView {
    oninit(vnode) {
        vnode.state.resources = [];
        m.request({
            url: '/resource/all'
        }).then(result => {
            vnode.state.resources = result;
            m.redraw();
        });
    }
    selectCollection(vnode, ev) {
        vnode.state.datastore = new DataStore(ev.target.value);
        vnode.state.datastore.fetchObjects(r => {
            if (vnode.state.datastore.getList().length > 0) {
                node.state.selectedObject = vnode.state.datastore.getList()[0];
            }
        });
    }
    selectObject(vnode, ev) {
        vnode.state.selectedObject =
                vnode.state.datastore.getLocal(ev.target.value);
        m.redraw();
        console.log('selectedObject', vnode.state.selectedObject)
    }
    view(vnode) {
        return [
            m('h1', 'CrudView'),
            m('select', {
                onchange: utils.event(vnode, this.selectCollection)
            }, vnode.state.resources.map(o => m('option', o))),
            vnode.state.datastore ? m('select', {
                onchange: utils.event(vnode, this.selectObject)
            }, vnode.state.datastore.getList().map(o => m('option', o._id))) : null,
            m('textarea', JSON.stringify(vnode.state.selectedObject, undefined, 2)),
            m(RenderJson, {obj: vnode.state.selectedObject})
        ];
    }
}

/* Data object */
class Fusion {
    constructor() {
        console.log('CREATING FUSION')
        this.path = '$';
        this.templateID = null;
        this.dataID = null;
    }
    setPath(path) {
        console.log('SET PATH', this);
        this.path = path;
    }
    getPath() {
        return this.path;
    }
    setTemplateID(id) {
        console.log('SET TEMPLATE', this);
        this.templateID = id;
    }
    getTemplateID() {
        return this.templateID;
    }
    setDataID(id) {
        console.log('SET DATA', this);
        this.dataID = id;
    }
    getDataID() {
        return this.dataID;
    }
}

let f = new Fusion();

console.log('f', JSON.stringify(f));
console.log('Fusion', Fusion);

class FusionSelector {
    constructor(vnode) {
        this.fusion = vnode.attrs.fusion || new Fusion();
    }
    view(vnode) {
        return [
            m('h1', 'FusionSelector'),
            m('.row', [
                m('.col-md-4', [
                    m('.label.label-default', 'Template'), m('select', {
                        onchange: e => this.fusion.setTemplateID(e.target.value)
                    }, templateStore.getList().map(c => m('option', c._id)))
                ]),
                m('.col-md-4', [
                    m('.label.label-default', 'Data'), m('select', {
                        onchange: e => this.fusion.setDataID(e.target.value)
                    }, dataStore.getList().map(c => m('option', c._id)))
                ]),
                m('.col-md-4', [
                    m('.label.label-default', 'Template'),
                    m('input#path', {
                        onkeyup: e => this.fusion.setPath(e.target.value)
                    })
                ]),
                m('.col-md-12',
                        m('.row', render({
                            template: templateStore.getLocal(this.fusion.getTemplateID() ? this.fusion.getTemplateID() : ''),
                            data: dataStore.getLocal(this.fusion.getDataID() ? this.fusion.getDataID() : ''),
                            path: vnode.state.path
                        }).map(c => c === null ? null : m(Wrapper, {obj: c}))))
            ]),
            m('pre', JSON.stringify(templateStore.getLocal(this.fusion.getTemplateID() ? this.fusion.getTemplateID() : ''))),
            m('pre', JSON.stringify(dataStore.getLocal(this.fusion.getDataID() ? this.fusion.getDataID() : ''))),
            m('pre', JSON.stringify(this)),
            m(InteractiveJsonPath, {obj: dataStore.getLocal(this.fusion.getDataID() ? this.fusion.getDataID() : {})})
        ];
    }
}





class Wrapper {
    view(vnode) {
        return  utils.isArray(vnode.attrs.obj) ?
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



class NavbarBrand {
    view(vnode) {
        return m("a.navbar-brand[href='#']", vnode.attrs, vnode.children);
    }
}

class NavbarToggleButton {
    view(vnode) {
        return m("button.navbar-toggler[aria-controls='navbarSupportedContent'][aria-expanded='false'][aria-label='Toggle navigation'][data-target='#navbarSupportedContent'][data-toggle='collapse'][type='button']",
                m("span.navbar-toggler-icon"));
    }
}

class Navbar {
    view(vnode) {
        return m("nav.navbar.navbar-expand-lg.navbar-light.bg-light",
                [
                    //   m(NavbarBrand, 'Navbar'),
                    m(NavbarToggleButton),
                    m(".collapse.navbar-collapse[id='navbarSupportedContent']",
                            [
                                m("ul.navbar-nav.mr-auto",
                                        [
                                            vnode.attrs.links.map(l => m("li.nav-item", m("a.nav-link", {href: '#' + l.link}, l.text))),
                                            m("li.nav-item.dropdown",
                                                    [
                                                        m("a.nav-link.dropdown-toggle[aria-expanded='false'][aria-haspopup='true'][data-toggle='dropdown'][href='#'][id='navbarDropdown'][role='button']",
                                                                "Dropdown"
                                                                ),
                                                        m(".dropdown-menu[aria-labelledby='navbarDropdown']",
                                                                [
                                                                    m("a.dropdown-item[href='#/title/Helo']",
                                                                            "Action"
                                                                            ),
                                                                    m("a.dropdown-item[href='#/render']",
                                                                            "render wrapper"
                                                                            ),
                                                                    m(".dropdown-divider"),
                                                                    m("a.dropdown-item[href='#/jsonpath']",
                                                                            "Json Path"
                                                                            ),
                                                                    m("a.dropdown-item[href='#/templatebuilder']",
                                                                            "TemplateBuilder"
                                                                            )
                                                                ]
                                                                )
                                                    ]
                                                    ),
//                                            m("li.nav-item",m("a.nav-link.disabled[href='#']", "Disabled" ) ),
                                            m("button.btn.btn-primary[aria-pressed='false'][autocomplete='off'][data-toggle='button'][type='button']", {onclick: ev => {
                                                    Context.editMode = !Context.editMode;
                                                }},
                                                    Context.editMode ? "Don't edit" : "Edit"
                                                    )
                                        ]
                                        ),
                                m("form.form-inline.my-2.my-lg-0",
                                        [
                                            m("input.form-control.mr-sm-2[aria-label='Search'][placeholder='Search'][type='search']"),
                                            m("button.btn.btn-outline-success.my-2.my-sm-0[type='submit']", {onclick: ev => Alert.messages.push({text: 'hello', title: 'HoneyPot', key: Math.random()})},
                                                    "Search"
                                                    )
                                        ]
                                        )
                            ]
                            )
                ]
                );
    }
}

class TemplateBuilder {
    oninit(vnode) {
        vnode.state.virtual = false;
    }
    convert(vnode, ev) {
        let source = document.getElementById('from-area').value;
        let input = vnode.state.virtual ? {source, virtual: vnode.state.virtual} : {source};
        let result = templateBuilder(input);
        document.getElementById('to-area').value = vnode.state.virtual ? JSON.stringify(result) : result;
        if (vnode.state.virtual) {
            datasets.push({key: 'result', data: result});
        }
    }
    toggleVirtual(vnode) {
        vnode.state.virtual = !vnode.state.virtual;
    }
    save(vnode, ev) {
        templateStore.save(JSON.parse(document.getElementById('to-area').value)[0]);
    }
    view(vnode) {
        return m('.row', [
            m('.col-md-6', m('textarea#from-area[cols=20]', {style: "width:100%", cols: 20})),
            m('.col-md-6', m('textarea#to-area', {style: "width:100%", cols: 20})),
            m('.col-md-12', [
                m('input[type=checkbox]', {
                    value: vnode.state.virtual,
                    onchange: m.withAttr('value', (v) => vnode.state.virtual = Boolean(v), vnode)
                }, 'virtual'),
                m('button.btn.btn-default', {onclick: utils.event(vnode, this.convert)}, 'Convert'),
                m('button.btn.btn-default', {onclick: utils.event(vnode, this.save)}, 'Save')
            ])
        ])
    }
}

class Title {
    view(vnode) {
        return m('.jumbotron', [
            m('h1', 'Fusion power'),
            m('h3', 'Building blocks')
        ]);
    }
}

var links = [
    {
        text: 'Rendering',
        link: '/',
        component: Title
    }, {
        text: 'Rendered template',
        link: '/render',
        component: {
            render: (vnode) => {
                return [m(Wrapper, {obj: cardTemplate}), m(RenderJson, {obj: renderedTemplate})];
            }
        }
    }, {
        text: 'JsonPath',
        link: '/jsonpath',
        component: {
            render: (vnode) => m(InteractiveJsonPath, {obj: data})
        }
    }, {
        text: 'Template Generator',
        link: '/templatebuilder',
        component: TemplateBuilder
    },
    {
        text: 'Fusions',
        link: '/fusion',
        component: {
            render: (vnode) => m(FusionSelector, {caca: 'AA'})
        }
    },
    {
        text: 'CRUD',
        link: '/crud',
        component: CrudView
    }
];

class Router {
    constructor(vnode) {
        m.route.prefix('#');
    }
    oncreate(vnode) {
        m.route(vnode.dom, '/', utils.toMap(links, 'link', 'component'));
    }
    view(vnode) {
        return m('');
    }
}

class Adder {
    add(vnode, ev) {
        vnode.attrs.cb(ev);
    }
    view(vnode) {
        return m("button.close[aria-label='Close'][data-dismiss='-alert'][type='button']",
                {onclick: utils.event(vnode, this.add)},
                m("span[aria-hidden='true']", m.trust("&plus;")));
    }
}

class PageLayout {
    view(vnode) {
        return [
            m(Navbar, {links: links}),
            m('.container', [
                m(Alert.listcomponent),
                m('article', m(Router))
            ])
        ];
    }
}

m.mount(document.getElementById('app'), PageLayout);

