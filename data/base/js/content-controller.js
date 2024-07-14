/******************************************************************************/
//ContentController (Video Plugin Edition)
/******************************************************************************/
function ContentController() {
    var contentWrapper = null;
    var immersiveMode = -1;
    var setupWrapper = function() {
        if (contentWrapper != null && contentWrapper.length > 0) {
            if (immersiveMode == 0) {
                //Reset wrapper
                contentWrapper.css({
                    left: "",
                    top: "",
                    width: "",
                    height: "",
                    marginLeft: "",
                    marginTop: "",
                    transform: ""
                });
            } else if (immersiveMode == 1) {
                //Center wrapper in main frame
                contentWrapper.css({
                    left: "50%",
                    top: "50%",
                    width: TVXSettings.SCREEN_WIDTH + "px",
                    height: TVXSettings.SCREEN_HEIGHT + "px",
                    marginLeft: -Math.floor(TVXSettings.SCREEN_WIDTH / 2) + "px",
                    marginTop: -Math.floor(TVXSettings.SCREEN_HEIGHT / 2) + "px",
                    transform: TVXSettings.ZOOM_FACTOR != 1 ? "scale(" + TVXSettings.ZOOM_FACTOR + ")" : ""
                });
            }
        }
    };
    this.init = function(wrapper) {
        contentWrapper = wrapper;
    };
    this.validate = function() {
        TVXVideoPlugin.onValidatedSettings(function(data) {
            if (data != null &&
                    data.info != null &&
                    data.info.application != null &&
                    data.info.application.settings != null) {
                immersiveMode = TVXTools.strToNum(data.info.application.settings.immersiveMode, -1);
                setupWrapper();
            }
        });
    };
    this.handleEvent = function(data) {
        if (data != null) {
            if (data.event == "app:resize") {
                //Zoom factor may have changed -> Validate settings and setup wrapper
                TVXVideoPlugin.validateSettings(setupWrapper);
            } else if (data.event == "settings:immersive_mode") {
                //Immersive mode has been changed -> Apply value and setup wrapper
                immersiveMode = TVXTools.strToNum(data.value, -1);
                setupWrapper();
            }
        }
    };
}
/******************************************************************************/