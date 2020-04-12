import * as PIXI from "pixi.js";
import gsap from "gsap";
import {ScrollScene} from "scrollscene";

window.PIXI = PIXI;

/**
 * Liquid images reveal on scroll
 */
export default class LiquidImagesController {
    constructor() {
        /**
         *
         * @type {{imageContainer: string}}
         */
        this.DOM = {
            image: ".js-liquid-image",
        };

        this.options = {
            bindTimelineToScroll: false,
        };

        /**
         *
         * @returns {NodeListOf<Element>}
         */
        this.images = document.querySelectorAll(this.DOM.image);

        //PIXI stuff
        this.app = null;

    }

    init() {
        console.log("LiquidImagesController init()");

        if (this.images !== null) {
            this.liquidImages();
        } else {
            console.error(`${this.DOM.image} does not exist in the DOM!`);
        }
    }

    liquidImages() {
        for (let i = 0; i < this.images.length; i++) {
            // CANVAS SIZE
            const canvasWidth = this.images[i].clientWidth;
            const canvasHeight = this.images[i].clientHeight;

            // CREATE PIXI APPLICATION
            this.app = new PIXI.Application({
                width: canvasWidth,
                height: canvasHeight,
                transparent: true,
                resolution: window.devicePixelRatio,
                resizeTo: this.images[i],
            });

            // ADD CANVAS TO CANVAS WRAPPER ELEMENT
            this.images[i].appendChild(this.app.view);

            //IMAGE
            const image = PIXI.Sprite.from(
                this.images[i].getAttribute("data-image"),
            );

            image.width = canvasWidth;
            image.height = canvasHeight;

            image.anchor.set(0.5);

            image.position.x = canvasWidth / 2;
            image.position.y = canvasHeight / 2;

            this.app.stage.addChild(image);

            // DISPLACEMENT MAP
            const displacementMap = PIXI.Sprite.from(
                this.images[i].getAttribute("data-displacement-map"),
            );
            const displacementFilter = new PIXI.filters.DisplacementFilter(
                displacementMap,
            );

            this.app.stage.filterArea = this.app.screen;
            this.app.stage.filters = [displacementFilter];
            this.app.stage.addChild(displacementMap);

            displacementMap.width = canvasWidth;
            displacementMap.height = canvasHeight;

            displacementMap.anchor.set(0.5);

            displacementMap.position.y = canvasHeight / 2;
            displacementMap.position.x = canvasWidth / 2;

            // DISPLACE TIMELINE
            const displacementTimeline = gsap.timeline({
                paused: true,
            });

            const canvasElement = this.images[i].querySelector("canvas");

            displacementTimeline
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
                        duration: 1,
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
                        onComplete: () => {
                        },
                    },
                    "start",
                );

            if(this.options.bindTimelineToScroll === true) {
                const scrollScene = new ScrollScene({
                    triggerElement: this.images[i],
                    triggerHook: 1,
                    duration: '100%',
                    gsap: {
                        timeline: displacementTimeline,
                    },
                });

            } else {
                const scrollScene = new ScrollScene({
                    triggerElement: this.images[i],
                    triggerHook: 0.8,
                    gsap: {
                        timeline: displacementTimeline,
                        reverseSpeed: 2,
                    },
                });
            }

        }
    }
}
