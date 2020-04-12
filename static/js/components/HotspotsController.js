import * as PIXI from "pixi.js";
import gsap from "gsap";

window.PIXI = PIXI;

/**
 * Magnetic hotspots with connecting lines
 */
export default class HotspotsController {
    constructor() {

        /**
         *
         * @type {{hotspotText: string, hotspot: string, hotspotCircle: string, hotspotContainer: string}}
         */
        this.DOM = {
            hotspotContainer: ".js-hotspot-container",
            hotspot: ".js-hotspot",
            hotspotCircle: ".js-hotspot-circle",
            hotspotText: ".js-hotspot-text",
        };

        /**
         *
         * @returns {NodeListOf<Element>}
         */
        this.hotspotContainer = document.querySelectorAll(
            this.DOM.hotspotContainer,
        );
    }

    init() {
        console.log("HotspotsController init()");

        if (this.hotspotContainer !== null) {
            this.hotspotLines();
        } else {
            console.error(
                `${this.DOM.hotspotContainer} does not exist in the DOM!`,
            );
        }
    }

    hotspotLines() {
        const lineColor = 0xb1b1b1;
        const lineGradient = ["#b1b1b1", "#ffffff"];
        const lineEndingRadius = 2;

        const gradientTexture = this.createGradientTexture(
            lineGradient[0],
            lineGradient[1],
        );

        for (let i = 0; i < this.hotspotContainer.length; i++) {
            const hotspots = this.hotspotContainer[i].querySelectorAll(
                this.DOM.hotspot,
            );

            // CANVAS SIZE
            const canvasWidth = this.hotspotContainer[i].clientWidth;
            const canvasHeight = this.hotspotContainer[i].clientHeight;

            // CREATE PIXI APPLICATION
            const app = new PIXI.Application({
                width: canvasWidth,
                height: canvasHeight,
                antialias: true,
                transparent: true,
                resolution: window.devicePixelRatio,
                resizeTo: this.hotspotContainer[i],
            });

            // ADD CANVAS TO CANVAS WRAPPER ELEMENT
            this.hotspotContainer[i].appendChild(app.view);

            for (let i = 0; i < hotspots.length; i++) {
                const circle = hotspots[i].querySelector(
                    this.DOM.hotspotCircle,
                );
                const text = hotspots[i].querySelector(this.DOM.hotspotText);

                const line = new PIXI.Graphics();
                line.alpha = 0;

                app.stage.addChild(line);

                app.ticker.add(() => {
                    line.clear();
                    line.beginFill(lineColor, 1);
                    line.drawCircle(
                        this.getElementPosition(circle)[0],
                        this.getElementPosition(circle)[1],
                        lineEndingRadius,
                    );
                    line.endFill();
                    line.beginFill(lineColor, 1);
                    line.drawCircle(
                        this.getElementPosition(text)[0],
                        this.getElementPosition(text)[1],
                        lineEndingRadius,
                    );
                    line.endFill();
                    line.moveTo(
                        this.getElementPosition(circle)[0],
                        this.getElementPosition(circle)[1],
                    );
                    line.lineStyle(1, lineColor, 1);
                    line.lineTextureStyle({
                        width: 1,
                        texture: gradientTexture,
                        color: 0xffffff,
                    });
                    line.lineTo(
                        this.getElementPosition(text)[0],
                        this.getElementPosition(text)[1],
                    );
                });

                //hover
                hotspots[i].addEventListener("mouseenter", () => {
                    gsap.to(line, {
                        alpha: 1,
                        duration: 0.4,
                        onComplete: () => {},
                    });
                });

                hotspots[i].addEventListener("mouseleave", () => {
                    gsap.to(line, {
                        alpha: 0,
                        duration: 0.4,
                        onComplete: () => {},
                    });
                });
            }
        }
    }

    /**
     *
     * @param {HTMLElement} element - element which position we should get
     * @returns {[number, number]} - position of element relative to viewport
     */
    getElementPosition(element) {
        const posX =
            element.getBoundingClientRect().left -
            element.closest(this.DOM.hotspotContainer).getBoundingClientRect()
                .left +
            element.clientWidth / 2;

        const posY =
            element.getBoundingClientRect().top -
            element.closest(this.DOM.hotspotContainer).getBoundingClientRect()
                .top +
            element.clientHeight / 2;

        return [posX, posY];
    }

    /**
     *
     * @param {string} from - color in hex format
     * @param {string} to - color in hex format
     * @returns {PIXI.Texture}
     */
    createGradientTexture(from, to) {
        const textureWH = 600;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const gradient = context.createLinearGradient(
            0,
            0,
            textureWH,
            textureWH,
        );
        gradient.addColorStop(0, from);
        gradient.addColorStop(1, to);
        context.fillStyle = gradient;
        context.fillRect(0, 0, textureWH, textureWH);

        return new PIXI.Texture.from(canvas);
    }
}
