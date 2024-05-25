/******************************************************************************/
//DashPlayer v0.0.3 (lib v4.7.4)
//(c) 2020 Benjamin Zachey
//related API: http://cdn.dashjs.org/latest/jsdoc/index.html
/******************************************************************************/
function DashPlayer() {
    var player = null;
    var ready = false;
    var ended = false;

    var onReady = function() {
        if (player != null && !ready) {
            ready = true;
            player.setTextTrack(-1);//Disable text track
            TVXVideoPlugin.debug("Dash video ready");
            TVXVideoPlugin.applyVolume();
            TVXVideoPlugin.startPlayback(true);//Accelerated start
        }
    };

    var onError = function(event) {
        if (event != null && event.data != null) {
            var code = event.data.code;
            var message = event.data.message;
            TVXVideoPlugin.error("Dash error: " + code + ": " + message);
        }
    };

    var onTextTrackReady = function() {
        if (player != null) {
            //TVXVideoPlugin.debug("Dash text track ready -> Disable it");
            player.setTextTrack(-1);//Disable text track
        }
    };

    var onEnded = function() {
        if (!ended) {
            ended = true;
            TVXVideoPlugin.debug("Dash video ended");
            TVXVideoPlugin.stopPlayback();
        }
    };

    // Function to get URL parameters
    var getUrlParameter = function(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    this.init = function() {
        player = dashjs.MediaPlayer().create();
        player.initialize();
        player.updateSettings({
            debug: {
                logLevel: dashjs.Debug.LOG_LEVEL_NONE
            }
        });

        // Retrieve DRM parameters from URL
        var keyId = getUrlParameter('keyId');
        var key = getUrlParameter('key');

        // DRM Configuration
        if (keyId && key) {
            player.setProtectionData({
                "org.w3.clearkey": {
                    clearkeys: {
                        [keyId]: key
                    }
                }
            });
        }

        player.on(dashjs.MediaPlayer.events.ERROR, onError, this);
        player.on(dashjs.MediaPlayer.events.CAN_PLAY, onReady, this);
        player.on(dashjs.MediaPlayer.events.TEXT_TRACKS_ADDED, onTextTrackReady, this);
        player.on(dashjs.MediaPlayer.events.PLAYBACK_ENDED, onEnded, this);
    };

    this.ready = function() {
        if (player != null) {
            TVXVideoPlugin.debug("Video plugin ready");
            var url = getUrlParameter('url');
            if (TVXTools.isFullStr(url)) {
                player.attachView(document.getElementById("player"));
                player.attachSource(url);
            } else {
                TVXVideoPlugin.warn("Dash URL is missing or empty");
            }
        } else {
            TVXVideoPlugin.error("Dash player is not initialized");
        }
    };

    this.dispose = function() {
        if (player != null) {
            player.off(dashjs.MediaPlayer.events.ERROR, onError, this);
            player.off(dashjs.MediaPlayer.events.CAN_PLAY, onReady, this);
            player.off(dashjs.MediaPlayer.events.TEXT_TRACKS_ADDED, onTextTrackReady, this);
            player.off(dashjs.MediaPlayer.events.PLAYBACK_ENDED, onEnded, this);
            player = null;
        }
    };

    this.play = function() {
        if (player != null) {
            player.play();
        }
    };

    this.pause = function() {
        if (player != null) {
            player.pause();
        }
    };

    this.stop = function() {
        if (player != null) {
            player.reset();
        }
    };

    this.getDuration = function() {
        if (player != null) {
            return player.duration();
        }
        return 0;
    };

    this.getPosition = function() {
        if (player != null) {
            return player.time();
        }
        return 0;
    };

    this.setPosition = function(position) {
        if (player != null) {
            player.seek(position);
        }
    };

    this.setVolume = function(volume) {
        if (player != null) {
            player.setVolume(volume / 100);
        }
    };

    this.getVolume = function() {
        if (player != null) {
            return player.getVolume() * 100;
        }
        return 100;
    };

    this.setMuted = function(muted) {
        if (player != null) {
            player.setMute(muted);
        }
    };

    this.isMuted = function() {
        if (player != null) {
            return player.isMuted();
        }
        return false;
    };

    this.getSpeed = function() {
        if (player != null) {
            return player.getPlaybackRate();
        }
        return 1;
    };

    this.setSpeed = function(speed) {
        if (player != null) {
            player.setPlaybackRate(speed);
        }
    };

    this.getUpdateData = function() {
        return {
            position: this.getPosition(),
            duration: this.getDuration(),
            speed: this.getSpeed()
        };
    };
}

/******************************************************************************/
//Setup
/******************************************************************************/
TVXPluginTools.onReady(function() {
    TVXVideoPlugin.setupPlayer(new DashPlayer());
    TVXVideoPlugin.init();
});
/******************************************************************************/
