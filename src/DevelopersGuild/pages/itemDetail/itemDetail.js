(function () {
    "use strict";

    var dtm = Windows.ApplicationModel.DataTransfer.DataTransferManager;
    var item;
    var start = Windows.UI.StartScreen;
    var storage = Windows.Storage;

    WinJS.UI.Pages.define("/pages/itemDetail/itemDetail.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            item = options && options.item ? Data.resolveItemReference(options.item) : Data.items.getAt(0);
            element.querySelector(".titlearea .pagetitle").textContent = item.group.title;
            element.querySelector("article .item-title").textContent = item.title;
            element.querySelector("article .item-subtitle").textContent = item.subtitle;
            element.querySelector("article .item-image").src = item.backgroundImage;
            element.querySelector("article .item-image").alt = item.subtitle;
            element.querySelector("article .item-content").innerHTML = item.content;
            element.querySelector(".content").focus();

            // Register for datarequested events for sharing
            dtm.getForCurrentView().addEventListener("datarequested", this.onDataRequested);

            // Handle click events from the Pin command
            document.getElementById("pin").addEventListener("click", function (e) {
                var uri = new Windows.Foundation.Uri("ms-appx:///images/logo.png");

                var tile = new start.SecondaryTile(
                    item.key,                                    // Tile ID
                    item.title,                                  // Tile short name
                    item.title,                                  // Tile display name
                    JSON.stringify(Data.getItemReference(item)), // Activation argument
                    start.TileOptions.showNameOnLogo,            // Tile options
                    uri                                          // Tile logo URI
                );

                tile.requestCreateAsync();
            });
        },

        onDataRequested: function (e) {
            var request = e.request;
            request.data.properties.title = item.title;
            request.data.properties.description = "Enterprise Developers Guild";

            // Share item content
            var htmlFormat = Windows.ApplicationModel.DataTransfer.HtmlFormatHelper.createHtmlFormat(item.content);
            request.data.setHtmlFormat(htmlFormat);
        },

        unload: function () {
            WinJS.Navigation.removeEventListener("datarequested", this.onDataRequested);
        }
    });
})();
