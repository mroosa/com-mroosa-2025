const carouselEl = document.querySelector(".carousel .film");
const film = document.querySelector(".carousel .film");
const filmGap = getComputedStyle(film).getPropertyValue("gap");
const setup = (id) => {
    if (id) {
        document.getElementById(id);
    }
    else {
        document.querySelectorAll(".carousel").forEach((k) => {
            // Count the slides
            const numSlides = Number(k.getAttribute('data-slides'));
            // Only add dots to multi-slide media
            if (numSlides > 1) {
                // Create the dot nav and append to ontainer
                const dots = document.createElement('ul');
                dots.classList.add('carousel-nav');
                k.appendChild(dots);
                // Add a dot for each slide
                for (let i = 0; i < numSlides; i++) {
                    const dot = document.createElement('li');
                    dot.setAttribute('data-id', i.toString());
                    // Set first dot "active"
                    if (i === 0)
                        dot.classList.add('active');
                    dot.innerHTML = '<a href="#">Slide ' + Math.floor(i + 1) + '</a>';
                    dots.appendChild(dot);
                    // Change active slide on dot click
                    dot.onclick = (d) => {
                        var _a, _b;
                        const actDot = Number((_a = k.querySelector('li.active')) === null || _a === void 0 ? void 0 : _a.getAttribute('data-id'));
                        const thisDot = Number(d.target.getAttribute('data-id'));
                        if (actDot !== thisDot) {
                            // Swap active dot
                            (_b = k.querySelector('li.active')) === null || _b === void 0 ? void 0 : _b.classList.toggle('active');
                            d.target.classList.toggle('active');
                            // Set offset, force "0" for first dot.
                            const percentage = (thisDot != 0) ? -thisDot * 100 : 0;
                            const newFrame = `calc(${percentage}% - (${thisDot} * ${filmGap}))`;
                            k.querySelector('.film').style.left = (thisDot != 0) ? newFrame : '0';
                        }
                    };
                }
            }
        });
    }
};
const Carousel = {
    film,
    filmGap,
    carouselEl,
    setup
};
export default Carousel;
