import * as PIXI from "pixi.js";

import gsap from "gsap";

export default class ThreeDPhotosController {
    /**
     *
     * @param {object} options
     */
    constructor() {
        this.DOM = {
            threeDPhotoContainer: ".js-3d-photo-container",
            threeDPhoto: ".js-3d-photo",
            threeDPhotoCanvas: ".js-3d-photo-canvas",
        };

        this.threeDPhotos = document.querySelectorAll(this.DOM.threeDPhoto);
    }

    init() {
        console.log("ThreeDPhotos init()");

        if (this.threeDPhotos !== null) {
            this.threeDPhotosController();
        } else {
            console.error(`${this.DOM.threeDPhoto} does not exist in the DOM!`);
        }
    }

    threeDPhotosController() {
        for (let i = 0; i < this.threeDPhotos.length; i++) {
            //MOUSEMOVE CONTAINER
            const container = this.threeDPhotos[i].closest(
                this.DOM.threeDPhotoContainer,
            );

            //THRESHOLD
            const verticalThreshold = this.threeDPhotos[i].getAttribute(
                "data-vertical-threshold",
            );
            const horizontalThreshold = this.threeDPhotos[i].getAttribute(
                "data-horizontal-threshold",
            );

            // CANVAS SIZE
            const canvasWidth = this.threeDPhotos[i].clientWidth;
            const canvasHeight = this.threeDPhotos[i].clientHeight;

            // CREATE PIXI APPLICATION
            const app = new PIXI.Application({
                width: canvasWidth,
                height: canvasHeight,
                transparent: true,
                resolution: window.devicePixelRatio,
                resizeTo: this.threeDPhotos[i],
            });

            // ADD CANVAS TO CANVAS WRAPPER ELEMENT
            this.threeDPhotos[i].appendChild(app.view);

            //IMAGE
            const image = PIXI.Sprite.from(
                this.threeDPhotos[i].getAttribute("data-image"),
            );

            image.width = canvasWidth;
            image.height = canvasHeight;

            image.anchor.set(0.5);

            image.position.x = canvasWidth / 2;
            image.position.y = canvasHeight / 2;

            app.stage.addChild(image);

            // //DEPTH MAP
            const depthMap = PIXI.Sprite.from(
                this.threeDPhotos[i].getAttribute("data-depth-map"),
            );
            const depthMapFilter = new PIXI.filters.DisplacementFilter(
                depthMap,
            );

            app.stage.addChild(depthMap);
            app.stage.filters = [depthMapFilter];

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
