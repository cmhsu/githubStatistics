var app = function() {
  Chart.defaults.global.showTooltips = false;
  var displayNumbers = {
    one: 10,
    three: 5,
    four: 10,
    five: 10
  };
  var times = {
    one: '>2015-09-12',
    two: '>2015-09-12',
    five: '>2015-09-12'
  };
  var languageThird = 'ruby';
  var languageFourth = 'ruby';
  var queries = [
    'https://api.github.com/search/repositories?q=created:' + times.one + '&sort=stars&per_page=100&page=1',
    'https://api.github.com/search/repositories?q=language:' + languageThird + '&sort=stars&per_page=100&page=1',
    'https://api.github.com/search/users?q=language:' + languageFourth + '&sort=followers&per_page=100&page=1',
    'https://api.github.com/search/repositories?q=created:' + times.five + '&sort=forks&per_page=100&page=1'
  ];
  var queryResult;
  var chartOne;
  var chartTwo;
  var chartThree;
  var chartFour;
  var chartFive;
  var cache = {};
  var currentValues = {};

  function makeRequest(query, chartNumber, queryParam) {
    if (cache[chartNumber] && cache[chartNumber][queryParam]) {
      currentValues[chartNumber] = cache[chartNumber][queryParam];
      if (chartNumber === 'two') {
        displayChart(currentValues[chartNumber].items, chartNumber);
        return;
      } else {
        displayChart(currentValues[chartNumber].items.slice(0, displayNumbers[chartNumber]), chartNumber);
        return;
      }
    }
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
        queryResult = JSON.parse(request.responseText);
        //cache the result so we only do each unique request once.
        if (!cache[chartNumber]) {
          cache[chartNumber] = {};
        }
        cache[chartNumber][queryParam] = queryResult;
        currentValues[chartNumber] = queryResult;
        if (chartNumber === 'two') {
          displayChart(queryResult.items, chartNumber);
        } else {
          displayChart(queryResult.items.slice(0, displayNumbers[chartNumber]), chartNumber);
        }
      }
    };
    request.open('GET', query);
    request.send();
  }

  function changeTime(value, chartNumber) {
    if (value === 'month') {
      times[chartNumber] = '>2015-09-12';
    } else if (value === 'sixMonths') {
      times[chartNumber] = '>2015-04-12';
    } else if (value === 'year') {
      times[chartNumber] = '>2014-10-12';
    }
    if (chartNumber === 'five' || chartNumber === 'two') {
      makeRequest('https://api.github.com/search/repositories?q=created:' + times[chartNumber] + '&sort=forks&per_page=100&page=1', chartNumber, times[chartNumber]);
    } else if (chartNumber === 'one' ) {
      makeRequest('https://api.github.com/search/repositories?q=created:' + times[chartNumber] + '&sort=stars&per_page=100&page=1', chartNumber, times[chartNumber]);
    }
  }

  function changeNumber(value, chartNumber) {
    displayNumbers[chartNumber] = value;
    displayChart(currentValues[chartNumber].items.slice(0, value), chartNumber);
  }

  function displayChart(info, chartNumber) {
    var languages = {};
    if (chartOne && chartNumber === 'one') {
      chartOne.destroy();
    } else if (chartTwo && chartNumber === 'two') {
      chartTwo.destroy();
    } else if (chartThree && chartNumber === 'three') {
      chartThree.destroy();
    } else if (chartFour && chartNumber === 'four') {
      chartFour.destroy();
    } else if (chartFive && chartNumber === 'five') {
      chartFive.destroy();
    }
    var ctx = document.getElementById(chartNumber).getContext('2d');
    var labels = [];
    var data = [];
    if (chartNumber === 'one' || chartNumber === 'three') {
      info.sort(function (a, b) {
        return b.stargazers_count - a.stargazers_count;
      });
      for (var i = 0; i < info.length; i++) {
        labels.push(info[i].name);
        data.push(info[i].stargazers_count);
      }
    } else if (chartNumber === 'two') {
      for (var i = 0; i < info.length; i++) {
        if (!languages[info[i].language]) {
          languages[info[i].language] = 1;
        } else {
          languages[info[i].language]++;
        }
      }
      delete languages[null];
      for (var language in languages) {
        data.push(languages[language]);
        labels.push(language);
      }
      data.sort(function (a, b) {
        return b - a
      });
    } else if (chartNumber === 'four') {
      for (var i = 0; i < info.length; i++) {
        labels.push(info[i].login);
        data.push(1);
      }
    } else if (chartNumber === 'five') {
      for (var i = 0; i < info.length; i++) {
        labels.push(info[i].name);
        data.push(info[i].forks);
      }
    }
    var data = {
      labels: labels,
      datasets: [
        {
          fillColor: '#5AD3D1',
          strokeColor: '#5AD3D1',
          highlightFill: '#5AD3D1',
          highlightStroke: '#5AD3D1',
          data: data
        }
      ]
    };
    if (chartNumber === 'one') {
      chartOne = new Chart(ctx).Bar(data, {
        scaleShowGridLines: false
      });
    } else if (chartNumber === 'two') {
      chartTwo = new Chart(ctx).Bar(data, {
        scaleShowGridLines: false
      });
    } else if (chartNumber === 'three') {
      chartThree = new Chart(ctx).Bar(data, {
        scaleShowGridLines: false
      });
    } else if (chartNumber === 'four') {
      chartFour = new Chart(ctx).Bar(data, {
        scaleShowGridLines: false
      })
    } else if (chartNumber === 'five') {
      chartFive = new Chart(ctx).Bar(data, {
        scaleShowGridLines: false
      });
    }
  }

  function showTooltip(chart) {
    chartTwo.showTooltip(chartTwo.segments, true);
  }

  function changeLanguage(value, className) {
    if (className === 'selectThird') {
      if (value === 'ruby') {
        languageThird = 'ruby';
      } else if (value === 'javascript') {
        languageThird = 'javascript';
      } else if (value === 'python') {
        languageThird = 'python';
      } else if (value === 'objective-c') {
        languageThird = 'objective-c';
      }
      makeRequest('https://api.github.com/search/repositories?q=language:' + languageThird + '&sort=stars&per_page=100&page=1', 'three', languageThird)
    } else if (className === 'selectFourth') {
      if (value === 'ruby') {
        languageFourth = 'ruby';
      } else if (value === 'javascript') {
        languageFourth = 'javascript';
      } else if (value === 'python') {
        languageFourth = 'python';
      } else if (value === 'objective-c') {
        languageFourth = 'objective-c';
      }
      makeRequest('https://api.github.com/search/users?q=language:' + languageFourth + '&sort=followers&per_page=100&page=1', 'four', languageFourth)
    }
  }

  makeRequest(queries[0], 'one', times.one);
  makeRequest(queries[3], 'two', times.two);
  makeRequest(queries[1], 'three', languageThird);
  makeRequest(queries[2], 'four', languageFourth);
  makeRequest(queries[3], 'five', times.five);

  return { //expose methods to global scope.
    changeTime: changeTime,
    changeLanguage: changeLanguage,
    changeNumber: changeNumber
  }
}();