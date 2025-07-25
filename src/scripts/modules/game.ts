import { randRange } from "./utilities.js";

let debug = false;

interface Popup {
    _parent: HTMLElement | string | null,
    _classes: string[],
    _contents: HTMLElement,
    _width: string | undefined,
    _height: string | undefined
}

class Popup {

    constructor(parent: HTMLElement | string | null, contents: HTMLElement, classes: string[], width?: string | undefined, height?: string | undefined) {
        if (typeof(parent) === 'object') {
            this._parent = parent;
        } else if (typeof(parent) === 'string') {
            this._parent = document.querySelector<HTMLElement>(parent);
        } else {
            this._parent = document.body;
        }
        this._contents = contents;
        this._classes = classes || [];
        this._width = width || "";
        this._height = height || "";

        const popupContainer: HTMLDivElement = document.createElement('div');
        popupContainer.classList.add('popupContainer', 'help');

        const popup: HTMLDivElement = document.createElement('div');
        this._classes.unshift('popup');
        this._classes.forEach(c => {
            popup.classList.add(c);
        })
        popup.addEventListener('click', e=> {
            this.close(popup);
        });
        popup.append(this._contents);
        popupContainer.append(popup);
        this._parent!.append(popupContainer);
        
    }
    close(popup: HTMLElement) {
        // TODO non harcoded CSS method
        if (popup.classList.contains('visible')) {
            popup.classList.remove('visible');
        }
    }
}

interface ReservedKeys {
    [index: string]: string;
}

interface InputHandler {
    _reservedKeys: ReservedKeys,
    keys: string[],
    noRepeat: string[]
}

