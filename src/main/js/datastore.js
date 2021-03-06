import m from 'mithril';
import utils from './utils';

export default class DataStore {
    constructor(collectionName) {
        this.url = "/resource/" + collectionName + "/";
        this.collectionName = collectionName;
        this.fetchObjects();
    }
    getList() {
        return this.collection;
    }
    getLocal(id) {
        var result = null;
        this.collection.forEach(r => {
            if (r._id === id) {
                result = r;
            }
        });
        return result;
    }
    fetchObjects(fn) {
        m.request({
            url: this.url,
            method: 'GET'
        }).then(result => {
            this.collection = result;
            utils.safe(fn)(result);
        });
    }
    delete(id, fn) {
        console.log('delete', id);
        m.request({
            url: this.url + id,
            method: 'DELETE'
        }).then(result => {
            console.log('delete result', result);
            utils.safe(fn)(result);
        });
    }
    save(object, fn) {
        this.collection.push(object);
        m.request({
            url: this.url,
            method: 'POST',
            data: object
        }).then(result => {
            console.log('save result', result);
            utils.safe(fn)(result);
        });
    }
    getObject(id, fn) {
        m.request({
            url: this.url + '/' + id
        }).then(r => {
            console.log('get', id)
            utils.safe(fn)(r);
        });
    }
}
