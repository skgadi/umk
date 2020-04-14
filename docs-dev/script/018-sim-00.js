const simVue = new Vue({
    el: "#sim-menu",
    data: {
        mode: "design",
        disp: {
            "run": true,
            "endTime": true,
            "endTime": true,
            "stop": true,
            "pause": true,
            "forward": true,
            "noOfSteps": true
        },
        simSettings: {
            h: 100, //Step size
            T: 5, // Total simulation time
            realtime: false,
            steps: 2
        }
    }
});