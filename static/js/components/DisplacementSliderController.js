import * as PIXI from "pixi.js";
import gsap from "gsap";
import Swiper from "swiper";

export default class PortfolioListController {
    constructor() {
        /**
         * Navigation DOM selectors
         * Navigation DOM state CSS classes
         * @type {{navigation: string, states: {navigationSlideUp: string, navigationScrolled: string, navigationFixed: string}}}
         */

        this.DOM = {
            sliderContainer: ".js-displacement-slider-container",
            slider: ".js-displacement-slider",
            sliderPrevious: ".js-displacement-slider-previous",
            sliderNext: ".js-displacement-slider-next",
            sliderCanvas: ".js-displacement-canvas",
            sliderImagesList: ".js-displacement-slider-image-list",
            sliderImage: ".js-displacement-slider-image",
        };

        this.options = {
            transitionSpeed: 800,
        };

        /**
         *
         * @type {Element}
         */
        this.sliderContainer = document.querySelector(this.DOM.sliderContainer);

        /**
         *
         * @type {Element}
         */
        this.slider = document.querySelector(this.DOM.slider);

        /**
         *
         * @type {Element}
         */
        this.sliderPrevious = document.querySelector(this.DOM.sliderPrevious);

        /**
         *
         * @type {Element}
         */
        this.sliderNext = document.querySelector(this.DOM.sliderNext);

        /**
         *
         * @type {Element}
         */
        this.sliderCanvas = document.querySelector(this.DOM.sliderCanvas);

        /**
         *
         * @type {Element}
         */
        this.sliderImagesList = document.querySelector(
            this.DOM.sliderImagesList,
        );

        /**
         *
         * @type {NodeListOf<Element>}
         */
        this.sliderImages = document.querySelectorAll(this.DOM.sliderImage);

        //PIXI stuff
        this.app = null;
        this.displacementFilter = null;
        this.slidesContainer = null;

        //gsap stuff
        this.displacementTimeline = null;
    }

    //region methods

    init() {
        console.log("DisplacementSliderController init()");

        if (this.slider !== null) {
            this.sliderController();
            this.initSlider();
        } else {
            console.error(`${this.DOM.slider} does not exist in the DOM!`);
        }
    }

    initSlider() {
        let displacementSlider = new Swiper(this.DOM.slider, {
            init: false,
            speed: this.options.transitionSpeed,
            navigation: {
                nextEl: this.DOM.sliderNext,
                prevEl: this.DOM.sliderPrevious,
            },
            effect: "fade",
            fadeEffect: {
                crossFade: true,
            },
        });

        console.log(displacementSlider.realIndex);
        console.log(displacementSlider.activeIndex);

        displacementSlider.on("init", () => {
            // console.log(displacementSlider.activeIndex);
            this.changeSlide(displacementSlider.activeIndex);
        });

        displacementSlider.on("slideChange", () => {
            // console.log(displacementSlider.activeIndex);
            this.changeSlide(displacementSlider.activeIndex);
        });

        displacementSlider.init();
    }

    sliderController() {
        // predefine canvas element dimensions in px 16:9
        const canvasWidth = 1000 * 1.25;
        const canvasHeight = 563 * 1.25;

        // assign/create new PIXI application which automatically creates the renderer, ticker, and root container/stage
        this.app = new PIXI.Application({
            width: canvasWidth,
            height: canvasHeight,
            resolution: window.devicePixelRatio,
            transparent: true,
        });

        // add PIXI canvas element to our DOM element
        this.sliderCanvas.appendChild(this.app.view);

        const displacementMapFile = this.sliderCanvas.getAttribute(
            "data-displacement-map",
        );

        // create displacement texture
        const displacementMap = new PIXI.Sprite.from(displacementMapFile);

        // create PIXI displacement filter and pass the texture
        this.displacementFilter = new PIXI.filters.DisplacementFilter(
            displacementMap,
        );

        // set displacement texture properties
        displacementMap.name = displacementMapFile;
        displacementMap.anchor.set(0.5);
        displacementMap.scale.set(1);
        displacementMap.width = canvasWidth;
        displacementMap.height = canvasHeight;
        displacementMap.position.set(canvasWidth / 2, canvasHeight / 2);

        this.slidesContainer = new PIXI.Container();
        // set stage properties for filter
        this.slidesContainer.filterArea = this.app.screen;
        this.slidesContainer.filters = [this.displacementFilter];

        // add filter to root container/stage
        this.app.stage.addChild(displacementMap);
        // add slides container root container/stage
        this.app.stage.addChild(this.slidesContainer);

        // load images from DOM to PIXI container
        for (let i = 0; i < this.sliderImages.length; i++) {
            //create texture
            const imageFile = this.sliderImages[i].getAttribute("data-image");

            const texture = new PIXI.Texture.from(imageFile);

            // create sprite and pass the texture
            const image = new PIXI.Sprite(texture);

            //set sprites properties
            image.name = imageFile;
            image.alpha = 1;
            image.width = canvasWidth;
            image.height = canvasHeight;

            // add sprites to root container/stage
            this.slidesContainer.addChild(image);
        }

        // DISPLACE TIMELINE
        this.displacementTimeline = gsap.timeline({
            paused: true,
        });

        const canvasElement = this.sliderCanvas.querySelector("canvas");

        this.displacementTimeline
            .add("in")
            .to(
                this.displacementFilter.scale,
                {
                    duration: this.options.transitionSpeed / 1000,
                    x: -200,
                    y: -200,
                    ease: "power3.out",
                },
                "in",
            )
            .to(
                canvasElement,
                {
                    scale: 1.05,
                    duration: this.options.transitionSpeed / 1000,
                    ease: "power3.out",
                },
                "in",
            )
            .add("out")
            .to(
                canvasElement,
                {
                    scale: 1,
                    duration: this.options.transitionSpeed / 1000,
                    ease: "power3.out",
                },
                "out",
            )
            .to(
                this.displacementFilter.scale,
                {
                    duration: this.options.transitionSpeed / 1000,
                    x: 0,
                    y: 0,
                    ease: "power3.out",
                },
                "out",
            );
    }

    changeSlide(currentIndex) {
        gsap.to(this.slidesContainer.children, {
            duration: (this.options.transitionSpeed * 2) / 1000,
            alpha: 0,
            ease: "power3.out",
            onStart: () => {
                this.displacementTimeline.restart().pause();
                this.displacementTimeline.play();
            },
        });

        gsap.to(this.slidesContainer.children[currentIndex], {
            duration: (this.options.transitionSpeed * 2) / 1000,
            alpha: 1,
            ease: "power3.out",
        });
    }

    //endregion
}
