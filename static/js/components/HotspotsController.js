import * as PIXI from "pixi.js";
import gsap from "gsap";

window.PIXI = PIXI;

/**
 * interactive portfolio list with webGL preview interaction powered by PIXI.js
 */
export default class HotspotsController {
    /**
     *
     * @param options
     */
    constructor() {
        /**
         *
         * @type {{hotspotText: string, hotspot: string, hotspotCircle: string, hotspotCanvasContainer: string, hotspotContainer: string}}
         * @private
         */

        this.DOM = {
            hotspotContainer: ".js-hotspot-container",
            hotspot: ".js-hotspot",
            hotspotCanvasContainer: ".js-hotspot-lines-container",
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

        /**
         *
         * @returns {NodeListOf<Element>}
         */
        this.hotspotCanvasContainer = document.querySelectorAll(
            this.DOM.hotspotCanvasContainer,
        );
    }

    init() {

        console.log("HotspotsController init()");

        if (this.hotspotContainer !== null) {

            this.initHotspotLines();
        } else {
            console.error(`${this.DOM.hotspotContainer} does not exist in the DOM!`);
        }
    }

    initHotspotLines() {
        const lineColor = 0xb1b1b1;
        const lineGradient = ["#b1b1b1", "#ffffff"];
        const lineEndingRadius = 2;

        const gradientTexture = this.getGradientTexture(
            lineGradient[0],
            lineGradient[1],
        );

        this.hotspotContainer.forEach((hotspotContainer) => {
            const hotspots = hotspotContainer.querySelectorAll(
                this.DOM.hotspot,
            );

            // CANVAS SIZE
            const canvasWidth = hotspotContainer.clientWidth;
            const canvasHeight = hotspotContainer.clientHeight;

            // CREATE PIXI APPLICATION
            const app = new PIXI.Application({
                width: canvasWidth,
                height: canvasHeight,
                antialias: true,
                transparent: true,
                //resolution: window.devicePixelRatio,
                resizeTo: hotspotContainer,
            });

            // ADD CANVAS TO CANVAS WRAPPER ELEMENT
            hotspotContainer.appendChild(app.view);

            hotspots.forEach((hotspot) => {
                const circle = hotspot.querySelector(
                    this.DOM.hotspotCircle,
                );
                const text = hotspot.querySelector(this.DOM.hotspotText);

                const line = new PIXI.Graphics();
                line.alpha = 0;

                app.stage.addChild(line);

                app.ticker.add(() => {
                    line.clear();
                    line.beginFill(lineColor, 1);
                    line.drawCircle(
                        this.getPosition(circle)[0],
                        this.getPosition(circle)[1],
                        lineEndingRadius,
                    );
                    line.endFill();
                    line.beginFill(lineColor, 1);
                    line.drawCircle(
                        this.getPosition(text)[0],
                        this.getPosition(text)[1],
                        lineEndingRadius,
                    );
                    line.endFill();
                    line.moveTo(
                        this.getPosition(circle)[0],
                        this.getPosition(circle)[1],
                    );
                    line.lineStyle(1, lineColor, 1);
                    line.lineTextureStyle({
                        width: 1,
                        texture: gradientTexture,
                        color: 0xffffff,
                    });
                    line.lineTo(
                        this.getPosition(text)[0],
                        this.getPosition(text)[1],
                    );
                });

                //hover
                hotspot.addEventListener("mouseenter", () => {
                    gsap.to(line, {
                        alpha: 1,
                        duration: 0.4,
                        onComplete: () => {},
                    });
                });

                hotspot.addEventListener("mouseleave", () => {
                    gsap.to(line, {
                        alpha: 0,
                        duration: 0.4,
                        onComplete: () => {},
                    });
                });
            });
        });
    }

    /**
     *
     * @param {HTMLElement} element - element which position we should get
     * @returns {[number, number]} - position of element relative to viewport
     */
    getPosition(element) {
        const posX =
            element.getBoundingClientRect().left -
            element
                .closest(this.DOM.hotspotContainer)
                .getBoundingClientRect().left +
            element.clientWidth / 2;

        const posY =
            element.getBoundingClientRect().top -
            element
                .closest(this.DOM.hotspotContainer)
                .getBoundingClientRect().top +
            element.clientHeight / 2;

        return [posX, posY];
    }

    /**
     *
     * @param {string} from - color in hex format
     * @param {string} to - color in hex format
     * @returns {PIXI.Texture}
     */
    getGradientTexture(from, to) {
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
