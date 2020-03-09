function loadJSON(url, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType('application/json');
    xobj.open('GET', url, true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == '200') {

            // .open will NOT return a value but simply returns undefined in async mode so use a callback
            callback(JSON.parse(xobj.responseText));
        }
    }
    xobj.send(null);
}

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
    var totals = {};

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
        if (!(xy[0] in totals)) {
          totals[xy[0]] = xy[1];
        } else {
          totals[xy[0]] = totals[xy[0]] + xy[1];
        }
      });

      data.push(trace);
    }

    totalsTrace = {
      x: [],
      y: [],
      text: [],
      name: 'Totalt',
      mode: 'lines+text',
      textposition: 'top center',
      hoverinfo: 'skip',
      line: {
        shape: 'spline',
        color: 'rgb(40, 40, 40)',
        width: 1,
      },
      type: 'scatter'
    };

    for (let date in totals) {
      totalsTrace.x.push(date);
      totalsTrace.y.push(totals[date]);
      totalsTrace.text.push(totals[date]);
    }

    data.push(totalsTrace);

    const layout = {
      title: 'Bekräftade fall av COVID-19 i Sverige, per region',
      barmode: 'stack',
      colorway: ['#5899DA', '#E8743B', '#19A979', '#ED4A7B', '#945ECF', '#13A4B4', '#525DF4', '#BF399E', '#6C8893', '#EE6868', '#2F6497'],
    };

    // console.log(data);
    Plotly.newPlot('corona-plot', data, layout);
});
