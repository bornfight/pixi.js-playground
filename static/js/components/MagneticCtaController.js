import gsap from "gsap";

export default class MagneticCtaController {
    constructor(element, innerElement) {
        this.innerEl = element.querySelectorAll(innerElement);
        this.innerText = element.querySelectorAll("div");

        element.addEventListener("mousemove", (ev) => {
            ev.currentTarget.classList.add("is-active");
            this.mousemoveFn(ev, element);
        });

        element.addEventListener("mouseleave", (ev) => {
            ev.currentTarget.classList.remove("is-active");
            this.mouseleaveFn(ev, element);
        });
    }

    mousemoveFn(ev, element) {
        // Get X-coordinate for the left button edge
        const buttonPosX = element.getBoundingClientRect().left;
        const buttonPosY = element.getBoundingClientRect().top;

        // Get position of the mouse inside element from left edge
        // (current mouse X position - button x coordinate)
        const pageX = ev.clientX;
        const pageY = ev.clientY;

        const xPosOfMouse = pageX - buttonPosX;
        const yPosOfMouse = pageY - buttonPosY;

        // Get position of mouse relative to button center
        // Mouse position inside element - button width / 2
        // To get positive or negative movement
        const xPosOfMouseInsideButton = xPosOfMouse - element.offsetWidth / 2;
        const yPosOfMouseInsideButton = yPosOfMouse - element.offsetHeight / 2;

        // Button text divider to increase or decrease text path
        const animationDivider = 3;
        const animationDividerText = 1.5;

        // Animate button text positive or negative from center
        gsap.to(this.innerEl, 0.3, {
            x: xPosOfMouseInsideButton / animationDivider,
            y: yPosOfMouseInsideButton / animationDivider,
            ease: "power3.out",
        });

        if (this.innerText.length > 0) {
            gsap.to(this.innerText, 0.2, {
                x: xPosOfMouseInsideButton / animationDividerText,
                y: yPosOfMouseInsideButton / animationDividerText,
                ease: "power3.out",
            });
        }
    }

    // On mouse leave
    mouseleaveFn() {

        // Animate button text reset to initial position (center)
        gsap.to(this.innerEl, 0.3, {
            x: 0,
            y: 0,
            ease: "power3.out",
        });

        if (this.innerText.length > 0) {
            gsap.to(this.innerText, 0.5, {
                x: 0,
                y: 0,
                ease: "power3.out",
            });
        }
    }
}
