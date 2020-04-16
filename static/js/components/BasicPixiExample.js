import * as PIXI from "pixi.js";
import gsap from "gsap";

export default class BasicPixiExample {
    constructor() {
        this.DOM = {
            pixiExample: ".js-pixi-example",
        };

        this.pixiExample = document.querySelector(this.DOM.pixiExample);
    }

    init() {
        console.log("BasicPixiExample init()");

        if (this.BasicPixiExample !== null) {
            this.PIXIExample();
        } else {
            console.error(`${this.DOM.BasicPixiExample} does not exist in the DOM!`);
        }
    }

    PIXIExample() {

        // CANVAS SIZE
        // const canvasWidth = this.pixiExample.clientWidth;
        // const canvasHeight = this.pixiExample.clientHeight;

        // 1. CREATE PIXI APPLICATION
        // const app = new PIXI.Application({
        //     width: canvasWidth,
        //     height: canvasHeight,
        //     transparent: true,
        //     resolution: window.devicePixelRatio,
        //     resizeTo: this.pixiExample,
        // });


        // 2. ADD CANVAS TO CANVAS WRAPPER ELEMENT
        // this.pixiExample.appendChild(app.view);

        // 3. GET IMAGE/TEXTURE AND CREATE SPRITE
        // const imageFile = this.pixiExample.getAttribute("data-image");
        // const image = PIXI.Sprite.from(
        //     imageFile,
        // );

        // 4. SET SPRITE PROPERTIES, POSITION SPRITE ON SCREEN
        // image.name = imageFile; // useful if using PIXI.js dev tools, also can be referenced later in the code
        // image.width = 360; // affects image.scale -> now is set to 0.5
        // image.height = 85;
        // image.anchor.set(0.5);
        // image.position.x = canvasWidth / 2;
        // image.position.y = canvasHeight / 2;

        // 5. ADD OUR IMAGE TO THE STAGE
        // app.stage.addChild(image);

        // 6. CREATE FILTER
        // const blurFilter = new PIXI.filters.BlurFilter();
        // blurFilter.blur = 0;

        // 7. ADD FILTER(s) TO SPRITE
        // image.filters = [blurFilter];

        // 8a. ANIMATE FILTER \W NATIVE TICKER
        // let frames = 0;
        // app.ticker.add(() => {
        //     frames += 0.015;
        //
        //     const blurAmount = Math.cos(frames);
        //
        //     blurFilter.blur = 10 * (blurAmount);
        // });

        // 8b.  ANIMATE FILTERS IMAGE PROPERTIES ON CLICK WITH GSAP
        // this.pixiExample.addEventListener("click", () => {
        //     gsap.to(blurFilter, {
        //         duration: 1,
        //         blur: 10,
        //         yoyo: true,
        //         repeat: 3,
        //         repeatDelay: 1,
        //         ease: "power3.out"
        //     });
        //
        //     gsap.to(image.scale, {
        //         duration: 1,
        //         x: 0.75,
        //         y: 0.75,
        //         ease: "power3.inOut"
        //     });
        // })
    }
}
