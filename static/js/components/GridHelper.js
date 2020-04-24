export default class GridHelper {
    /**
     *
     */
    constructor() {
        this.DOM = {
            grid: "grid",
        };

        this.gridOptions = {
            gridWidth: 1440, // px
            columnCount: 24,
            gridColor: "rgb(255, 0, 255, 0.15)",
            gutterWidth: 0, // px
            gutterFixed: false,
            initialDisplay: "none", //"flex" or "none"
        };

        this.grid = null;

        this.columnWidth =
            (this.gridOptions.gridWidth -
                (this.gridOptions.columnCount - 1) *
                    this.gridOptions.gutterWidth) /
            this.gridOptions.columnCount;

        this.columnWidthPercentage = `${(this.columnWidth /
            this.gridOptions.gridWidth) *
            100}%`;

        this.gutterWidthPercentage = `${(this.gridOptions.gutterWidth /
            this.gridOptions.gridWidth) *
            100}%`;
    }

    init() {
        console.log("GridHelper init()");
        this.initGrid();
        this.keyboardShortcut();
    }

    initGrid() {
        // create grid overlay element
        this.grid = document.createElement("div");
        this.grid.id = this.DOM.grid;

        // style grid element
        this.grid.style.cssText = `
            pointer-events: none;
            display: ${this.gridOptions.initialDisplay};
            flex-direction: row;
            width: 100%;
            max-width: ${this.gridOptions.gridWidth}px;
            height: 100%;
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
        `;

        if (!this.gridOptions.gutterWidth > 0) {
            this.grid.style.borderLeft = "none";
        }

        // add grid container to page
        document.body.appendChild(this.grid);

        // add columns to grid
        for (var i = 0; i < this.gridOptions.columnCount; i++) {
            var column = document.createElement("i");
            this.grid.appendChild(column);

            column.style.cssText = `
                height: auto;
                flex-grow: 1;
                border-left: 1px solid ${this.gridOptions.gridColor};
            `;

            if (this.gridOptions.gutterWidth > 0) {
                column.style.borderRight = `1px solid ${this.gridOptions.gridColor}`;
            }

            if (this.gridOptions.gutterFixed === true) {
                column.style.marginRight = `${this.gridOptions.gutterWidth}px`;
            } else {
                column.style.marginRight = this.gutterWidthPercentage;
                column.style.width = this.columnWidthPercentage;
            }
        }

        this.grid.lastChild.style.marginRight = 0;
    }

    /**
     *
     */
    keyboardShortcut() {
        document.addEventListener("keyup", (ev) => {
            if (ev.keyCode === 71 && ev.altKey) {
                if (this.grid.style.display === "none") {
                    this.grid.style.display = "flex";
                } else {
                    this.grid.style.display = "none";
                }
            }
        });
    }
}
