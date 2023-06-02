import {} from './index.d';

let map = {
    red: 1,
    green: 2,
    yellow: 3,
    blue: 4,
    magenta: 5,
    cyan: 6,
    white: 7,
    gray: 8,
    grey: 8,
    black: 9
};

for(let i = 0; i < Object.keys(map).length; i++) {
    let key = Object.keys(map)[i];
    let value = Object.values(map)[i];

    (function (key, value) {
        String.prototype.__defineGetter__(key, function(this: String) {
            return `\x1b[3${value}m${this}\x1b[0m`;
        });
    })(key, value);
}