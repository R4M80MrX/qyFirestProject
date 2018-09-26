var UserDefualt_MusicEffect = "MusicEffect";
var UserDefualt_BackMusic = "BackMusic";

var AudioManager = cc.Class({

    properties: {
        def_path1: "resources/",
        def_path2: "sound/",
        music_path: 'background',
    },
    ctor() {
        this.file_path_map = new Map;
        this.audio_clip_map = {};
        //
        let self = this;
        setTimeout(() => {
            self.preloadAudio();
        }, 2);
    },
    preloadAudio() {
        if (!this.loading && Object.keys(this.audio_clip_map).length == 0) {
            let self = this;
            this.loading = true;
            cc.loader.loadResDir('sound', cc.AudioClip, null, function (error, res_arr, str_arr) {
                self.loading = false;
                if (error) {

                }
                else {
                    str_arr.forEach((str, index) => {
                        str = str.split('/');
                        str = str[str.length - 1];
                        self.audio_clip_map[str] = res_arr[index];
                        self.audio_clip_map[str + '.mp3'] = res_arr[index];
                    });
                }
            });

        }

    },
    //切换
    switchoverAudio() {
        this.switchoverAudioMusic();
        this.switchoverAudioEffect();
    },
    switchoverAudioMusic() {
        this.setPlayMusic(!this.isPlayMusic());
    },
    switchoverAudioEffect() {
        this.setPlayEffects(!this.isPlayEffects());
    },
    isPlayMusic() {
        if (!window.canPlayMusic)
            window.canPlayMusic = LocalDataManager.readBool(UserDefualt_BackMusic, true);
        return window.canPlayMusic;
    },
    isPlayEffects() {
        if (!window.canPlayEffects)
            window.canPlayEffects = LocalDataManager.readBool(UserDefualt_MusicEffect, true);
        return window.canPlayEffects;
    },

    /**
    * Set whether to play background music.
    *
    * @param bPlayMusic false is not play.
    */
    setPlayMusic(bPlayMusic) {
        if (this.isPlayMusic() != bPlayMusic) {
            LocalDataManager.write(UserDefualt_BackMusic, bPlayMusic);
            window.canPlayMusic = bPlayMusic;
            this.playMusic();
        }
    },

    /**
    * Set whether to play effects.
    *
    * @param bPlayEffects false is not play.
    */
    setPlayEffects(bPlayEffects) {
        if (this.isPlayEffects() != bPlayEffects) {
            LocalDataManager.write(UserDefualt_MusicEffect, bPlayEffects);
            window.canPlayEffects = bPlayEffects;
            if (!bPlayEffects) {
                //this.stopAllEffects();
            }
        }
    },

    replaceMusic(music) {
        this.playMusic();
    },
    /**
	* Preload background music.
	*
	* @param filePath The path of the background music file.
	*/
    preloadMusic(filePath, callback = null) {
        cc.audioEngine.preload(filePath, callback);
    },

    /**
    * Play background music.
    *
    * @param filePath The path of the background music file,or the FileName of T_SoundResInfo.
    * @param loop Whether the background music loop or not.
    * @param volume Volume value (range from 0.0 to 1.0).
    * @return An audio ID. It allows you to dynamically change the behavior of an audio instance on the fly.
    *
    * @see `AudioProfile`
    */
    playMusic(filePath, volume = 1) {
        if (this.isPlayMusic()) {
            filePath = filePath || this.music_path;
            //this.stopMusic();
            return this._playMusicAudio(filePath, true, volume);            
        }
        else {
            this.stopMusic();
        }
        return false;
    },
    _playMusicAudio(filePath, loop = false, volume = 1) {

        if (this.audio_clip_map[filePath]) {
            cc.audioEngine.playMusic(this.audio_clip_map[filePath], loop);
            return true;
        }
        else {
            this.preloadAudio();
        }

        return false;
    },
    /**
    * Stop playing background music.
    */
    stopMusic() {
        cc.audioEngine.stopMusic();
    },
    /**
    * Pause playing background music.
    */
    pauseMusic() {
        cc.audioEngine.pauseMusic();
    },
    /**
    * Resume playing background music.
    */
    resumeMusic() {
        cc.audioEngine.resumeMusic();
    },

    /**
    * Play sound effect with a file path, pitch, pan and gain.
    *
    * @param filePath The path of the effect file.
    * @param loop Determines whether to loop the effect playing or not. The default value is false.
    * @param volume Volume value (range from 0.0 to 1.0).
    * @return An audio ID. It allows you to dynamically change the behavior of an audio instance on the fly.
    *
    * @see `AudioProfile`
    */
    play(filePath, loop = false, volume = 1) {
        this.playEffect(filePath, loop, volume);
    },
    playEffect(filePath, loop = false, volume = 1) {
        if (this.isPlayEffects()) {
            return this._playAudio(filePath, loop, volume);

        }
        return false;
    },
    _playAudio(filePath, loop = false, volume = 1) {

        if (this.audio_clip_map[filePath]) {
            cc.audioEngine.play(this.audio_clip_map[filePath], loop, volume);
            return true;
        }
        else {
            this.preloadAudio();
        }

        return false;
    },
    /**
    * Pause all playing sound effect.
    */
    pauseAllEffects() {
        cc.audioEngine.pauseAll();
    },

    /**
    * Resume all playing sound effect.
    */
    resumeAllEffects() {
        cc.audioEngine.resumeAll();
    },

    /**
    * Stop all playing sound effects.
    */
    stopAllEffects() {
        cc.audioEngine.stopAll();
    },

    /**
    * Preload a compressed audio file.
    *
    * The compressed audio will be decoded to wave, then written into an internal buffer in SimpleAudioEngine.
    *
    * @param filePath The path of the effect file.
    * @js NA
    */
    preloadEffect(filePath, callback) {
        cc.audioEngine.preload(filePath, callback);
    },


});

window.AudioManager = new AudioManager();