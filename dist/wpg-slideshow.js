"use strict";
/**
 * Start slideshow when DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
    let slideshow = new WPGSlideshow();
    slideshow.activate();
});
/**
 * Class to enable slideshow functionality for WP Gallery Blocks.
 */
class WPGSlideshow {
    /**
     * @constructor
     * Default constructor.
     */
    constructor() {
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
    activate() {
        // Check if the site contains any slideshows
        if (this.slideshowsNodeList) {
            // Identifier for slideshow HTML elements
            let ssID = 0;
            // Inject markup for every slideshow
            this.slideshowsNodeList.forEach((slideshow) => {
                // Build ID for slideshow html container
                let ssIDText = "wpg-slideshow-" + ssID;
                slideshow.setAttribute("id", ssIDText);
                // Get all WP-Block-Gallery elements
                let containerNodeList = slideshow.querySelectorAll(".blocks-gallery-grid");
                // Run trough gallery containers
                containerNodeList.forEach((container) => {
                    // Add class to slideshow container
                    container.classList.add("wpg-slideshow__container");
                    // Get all blocks gallery item (container for images)
                    let items = container.querySelectorAll(".blocks-gallery-item");
                    let itemID = 0;
                    // Add id, wpg slideshow classes and styles to items and imgs
                    items.forEach((item) => {
                        itemID++;
                        item.id = "wpg-slide-" + itemID; // First id has value of 1
                        item.classList.add("wpg-slideshow__item");
                        item.style.cssText = "margin-bottom: 0!important"; // Overwrite default margin of wp-block-gallery
                        item.style.display = itemID === 1 ? "block" : "none"; // Show first img, hide rest
                        // Get all imgs and add identification data to markup
                        let imgs = item.querySelectorAll("img");
                        imgs.forEach((img) => {
                            img.classList.add("wpg-slideshow__img");
                            img.setAttribute("data-ssid", itemID.toString()); // Add slideshow id to image
                            img.setAttribute("data-loaded", "false"); // True if image has loaded
                        });
                    });
                    // Build and add naivgation buttons to slideshow container
                    this.addNavButton(container, ssID, "prev");
                    this.addNavButton(container, ssID, "next");
                    this.addNavButtonEvents(ssID);
                    // Remember slideshow data
                    let ssObj = new Slideshow(ssID, itemID);
                    this.slideshows.push(ssObj);
                });
            });
        }
    }
    /**
     * Add navigations buttons (next/prev) to slideshow container.
     *
     * @param {any} parent - Slideshow container html element.
     * @param {number} number - Slideshow id.
     * @param {string} btnType - Button type ("prev" or "next").
     */
    addNavButton(parent, btnID, btnType) {
        // Assign '<' for prev and '>' for next
        let icon = btnType === "prev" ? "&#10094" : "&#10095";
        // Insert button before parent (displays on top of slideshow).
        parent.insertAdjacentHTML("beforebegin", `<a id= 'wpg-slideshow-${btnID.toString()}-${btnType}' class='wpg-slideshow__button wpg-slideshow__button--${btnType}'
      data-ssid=${btnID.toString()}>${icon}</a>`);
    }
    /**
     * Add event handler for navigation buttons.
     * @param {number} btnID - Button (=slideshow) ID.
     */
    addNavButtonEvents(btnID) {
        // Get previous button
        let prevBtn = document.getElementById(`wpg-slideshow-${btnID.toString()}-prev`);
        // Change slide to previous on click
        prevBtn.addEventListener("click", (e) => {
            this.changeSlides(prevBtn, -1);
        });
        // Get next button
        let nextBtn = document.getElementById(`wpg-slideshow-${btnID.toString()}-next`);
        // Change slide to next on click
        nextBtn.addEventListener("click", (e) => {
            this.changeSlides(nextBtn, 1);
        });
    }
    /**
     * Changes slides to next or previous.
     *
     * @param {Object} btn - Clicked button as html element.
     * @param {Number} changeValue - Value which changes index of slideshow (-1/+1).
     */
    changeSlides(btn, changeValue) {
        // Get changing slideshow
        let id = btn.getAttribute("data-ssid");
        let slideshow = this.slideshows[id];
        // Hide current slide
        let currentSlide = document.getElementById(`wpg-slide-${slideshow.index}`);
        currentSlide.style.display = "none";
        console.log("%c Changing slides:", "color: green; font-weight: bold;");
        console.log(`Current Slide ID: ${slideshow.index}`);
        console.log(`Change Value: ${changeValue}`);
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
        let newSlide = document.getElementById(`wpg-slide-${slideshow.index}`);
        newSlide.style.display = "block";
        // Put changed slideshow back on array
        this.slideshows[id] = slideshow;
        console.log(`Next Slide ID: ${slideshow.index}`);
        console.log(`Image Count: ${slideshow.imageCount}`);
    }
}
class Slideshow {
    /**
     * @constructor
     * Default constructor.
     *
     * @param {number} id - Slideshow id.
     * @param {number} imageCount - Slideshow image count (or number of slides).
     */
    constructor(id, imageCount) {
        this._startIndex = 1;
        this.id = id;
        this.index = 1;
        this.imageCount = imageCount;
    }
    /**
     * Given number is added to index.
     */
    changeIndex(index) {
        this.index += index;
    }
    /**
     * Index is set to last position (number of images).
     */
    setIndexToLast() {
        this.index = this.imageCount;
    }
    /**
     * Index is set to first position (1).
     */
    setIndexToFirst() {
        this.index = this._startIndex;
    }
    /**
     * Checks if current index is last slide.
     *
     * @return {Boolean} - True if index is last slide.
     */
    lastSlideIsShown() {
        if (this.index === this.imageCount)
            return true;
        else
            return false;
    }
}
