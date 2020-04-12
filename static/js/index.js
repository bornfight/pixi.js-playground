import NavigationController from "./components/NavigationController";
import PortfolioListController from "./components/PortfolioListController";
import MagneticCtaController from "./components/MagneticCtaController";
import HotspotsController from "./components/HotspotsController";
import ThreeDImagesController from "./components/ThreeDImagesController";
import LiquidImagesController from "./components/LiquidImagesController";
import RGBSplittingController from "./components/RGBSplittingController";

function ready(callbackFunc) {
    if (document.readyState !== "loading") {
        /**
         * Document is already ready, call the callback directly
         */
        callbackFunc();
    } else if (document.addEventListener) {
        /**
         * All modern browsers to register DOMContentLoaded
         */
        document.addEventListener("DOMContentLoaded", callbackFunc);
    } else {
        /**
         * Old IE browsers
         */
        document.attachEvent("onreadystatechange", function () {
            if (document.readyState === "complete") {
                callbackFunc();
            }
        });
    }
}

/**
 * Document ready callback
 */
ready(function () {

    const navigation = new NavigationController();
    navigation.init();

    var consoleLogStyle = [
        "background-color: #000000",
        "color: white",
        "display: block",
        "line-height: 24px",
        "text-align: center",
        "border: 1px solid #ffffff",
        "font-weight: bold",
    ].join(";");

    console.log("dev by: %c Bornfight ", consoleLogStyle);

    if (document.getElementById("portfolio") !== null) {
        const portfolioList = new PortfolioListController();
        portfolioList.init();
    }

    if (document.getElementById("hotspots") !== null) {
        const magneticCta = new MagneticCtaController();
        magneticCta.init();

        const hotspots = new HotspotsController();
        hotspots.init();
    }

    if (document.getElementById("faux-3d") !== null) {
        const threeDImages = new ThreeDImagesController();
        threeDImages.init();
    }

    if (document.getElementById("rgb-splitting") !== null) {
        const RGBSplitting = new RGBSplittingController();
        RGBSplitting.init();
    }

    if (document.getElementById("image-reveal") !== null) {
        const liquidImages = new LiquidImagesController();
        liquidImages.init();
    }
});
