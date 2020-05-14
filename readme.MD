wpg-slideshow provides manual slideshow functionality for Wordpress Gutenberg Gallery Blocks without additional plugins.

# Quick Overview

Should work with any Gutenberg version, which supports gallery blocks.

**Installation**

1.  Create **_assets_** folder in the directory for your active wordpress theme.
2.  Copy wpg-slideshow source into **_\assets\wpg-slideshow_**.
3.  Extend **_functions.php_**:

        // Add wpg-slideshow functionality
        add_action('wp_enqueue_scripts', 'wpg_setup');

        function wpg_setup() {
            // Enqueue CSS for wpg-slideshow
            wp_enqueue_style('wpg-slideshow', get_theme_file_uri('/assets/wpg-slideshow/style.css'), NULL, NULL);

            // Enqueue JavaScript for wpg-slideshow
            wp_enqueue_script('wpg-slideshow', get_theme_file_uri('/assets/wpg-slideshow/wpg-slideshow.js'), NULL, NULL, false);
        }

4.  In Wordpress Dashboard, open a post, insert Gallery, goto sidebar "Block" and change settings to:
    - Columns: **1**
    - Crop images: **deactivated**
    - Advanced -> Additional CSS class(es): **wpg-slideshow**
