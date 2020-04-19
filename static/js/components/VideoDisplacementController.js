import * as PIXI from "pixi.js";

import gsap from "gsap";

export default class VideoDisplacementController {
    constructor() {
        this.DOM = {
            videoContainer: ".js-video-displace-container",
        };

        this.videoContainer = document.querySelector(this.DOM.videoContainer);
    }

    init() {
        console.log("VideoDisplacementController init()");

        if (this.videoContainer !== null) {
            this.videoDisplace();
        } else {
            console.error(
                `${this.DOM.videoContainer} does not exist in the DOM!`,
            );
        }
    }

    videoDisplace() {
        // CANVAS SIZE
        const canvasWidth = this.videoContainer.clientWidth;
        const canvasHeight = this.videoContainer.clientHeight;

        // CREATE PIXI APPLICATION
        const app = new PIXI.Application({
            width: canvasWidth,
            height: canvasHeight,
            transparent: true,
            resolution: window.devicePixelRatio,
        });

        // ADD CANVAS TO CANVAS WRAPPER ELEMENT
        this.videoContainer.appendChild(app.view);

        // DISPLACEMENT MAP
        const displacementMapFile = this.videoContainer.getAttribute(
            "data-displacement-map",
        );
        const displacementMap = PIXI.Sprite.from(displacementMapFile);

        // displacementMap.texture.baseTexture.wrapMode =
        PIXI.WRAP_MODES.REPEAT;
        displacementMap.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.MIRRORED_REPEAT;
        // displacementMap.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.CLAMP;

        displacementMap.name = displacementMapFile;
        displacementMap.scale.y = 0.9;
        displacementMap.scale.x = 0.7;
        displacementMap.x = displacementMap._x = 0;
        displacementMap.y = displacementMap._y = 0;

        const displacementFilter = new PIXI.filters.DisplacementFilter(
            displacementMap,
        );
        // displacementFilter.padding = 30;
        // displacementFilter.scale.x = 65;
        // displacementFilter.scale.y = 65;

        //IMAGE
        const videoFile = this.videoContainer.getAttribute("data-video");
        const video = PIXI.Texture.from(
            videoFile,
        );

        const videoSprite = new PIXI.Sprite(video);

        videoSprite.name = videoFile;
        videoSprite.width = canvasWidth;
        videoSprite.height = canvasHeight;
        video.baseTexture.resource.source.loop = true;

        videoSprite.anchor.set(0.5);

        videoSprite.position.x = canvasWidth / 2;
        videoSprite.position.y = canvasHeight / 2;

        app.stage.addChild(displacementMap);
        app.stage.filterArea = app.screen;
        app.stage.filters = [displacementFilter];
        app.stage.addChild(videoSprite);

        this.initVideoDisplaceEvents(displacementFilter);
    }

    initVideoDisplaceEvents(displacementFilter) {

        window.addEventListener("mousemove", (ev) => {

            let yAmount = ev.clientY / window.innerHeight - 0.5;
            let xAmount = ev.clientX / window.innerWidth - 0.5;

            gsap.to(displacementFilter.scale, {
                duration: 1.2,
                y: yAmount * 200,
                x: xAmount * 200,
                ease: "power3.out",
            });
        });
    }
}
