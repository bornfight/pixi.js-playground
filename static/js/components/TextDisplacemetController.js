import * as PIXI from "pixi.js";

import gsap from "gsap";

export default class TextDisplacementController {
    constructor() {
        this.DOM = {
            textContainer: ".js-text-displace-container",
            textValue: ".js-text-displace-value",
        };

        this.textContainers = document.querySelectorAll(this.DOM.textContainer);
    }

    init() {
        console.log("TextDisplacementController init()");

        if (this.textContainers !== null) {
            this.textDisplace();
        } else {
            console.error(
                `${this.DOM.textContainer} does not exist in the DOM!`,
            );
        }
    }

    textDisplace() {
        for (let i = 0; i < this.textContainers.length; i++) {
            // CANVAS SIZE
            const canvasWidth = this.textContainers[i].clientWidth;
            const canvasHeight = this.textContainers[i].clientHeight;

            // CREATE PIXI APPLICATION
            this.app = new PIXI.Application({
                width: canvasWidth,
                height: canvasHeight,
                transparent: true,
                resolution: window.devicePixelRatio,
            });

            // ADD CANVAS TO CANVAS WRAPPER ELEMENT
            this.textContainers[i].appendChild(this.app.view);

            // DISPLACEMENT MAP
            const displacementMapFile = this.textContainers[i].getAttribute(
                "data-displacement-map",
            );
            const displacementMap = PIXI.Sprite.from(displacementMapFile);

            // displacementMap.texture.baseTexture.wrapMode =
                PIXI.WRAP_MODES.REPEAT;
            displacementMap.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.MIRRORED_REPEAT;
            // displacementMap.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.CLAMP;

            displacementMap.scale.y = 0.9;
            displacementMap.scale.x = 0.7;
            displacementMap.x = displacementMap._x = 0;
            displacementMap.y = displacementMap._y = 0;

            const displacementFilter = new PIXI.filters.DisplacementFilter(
                displacementMap,
            );
            displacementFilter.padding = 30;
            displacementFilter.scale.x = 65;
            displacementFilter.scale.y = 65;

            //TEXT
            const textValue = this.textContainers[i].querySelector(
                this.DOM.textValue,
            ).textContent;

            const style = new PIXI.TextStyle({
                fontFamily: '"RobotoMono-Regular"',
                fill: 0xffffff,
                align: "left",
                wordWrap: true,
                wordWrapWidth: this.textContainers[i].clientWidth,
                whiteSpace: "normal",
                fontSize: 24,
                lineHeight: 32,
                padding: 60,
            });

            const text = new PIXI.Text(`${textValue}`, style);
            text.filters = [displacementFilter];
            text.position.x = 30;
            text.position.y = 30;

            this.app.stage.addChild(displacementMap);
            this.app.stage.addChild(text);

            this.initTextDisplaceEvents(displacementFilter);
        }
    }

    initTextDisplaceEvents(displacementFilter) {
        window.addEventListener("mousemove", (ev) => {
            let yAmount = ev.clientY / window.innerHeight - 0.5;
            let xAmount = ev.clientX / window.innerWidth - 0.5;

            gsap.to(displacementFilter.scale, {
                duration: 1.2,
                y: yAmount * 100,
                x: xAmount * 150,
                ease: "power3.out",
            });
        });
    }
}
