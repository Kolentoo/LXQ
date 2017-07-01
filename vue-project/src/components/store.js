const storage = 'src';
export default {
    fetch: function() {
        return JSON.parse(window.localStorage.getItem(storage) || '[]');
    },
    save: function(items) {
        window.localStorage.setItem(storage, JSON.stringify(items));
    }
}