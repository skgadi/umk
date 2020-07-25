document.getElementById('ctl-slider').onchange = function () {
  setValue(document.getElementById('ctl-slider').value);
}​

function heartBeat() {
  //console.log ("beat");
  setTimeout(() => {
    if (state.isRunning) {
      takeNextStep();
    }
    heartBeat();
  }, state.duration);
}

function takeNextStep() {
  let pValue = document.getElementById('ctl-slider').value;
  if (state.isForward) {
    pValue++;
    if (pValue >= allData.length) {
      pValue = 0;
    }
  } else {
    pValue--;
    if (pValue < 0) {
      if (allData.length > 0) {
        pValue = allData.length - 1;
      } else {
        pValue = 0;
      }
    }
  }
  if (pValue < allData.length) {
    setValue(pValue);
  } else {
    if (allData.length > 0) {
      setValue(0);
    }
  }
}

document.getElementById('play').onclick = function () {
  playButtonOperation(true);
};
document.getElementById('play-back').onclick = function () {
  playButtonOperation(false);
};
document.getElementById('step').onclick = function () {
  state.isForward = true;
  takeNextStep();
};
document.getElementById('step-back').onclick = function () {
  state.isForward = false;
  takeNextStep();
};

function playButtonOperation(isForward) {
  state.isRunning = !state.isRunning;
  state.isForward = isForward;
  if (state.isRunning) {
    document.getElementById('play').innerHTML = '<i class="fas fa-pause fa-fw"></i>';
    document.getElementById('play-back').innerHTML = '<i class="fas fa-pause fa-fw"></i>';
    if (isForward) {
      document.getElementById('play').style.visibility='visible';
      document.getElementById('play-back').style.visibility='hidden';
    } else {
      document.getElementById('play').style.visibility='hidden';
      document.getElementById('play-back').style.visibility='visible';
    }
    document.getElementById('step').style.visibility='hidden';
    document.getElementById('step-back').style.visibility='hidden';
  } else {
    document.getElementById('play').innerHTML = '<i class="fas fa-play fa-fw"></i>';
    document.getElementById('play-back').innerHTML = '<i class="fas fa-play fa-rotate-180 fa-fw"></i>';
    document.getElementById('play').style.visibility='visible';
    document.getElementById('play-back').style.visibility='visible';
    document.getElementById('step').style.visibility='visible';
    document.getElementById('step-back').style.visibility='visible';
  }
}