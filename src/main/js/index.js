import m from 'mithril';
import jsonPath from './jsonpath';
import { applyOperation } from 'fast-json-patch'

import render from './rendering'

import templateBuilder from './htmltohyperscript';

import utils from './utils';

let Context = {
    editMode: false
};

let store = {
    "store": {
        "book": [
            {"category": "reference",
                "author": "Nigel Rees",
                "title": "Sayings of the Century",
                "price": 8.95,
                "flag": "http://www.androidbegin.com/tutorial/flag/china.png"
            },
            {"category": "fiction",
                "author": "Evelyn Waugh",
                "title": "Sword of Honour",
                "price": 12.99,
                "flag": "http://www.androidbegin.com/tutorial/flag/india.png"
            },
            {"category": "fiction",
                "author": "Herman Melville",
                "title": "Moby Dick",
                "isbn": "0-553-21311-3",
                "price": 8.99,
                "flag": "http://www.androidbegin.com/tutorial/flag/unitedstates.png"
            },
            {"category": "fiction",
                "author": "J. R. R. Tolkien",
                "title": "The Lord of the Rings",
                "isbn": "0-395-19395-8",
                "price": 22.99,
                "flag": "http://www.androidbegin.com/tutorial/flag/japan.png"
            }
        ],
        "bicycle": {
            "color": "red",
            "price": 19.95
        }
    }
};

let data = {// JSON Object
    "worldpopulation": // JSON Array Name
            [// JSON Array
                {// JSON Object
                    "rank": 1, "country": "China",
                    "population": "1,354,040,000",
                    "flag": "http://www.androidbegin.com/tutorial/flag/china.png"
                },
                {// JSON Object
                    "rank": 2, "country": "India",
                    "population": "1,210,193,422",
                    "flag": "http://www.androidbegin.com/tutorial/flag/india.png"
                },
                {// JSON Object
                    "rank": 3, "country": "United States",
                    "population": "315,761,000",
                    "flag": "http://www.androidbegin.com/tutorial/flag/unitedstates.png"
                },
                {// JSON Object
                    "rank": 4, "country": "Indonesia",
                    "population": "237,641,326",
                    "flag": "http://www.androidbegin.com/tutorial/flag/indonesia.png"
                },
                {// JSON Object
                    "rank": 5, "country": "Brazil",
                    "population": "193,946,886",
                    "flag": "http://www.androidbegin.com/tutorial/flag/brazil.png"
                },
                {// JSON Object
                    "rank": 6, "country": "Pakistan",
                    "population": "182,912,000",
                    "flag": "http://www.androidbegin.com/tutorial/flag/pakistan.png"
                },
                {// JSON Object
                    "rank": 7, "country": "Nigeria",
                    "population": "170,901,000",
                    "flag": "http://www.androidbegin.com/tutorial/flag/nigeria.png"
                },
                {// JSON Object
                    "rank": 8, "country": "Bangladesh",
                    "population": "152,518,015",
                    "flag": "http://www.androidbegin.com/tutorial/flag/bangladesh.png"
                },
                {// JSON Object
                    "rank": 9, "country": "Russia",
                    "population": "143,369,806",
                    "flag": "http://www.androidbegin.com/tutorial/flag/russia.png"
                },
                {// JSON Object
                    "rank": 10, "country": "Japan",
                    "population": "127,360,000",
                    "flag": "http://www.androidbegin.com/tutorial/flag/japan.png"
                }
            ] // JSON Array
};
let booktemplate_old = {"tag": "h1", "attrs": {"class": "large-font"}, "text": "@.title"};
let booktemplate = {"tag": "div", "attrs": {"class": "card"}, "children": [{"tag": "div", "attrs": {"class": "card-header"}, "children": ["$.title"]}]};

