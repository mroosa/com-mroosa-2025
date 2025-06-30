import { randRange } from "./utilities.js";

let debug = false;

class Popup {
    constructor(parent, contents, classes, width, height) {
        if (typeof(parent) === 'object') {
            this._parent = parent;
        } else if (typeof(parent) === 'string') {
            this._parent = document.querySelector(parent);
        } else {
            this._parent = document.body;
        }
        this._contents = contents;
        this._classes = classes || [];
        this._width = width || "";
        this._height = height || "";

        const popupContainer = document.createElement('div');
        popupContainer.classList.add('popupContainer', 'help');

        const popup = document.createElement('div');
        this._classes.unshift('popup');
        this._classes.forEach(c => {
            popup.classList.add(c);
        })
        popup.addEventListener('click', e=> {
            this.close(popup);
        });
        popup.append(this._contents);
        popupContainer.append(popup);
        this._parent.append(popupContainer);
        
    }
    close(popup) {
        // TODO non harcoded CSS method
        if (popup.classList.contains('visible')) {
            popup.classList.remove('visible');
        }
    }
}

class InputHandler {
    constructor(reservedKeys) {
        // Abstract the keymapping to allow for possible changes to buttons
        this._reservedKeys = reservedKeys;
        this.keys = [];
        this.noRepeat = [];
        window.addEventListener('keydown', (e) => {
            // prevent reserved keys from firing off other actions
            if (Object.values(this._reservedKeys).indexOf(e.key) > -1) {
                // Push to key array for later use
                // TODO: Swap out actual keyboard value for matching reservedKeys key
                //       to allow for abstract keyboard input (or rebinding)
                if (this.noRepeat.indexOf(e.key) === -1 && this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key);
                }
                e.preventDefault();
            }
        });
        window.addEventListener('keyup', (e) => {
            if (this.keys.indexOf(e.key) !== -1) {
                this.keys.splice(this.keys.indexOf(e.key),1);
            }
            // Remove "no repeat" key from array so it can be used again
            if (this.noRepeat.indexOf(e.key) !== -1 ) {
                this.noRepeat.splice(this.noRepeat.indexOf(e.key),1);
            }
        });

        const keyMap = document.createElement('div');
        let info = "<h3>Controls</h3><ul>";
        for (let [purpose, key] of Object.entries(this._reservedKeys)) {
            info += `<li><h4>${purpose.toUpperCase()}</h4><span class="key--${key}" title="${key}"></span></li>`;
        }
        info += "</ul>";
        keyMap.innerHTML = info;
        // TODO: Remove hard coding, pass parent
        new Popup('#about', keyMap, ['controls']);

    }

    showKeyMap() {
    }
}

class Player {
    constructor(sceneWidth, sceneHeight, width, height, x, y, sprite, spriteX, spriteY) {
        this._sceneWidth = sceneWidth;
        this._sceneHeight = sceneHeight;
        this._width = width || 48;
        this._height = height || 64;
        this._groundLevel = this._sceneHeight - this._height; // Default max
        this._skyLimit = -200; // Default max
        this._x = x || 0;
        this._y = y || this._groundLevel;
        this._sprite = sprite || document.getElementById("playerSprite") || "";
        this._spriteX = spriteX || 0; // default top left - multiply by width/height for frame
        this._spriteY = spriteY || 0; // default top left - multiply by width/height for frame
        this._numXSprite = 4; // Being lazy
        this._numYSprite = 0; // Being lazy
        this._fps = 9;
        this._frameTimer = 0;
        this._frameInterval = 1000/this._fps;
        this._deltaX = 0;
        this._deltaY = 0;
        this._gravity = .5;
        this._lowerBound = this._groundLevel;
        this._upperBound = this._skyLimit;
        this._direction = true; // Right facing
    }

