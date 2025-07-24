// Make the DIV element draggable:

function dragElement(thisObj: HTMLElement, thisContainer: HTMLElement): void {
    let curXPos: number = 0;
    let newXPos: number = 0;
    const containerBounds = thisContainer.getBoundingClientRect();
    const onion = (<HTMLElement>thisContainer.querySelector(".onion"));
    const padAry: string[] = getComputedStyle(thisContainer).getPropertyValue('padding').split(" ");

    let leftPad: number = 0;
    let rightPad: number = 0;

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
    
    const leftBound: number = leftPad + containerBounds.left;
    const rightBound: number = containerBounds.right - rightPad;


    thisObj.onmousedown = dragMouseDown;



    function dragMouseDown(e: MouseEvent): void {
        e = e || window.event;
        e?.preventDefault();
        // console.log(containerBounds.left, containerBounds.right);
        // get the mouse cursor position at startup:
        curXPos = e.clientX;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e: MouseEvent): void {
        e = e || window.event;
        // calculate the new cursor position:
        newXPos = curXPos - e.clientX;
        e.preventDefault();
        let beforeXPos: string = '0';
        if (curXPos > leftBound && curXPos < rightBound) {
            thisObj.style.left = `${thisObj.offsetLeft - newXPos}px`;
            beforeXPos = `${Math.floor(containerBounds.right - leftPad - curXPos)}px`;
            // console.log(curXPos);
        } else {
            if (curXPos <= leftBound) {
                beforeXPos = `${onion.offsetWidth - 4}px`;
                thisObj.style.left = '0';
            } else if (curXPos >= rightBound) {
                beforeXPos = '0'; 
                thisObj.style.left = `${onion.offsetWidth - 4}px`;
            }
        }
        (<HTMLElement>thisContainer.querySelector('.before')).style.right = beforeXPos;
        curXPos = e.clientX;
        // set the element's new position:
    }

    function closeDragElement(): void {
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
        // console.log(thisObj.style.left);
    }
}

const setup = (id?: string): void => {
    if (id) {
        document.getElementById(id);
    } else {
        document.querySelectorAll(".compare").forEach((k): void => {
            const grip = (<HTMLElement>document.querySelector("." + k.classList[0] + " .grip"));
            const container = (<HTMLElement>k);
            dragElement(grip, container);
        });
    }
}




const Comparison = {
    setup
}
export default Comparison;