let cardTemplate = {"tag": "div", "attrs": {"class": "col-md-4"}, "children": [{
            "tag": "div",
            "attrs": {
                "style": {
                    //         "width": "10rem"
                },
                "className": "card card-primary",
            },
            "children": [
                {
                    "tag": "img",
                    "attrs": {
                        "alt": "Card image cap",
                        "src": "$.flag",
                        "className": "card-img-top"
                    },
                    "children": [

                    ],
                    "skip": false
                },
                {
                    "tag": "div",
                    "attrs": {
                        "className": "card-body"
                    },
                    "children": [
                        {
                            "tag": "h4",
                            "attrs": {
                                "className": "card-title"
                            },
                            "text": "$.country",
                            "skip": false
                        },
                        {
                            "tag": "p",
                            "attrs": {
                                "className": "card-text"
                            },
                            "children": [
                                "Population: ",
                                {
                                    tag: 'span',
                                    "text": "$.population",
                                    attrs: {
                                        className: ''
                                    }
                                }
                            ],
                            "skip": false
                        },
                        {
                            "tag": "a",
                            "attrs": {
                                "href": "#",
                                "className": "btn btn-primary"
                            },
                            "text": "Nuke'em all",
                            "skip": false
                        }
                    ],
                    "skip": false
                }
            ],
            "skip": false
        }]};

var renderedTemplate = render({template: cardTemplate, data: data, path: '$..worldpopulation[:]'});

var datasets = [
    {
        key: 'worldpopulation',
        data: data,
    },
    {
        key: 'store',
        data: store
    },
    {
        key: 'template for card',
        data: cardTemplate
    },
    {
        key: 'rederedStuff',
        data: renderedTemplate
    }
];

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



var resultTypes = ["VALUE", "PATH", "LOCATION"];

