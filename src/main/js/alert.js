

import m from 'mithril';

import utils from './utils';

var alerts = [{text: 'hello', title: 'HoneyPot', key: 0}];

class Alert {
    oncreate(vnode) {
        this.timeout = vnode.attrs.timeout || -1;
        if (this.timeout > 0) {
            setTimeout(utils.event(vnode, this.remove), this.timeout);
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
                            {onclick: utils.event(vnode, this.remove)},
                            m("span[aria-hidden='true']", m.trust("&times;")))
                ]
                );
    }
}

class AlertList {
    view(vnode) {
        return m('', [m('.badge.badge-secondary', alerts.length), alerts.map((al, idx) => m(Alert, {alert: al, timeout: 3000}))]);
    }
}

export default {
    component: Alert,
    listcomponent: AlertList,
    messages: alerts
}
