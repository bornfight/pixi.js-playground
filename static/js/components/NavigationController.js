/**
 * "smart" navigation which goes off screen when scrolling down for a better overview of content and UX
 * navigation appears when scrolling up
 */
export default class NavigationController {
    constructor() {
        /**
         * Navigation DOM selectors
         * Navigation DOM state CSS classes
         * @type {{navigation: string, states: {navigationSlideUp: string, navigationScrolled: string, navigationFixed: string}}}
         */

        this.DOM = {
            navigation: ".js-navigation-wrapper",
            states: {
                navigationScrolled: "has-scrolled",
                navigationFixed: "is-fixed",
                navigationSlideUp: "slide-up",
            },
        };

        /**
         * flag, state variable for scrolling event
         * @type {boolean}
         */
        this.scrolling = false;
        /**
         * amount of pixels to scroll from top for adding "has-scrolled" state class
         * @type {number}
         */
        this.scrollNavigationOffset = 200;
        /**
         * variable for storing amount of scroll from top position value
         * @type {number}
         */
        this.previousTop = 0;
        /**
         * variable for storing current scroll position value
         * @type {number}
         */
        this.currentTop = 0;
        this.scrollDelta = 0;
        this.scrollOffset = 0;

        /**
         * fetch navigation element DOM element
         * @type {Element}
         */
        this.navigation = document.querySelector(this.DOM.navigation);
    }

    //region methods
    /**
     *
     */
    init() {
        console.log("Navigation init()");

        if (this.navigation !== null) {
            this.navigationController();
        } else {
            console.error(`${this.DOM.navigation} does not exist in the DOM!`);
        }
    }

    /**
     *
     */
    navigationController() {
        document.addEventListener("scroll", () => {
            if (!this.scrolling) {
                this.scrolling = true;

                if (!window.requestAnimationFrame) {
                    setTimeout(this.checkScroll(), 250);
                } else {
                    requestAnimationFrame(() => this.checkScroll());
                }
            }
        });
    }

    /**
     *
     */
    checkScroll() {
        /**
         *
         * @type {number}
         */
        let currentTop = window.pageYOffset | document.body.scrollTop;

        this.changeNavigationState(currentTop);

        this.previousTop = currentTop;
        this.scrolling = false;
    }

    /**
     *
     * @param currentTop
     */
    changeNavigationState(currentTop) {
        if (currentTop > this.scrollNavigationOffset) {
            this.navigation.classList.add(this.DOM.states.navigationScrolled);
        } else {
            this.navigation.classList.remove(
                this.DOM.states.navigationScrolled,
            );
        }

        if (this.previousTop >= currentTop) {
            this.scrollingUp(currentTop);
        } else {
            this.scrollingDown(currentTop);
        }
    }

    /**
     *
     * @param currentTop
     */
    scrollingUp(currentTop) {
        if (currentTop < this.scrollNavigationOffset) {
            this.navigation.classList.remove(this.DOM.states.navigationSlideUp);
        } else if (this.previousTop - currentTop > this.scrollDelta) {
            this.navigation.classList.remove(this.DOM.states.navigationSlideUp);
        }
    }

    /**
     *
     * @param currentTop
     */
    scrollingDown(currentTop) {
        if (currentTop > this.scrollNavigationOffset + this.scrollOffset) {
            this.navigation.classList.add(this.DOM.states.navigationSlideUp);
        } else if (currentTop > this.scrollNavigationOffset) {
            this.navigation.classList.remove(this.DOM.states.navigationSlideUp);
        }
    }

    //endregion
}
