import {randRange, shuffleArray} from "./modules/utilities.js";

import Console from "./modules/console.js";
import Carousel from "./modules/carousel.js";
import Comparison from "./modules/before-after.js";
// import Label from "./modules/label.js";
import Game from "./modules/game.js";

const {siteConsole, siteDisplay, siteTerminal, toggleConsole, submitLine, clearLine, clearDisplay} = Console;
const {filmGap} = Carousel;

let bonus = false;
let isAnimating = false;
let curScene = 1;

window.onload = (w) => {
    Carousel.setup();
    Comparison.setup();
    // Label.setup();

    document.querySelectorAll(".input-wrap").forEach(e => {
        e.querySelector("input, textarea").onfocus = () => {
            e.classList.add("focused");
        };
        e.querySelector("input, textarea").onblur = () => {
            e.classList.remove("focused");
        };
    });
    window.onscroll = () => {checkScroll();};
    checkScroll();

    document.getElementById('contact-form').onsubmit = (e) => {
        e.preventDefault();
        postData(e.target);
    };

    // About block interactivity
    document.querySelectorAll("#about h2 span").forEach(b => {
        b.onclick = e => {
            e.preventDefault();
            hitBlock(b);
        }
    });

    // About background parallax
    const monitor = document.querySelector(".monitor");
    let midGround = (window.innerWidth / 2);
    let backGround = (window.innerWidth / 2);
    monitor.style.backgroundPosition = midGround + "px 95%, " + backGround + "px 100%";
    let origX = 0;
    window.addEventListener("mousemove", (e) => {
        origX = e.clientX > origX ? 1: -1;
        midGround = (midGround - origX/3);
        backGround = (backGround - origX/9);
        monitor.style.backgroundPosition = midGround + "px 95%, " + backGround + "px 100%";
        origX = e.clientX;
    });


    // Section offsets
    let offsetArray = [];
    document.querySelectorAll("section").forEach((e) => {
        const thisObj = {id: e.id, offset: e.offsetTop}
        offsetArray.push(thisObj);
    })
    
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
    let cloudPosAry = ["8%,23%","13%,13%","24%,10%","49%,8%","68%,15%", "95%,10%"];
    let cloudAry = [];
    const numClouds = cloudPosAry.length;

    for(let i = 0; i < numClouds; i++) {
        shuffleArray(cloudPosAry);
        const pos = cloudPosAry.pop().split(",");
        const x = (parseInt(pos[0], 10) / 100) * canvas.width;
        const y = (parseInt(pos[1], 10) / 100) * canvas.height;
        const cloudSprite = randRange(1,5);
        const cloudImage = document.getElementById("cloud");
        const cloud = new Game.Cloud(canvas.width, canvas.height, 120, 60, x, y, cloudImage, cloudSprite);
        cloudAry.push(cloud);
    }

    function animateClouds() {
        cloudAry.forEach(cloud=> {
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
        htmlPlatforms.forEach(e => {
            if (e.hasAttribute('data-scene')) {
                const platformScenes = e.attributes['data-scene'].value.split(",");
                if (e.hasAttribute('data-scene') && platformScenes.includes(curScene.toString())) {
                    const isSolid = (e.hasAttribute('data-platform-solid') && e.attributes['data-platform-solid']) ? true : false;
                    const platform = new Game.Platform(canvas.width, canvas.height, e.offsetWidth, e.offsetHeight, e.offsetLeft, e.offsetTop, isSolid, e);
                    _platformAry.push(platform);
                }
            }
        })

        // Hand picked elements
        const aboutTitle = document.querySelectorAll("#about .contain h2 span");
        aboutTitle.forEach(e => {
            // console.log(e);
            const platform = new Game.Platform(canvas.width, canvas.height, e.offsetWidth, e.offsetHeight, e.offsetLeft, e.offsetTop, true, e, (e) => {hitBlock(e)});
            _platformAry.push(platform);
        })
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
    function animateScene(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (bonus) {
            // remove platforms & clouds
            if (platformAry.length > 0) {
                platformAry = [];
            }
        } else {
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
        if (!isAnimating) {
            isAnimating = true;
            animateScene();
        } else {
            isAnimating = false;
        }
    }

    // initial setup
    function init() {
        document.getElementById("about").removeEventListener('click', init);
        document.querySelector(".popup.controls").classList.add('visible');
        let timeoutID = setTimeout( () => {
            toggleAnimation();
            document.querySelector('.popup.controls').classList.remove('visible');
        }, 3000);
        document.querySelector(".popup.controls").addEventListener('click', () => {
            clearInterval(timeoutID);
            toggleAnimation();
        });
    }
    document.getElementById("about").addEventListener('click', init);
    animateScene(0);

    // Canvas extends on resize
    function resizeCanvas() {
        // isAnimating = 'stopped';
        canvas.width = canvasParent.offsetWidth;
        canvas.height = canvasParent.offsetHeight - groundHt;
        cancelAnimationFrame(animationID);
        platformAry = getPlatforms();
        ctx = canvas.getContext('2d');

            // redraw
        // animateScene();
    }
    window.addEventListener("resize", resizeCanvas);
    

}

// "blocl" interactions
const maxHits = 6; // for "special" blocks
function hitBlock(b) {
    // get num of hits on block
    let blockHits = typeof(b.attributes['data-hits']) !== "undefined" ? b.attributes['data-hits'].value : 0;
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
            b.setAttribute("data-hits", blockHits);
        }
    }
}

function ee() {
    document.getElementById("about").classList.add("space");
    // Changes post scene change
    setTimeout(() => {
        bonus = true;
        curScene++;
        document.querySelectorAll(".brick").forEach(e=>{e.classList.remove('brick');});
        document.getElementById("about").setAttribute('data-current-scene', curScene);
        document.querySelector("#about h2 span.special").classList.remove('special');
        document.querySelectorAll('#about p[data-scene="1"]').forEach((e)=>{e.style.opacity = 0;});
        document.querySelectorAll('#about p[data-scene="2"]').forEach((e)=>{e.style.opacity = 1;});
    }, 3000);
}


async function postData(form) {
    let emailContents = new FormData();
    form.querySelectorAll('input, textarea').forEach((i) => {
        if (i.type !== 'submit') emailContents.append(i.attributes.name.value, i.value);
    });

    const url = "templates/mailer-smtp.php";
    // const url = "templates/test.php";
    try {
        const response = await fetch(url, {
            method: "POST",
            body: emailContents
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
  
        // alert('yay');
        console.log(await response);
    } catch (error) {
        console.error(error.message);
    }

}

// window.addEventListener('keydown', e => {
//     console.log(e.key);
// });
  
function checkScroll() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    document.querySelector("header").classList.add("scroll");
  } else {
    document.querySelector("header").classList.remove("scroll");
  }
}