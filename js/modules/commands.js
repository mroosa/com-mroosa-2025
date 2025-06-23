class Command {
    constructor(description, type, action, options) {
        this._desc = description;
        this._type = type;
        this._action = action;
        this._options = options;
    }

    get desc() {
        return this._desc;
    }

    get type() {
        return this._type;
    }

    get action() {
        return this._action;
    }

    get options() {
        return this._options;
    }
}

const clear = new Command("clear the contents of the console",'run',"clearDisplay();",'');
const cd = new Command("Change directory",'concat','','');
const dir = new Command("Show directory tree",'concat','','');