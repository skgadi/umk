const umk_audio = {
  list: {
    blk_hover: new Audio("dependencies/audio/422836__gamedevc__g-ui-button-hover-1.wav"),
    blk_placed: new Audio("dependencies/audio/220191__gameaudio__space-swoosh-brighter.wav"),
    pop_sentPrevData: new Audio("dependencies/audio/242501__gabrielaraujo__powerup-success.wav"),
    pop_openWind: new Audio("dependencies/audio/320181__dland__hint.wav"),
      sim_recPacket: new Audio("dependencies/audio/341695__projectsu012__coins-1.wav"),
    sim_btnPress: new Audio("dependencies/audio/107143__bubaproducer__button-24.wav"),
    sim_finished: new Audio("dependencies/audio/265012__sethlind__toaster-oven-ding.wav"),
  },
  play: function (sound, volume=1) {
    try {
      if (settings.enableAudio) {
        this.list[sound].volume = volume;
        this.list[sound].play();
      }
    } catch (e) {
      console.log(e);
    }
  }
}