import * as PIXI from "pixi.js";
import gsap from "gsap";

window.PIXI = PIXI;

/**
 * interactive portfolio list with webGL preview interaction powered by PIXI.js
 */
export default class PortfolioListController {
    constructor() {
        /**
         * Navigation DOM selectors
         * Navigation DOM state CSS classes
         * @type {{navigation: string, states: {navigationSlideUp: string, navigationScrolled: string, navigationFixed: string}}}
         */

        this.DOM = {
            portfolio: ".js-portfolio",
            portfolioItem: ".js-portfolio-item",
            portfolioPreviewList: ".js-portfolio-preview-list",
            portfolioPreviewItem: ".js-portfolio-preview-item",
            portfolioCanvas: ".js-portfolio-canvas",
        };

        /**
         *
         * @type {Element}
         */
        this.portfolio = document.querySelector(this.DOM.portfolio);

        /**
         *
         * @type {NodeListOf<Element>}
         */
        this.portfolioItems = document.querySelectorAll(this.DOM.portfolioItem);

        /**
         *
         * @type {Element}
         */
        this.portfolioPreviewList = document.querySelector(
            this.DOM.portfolioPreviewList,
        );

        /**
         *
         * @type {NodeListOf<Element>}
         */
        this.portfolioPreviewItems = document.querySelectorAll(
            this.DOM.portfolioPreviewItem,
        );

        /**
         *
         * @type {Element}
         */
        this.portfolioCanvas = document.querySelector(this.DOM.portfolioCanvas);

        //PIXI stuff
        this.app = null;

        //gsap stuff
        this.displacementTimeline = null;
    }

    //region methods

    init() {
        console.log("PortfolioListController init()");

        if (this.portfolio !== null) {
            this.portfolioEvents();
            this.portfolioController();
        } else {
            console.error(`${this.DOM.portfolio} does not exist in the DOM!`);
        }
    }

    portfolioEvents() {

        for (let i = 0; i < this.portfolioItems.length; i++) {

            this.portfolioItems[i].addEventListener("mousemove", (ev) => {
                const decimalX = ev.clientX / window.innerWidth - 0.5;
                const decimalY = ev.clientY / window.innerHeight - 0.5;

                gsap.to(this.portfolioCanvas, {
                    duration: 0.4,
                    x: 300 * decimalX,
                    y: 150 * decimalY,
                    ease: "power3.out",
                });
            });

            this.portfolioItems[i].addEventListener("mouseenter", () => {
                this.portfolioItemMouseenter(i + 1); // why +1? Hint: PIXI related
            });

            this.portfolioItems[i].addEventListener("mouseleave", () => {
                this.portfolioItemMouseleave();
            });
        }
    }

    portfolioController() {
        // predefine canvas element dimensions in px 16:9
        const canvasWidth = 1000;
        const canvasHeight = 563;

        // assign/create new PIXI application which automatically creates the renderer, ticker, and root container/stage
        this.app = new PIXI.Application({
            width: canvasWidth,
            height: canvasHeight,
            transparent: true,
        });

        // add PIXI canvas element to our DOM element
        this.portfolioCanvas.appendChild(this.app.view);

        const displacementMapImage = this.portfolioCanvas.getAttribute("data-displacement-map");

        // create displacement texture
        const displacementMap = new PIXI.Sprite.from(
            displacementMapImage,
        );

        // create PIXI displacement filter and pass the texture
        const displacementFilter = new PIXI.filters.DisplacementFilter(
            displacementMap,
        );

        // set displacement texture properties
        displacementMap.name = displacementMapImage;
        displacementMap.anchor.set(0.5);
        displacementMap.scale.set(1);
        displacementMap.width = canvasWidth;
        displacementMap.height = canvasHeight;
        displacementMap.position.set(canvasWidth / 2, canvasHeight / 2);

        // set stage properties for filter
        this.app.stage.filterArea = this.app.screen;
        this.app.stage.filters = [displacementFilter];

        // add filter to root container/stage
        this.app.stage.addChild(displacementMap);

        // load images from DOM to PIXI container
        for (let i = 0; i < this.portfolioItems.length; i++) {
            //create texture
            const texture = new PIXI.Texture.from(
                this.portfolioPreviewItems[i].getAttribute(
                    "data-portfolio-preview",
                ),
            );

            // create sprite and pass the texture
            const image = new PIXI.Sprite(texture);

            //set sprites properties
            image.name = this.portfolioPreviewItems[i].getAttribute(
                "data-portfolio-preview",
            );
            image.alpha = 1;
            image.width = canvasWidth;
            image.height = canvasHeight;

            // add sprites to root container/stage
            this.app.stage.addChild(image);
        }

        // DISPLACE TIMELINE
        this.displacementTimeline = gsap.timeline({
            paused: true,
        });

        const canvasElement = this.portfolioCanvas.querySelector("canvas");

        this.displacementTimeline
            .add("start")
            .fromTo(
                canvasElement,
                {
                    autoAlpha: 0,
                },
                {
                    duration: 0.4,
                    autoAlpha: 1,
                    ease: "power3.out",
                },
                "start",
            )
            .fromTo(
                canvasElement,
                {
                    scale: 1.5,
                },
                {
                    duration: 0.8,
                    scale: 1,
                    ease: "power3.out",
                },
                "start",
            )
            .fromTo(
                displacementFilter.scale,
                {
                    x: 150,
                    y: 150,
                },
                {
                    duration: 1.6,
                    x: 0,
                    y: 0,
                    ease: "power3.out",
                    onComplete: () => {},
                },
                "start",
            );
    }

    portfolioItemMouseenter(index) {
        gsap.to(this.app.stage.children[index], {
            duration: 0.4,
            alpha: 1,
            ease: "power3.out",
            onStart: () => {
                this.displacementTimeline.restart().pause();
                this.displacementTimeline.play();
            },
        });
    }

    portfolioItemMouseleave() {
        gsap.to(this.app.stage.children, {
            duration: 0.4,
            alpha: 0,
            ease: "power3.out",
        });
    }

    //endregion
}
