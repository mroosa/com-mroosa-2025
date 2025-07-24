import {randRange, shuffleArray} from "./modules/utilities";

import Console from "./modules/console";
import Carousel from "./modules/carousel";
import Comparison from "./modules/before-after";
// import Label from "./modules/label";
import Game from "./modules/game";

const {siteConsole, siteDisplay, siteTerminal, toggleConsole, submitLine, clearLine, clearDisplay} = Console;
const {filmGap} = Carousel;

let bonus: boolean = false;
let isAnimating: boolean = false;
let curScene: number = 1;

window.onload = (w): void => {
    Carousel.setup();
    Comparison.setup();
    // Label.setup();

    document.querySelectorAll<HTMLElement>(".input-wrap").forEach((wrap): void => {
        (<HTMLInputElement>wrap.querySelector("input, textarea")).onfocus = (): void => {
            wrap?.classList.add("focused");
        };
        (<HTMLInputElement>wrap.querySelector("input, textarea")).onblur = (): void => {
            wrap?.classList.remove("focused");
        };
    });
    window.onscroll = (): void => {checkScroll();};
    checkScroll();

    (<HTMLFormElement>document.getElementById('contact-form')).onsubmit = (e: Event): void => {
        e?.preventDefault();
        const targetForm = (<HTMLFormElement>e.target);
        postData(targetForm);
    };

    // About block interactivity
    document.querySelectorAll<HTMLElement>("#about h2 span").forEach((b): void => {
        (<HTMLElement>b).onclick = (e):void => {
            e?.preventDefault();
            hitBlock(b);
        }
    });

    // About background parallax
    const intro = (<HTMLElement>document.getElementById("intro"));
    const monitor = (<HTMLElement>document.querySelector(".monitor"));
    let midGround: number = (window.innerWidth / 2);
    let backGround: number = (window.innerWidth / 2);
    monitor.style.backgroundPosition = `${midGround}px 95%, ${backGround}px 100%`;
    intro.style.backgroundPosition = `center, ${Math.floor(backGround)}px center, ${Math.floor(midGround * 2) + 300}px top, ${Math.floor(backGround * 2)}px center, center`;
    let origX: number = 0;
    window.addEventListener("mousemove", (e) => {
        origX = e.clientX > origX ? 1: -1;
        midGround = (midGround - origX/3);
        backGround = (backGround - origX/9);
        monitor.style.backgroundPosition = `${midGround}px 95%, ${backGround}px 100%`;
        intro.style.backgroundPosition = `center, ${Math.floor(backGround)}px center, ${Math.floor(midGround * 2) + 300}px top, ${Math.floor(backGround * 2)}px center, center`;
        origX = e.clientX;
        });


    // Section offsets
    let offsetArray = [];
    document.querySelectorAll("section").forEach((e) => {
        const thisObj = {id: e.id, offset: e.offsetTop}
        offsetArray.push(thisObj);
    })
    
    // About "game"
    const groundHt: number = 26;
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    const canvasParent: HTMLElement = document.querySelector("#about .monitor") as HTMLElement;
    canvasParent.appendChild(canvas);
    canvas.width = canvasParent.offsetWidth;
    canvas.height = canvasParent.offsetHeight - groundHt;

    let ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;

    /// Player
    const input = new Game.InputHandler({
        left: 'ArrowLeft', 
        right: 'ArrowRight', 
        down: 'ArrowDown', 
        jump: 'ArrowUp'
    });
    const plyrHt: number = 64;
    const plyrWd: number = 48;
    const initX = canvas.width * .25; // 25%
    const initY = canvas.height - plyrHt - 100; // Start with playing jumping to engage interactivity
    const marty = new Game.Player(canvas.width, canvas.height, plyrWd, plyrHt, initX, initY, null, 4);

    /// Environment
    
    //// Clouds
    let cloudPosAry: string[] = ["8%,23%","13%,13%","24%,10%","49%,8%","68%,15%", "95%,10%"];
    let cloudAry: any[] = [];
    const numClouds: number = cloudPosAry.length;
    if (numClouds > 0) {
        for(let i: number = 0; i < numClouds; i++) {
            shuffleArray(cloudPosAry);
            const lastPos:string = cloudPosAry.pop() || '';
            const pos: string[] = lastPos.split(",");
            // const pos: string[] = cloudPosAry.pop().split(",");
            const x: number = (parseInt(pos[0], 10) / 100) * canvas.width;
            const y: number = (parseInt(pos[1], 10) / 100) * canvas.height;
            const cloudSprite: number = randRange(1,5);
            const cloudImage = (<HTMLElement>document.getElementById("cloud"));
            const cloud = new Game.Cloud(canvas.width, canvas.height, 120, 60, x, y, cloudImage, cloudSprite);
            cloudAry.push(cloud);
        }
    }

    function animateClouds() {
        cloudAry.forEach((cloud)=> {
            cloud.draw(ctx);
            cloud.update();
        });
    }

    //// Platforms
    // Wrap platforms in a function so they can be re-calc'd on resize
    function getPlatforms() {
        let _platformAry: any[] = [];
        // TODO: Look for "platform" class to auto add
        const htmlPlatforms = document.querySelectorAll<HTMLElement>("#about .platform");
        htmlPlatforms.forEach((el): void => {
            if (el.hasAttribute('data-scene')) {
                if (el.hasAttribute('data-scene') && el.getAttribute('data-scene') !== 'undefined') {
                    const dataScene: string = el.getAttribute('data-scene')?.toString() || '';
                    const platformScenes: string[] = dataScene.split(",");
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
        const aboutTitle = document.querySelectorAll<HTMLElement>("#about .contain h2 span");
        aboutTitle.forEach(el => {
            // console.log(e);
            const platform = new Game.Platform(canvas.width, canvas.height, el.offsetWidth, el.offsetHeight, el.offsetLeft, el.offsetTop, true, el, (el: HTMLElement) => {hitBlock(el)});
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
    let animationID: number = 0;
    let lastTime: number = 0;

    function animateScene(timeStamp: number = 0) {
        const deltaTime: number = timeStamp - lastTime;
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

    function toggleAnimation(force?: string) {
        if (force === 'pause') {
            isAnimating = false;
        } else {
            if (!isAnimating) {
                isAnimating = true;
                animateScene();
            } else {
                isAnimating = false;
            }
        }
    }

    // initial setup
    function init() {
        if (window.innerWidth > 960) {

            const popupControls = (<HTMLElement>document.querySelector(".popup.controls"));

            (<HTMLElement>document.getElementById("about")).removeEventListener('click', init);
            popupControls.classList.add('visible');
            let timeoutID = setTimeout( () => {
                toggleAnimation();
                popupControls.classList.remove('visible');
            }, 2500);
            popupControls.addEventListener('click', () => {
                clearInterval(timeoutID);
                toggleAnimation();
            });
        }
    }
    document.getElementById("about")?.addEventListener('click', init);
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
        ctx = canvas.getContext('2d')!;
        marty.resetBounds(canvas.width, canvas.height);

            // redraw
        if (window.innerWidth > 960) {
            animateScene(0);
        } else {
            isAnimating = false;
        }
    }
    window.addEventListener("resize", resizeCanvas);
    

    function toggleMenu(force?: string) {
        if (force === 'open') {
            document.body.classList.add('menu-open');
        } else if (force === 'close') {
            document.body.classList.remove('menu-open');
        } else {
            document.body.classList.toggle('menu-open');
        }

    }
    function setMobileMenu() {
        document.querySelectorAll<HTMLElement>("nav li:not(.spacer)").forEach(l => {
            l.addEventListener('click', closeMenu);
        });
    }
    function closeMenu() {
        toggleMenu('close');
        document.querySelectorAll<HTMLElement>("nav li:not(.spacer)").forEach(l => {
            l.removeEventListener('click', closeMenu);
        });
    }
    document.getElementById("menu-toggle")?.addEventListener('click', e => {
        toggleMenu();
        setMobileMenu();
        e.preventDefault();
    });
}

// "block" interactions
const maxHits = 6; // for "special" blocks
function hitBlock(b: HTMLElement) {
    // get num of hits on block
    let blockHits: number = typeof(b.getAttribute('data-hits')) !== "undefined" ? Number(b.getAttribute('data-hits')) : 0;
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
    document.getElementById("about")?.classList.add("space");
    // Changes post scene change
    setTimeout(() => {
        bonus = true;
        curScene++;
        document.querySelectorAll<HTMLElement>(".brick").forEach(e=>{e.classList.remove('brick');});
        document.getElementById("about")?.setAttribute('data-current-scene', curScene.toString());
        document.querySelector("#about h2 span.special")?.classList.remove('special');
        document.querySelectorAll<HTMLElement>('#about p[data-scene="1"]')?.forEach((e)=>{e.style.opacity = '0';});
        document.querySelectorAll<HTMLElement>('#about p[data-scene="2"]')?.forEach((e)=>{e.style.opacity = '1';});
    }, 3000);
}





// Contact Form
async function postData(form: HTMLFormElement) {
    let emailContents = new FormData();
    form.querySelectorAll<HTMLInputElement>('input, textarea').forEach((i) => {
        if (i.type !== 'submit') emailContents.append(i.name, i.value);
    });

    const url = "templates/mailer-smtp.php";
    // const url = "templates/test.php";
    try {
        form.querySelectorAll<HTMLElement>('.input-wrap:not(.submit-wrap)').forEach((wrap) => {
            wrap.classList.add('disabled');
            (<HTMLInputElement>wrap.querySelector('input, textarea')).setAttribute('disabled','disabled');
        });
        document.querySelector('.submit-wrap')?.classList.add('waiting');
        
        const response = await fetch(url, {
            method: "POST",
            body: emailContents
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        } else {
            // debug using timeout
            // setTimeout(()=> {
                document.querySelector('.submit-wrap')?.classList.remove('waiting');
                (<HTMLInputElement>document.getElementById('submit')).value = "Thank You!";
            // }, 2000);

            setTimeout(()=> {
                form.querySelectorAll<HTMLElement>('.input-wrap').forEach((wrap) => {
                    wrap.classList.remove('disabled');
                    wrap.querySelector('input, textarea')?.removeAttribute('disabled');
                });
                (<HTMLInputElement>document.getElementById('submit')).value = "Submit";
            },3000);
        }
  
        // alert('yay');
        console.log(await response);
    } catch (error: any) {
        console.error(error.message);
    }

}

// let aboutHt = document.getElementById("intro").offsetHeight;
function checkScroll(): void {
    let toTop = document.body.scrollTop || document.documentElement.scrollTop;
    const header = (<HTMLElement>document.querySelector("header"));
    if (toTop > 50) {
        header.classList.add("scroll");
    } else {
        header.classList.remove("scroll");
    }
    // document.querySelector("#intro h1").style.top = `${(aboutHt + toTop) / 2}px`;
}