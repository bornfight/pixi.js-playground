import * as PIXI from "pixi.js";
import gsap from "gsap";

window.PIXI = PIXI;

export default class RGBSplittingController {
    constructor() {
        this.DOM = {
            RGBSplittingContainer: ".js-rgb-splitting-container",
        };

        this.options = {
            canvasWidth: 1600,
            canvasHeight: 900,
        };

        this.RGBSplittingContainer = document.querySelector(
            this.DOM.RGBSplittingContainer,
        );

        this.canvasWidth =
            innerWidth > 800
                ? this.options.canvasWidth
                : this.options.canvasWidth / 2;
        this.canvasHeight =
            innerHeight > 800
                ? this.options.canvasHeight
                : this.options.canvasHeight / 2;

        //PIXI stuff
        this.app = null;
    }

    init() {
        console.log("RGBSplittingController init()");

        if (this.RGBSplittingContainer !== null) {
            this.RGBSplittingController();
        } else {
            console.error(
                `${this.DOM.RGBSplittingContainer} does not exist in the DOM!`,
            );
        }
    }

    RGBSplittingController() {
        let rt = [],
            bg,
            bgs = [],
            rts = [],
            containers = [],
            channelsContainer = [],
            displacementFilters = [],
            brushes = [];

        // CHANNEL FILTERS
        let redChannelFilter = new PIXI.filters.ColorMatrixFilter();
        redChannelFilter.matrix = [
            1,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
        ];

        let greenChannelFilter = new PIXI.filters.ColorMatrixFilter();
        greenChannelFilter.matrix = [
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
        ];

        let blueChannelFilter = new PIXI.filters.ColorMatrixFilter();
        blueChannelFilter.matrix = [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
        ];

        channelsContainer.push(
            redChannelFilter,
            greenChannelFilter,
            blueChannelFilter,
        );

        this.app = new PIXI.Application({
            width: this.canvasWidth,
            height: this.canvasHeight,
            autoStart: false,
            transparent: true,
            //resizeTo: this.RGBSplittingContainer,
        });

        // ADD CANVAS TO CANVAS WRAPPER ELEMENT
        this.RGBSplittingContainer.appendChild(this.app.view);

        for (let i = 0; i < 3; i++) {
            rt.push(
                PIXI.RenderTexture.create(this.app.screen.width, this.app.screen.height),
            );
            rts.push(rt);
        }

        // CONTAINERS //
        let containerRed = new PIXI.Container();
        containerRed.position.x = 0;

        let containerGreen = new PIXI.Container();
        containerGreen.position.x = 0;

        let containerBlue = new PIXI.Container();
        containerBlue.position.x = 0;

        containers.push(containerRed, containerGreen, containerBlue);

        // LOAD TEXTURES //
        this.app.loader.add(
            "bg",
            this.RGBSplittingContainer.getAttribute("data-image"),
        );
        this.app.loader.add(
            "displacement",
            this.RGBSplittingContainer.getAttribute("data-displacement-image"),
        );

        // LOADER //
        this.app.loader.load((loader, resources) => {
            let tempBg = new PIXI.Sprite(resources.bg.texture);
            tempBg.width = this.app.screen.width;
            tempBg.height = this.app.screen.height;

            this.app.renderer.render(tempBg, rt[0]);

            for (let i = 0, len = containers.length; i < len; i++) {
                this.app.stage.addChild(containers[i]);
                brushes.push(new PIXI.Sprite(resources.displacement.texture));
                displacementFilters.push(
                    new PIXI.filters.DisplacementFilter(brushes[i]),
                );

                bg = new PIXI.Sprite(rts[0][0]);
                bgs.push(bg);
                containers[i].filters = [
                    channelsContainer[i],
                    displacementFilters[i],
                ];
                containers[i].addChild(bgs[i], brushes[i]);
            }

            brushes[0].anchor.set(0.5);
            brushes[1].anchor.set(0.6);
            brushes[2].anchor.set(0.4);
            containers[1].filters[1].blendMode = PIXI.BLEND_MODES.ADD;
            containers[2].filters[1].blendMode = PIXI.BLEND_MODES.ADD;

            this.app.stage.interactive = true;

            this.app.stage.on("pointermove", (ev) => {
                let x = ev.data.global.x;
                let y = ev.data.global.y;

                for (let i = 0, len = containers.length; i < len; i++) {
                    gsap.to(displacementFilters[i].scale, {
                        duration: 0.2,
                        x: Math.atan(x - brushes[i].x) * 40,
                        y: Math.atan(y - brushes[i].y) * 40,
                        ease: "power2.out",
                    });

                    brushes[i].position = ev.data.global;
                }
            });

            this.app.start();
        });
    }
}
