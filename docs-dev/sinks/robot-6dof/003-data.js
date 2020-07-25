var allData = [];


function updateData(data) {
  allData = allData.concat(data);
  allData = allData.slice(-settings.limitData);
  updateLimits();

  // console.log(allData);
}

function restThedata() {
  allData = [];
}

function updateLimits() {
  var slider = document.getElementById('ctl-slider');
  if (allData.length > 0) {
    slider.max = allData.length - 1;
    if (state.t < allData[0].t) {
      setValue(0);
    }
  } else {
    setValue(0);
  }
  if (allData.length >= 2) {
    let PossibleDuration = Math.round((allData[1].t - allData[0].t) * 1000);
    if (PossibleDuration >= 1) {
      state.duration = PossibleDuration;
    }
  }
}

function setValue(val) {
  const item = allData[val];
  document.getElementById('ctl-slider').value = val;
  document.getElementById('ctl-info').innerHTML = "t=" +
    limitDecimalsTo3(item.t) +
    "; &theta;1=" + limitDecimalsTo3(item.v[0].r[0][0]) +
    "; &theta;2=" + limitDecimalsTo3(item.v[1].r[0][0]) +
    "; &theta;3=" + limitDecimalsTo3(item.v[2].r[0][0]) +
    "; &theta;4=" + limitDecimalsTo3(item.v[3].r[0][0]) +
    "; &theta;5=" + limitDecimalsTo3(item.v[4].r[0][0]) +
    "; &theta;6=" + limitDecimalsTo3(item.v[5].r[0][0]) + ";";
  state.pos.joint_1 = item.v[0].r[0][0];
  state.pos.joint_2 = item.v[1].r[0][0];
  state.pos.joint_3 = item.v[2].r[0][0];
  state.pos.joint_4 = item.v[3].r[0][0];
  state.pos.joint_5 = item.v[4].r[0][0];
  state.pos.joint_6 = item.v[5].r[0][0];
  moveRobot();
}

function limitDecimalsTo3(value) {
  return Math.round(value * 1000) / 1000;
}