class InteractiveJsonPath {
    oninit(vnode) {
        vnode.state.path = '$';
        vnode.state.dataset = 'worldpopulation';
        vnode.state.resultType = 'VALUE';
        vnode.state.computeOutput(vnode)
    }
    changePath(vnode, ev) {
        vnode.state.path = ev.target.value;
        vnode.state.computeOutput(vnode)
    }
    computeOutput(vnode) {
        let tOut = JSON.stringify(jsonPath(findData(vnode.state.dataset), vnode.state.path, {resultType: vnode.state.resultType}), undefined, 2);
        if (tOut !== 'false')
            vnode.state.output = tOut;
    }
    changeDataset(vnode, ev) {
        vnode.state.dataset = ev.target.value;
        vnode.state.computeOutput(vnode)
    }
    changeResultType(vnode, ev) {
        vnode.state.resultType = ev.target.value;
        vnode.state.computeOutput(vnode);
    }
    view(vnode) {
        return m('.row', [
            m('.col-6', m('select', {onchange: event(vnode, this.changeDataset)}, datasets.map(d => m('option', d.key)))),
            m('.col-6', m('select', {onchange: event(vnode, this.changeResultType)}, resultTypes.map(d => m('option', d + '')))),
            m('.col-md-6', m('input', {oninput: event(vnode, this.changePath)})),
            m('.col-md-6', m('pre', vnode.state.output))
        ]);
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

class RenderJson {
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
                        m('span', {style: 'opacity:.5', onclick: event(vnode, this.toggleCollapsed)},
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

var event = (vnode, fn) => {
    return (ev) => {
        fn(vnode, ev);
        m.redraw();
    };
};

class Alert {
    oncreate(vnode) {
        this.timeout = vnode.attrs.timeout || -1;
        if (this.timeout > 0) {
            setTimeout(event(vnode, this.remove), this.timeout);
        }
    }
    remove(vnode) {
        console.log('removal ', alerts);
        alerts.splice(alerts.indexOf(vnode.attrs.alert), 1);
    }
    view(vnode) {
        return m(".alert.alert-warning.alert-dismissible.fade.show[role='alert']", {key: vnode.attrs.alert.key},
                [
                    m("strong", vnode.attrs.alert.title),
                    [vnode.attrs.alert.alert, vnode.attrs.alert.key],
                    m("button.close[aria-label='Close'][data-dismiss='-alert'][type='button']",
                            {onclick: event(vnode, this.remove)},
                            m("span[aria-hidden='true']", m.trust("&times;")))
                ]
                );
    }
}

class Navbar {
    view(vnode) {
        return m("nav.navbar.navbar-expand-lg.navbar-light.bg-light",
                [
                    m("a.navbar-brand[href='#']",
                            "Navbar"
                            ),
                    m("button.navbar-toggler[aria-controls='navbarSupportedContent'][aria-expanded='false'][aria-label='Toggle navigation'][data-target='#navbarSupportedContent'][data-toggle='collapse'][type='button']",
                            m("span.navbar-toggler-icon")
                            ),
                    m(".collapse.navbar-collapse[id='navbarSupportedContent']",
                            [
                                m("ul.navbar-nav.mr-auto",
                                        [
                                            m("li.nav-item.active",
                                                    m("a.nav-link[href='#']",
                                                            [
                                                                "Home",
                                                                m("span.sr-only",
                                                                        "(current)"
                                                                        )
                                                            ]
                                                            )
                                                    ),
                                            m("li.nav-item",
                                                    m("a.nav-link[href='#']",
                                                            "Link"
                                                            )
                                                    ),
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
                                            m("li.nav-item",
                                                    m("a.nav-link.disabled[href='#']",
                                                            "Disabled"
                                                            )
                                                    ),
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
                                            m("button.btn.btn-outline-success.my-2.my-sm-0[type='submit']", {onclick: ev => alerts.push({text: 'hello', title: 'HoneyPot', key: Math.random()})},
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
        console.log('#########', vnode);
        console.log(templateBuilder);
        let source = document.getElementById('from-area').value;
        console.log(source)
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
    view(vnode) {
        return m('.row', [
            m('.col-md-6', m('textarea#from-area[cols=20]', {style: "width:100%", cols: 20})),
            m('.col-md-6', m('textarea#to-area', {style: "width:100%", cols: 20})),
            m('.col-md-12', [
                m('input[type=checkbox]', {value: vnode.state.virtual, onchange: m.withAttr('value', (v) => vnode.state.virtual = Boolean(v), vnode)}, 'virtual'),
                m('button.btn.btn-default', {onclick: event(vnode, this.convert)}, 'Convert')
            ])
        ])
    }
}

m.route.prefix('#');
class Router {
    oncreate(vnode) {
        m.route(vnode.dom, '/', {
            '/': RenderInRow,
            '/title/:id': RenderInRow,
            '/render': {
                render: (vnode) => {
                    return [m(Wrapper, {obj: cardTemplate}), m(RenderJson, {obj: renderedTemplate})];
                }
            },
            '/jsonpath': InteractiveJsonPath,
            '/templatebuilder': TemplateBuilder
        });
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
                {onclick: event(vnode, this.add)},
                m("span[aria-hidden='true']", m.trust("&plus;")));
    }
}

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
        return m('', 'Editbar', m('select', {onchange: event(vnode, this.applyClassToParent)}, [
            m('option', 'alert alert-warning'),
            m('option', 'alert alert-success')]), m('select', {onchange: event(vnode, this.applyTagToParent)}, [
            vnode.state.tags.map(t => m('option', t))
        ]));
    }
}

class VariableComponent {
    oninit(vnode) {
        vnode.state.tag = '';
        vnode.state.class = 'alert alert-warning';
//        setInterval(event(vnode, v => console.log(vnode.state.class)), 1000);
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
                tc: event(vnode, this.applyTag),
                c: vnode.state.class,
                cc: event(vnode, this.applyClass)
            }) : null,
            m(vnode.state.tag, {class: vnode.state.class}, vnode.children),
            Context.editMode ? m(Adder, {cb: event(vnode, this.addChild)}) : null];
    }
}

var alerts = [{text: 'hello', title: 'HoneyPot', key: 0}];
class AlertList {
    view(vnode) {
        return m('', [m('.badge.badge-secondary', alerts.length), alerts.map((al, idx) => m(Alert, {alert: al, timeout: 3000}))]);
    }
}

class PageLayout {
    view(vnode) {
        return [m(Navbar), m('.container', m(AlertList), m('article', m(Router)))];
    }
}



m.mount(document.getElementById('app'), PageLayout);