import * as PIXI from "pixi.js";

import gsap from "gsap";

export default class ThreeDImagesController {
    constructor() {
        this.DOM = {
            threeDImageContainer: ".js-3d-image-container",
            threeDImage: ".js-3d-image",
            threeDImageCanvas: ".js-3d-image-canvas",
        };

        this.threeDImages = document.querySelectorAll(this.DOM.threeDImage);
    }

    init() {
        console.log("ThreeDImages init()");

        if (this.threeDImages !== null) {
            this.threeDImagesController();
        } else {
            console.error(`${this.DOM.threeDImage} does not exist in the DOM!`);
        }
    }

    threeDImagesController() {
        for (let i = 0; i < this.threeDImages.length; i++) {
            //MOUSEMOVE CONTAINER
            const container = this.threeDImages[i].closest(
                this.DOM.threeDImageContainer,
            );

            //THRESHOLD
            const verticalThreshold = this.threeDImages[i].getAttribute(
                "data-vertical-threshold",
            );
            const horizontalThreshold = this.threeDImages[i].getAttribute(
                "data-horizontal-threshold",
            );

            // CANVAS SIZE
            const canvasWidth = this.threeDImages[i].clientWidth;
            const canvasHeight = this.threeDImages[i].clientHeight;

            // CREATE PIXI APPLICATION
            const app = new PIXI.Application({
                width: canvasWidth,
                height: canvasHeight,
                transparent: true,
                resolution: window.devicePixelRatio,
                resizeTo: this.threeDImages[i],
            });

            // ADD CANVAS TO CANVAS WRAPPER ELEMENT
            this.threeDImages[i].appendChild(app.view);

            //IMAGE
            const imageFile = this.threeDImages[i].getAttribute("data-image");
            const image = PIXI.Sprite.from(
                imageFile,
            );

            image.name = imageFile;
            image.width = canvasWidth;
            image.height = canvasHeight;

            image.anchor.set(0.5);

            image.position.x = canvasWidth / 2;
            image.position.y = canvasHeight / 2;

            app.stage.addChild(image);

            // //DEPTH MAP
            const depthMapName = this.threeDImages[i].getAttribute("data-depth-map");
            const depthMap = PIXI.Sprite.from(
                depthMapName,
            );
            const depthMapFilter = new PIXI.filters.DisplacementFilter(
                depthMap,
            );

            app.stage.addChild(depthMap);
            app.stage.filters = [depthMapFilter];

            depthMap.name = depthMapName;
            depthMap.width = canvasWidth;
            depthMap.height = canvasHeight;

            depthMap.anchor.set(0.5);

            depthMap.position.y = canvasHeight / 2;
            depthMap.position.x = canvasWidth / 2;

            depthMapFilter.scale.x = 2;
            depthMapFilter.scale.y = 2;

            //EVENTS
            this.initThreeDEvents(
                container,
                depthMapFilter,
                horizontalThreshold,
                verticalThreshold,
            );
        }
    }

    /**
     *
     * @param {HTMLElement} container
     * @param {PIXI.filters.DisplacementFilter} displacementFilter
     * @param {number} horizontalThreshold
     * @param {number} verticalThreshold
     */
    initThreeDEvents(
        container,
        displacementFilter,
        horizontalThreshold,
        verticalThreshold,
    ) {
        container.addEventListener("mousemove", (ev) => {
            let yAmount = ev.clientY / window.innerHeight - 0.5;
            let xAmount = ev.clientX / window.innerWidth - 0.5;

            gsap.to(displacementFilter.scale, {
                duration: 2,
                y: yAmount * verticalThreshold,
                x: xAmount * horizontalThreshold,
                ease: "power3.out",
            });

            // displacementFilter.scale.x = xAmount * horizontalThreshold;
            // displacementFilter.scale.y = yAmount * verticalThreshold;
        });
    }
}
