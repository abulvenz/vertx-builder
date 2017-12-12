import m from 'mithril';
import Alert from './alert';
import Context from './context';

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

export default class Navbar {
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
                                            m("button.btn.btn-outline-success.my-2.my-sm-0[type='submit']", {
                                                onclick: ev => Alert.messages.push({text: 'hello', title: 'HoneyPot', key: Math.random()})
                                            },
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
