/******************************************************************************/
//TemplatePlayer v0.0.8
//(c) 2023 Benjamin Zachey
/******************************************************************************/
function TemplatePlayer() {
    var contentController = new ContentController();
    var type = -1;
    var logger = new TVXLogger();
    var position = 0;//s
    var duration = 60;//s
    var speed = 1;
    this.init = function() {
        contentController.init($(".content-wrapper"));
        type = TVXServices.urlParams.getNum("type", -1);
        logger.registerControl($("#log"));
        logger.debug("Init");
    };
    this.ready = function() {
        contentController.validate();
        logger.debug("Ready");
        //Optionally, load corresponding video info and start playback when loaded
        if (type == 1 || type == 3) {
            TVXVideoPlugin.requestData("video:info", function(data) {
                if (data.video != null && data.video.info != null) {
                    logger.debug("Initial video info: " + TVXTools.serialize(data.video.info));
                    TVXVideoPlugin.startPlayback();
                } else {
                    TVXVideoPlugin.warn("Video info is not available");
                }
            });
        } else {
            TVXVideoPlugin.startPlayback();
        }
    };
    this.dispose = function() {
        logger.debug("Dispose");
    };
    this.getState = function() {
        return TVXVideoState.STOPPED;
    };
    this.play = function() {
        logger.debug("Play");
    };
    this.pause = function() {
        logger.debug("Pause");
    };
    this.stop = function() {
        logger.debug("Stop");
    };
    this.getDuration = function() {
        return duration;
    };
    this.getPosition = function() {
        return position;
    };
    this.setPosition = function(pos) {
        logger.debug("Set position: " + pos);
        position = pos;
        if (position == duration) {
            TVXVideoPlugin.stopPlayback();
        }
    };
    this.setVolume = function(volume) {
        logger.debug("Set volume: " + volume);
    };
    this.getVolume = function() {
        return 100;
    };
    this.setMuted = function(m) {
        logger.debug("Set muted: " + m);
    };
    this.isMuted = function() {
        return false;
    };
    this.getSpeed = function() {
        return speed;
    };
    this.setSpeed = function(s) {
        logger.debug("Set speed: " + s);
        speed = s;
    };
    this.setSize = function(width, height) {
        logger.debug("Set size: " + width + "x" + height);
    };
    this.getUpdateData = function() {
        return {
            position: this.getPosition(),
            duration: this.getDuration(),
            speed: this.getSpeed()
        };
    };
    this.handleEvent = function(data) {
        contentController.handleEvent(data);
        //Only log non-video events
        if (data.event.indexOf("video:") != 0) {
            logger.debug("Handle event: " + TVXTools.serialize(data));
        }
        //Optionally, check video load events
        if ((type == 2 || type == 3) && data.event == "video:load") {
            logger.debug("New video info: " + TVXTools.serialize(data.info));
        }
    };
    this.handleData = function(data) {
        logger.debug("Handle data: " + TVXTools.serialize(data));
    };
    this.handleRequest = function(dataId, data, callback) {
        logger.debug("Handle request: " + dataId);
        logger.debug("Request data: " + TVXTools.serialize(data));
        if (dataId == "error") {
            throw new Error("An error has occurred");
        }
        callback(null);
    };
    this.onError = function(message, error) {
        logger.error(message + ": " + error);
        console.error(error);
    };
}
/******************************************************************************/

/******************************************************************************/
//Setup
/******************************************************************************/
TVXPluginTools.onReady(function() {
    TVXVideoPlugin.setupPlayer(new TemplatePlayer());
    TVXVideoPlugin.init();
});
/******************************************************************************/