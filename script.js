function loadJSON(url, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', url, true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {

            // .open will NOT return a value but simply returns undefined in async mode so use a callback
            callback(JSON.parse(xobj.responseText));
        }
    }
    xobj.send(null);
}

//loadJSON('data.json', function(data) {
//    console.log(data[0]);
//    Plotly.newPlot('corona-plot', data);
//});

loadJSON('data-region.json', function(rawData) {
    // console.log(rawData);
    var regions = {};
    rawData.forEach(dayData => {
      for (let region in dayData.infected) {
        if (!(region in regions)) {
          regions[region] = [];
        }
        const xy = [dayData.date, dayData.infected[region]];
        regions[region].push(xy);
      }
    });

    var data = [];

    for (let region in regions) {
      let trace = {
        x: [],
        y: [],
        name: region,
        type: 'bar'
      };

      regions[region].forEach(xy => {
        trace.x.push(xy[0]);
        trace.y.push(xy[1]);
      });

      data.push(trace);
    }

    const layout = {barmode: 'stack'};

    console.log(data);
    Plotly.newPlot('corona-plot', data, layout);
});
