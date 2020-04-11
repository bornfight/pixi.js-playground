import gsap from "gsap";

export default class MagneticCtaController {
    constructor() {
        this.DOM = {
            ctaContainer: ".js-magnetic-cta-container",
            cta: ".js-magnetic-cta",
            ctaContent: ".js-magnetic-cta-content",
        };

        this.ctaContainer = document.querySelectorAll(this.DOM.ctaContainer);
    }

    init() {
        console.log("MagneticCtaController init()");

        if (this.ctaContainer !== null) {
            this.magneticCtaEvents();
        } else {
            console.error(
                `${this.DOM.ctaContainer} does not exist in the DOM!`,
            );
        }
    }

    magneticCtaEvents() {
        for (let i = 0; i < this.ctaContainer.length; i++) {
            this.ctaContainer[i].addEventListener("mousemove", (ev) => {
                this.magneticMousemove(ev);
            });

            this.ctaContainer[i].addEventListener("mouseleave", (ev) => {
                this.magneticMouseleave(ev);
            });
        }
    }

    magneticMousemove(ev) {
        ev.currentTarget.classList.add("is-hovered");

        // Get X-coordinate for the left container edge
        const containerPosX = ev.currentTarget.getBoundingClientRect().left;
        const containerPosY = ev.currentTarget.getBoundingClientRect().top;

        // Get position of the mouse inside element from left edge
        // (current mouse X position - button x coordinate)
        const pageX = ev.clientX;
        const pageY = ev.clientY;

        const xPosOfMouse = pageX - containerPosX;
        const yPosOfMouse = pageY - containerPosY;

        // Get position of mouse relative to container center
        // Mouse position inside element - container width / 2
        // To get positive or negative movement
        const xPosOfMouseInsideContainer =
            xPosOfMouse - ev.currentTarget.offsetWidth / 2;
        const yPosOfMouseInsideContainer =
            yPosOfMouse - ev.currentTarget.offsetHeight / 2;

        // Button text divider to increase or decrease text path
        const animationDivider = 3;
        const animationDividerText = 1.5;

        // Animate button text positive or negative from center
        gsap.to(ev.currentTarget.querySelector(this.DOM.cta), 0.3, {
            x: xPosOfMouseInsideContainer / animationDivider,
            y: yPosOfMouseInsideContainer / animationDivider,
            ease: "power3.out",
        });

        if (
            ev.currentTarget.querySelector(this.DOM.ctaContent).length !== null
        ) {
            gsap.to(ev.currentTarget.querySelector(this.DOM.ctaContent), 0.2, {
                x: xPosOfMouseInsideContainer / animationDividerText,
                y: yPosOfMouseInsideContainer / animationDividerText,
                ease: "power3.out",
            });
        }
    }

    magneticMouseleave(ev) {
        ev.currentTarget.classList.remove("is-hovered");

        // Animate button text reset to initial position (center)
        gsap.to(ev.currentTarget.querySelector(this.DOM.cta), {
            duration: 0.3,
            x: 0,
            y: 0,
            ease: "power3.out",
        });

        if (
            ev.currentTarget.querySelector(this.DOM.ctaContent).length !== null
        ) {
            gsap.to(ev.currentTarget.querySelector(this.DOM.ctaContent), {
                duration: 0.5,
                x: 0,
                y: 0,
                ease: "power3.out",
            });
        }
    }
}
