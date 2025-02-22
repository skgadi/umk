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
  state.pos.joint_1 = item.v[0].r[0][0];
  state.pos.joint_2 = item.v[1].r[0][0];
  state.pos.joint_3 = item.v[2].r[0][0];
  state.pos.joint_4 = item.v[3].r[0][0];
  state.pos.joint_5 = item.v[4].r[0][0];
  state.pos.joint_6 = item.v[5].r[0][0];
  const xyzPos = getXYZPosition();
  document.getElementById('ctl-slider').value = val;
  document.getElementById('ctl-info').innerHTML = "t=" +
    limitDecimalsTo3(item.t) +
    "; &beta;<sub>1</sub>=" + limitDecimalsTo3(item.v[0].r[0][0]) +
    "; &beta;<sub>2</sub>=" + limitDecimalsTo3(item.v[1].r[0][0]) +
    "; &beta;<sub>3</sub>=" + limitDecimalsTo3(item.v[2].r[0][0]) +
    "; &beta;<sub>4</sub>=" + limitDecimalsTo3(item.v[3].r[0][0]) +
    "; &beta;<sub>5</sub>=" + limitDecimalsTo3(item.v[4].r[0][0]) +
    "; &beta;<sub>6</sub>=" + limitDecimalsTo3(item.v[5].r[0][0]) +
    "; x<sub>w</sub>=" + limitDecimalsTo3(xyzPos.x) +
    "; y<sub>w</sub>=" + limitDecimalsTo3(xyzPos.y) +
    "; z<sub>w</sub>=" + limitDecimalsTo3(xyzPos.z) +
    ";";
  moveRobot();
}

function limitDecimalsTo3(value) {
  return Math.round(value * 1000) / 1000;
}

function getXYZPosition() {
  const degToRad = Math.PI / 180;
  const beta_1 = state.pos.joint_1 * degToRad;
  const beta_2 = state.pos.joint_2 * degToRad;
  const beta_3 = state.pos.joint_3 * degToRad;
  const theta_1 = beta_1;
  const theta_2 =  Math.PI / 2 - beta_2;
  const theta_3 = beta_3 - Math.PI / 2;
  const theta_2PlusTheta_3 = theta_2 + theta_3;
  const cosTheta_1 = Math.cos(theta_1);
  const sinTheta_1 = Math.sin(theta_1);
  const cosTheta_2 = Math.cos(theta_2);
  const sinTheta_2 = Math.sin(theta_2);
  const cosTheta_1PlusTheta_2 = Math.cos(theta_2PlusTheta_3);
  const sinTheta_1PlusTheta_2 = Math.sin(theta_2PlusTheta_3);
  const d_1 = 0.4865;
  const a_1 = 0.15;
  const a_2 = 0.475;
  const a_3 = 0.6;
  const x = cosTheta_1 * (a_2 * cosTheta_2 + a_3 * cosTheta_1PlusTheta_2) + a_1 * cosTheta_1;
  const y = sinTheta_1 * (a_2 * cosTheta_2 + a_3 * cosTheta_1PlusTheta_2) + a_1 * sinTheta_1;
  const z = d_1 + a_2 * sinTheta_2 + a_3 * sinTheta_1PlusTheta_2;
  return {x, y, z};
}