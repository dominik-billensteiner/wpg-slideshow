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
  ssClassName: string; // Class name of slideshow.
  slideshows: Slideshow[]; // Array of Slideshow class objects.
  slideshowsNodeList: NodeListOf<Element>; // NodeList of slideshows on current page.

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
      let ssID: number = 0;

      // Inject markup for every slideshow
      this.slideshowsNodeList.forEach((slideshow) => {
        // Build ID for slideshow html container
        let ssIDText: string = "wpg-slideshow-" + ssID;
        slideshow.setAttribute("id", ssIDText);

        // Get all WP-Block-Gallery elements
        let containerNodeList: NodeListOf<Element> = slideshow.querySelectorAll(
          ".blocks-gallery-grid"
        );

        // Run trough gallery containers
        containerNodeList.forEach((container) => {
          // Add class to slideshow container
          container.classList.add("wpg-slideshow__container");

          // Get all blocks gallery item (container for images)
          let items: NodeListOf<any> = container.querySelectorAll(
            ".blocks-gallery-item"
          );
          let itemID: number = 0;

          // Add id, wpg slideshow classes and styles to items and imgs
          items.forEach((item) => {
            itemID++;
            item.id = "wpg-slide-" + itemID; // First id has value of 1
            item.classList.add("wpg-slideshow__item");
            item.style.cssText = "margin-bottom: 0!important"; // Overwrite default margin of wp-block-gallery
            item.style.display = itemID === 1 ? "block" : "none"; // Show first img, hide rest

            // Get all imgs and add identification data to markup
            let imgs: NodeListOf<Element> = item.querySelectorAll("img");
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
          let ssObj: Slideshow = new Slideshow(ssID, itemID);
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
  addNavButton(parent: any, btnID: number, btnType: string) {
    // Assign '<' for prev and '>' for next
    let icon = btnType === "prev" ? "&#10094" : "&#10095";

    // Insert button before parent (displays on top of slideshow).
    parent.insertAdjacentHTML(
      "beforebegin",
      `<a id= 'wpg-slideshow-${btnID.toString()}-${btnType}' class='wpg-slideshow__button wpg-slideshow__button--${btnType}'
      data-ssid=${btnID.toString()}>${icon}</a>`
    );
  }

  /**
   * Add event handler for navigation buttons.
   * @param {number} btnID - Button (=slideshow) ID.
   */
  addNavButtonEvents(btnID: number) {
    // Get previous button
    let prevBtn: any = document.getElementById(
      `wpg-slideshow-${btnID.toString()}-prev`
    );

    // Change slide to previous on click
    prevBtn.addEventListener("click", (e: any) => {
      this.changeSlides(prevBtn, -1);
    });

    // Get next button
    let nextBtn: any = document.getElementById(
      `wpg-slideshow-${btnID.toString()}-next`
    );

    // Change slide to next on click
    nextBtn.addEventListener("click", (e: any) => {
      this.changeSlides(nextBtn, 1);
    });
  }

  /**
   * Changes slides to next or previous.
   *
   * @param {Object} btn - Clicked button as html element.
   * @param {Number} changeValue - Value which changes index of slideshow (-1/+1).
   */
  changeSlides(btn: any, changeValue: number) {
    // Get changing slideshow
    let id: number = btn.getAttribute("data-ssid");
    let slideshow: Slideshow = this.slideshows[id];

    // Hide current slide
    let currentSlide: any = document.getElementById(
      `wpg-slide-${slideshow.index}`
    );
    currentSlide.style.display = "none";

    console.log("%c Changing slides:", "color: green; font-weight: bold;");
    console.log(`Current Slide ID: ${slideshow.index}`);
    console.log(`Change Value: ${changeValue}`);

    // Show the newly selected slide
    if (slideshow.index == 1 && changeValue == -1) {
      // Previous button pressed, first slide is shown -> set to last slide
      slideshow.setIndexToLast();
    } else if (slideshow.lastSlideIsShown() && changeValue == 1) {
      // Next button pressed, last slide is shown -> set to first slide
      slideshow.setIndexToFirst();
    } else {
      // Next or previous button pressed, change slide accordingly
      slideshow.changeIndex(changeValue);
    }
    let newSlide: any = document.getElementById(`wpg-slide-${slideshow.index}`);
    newSlide.style.display = "block";

    // Put changed slideshow back on array
    this.slideshows[id] = slideshow;

    console.log(`Next Slide ID: ${slideshow.index}`);
    console.log(`Image Count: ${slideshow.imageCount}`);
  }
}

class Slideshow {
  public id: number;
  public index: number;
  public imageCount: number;
  private _startIndex: number = 1;

  /**
   * @constructor
   * Default constructor.
   *
   * @param {number} id - Slideshow id.
   * @param {number} imageCount - Slideshow image count (or number of slides).
   */
  constructor(id: number, imageCount: number) {
    this.id = id;
    this.index = 1;
    this.imageCount = imageCount;
  }

  /**
   * Given number is added to index.
   */
  changeIndex(index: number) {
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
  lastSlideIsShown(): boolean {
    if (this.index === this.imageCount) return true;
    else return false;
  }
}