class InputHandler {
    constructor(reservedKeys: ReservedKeys) {
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

interface Player {
    _sceneWidth: number,
    _sceneHeight: number,
    _width: number,
    _height: number,
    _groundLevel: number,
    _skyLimit: number,
    _x: number,
    _y: number,
    _sprite: HTMLElement | null,
    _spriteX: number,
    _spriteY: number,
    _numXSprite: number,
    _numYSprite: number,
    _fps: number,
    _frameTimer: number,
    _frameInterval: number,
    _deltaX: number,
    _deltaY: number,
    _gravity: number,
    _lowerBound: number,
    _upperBound: number,
    _direction: boolean
}

class Player {   
    constructor(sceneWidth: number, sceneHeight: number, width: number, height: number, x: number, y: number, sprite: HTMLElement | null, spriteX?: number, spriteY?: number) {
        this._sceneWidth = sceneWidth;
        this._sceneHeight = sceneHeight;
        this._width = width || 48;
        this._height = height || 64;
        this._groundLevel = this._sceneHeight - this._height; // Default max
        this._skyLimit = -200; // Default max
        this._x = x || 0;
        this._y = y || this._groundLevel;
        this._sprite = sprite || document.getElementById("playerSprite");
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

    draw(context: CanvasRenderingContext2D) {
        if (debug) {
            context.strokeStyle = "#f90";
            context.strokeRect(this._x, this._y, this._width, this._height);
        }
        //drawImage vars: imageFile, sourceX, sourceY, souceWidth, sourceHeight, xPos, yPos, width, height
        context.drawImage((<CanvasImageSource>this._sprite), this._spriteX * this._width, this._spriteY * this._height, this._width, this._height, this._x, this._y, this._width, this._height);
    }
    update(input: InputHandler, platforms: any[], deltaTime: number, bonus: boolean) {

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
        let ceiling: number = this._skyLimit; // Temp reset to upper
        let floor: number = this._groundLevel; // Temp reset to lower
        let isPlatform: boolean = false; // Asume there is no platform
        let onPermiablePlatform: boolean = false; // Assume ground/platform is solid
        let platformCallback = (): void => {};
        
        // Go through all platforms to determine eligibility
        platforms.forEach((p) => {
            // If player is between edges of platform
            if (this._x + this._width > p._x && this._x < p._x + p._width) {
                // return true if player is between the x bounds of a platform
                isPlatform = true;
                // Check for solid platforms above the players head
                if (p._notPermiable && this._y > p._y + p._height) {
                    // set the ceiling to the lowest solid platform above the players head
                    ceiling = (p._y + p._height > ceiling) ? p._y + p._height : ceiling;
                    if (p._callback !== null) {
                        platformCallback = (): void => {p._callback!(p._source)};
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
        if (!isPlatform) {
            this._lowerBound = this._groundLevel;
        } else {
            this._upperBound = ceiling;
            this._lowerBound = floor;
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
    resetBounds(width: number, height: number) {
        // reset scene parameters
        this._sceneWidth = width;
        this._sceneHeight = height;

        // prevent player from moving offscreen horizontally
        if (this._x > this._sceneWidth - this._width) this._x = width - this._width;
        if (this._x < 0) this._x = 0;

        // prevent player from falling below ground
        if (this._y + this._height > this._sceneHeight) {
            this._y = this._sceneHeight - this._height;
        }
        // reset ground
        this._groundLevel = this._sceneHeight - this._height;
        this._lowerBound = this._groundLevel;

        
    }
}

interface Environment {
    _sceneWidth: number,
    _sceneHeight: number,
    _width: number,
    _height: number,
    _x: number,
    _y: number
}

class Environment {
    constructor(sceneWidth: number, sceneHeight: number, width: number, height: number, x: number, y: number) {
        this._sceneWidth = sceneWidth;
        this._sceneHeight = sceneHeight;
        this._width = width;
        this._height = height;
        this._x = x;
        this._y = y;
    }
}

interface Cloud {
    _image: HTMLElement,
    _spriteY: number,
    _spriteX: number,
    _speed: number
}

class Cloud extends Environment {
    constructor(sceneWidth: number, sceneHeight: number, width: number, height: number, x: number, y: number, image: HTMLElement, spriteY?: number, speed?: number) {
        super(sceneWidth, sceneHeight, width, height, x, y);
        this._image = image;
        this._spriteY = spriteY || 0;
        this._spriteX = 0; // First frame only
        this._speed = speed || randRange(25,45) / 1000;
    }
    draw(context: CanvasRenderingContext2D) {
        //drawImage vars: imageFile, sourceX, sourceY, souceWidth, sourceHeight, xPos, yPos, width, height
        context.drawImage((<CanvasImageSource>this._image), this._width * this._spriteX, this._height * this._spriteY, this._width, this._height, this._x, this._y, this._width, this._height);
    }
    update() {
        this._x -= this._speed;
        if (this._x + this._width < 0) this._x = this._sceneWidth + this._width;
    }

}

interface Platform {
    _notPermiable: boolean,
    _source: HTMLElement | null,
    _callback: any

}

class Platform extends Environment {
    constructor(sceneWidth: number, sceneHeight: number, width: number, height: number, x: number, y: number, notPermiable: boolean, source?: HTMLElement | null, callback?: any) {
        super(sceneWidth, sceneHeight, width, height, x, y);
        this._notPermiable = notPermiable || false;
        this._source = source || null;
        this._callback = callback || null;
    }

    draw(context: { fillStyle: string; fillRect: (arg0: number, arg1: number, arg2: number, arg3: number) => void; strokeStyle: string; strokeRect: (arg0: number, arg1: number, arg2: number, arg3: number) => void; text: string; lineWidth: number; strokeText: (arg0: string, arg1: number, arg2: number) => void; fillText: (arg0: string, arg1: number, arg2: number) => void; }) {
        // Invisible boxes
        context.fillStyle = "#0000";
        context.fillRect(this._x, this._y, this._width, this._height);
        if (debug) {
            context.strokeStyle = "#f90";
            context.strokeRect(this._x, this._y, this._width, this._height);
            let info: string = `${this._width}x${this._height} • (${this._x},${this._y}) • permiable: ${this._notPermiable}`;
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

