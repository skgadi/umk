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
    "; &theta;<sub>1</sub>=" + limitDecimalsTo3(item.v[0].r[0][0]) +
    "; &theta;<sub>2</sub>=" + limitDecimalsTo3(item.v[1].r[0][0]) +
    "; &theta;<sub>3</sub>=" + limitDecimalsTo3(item.v[2].r[0][0]) +
    "; &theta;<sub>4</sub>=" + limitDecimalsTo3(item.v[3].r[0][0]) +
    "; &theta;<sub>5</sub>=" + limitDecimalsTo3(item.v[4].r[0][0]) +
    "; &theta;<sub>6</sub>=" + limitDecimalsTo3(item.v[5].r[0][0]) +
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
  const theta_1 = state.pos.joint_1 * degToRad;
  const theta_2 = state.pos.joint_2 * degToRad;
  const theta_3 = state.pos.joint_3 * degToRad;
  const beta_1 = theta_1;
  const beta_2 =  Math.PI / 2 - theta_2;
  const beta_3 = -theta_3 - Math.PI / 2;
  const beta_2PlusBeta_3 = beta_2 + beta_3;
  const cosBeta_1 = Math.cos(beta_1);
  const sinBeta_1 = Math.sin(beta_1);
  const cosBeta_2 = Math.cos(beta_2);
  const sinBeta_2 = Math.sin(beta_2);
  const cosBeta_1PlusBeta_2 = Math.cos(beta_2PlusBeta_3);
  const sinBeta_1PlusBeta_2 = Math.sin(beta_2PlusBeta_3);
  const d_1 = 0.4865;
  const a_1 = 0.15;
  const a_2 = 0.475;
  const a_3 = 0.6;
  const x = cosBeta_1 * (a_2 * cosBeta_2 + a_3 * cosBeta_1PlusBeta_2) + a_1 * cosBeta_1;
  const y = sinBeta_1 * (a_2 * cosBeta_2 + a_3 * cosBeta_1PlusBeta_2) + a_1 * sinBeta_1;
  const z = d_1 + a_2 * sinBeta_2 + a_3 * sinBeta_1PlusBeta_2;
  return {x, y, z};
}