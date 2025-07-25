import { randRange, shuffleArray } from "./modules/utilities.js";
import Console from "./modules/console.js";
import Carousel from "./modules/carousel.js";
import Comparison from "./modules/before-after.js";
import Game from "./modules/game.js";
const { siteConsole, siteDisplay, siteTerminal, toggleConsole, submitLine, clearLine, clearDisplay } = Console;
const { filmGap } = Carousel;
let bonus = false;
let isAnimating = false;
let curScene = 1;
window.onload = (w) => {
    var _a, _b;
    Carousel.setup();
    Comparison.setup();
    // Label.setup();
    document.querySelectorAll(".input-wrap").forEach((wrap) => {
        wrap.querySelector("input, textarea").onfocus = () => {
            wrap === null || wrap === void 0 ? void 0 : wrap.classList.add("focused");
        };
        wrap.querySelector("input, textarea").onblur = () => {
            wrap === null || wrap === void 0 ? void 0 : wrap.classList.remove("focused");
        };
    });
    window.onscroll = () => { checkScroll(); };
    checkScroll();
    document.getElementById('contact-form').onsubmit = (e) => {
        e.preventDefault();
        const targetForm = e.target;
        postData(targetForm);
    };
    // About block interactivity
    document.querySelectorAll("#about h2 span").forEach((b) => {
        b.onclick = (e) => {
            e.preventDefault();
            hitBlock(b);
        };
    });
    // About background parallax
    const intro = document.getElementById("intro");
    const monitor = document.querySelector(".monitor");
    let midGround = (window.innerWidth / 2);
    let backGround = (window.innerWidth / 2);
    monitor.style.backgroundPosition = `${midGround}px 95%, ${backGround}px 100%`;
    intro.style.backgroundPosition = `center, ${Math.floor(backGround)}px center, ${Math.floor(midGround * 2) + 300}px top, ${Math.floor(backGround * 2)}px center, center`;
    let origX = 0;
    window.addEventListener("mousemove", (e) => {
        origX = e.clientX > origX ? 1 : -1;
        midGround = (midGround - origX / 3);
        backGround = (backGround - origX / 9);
        monitor.style.backgroundPosition = `${midGround}px 95%, ${backGround}px 100%`;
        intro.style.backgroundPosition = `center, ${Math.floor(backGround)}px center, ${Math.floor(midGround * 2) + 300}px top, ${Math.floor(backGround * 2)}px center, center`;
        origX = e.clientX;
    });
    // Section offsets
    let offsetArray = [];
    document.querySelectorAll("section").forEach((e) => {
        const thisObj = { id: e.id, offset: e.offsetTop };
        offsetArray.push(thisObj);
    });
    // About "game"
    const groundHt = 26;
    const canvas = document.createElement("canvas");
    const canvasParent = document.querySelector("#about .monitor");
    canvasParent.appendChild(canvas);
    canvas.width = canvasParent.offsetWidth;
    canvas.height = canvasParent.offsetHeight - groundHt;
    let ctx = canvas.getContext('2d');
    /// Player
    const input = new Game.InputHandler({
        left: 'ArrowLeft',
        right: 'ArrowRight',
        down: 'ArrowDown',
        jump: 'ArrowUp'
    });
    const plyrHt = 64;
    const plyrWd = 48;
    const initX = canvas.width * .25; // 25%
    const initY = canvas.height - plyrHt - 100; // Start with playing jumping to engage interactivity
    const marty = new Game.Player(canvas.width, canvas.height, plyrWd, plyrHt, initX, initY, null, 4);
    /// Environment
    //// Clouds
    let cloudPosAry = ["8%,23%", "13%,13%", "24%,10%", "49%,8%", "68%,15%", "95%,10%"];
    let cloudAry = [];
    const numClouds = cloudPosAry.length;
    if (numClouds > 0) {
        for (let i = 0; i < numClouds; i++) {
            shuffleArray(cloudPosAry);
            const lastPos = cloudPosAry.pop() || '';
            const pos = lastPos.split(",");
            // const pos: string[] = cloudPosAry.pop().split(",");
            const x = (parseInt(pos[0], 10) / 100) * canvas.width;
            const y = (parseInt(pos[1], 10) / 100) * canvas.height;
            const cloudSprite = randRange(1, 5);
            const cloudImage = document.getElementById("cloud");
            const cloud = new Game.Cloud(canvas.width, canvas.height, 120, 60, x, y, cloudImage, cloudSprite);
            cloudAry.push(cloud);
        }
    }
    function animateClouds() {
        cloudAry.forEach((cloud) => {
            cloud.draw(ctx);
            cloud.update();
        });
    }
    //// Platforms
    // Wrap platforms in a function so they can be re-calc'd on resize
    function getPlatforms() {
        let _platformAry = [];
        // TODO: Look for "platform" class to auto add
        const htmlPlatforms = document.querySelectorAll("#about .platform");
        htmlPlatforms.forEach((el) => {
            var _a;
            if (el.hasAttribute('data-scene')) {
                if (el.hasAttribute('data-scene') && el.getAttribute('data-scene') !== 'undefined') {
                    const dataScene = ((_a = el.getAttribute('data-scene')) === null || _a === void 0 ? void 0 : _a.toString()) || '';
                    const platformScenes = dataScene.split(",");
                    if (platformScenes.includes(curScene.toString())) {
                        const isSolid = (el.hasAttribute('data-platform-solid') && el.getAttribute('data-platform-solid')) ? true : false;
                        const platform = new Game.Platform(canvas.width, canvas.height, el.offsetWidth, el.offsetHeight, el.offsetLeft, el.offsetTop, isSolid, el);
                        _platformAry.push(platform);
                    }
                }
            }
        });
        // console.log(_platformAry);
        // Hand picked elements
        const aboutTitle = document.querySelectorAll("#about .contain h2 span");
        aboutTitle.forEach(el => {
            // console.log(e);
            const callBack = (el) => { hitBlock(el); };
            const platform = new Game.Platform(canvas.width, canvas.height, el.offsetWidth, el.offsetHeight, el.offsetLeft, el.offsetTop, true, el, callBack);
            _platformAry.push(platform);
        });
        // const aboutParagraphs = document.querySelectorAll("#about .contain p");
        // aboutParagraphs.forEach(e => {
        //     const platform = new Game.Platform(canvas.width, canvas.height, e.offsetWidth, e.offsetHeight, e.offsetLeft, e.offsetTop);
        //     _platformAry.push(platform);
        // })
        return _platformAry;
    }
    let platformAry = getPlatforms();
    function handlePlatforms() {
        platformAry.forEach(platform => {
            platform.draw(ctx);
        });
    }
    // Animate
    let animationID = 0;
    let lastTime = 0;
    function animateScene(timeStamp = 0) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (bonus) {
            // remove platforms & clouds
            if (platformAry.length > 0) {
                platformAry = [];
            }
        }
        else {
            animateClouds();
        }
        handlePlatforms();
        marty.draw(ctx);
        marty.update(input, platformAry, deltaTime, bonus);
        if (isAnimating === true) {
            animationID = requestAnimationFrame(animateScene);
        }
    }
    function toggleAnimation(force) {
        if (force === 'pause') {
            isAnimating = false;
        }
        else {
            if (!isAnimating) {
                isAnimating = true;
                animateScene();
            }
            else {
                isAnimating = false;
            }
        }
    }
    // initial setup
    function init() {
        if (window.innerWidth > 960) {
            const popupControls = document.querySelector(".popup.controls");
            document.getElementById("about").removeEventListener('click', init);
            popupControls.classList.add('visible');
            let timeoutID = setTimeout(() => {
                toggleAnimation();
                popupControls.classList.remove('visible');
            }, 2500);
            popupControls.addEventListener('click', () => {
                clearInterval(timeoutID);
                toggleAnimation();
            });
        }
    }
    (_a = document.getElementById("about")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', init);
    if (window.innerWidth > 960) {
        animateScene(0);
    }
    // Canvas extends on resize
    function resizeCanvas() {
        // isAnimating = 'stopped';
        canvas.width = canvasParent.offsetWidth;
        canvas.height = canvasParent.offsetHeight - groundHt;
        // console.log(canvas.height);
        cancelAnimationFrame(animationID);
        platformAry = getPlatforms();
        ctx = canvas.getContext('2d');
        marty.resetBounds(canvas.width, canvas.height);
        // redraw
        if (window.innerWidth > 960) {
            animateScene(0);
        }
        else {
            isAnimating = false;
        }
    }
    window.addEventListener("resize", resizeCanvas);
    function toggleMenu(force) {
        if (force === 'open') {
            document.body.classList.add('menu-open');
        }
        else if (force === 'close') {
            document.body.classList.remove('menu-open');
        }
        else {
            document.body.classList.toggle('menu-open');
        }
    }
    function setMobileMenu() {
        document.querySelectorAll("nav li:not(.spacer)").forEach(l => {
            l.addEventListener('click', closeMenu);
        });
    }
    function closeMenu() {
        toggleMenu('close');
        document.querySelectorAll("nav li:not(.spacer)").forEach(l => {
            l.removeEventListener('click', closeMenu);
        });
    }
    (_b = document.getElementById("menu-toggle")) === null || _b === void 0 ? void 0 : _b.addEventListener('click', e => {
        toggleMenu();
        setMobileMenu();
        e.preventDefault();
    });
};
// "block" interactions
const maxHits = 6; // for "special" blocks
function hitBlock(b) {
    // get num of hits on block
    let blockHits = typeof (b.getAttribute('data-hits')) !== "undefined" ? Number(b.getAttribute('data-hits')) : 0;
    // check for state change
    if (blockHits <= maxHits) {
        // add animation
        b.classList.add("brick-hit");
        setTimeout(() => {
            b.classList.remove("brick-hit");
        }, 250);
        // only count hits for "special" blocks
        if (b.classList.contains("special")) {
            const star = document.createElement('span');
            b.append(star);
            star.classList.add('star');
            setTimeout(() => {
                star.remove();
            }, 1000);
            if (blockHits == maxHits) {
                b.classList.add("spent");
                setTimeout(() => {
                    ee();
                }, 250);
            }
            blockHits++;
            b.setAttribute("data-hits", blockHits.toString());
        }
    }
}
function ee() {
    var _a;
    (_a = document.getElementById("about")) === null || _a === void 0 ? void 0 : _a.classList.add("space");
    // Changes post scene change
    setTimeout(() => {
        var _a, _b, _c, _d;
        bonus = true;
        curScene++;
        document.querySelectorAll(".brick").forEach(e => { e.classList.remove('brick'); });
        (_a = document.getElementById("about")) === null || _a === void 0 ? void 0 : _a.setAttribute('data-current-scene', curScene.toString());
        (_b = document.querySelector("#about h2 span.special")) === null || _b === void 0 ? void 0 : _b.classList.remove('special');
        (_c = document.querySelectorAll('#about p[data-scene="1"]')) === null || _c === void 0 ? void 0 : _c.forEach((e) => { e.style.opacity = '0'; });
        (_d = document.querySelectorAll('#about p[data-scene="2"]')) === null || _d === void 0 ? void 0 : _d.forEach((e) => { e.style.opacity = '1'; });
    }, 3000);
}
// Contact Form
async function postData(form) {
    var _a, _b;
    let emailContents = new FormData();
    form.querySelectorAll('input, textarea').forEach((i) => {
        if (i.type !== 'submit')
            emailContents.append(i.name, i.value);
    });
    const url = "templates/mailer-smtp.php";
    // const url = "templates/test.php";
    try {
        form.querySelectorAll('.input-wrap:not(.submit-wrap)').forEach((wrap) => {
            wrap.classList.add('disabled');
            wrap.querySelector('input, textarea').setAttribute('disabled', 'disabled');
        });
        (_a = document.querySelector('.submit-wrap')) === null || _a === void 0 ? void 0 : _a.classList.add('waiting');
        const response = await fetch(url, {
            method: "POST",
            body: emailContents
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        else {
            // debug using timeout
            // setTimeout(()=> {
            (_b = document.querySelector('.submit-wrap')) === null || _b === void 0 ? void 0 : _b.classList.remove('waiting');
            document.getElementById('submit').value = "Thank You!";
            // }, 2000);
            setTimeout(() => {
                form.querySelectorAll('.input-wrap').forEach((wrap) => {
                    var _a;
                    wrap.classList.remove('disabled');
                    (_a = wrap.querySelector('input, textarea')) === null || _a === void 0 ? void 0 : _a.removeAttribute('disabled');
                });
                document.getElementById('submit').value = "Submit";
            }, 3000);
        }
        // console.log(await response);
    }
    catch (error) {
        console.error(error.message);
    }
}
// let aboutHt = document.getElementById("intro").offsetHeight;
function checkScroll() {
    let toTop = document.body.scrollTop || document.documentElement.scrollTop;
    const header = document.querySelector("header");
    if (toTop > 50) {
        header.classList.add("scroll");
    }
    else {
        header.classList.remove("scroll");
    }
    // document.querySelector("#intro h1").style.top = `${(aboutHt + toTop) / 2}px`;
}
