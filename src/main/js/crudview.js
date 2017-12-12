
import m from 'mithril';
import DataStore from './datastore';
import RenderJson from './renderjson';

class Option {
    view(vnode) {
        return m('option', vnode.attrs, vnode.children);
    }
}

class Select {
    view(vnode) {
        return m('select.custom-select', {
            onchange: e => vnode.attrs.onchange(e.target.value)
        }, [
            vnode.attrs.options
        ]);
    }
}

export default class CrudView {
    constructor(vnode) {
        this.resources = [];
        m.request({
            url: '/resource/all'
        }).then(result => {
            this.resources = result;
            m.redraw();
            if (this.resources.length > 0) {
                this.selectCollection(this.resources[0]);
            }
        });
    }
    selectCollection(collection) {
        this.datastore = new DataStore(collection);
        this.datastore.fetchObjects(r => {
            if (this.datastore.getList().length > 0) {
                this.selectedObject = this.datastore.getList()[0];
            }
        });
    }
    selectObject(id) {
        this.selectedObject =
                this.datastore.getLocal(id);
        m.redraw();
        console.log('selectedObject', this.selectedObject)
    }
    view(vnode) {
        return [
            m('h1', 'CrudView'),
            m('.row', [
                m('.col-md-4', [
                    m('label', 'Collection'),
                    m(Select, {
                        onchange: e => this.selectCollection(e),
                        options: this.resources.map(o => m(Option, o))
                    })
                ]),
                m('.col-md-4', [
                    this.datastore && this.datastore.getList() ? [
                        m('label', 'Object'),
                        m(Select, {
                            onchange: e => this.selectObject(e),
                            options: this.datastore.getList().map(o => m('option', o._id))
                        })]
                            : null
                ]),
                m('.col-md-4', [
                    m('button.btn.btn-primary', {onclick: null}
                    , 'Save')
                ]),
                m('.col-md-12', [
                    m('textarea', {style: 'width:100%', rows: 15}, JSON.stringify(this.selectedObject, undefined, 2))
                ]),
                m('.col-md-12', [
                    m(RenderJson, {obj: this.selectedObject})
                ])
            ]),
        ];
    }
}