    draw(context) {
        if (debug) {
            context.strokeStyle = "#f90";
            context.strokeRect(this._x, this._y, this._width, this._height);
        }
        //drawImage vars: imageFile, sourceX, sourceY, souceWidth, sourceHeight, xPos, yPos, width, height
        context.drawImage(this._sprite, this._spriteX * this._width, this._spriteY * this._height, this._width, this._height, this._x, this._y, this._width, this._height);
    }
    update(input, platforms, deltaTime, bonus) {

        // horizontal input
        if (input.keys.indexOf('ArrowLeft') > -1) {
            this._deltaX = -3.5;
            this._spriteY = (bonus) ? 3 : 1;
            this._direction = false;
            if (this._frameTimer > this._frameInterval) {
                this._spriteX = this._spriteX + 1 < this._numXSprite ? this._spriteX + 1 : 0;
                this._frameTimer = 0;
            } else {
                this._frameTimer += deltaTime;
            }
        } else if (input.keys.indexOf('ArrowRight') > -1) {
            this._deltaX = 3.5;
            this._spriteY = (bonus) ? 2 : 0;
            this._direction = true;
            if (this._frameTimer > this._frameInterval) {
                this._spriteX = this._spriteX + 1 < this._numXSprite ? this._spriteX + 1 : 0;
                this._frameTimer = 0;
            } else {
                this._frameTimer += deltaTime;
            }
        } else {
            this._deltaX = 0;
            this._spriteX = 1;
            if (bonus) {
                this._spriteY = (this._direction) ? 2 : 3;
            } else {
                this._spriteY = (this._direction) ? 0 : 1;
            }
        }
        // horizontal output
        this._x += this._deltaX;
        if (this._x < -this._width) this._x = this._sceneWidth;
        if (this._x > this._sceneWidth) this._x = -this._width;

        // vertical input
        let ceiling = this._skyLimit; // Temp reset to upper
        let floor = this._groundLevel; // Temp reset to lower
        let isPlatform = false; // Asume there is no platform
        let onPermiablePlatform = false; // Assume ground/platform is solid
        let platformCallback = null;
        
        // Go through all platforms to determine eligibility
        platforms.forEach(p => {
            // If player is between edges of platform
            if (this._x + this._width > p._x && this._x < p._x + p._width) {
                // return true if player is between the x bounds of a platform
                isPlatform = true;
                // Check for solid platforms above the players head
                if (p._notPermiable && this._y > p._y + p._height) {
                    // set the ceiling to the lowest solid platform above the players head
                    ceiling = (p._y + p._height > ceiling) ? p._y + p._height : ceiling;
                    if (p._callback !== null) {
                        platformCallback = () => {p._callback(p._source)};
                    }
                }
                // Find the platform player is standing on, set permiability
                if (this._y + this._height === p._y) {
                    onPermiablePlatform = p._notPermiable;
                }
                // Find the highest platform currently below the player
                if (this._y + this._height <= p._y) {
                    floor = (p._y - this._height <= floor) ? p._y - this._height : floor;
                }
            }
        });
        if (isPlatform === true) {
            this._upperBound = ceiling;
            this._lowerBound = floor;
        } else {
            this._lowerBound = this._groundLevel;
        }
        if (input.keys.indexOf('ArrowUp') > -1 && this.isGrounded()) {
            // Prevent jupming from repeating without a new key press
            if (input.noRepeat.indexOf('ArrowUp') === -1){
                if (this._y > this._upperBound) {
                    this._deltaY -= 15;
                }
                input.noRepeat.push('ArrowUp');
            }
        }
        if (input.keys.indexOf('ArrowDown') > -1 && this.isGrounded()) {
            // console.log(permiablePlatform);
            if (this._y < this._groundLevel && !onPermiablePlatform) {
                this._lowerBound = this._groundLevel;
                // setTimeout(()=>{
                //     permiablePlatform = true;
                // }, 250);
            }
        }
        // vertical output
        /// if the next deltaY value would put it inside/above a solid platform, limit it.
        if (this._y + this._deltaY > this._upperBound) {
            this._y += this._deltaY;
        } else {
            this._y = this._upperBound;
            this._deltaY = 0;
            this._upperBound = -200;
            if (platformCallback !== null) platformCallback();
        }

        if (bonus) {
            this._spriteY = (this._direction) ? 2 : 3;
        } else {
            this._spriteY = (this._direction) ? 0 : 1;
        }
    if (this._y < this._lowerBound) {
            // falling
            this._deltaY += (bonus) ? this._gravity/2 : this._gravity;
            this._spriteX = 4;
            // Sprite control
        } else {
            // stop falling
            this._deltaY = 0;
            // Sprite control
            this._y = this._lowerBound;
        }

        
    }
    isGrounded() {
        return this._y >= this._lowerBound;
    }
    onPlatform() {
        // if (this._y)
    }
}

class Environment {
    constructor(sceneWidth, sceneHeight, width, height, x, y) {
        this._sceneWidth = sceneWidth;
        this._sceneHeight = sceneHeight;
        this._width = width;
        this._height = height;
        this._x = x;
        this._y = y;
    }
}

class Cloud extends Environment {
    constructor(sceneWidth, sceneHeight, width, height, x, y, image, spriteY, speed) {
        super(sceneWidth, sceneHeight, width, height, x, y);
        this._image = image;
        this._spriteY = spriteY || 0;
        this._spriteX = 0; // First frame only
        this._speed = randRange(25,45) / 1000 || speed;
    }
    draw(context) {
        //drawImage vars: imageFile, sourceX, sourceY, souceWidth, sourceHeight, xPos, yPos, width, height
        context.drawImage(this._image, this._width * this._spriteX, this._height * this._spriteY, this._width, this._height, this._x, this._y, this._width, this._height);
    }
    update() {
        this._x -= this._speed;
        if (this._x + this._width < 0) this._x = this._sceneWidth + this._width;
    }

}

class Platform extends Environment {
    constructor(sceneWidth, sceneHeight, width, height, x, y, notPermiable, source, callback) {
        super(sceneWidth, sceneHeight, width, height, x, y);
        this._notPermiable = notPermiable || false;
        this._source = source || null;
        this._callback = callback || null;
    }

    draw(context) {
        // Invisible boxes
        context.fillStyle = "#0000";
        context.fillRect(this._x, this._y, this._width, this._height);
        if (debug) {
            context.strokeStyle = "#f90";
            context.strokeRect(this._x, this._y, this._width, this._height);
            let info = `${this._width}x${this._height} • (${this._x},${this._y}) • permiable: ${this._permiable}`;
            context.text = "12px Arial";
            context.strokeStyle = "#fff";
            context.lineWidth = 2;
            context.fillStyle = "#000";
            context.strokeText(info, this._x + 5, this._y + 15);
            context.fillText(info, this._x + 5, this._y + 15);
        }
    }
}


const Game = {
    InputHandler,
    Player,
    Environment,
    Cloud,
    Platform
}


export default Game;

