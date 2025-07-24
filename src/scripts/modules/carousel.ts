
const carouselEl = (<HTMLElement>document.querySelector(".carousel .film"));
const film = (<HTMLElement>document.querySelector(".carousel .film"));
const filmGap: string = getComputedStyle(film).getPropertyValue("gap");

const setup = (id?: string): void => {
    if (id) {
        document.getElementById(id);
    } else {
        document.querySelectorAll(".carousel").forEach((k)=> {
            // Count the slides
            const numSlides: number = Number(k.getAttribute('data-slides'));
            // Only add dots to multi-slide media
            if (numSlides > 1) {
                // Create the dot nav and append to ontainer
                const dots = document.createElement('ul');
                dots.classList.add('carousel-nav');
                k.appendChild(dots);

                // Add a dot for each slide
                for (let i: number = 0; i < numSlides; i++) {
                    const dot = document.createElement('li');
                    dot.setAttribute('data-id', i.toString());
                    // Set first dot "active"
                    if (i === 0) dot.classList.add('active');
                    dot.innerHTML = '<a href="#">Slide ' + Math.floor(i + 1) + '</a>';
                    dots.appendChild(dot);

                    // Change active slide on dot click
                    dot.onclick = (d): void => {
                        const actDot: number = Number(k.querySelector('li.active')?.getAttribute('data-id'));
                        const thisDot: number = Number((<HTMLElement>d.target).getAttribute('data-id'));
                        if (actDot !== thisDot) {
                            // Swap active dot
                            k.querySelector('li.active')?.classList.toggle('active');
                            (<HTMLElement>d.target).classList.toggle('active');
                            // Set offset, force "0" for first dot.
                            const percentage: number = (thisDot != 0) ? -thisDot * 100 : 0;
                            const newFrame: string = `calc(${percentage}% - (${thisDot} * ${filmGap}))`;
                            (<HTMLElement>k.querySelector('.film')).style.left = (thisDot != 0) ? newFrame : '0';
                        }
                    }
                }
            }
        });
    }
}


const Carousel = {
    film,
    filmGap,
    carouselEl,
    setup
}
export default Carousel;