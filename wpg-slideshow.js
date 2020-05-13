/**
 * Start slideshow when DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
    var slideshow = new WPGSlideshow();
    slideshow.activate();
});
/**
 * Class to enable slideshow functionality for WP Gallery Blocks.
 */
var WPGSlideshow = /** @class */ (function () {
    /**
     * @constructor
     * Default constructor.
     */
    function WPGSlideshow() {
        // Set classname of slideshow.
        this.ssClassName = "wpg-slideshow";
        // Initialize empty Array.
        this.slideshows = new Array();
        // Get slideshows as Nodelist-Array
        this.slideshowsNodeList = document.querySelectorAll("." + this.ssClassName);
    }
    /**
     * Injects slideshow markup and adds functionality for slideshows.
     */
    WPGSlideshow.prototype.activate = function () {
        var _this = this;
        // Check if the site contains any slideshows
        if (this.slideshowsNodeList) {
            // Identifier for slideshow HTML elements
            var ssID_1 = 0;
            // Inject markup for every slideshow
            this.slideshowsNodeList.forEach(function (slideshow) {
                // Build ID for slideshow html container
                var ssIDText = "wpg-slideshow-" + ssID_1;
                slideshow.setAttribute("id", ssIDText);
                // Get all WP-Block-Gallery elements
                var containerNodeList = slideshow.querySelectorAll(".blocks-gallery-grid");
                // Run trough gallery containers
                containerNodeList.forEach(function (container) {
                    // Add class to slideshow container
                    container.classList.add("wpg-slideshow__container");
                    // Get all blocks gallery item (container for images)
                    var items = container.querySelectorAll(".blocks-gallery-item");
                    var itemID = 0;
                    // Add id, wpg slideshow classes and styles to items and imgs
                    items.forEach(function (item) {
                        itemID++;
                        item.id = "wpg-slide-" + itemID; // First id has value of 1
                        item.classList.add("wpg-slideshow__item");
                        item.style.cssText = "margin-bottom: 0!important"; // Overwrite default margin of wp-block-gallery
                        item.style.display = itemID === 1 ? "block" : "none"; // Show first img, hide rest
                        // Get all imgs and add identification data to markup
                        var imgs = item.querySelectorAll("img");
                        imgs.forEach(function (img) {
                            img.classList.add("wpg-slideshow__img");
                            img.setAttribute("data-ssid", itemID.toString()); // Add slideshow id to image
                            img.setAttribute("data-loaded", "false"); // True if image has loaded
                        });
                    });
                    // Build and add naivgation buttons to slideshow container
                    _this.addNavButton(container, ssID_1, "prev");
                    _this.addNavButton(container, ssID_1, "next");
                    _this.addNavButtonEvents(ssID_1);
                    // Remember slideshow data
                    var ssObj = new Slideshow(ssID_1, itemID);
                    _this.slideshows.push(ssObj);
                });
            });
        }
    };
    /**
     * Add navigations buttons (next/prev) to slideshow container.
     *
     * @param {any} parent - Slideshow container html element.
     * @param {number} number - Slideshow id.
     * @param {string} btnType - Button type ("prev" or "next").
     */
    WPGSlideshow.prototype.addNavButton = function (parent, btnID, btnType) {
        // Assign '<' for prev and '>' for next
        var icon = btnType === "prev" ? "&#10094" : "&#10095";
        // Insert button before parent (displays on top of slideshow).
        parent.insertAdjacentHTML("beforebegin", "<a id= 'wpg-slideshow-" + btnID.toString() + "-" + btnType + "' class='wpg-slideshow__button wpg-slideshow__button--" + btnType + "'\n      data-ssid=" + btnID.toString() + ">" + icon + "</a>");
    };
    /**
     * Add event handler for navigation buttons.
     * @param {number} btnID - Button (=slideshow) ID.
     */
    WPGSlideshow.prototype.addNavButtonEvents = function (btnID) {
        var _this = this;
        // Get previous button
        var prevBtn = document.getElementById("wpg-slideshow-" + btnID.toString() + "-prev");
        // Change slide to previous on click
        prevBtn.addEventListener("click", function (e) {
            _this.changeSlides(prevBtn, -1);
        });
        // Get next button
        var nextBtn = document.getElementById("wpg-slideshow-" + btnID.toString() + "-next");
        // Change slide to next on click
        nextBtn.addEventListener("click", function (e) {
            _this.changeSlides(nextBtn, 1);
        });
    };
    /**
     * Changes slides to next or previous.
     *
     * @param {Object} btn - Clicked button as html element.
     * @param {Number} changeValue - Value which changes index of slideshow (-1/+1).
     */
    WPGSlideshow.prototype.changeSlides = function (btn, changeValue) {
        // Get changing slideshow
        var id = btn.getAttribute("data-ssid");
        var slideshow = this.slideshows[id];
        // Hide current slide
        var currentSlide = document.getElementById("wpg-slide-" + slideshow.index);
        currentSlide.style.display = "none";
        console.log("%c Changing slides:", "color: green; font-weight: bold;");
        console.log("Current Slide ID: " + slideshow.index);
        console.log("Change Value: " + changeValue);
        // Show the newly selected slide
        if (slideshow.index == 1 && changeValue == -1) {
            // Previous button pressed, first slide is shown -> set to last slide
            slideshow.setIndexToLast();
        }
        else if (slideshow.lastSlideIsShown() && changeValue == 1) {
            // Next button pressed, last slide is shown -> set to first slide
            slideshow.setIndexToFirst();
        }
        else {
            // Next or previous button pressed, change slide accordingly
            slideshow.changeIndex(changeValue);
        }
        var newSlide = document.getElementById("wpg-slide-" + slideshow.index);
        newSlide.style.display = "block";
        // Put changed slideshow back on array
        this.slideshows[id] = slideshow;
        console.log("Next Slide ID: " + slideshow.index);
        console.log("Image Count: " + slideshow.imageCount);
    };
    return WPGSlideshow;
}());
var Slideshow = /** @class */ (function () {
    /**
     * @constructor
     * Default constructor.
     *
     * @param {number} id - Slideshow id.
     * @param {number} imageCount - Slideshow image count (or number of slides).
     */
    function Slideshow(id, imageCount) {
        this._startIndex = 1;
        this.id = id;
        this.index = 1;
        this.imageCount = imageCount;
    }
    /**
     * Given number is added to index.
     */
    Slideshow.prototype.changeIndex = function (index) {
        this.index += index;
    };
    /**
     * Index is set to last position (number of images).
     */
    Slideshow.prototype.setIndexToLast = function () {
        this.index = this.imageCount;
    };
    /**
     * Index is set to first position (1).
     */
    Slideshow.prototype.setIndexToFirst = function () {
        this.index = this._startIndex;
    };
    /**
     * Checks if current index is last slide.
     *
     * @return {Boolean} - True if index is last slide.
     */
    Slideshow.prototype.lastSlideIsShown = function () {
        if (this.index === this.imageCount)
            return true;
        else
            return false;
    };
    return Slideshow;
}());
