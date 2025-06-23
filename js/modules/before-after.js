// Make the DIV element draggable:

function dragElement(thisObj, thisContainer) {
    let curXPos = 0,
        newXPos = 0;
    const containerBounds = thisContainer.getBoundingClientRect(),
        padAry = getComputedStyle(thisContainer).getPropertyValue('padding').split(" ");

    let leftPad, rightPad;

    if (padAry.length > 3) {
        leftPad = parseInt(padAry[1], 10);
        rightPad = parseInt(padAry[3], 10);
    } else if (padAry.length === 3 || padAry.length === 2) {
        leftPad = parseInt(padAry[1], 10);
        rightPad = parseInt(padAry[1], 10);
    } else if (padAry.length === 1) {
        leftPad = parseInt(padAry[0], 10);
        rightPad = parseInt(padAry[0], 10);
    }
    
    const leftBound = leftPad + containerBounds.left,
        rightBound = containerBounds.right - rightPad;


    thisObj.onmousedown = dragMouseDown;



    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        console.log(containerBounds.left, containerBounds.right);
        // get the mouse cursor position at startup:
        curXPos = e.clientX;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        newXPos = curXPos - e.clientX;
        if (curXPos > leftBound && curXPos < rightBound) {
            thisObj.style.left = (thisObj.offsetLeft - newXPos) + "px";
            thisContainer.querySelector('.before').style.right = Math.floor(containerBounds.right - leftPad - curXPos)+"px";
            thisContainer.querySelector('.before').style.right = Math.floor(containerBounds.right - leftPad - curXPos)+"px";
        } else {
            if (curXPos <= leftBound) {
                curXPos = leftBound + 2;
            } else if (curXPos >= rightBound) {
                curXPos = rightBound - 2;
            }
        }
        curXPos = e.clientX;
        // set the element's new position:
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        // console.log(curXPos);
        // if(curXPos < leftBound) {
        //     curXPos = leftBound;
        //     thisObj.style.left = '0px';
        // } else if (curXPos > rightBound) {
        //     curXPos = rightBound;
        //     thisObj.style.left = 'calc(100% - 3px)';
        // }
        document.onmouseup = null;
        document.onmousemove = null;
        console.log(thisObj.style.left);
    }
}

const setup = id => {
    if (id) {
        document.getElementById(id);
    } else {
        document.querySelectorAll(".compare").forEach((k)=> {
            const grip = document.querySelector("." + k.classList[0] + " .grip");
            const container = k;
            dragElement(grip, container);
        });
    }
}




const Comparison = {
    setup
}
export default Comparison;