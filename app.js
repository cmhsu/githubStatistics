var app = function() {
  Chart.defaults.global.showTooltips = false;
  var displayNumberOne = 10;
  var displayNumberThree = 5;
  var displayNumberFour = 10;
  var displayNumberFive = 10;
  var languageThird = 'ruby';
  var languageFourth = 'ruby';
  var queries = [
    'https://api.github.com/search/repositories?q=created:' + time + '&sort=stars&per_page=100&page=1',
    'https://api.github.com/search/repositories?q=language:' + languageThird + '&sort=stars&per_page=100&page=1',
    'https://api.github.com/search/users?q=language:' + languageFourth + '&sort=followers&per_page=100&page=1',
    'https://api.github.com/search/repositories?q=created:' + timeFive + '&sort=forks&per_page=100&page=1'
  ];
  var queryResult;
  var chartOne;
  var chartTwo;
  var chartThree;
  var chartFour;
  var chartFive;
  var chartOneCache = {};
  var chartTwoCache = {};
  var chartThreeCache = {};
  var chartFourCache = {};
  var chartFiveCache = {};
  var oneCurrentValues;
  var twoCurrentValues;
  var threeCurrentValues;
  var fourCurrentValues;
  var fiveCurrentValues;
  var time = '>2015-09-12';
  var timeTwo = '>2015-09-12';
  var timeFive = '>2015-09-12';

  function makeRequest(query, chartNumber, queryParam) {
    if (chartNumber === 'one') {
      //check if we have the cached value of the request already
      if (chartOneCache[queryParam]) {
        oneCurrentValues = chartOneCache[queryParam];
        displayChartOneThreeFourFive(chartOneCache[queryParam].items.slice(0, displayNumberOne), 'one');
        return;
      }
    } else if (chartNumber === 'two') {
      if (chartTwoCache[queryParam]) {
        twoCurrentValues = chartTwoCache[queryParam];
        displayChartTwo(chartTwoCache[queryParam].items);
        return;
      }
    } else if (chartNumber === 'three') {
      if (chartThreeCache[queryParam]) {
        threeCurrentValues = chartThreeCache[queryParam];
        displayChartOneThreeFourFive(chartThreeCache[queryParam].items.slice(0, displayNumberThree), 'three');
        return;
      }
    } else if (chartNumber === 'four') {
      if (chartFourCache[queryParam]) {
        fourCurrentValues = chartFourCache[queryParam];
        displayChartOneThreeFourFive(chartFourCache[queryParam].items.slice(0, displayNumberFour), 'four');
        return;
      }
    } else if (chartNumber === 'five') {
      if (chartFiveCache[queryParam]) {
        fiveCurrentValues = chartFiveCache[queryParam];
        displayChartOneThreeFourFive(chartFiveCache[queryParam].items.slice(0, displayNumberFive), 'five');
        return;
      }
    }
    var requestOne = new XMLHttpRequest();
    requestOne.onreadystatechange = function () {
      if (requestOne.readyState == 4 && requestOne.status == 200) {
        queryResult = JSON.parse(requestOne.responseText);
        if (chartNumber === 'one') {
          //cache the result so we only do each unique request once.
          chartOneCache[queryParam] = queryResult;
          oneCurrentValues = queryResult;
          displayChartOneThreeFourFive(queryResult.items.slice(0, displayNumberOne), 'one');
        } else if (chartNumber === 'two') {
          chartTwoCache[queryParam] = queryResult;
          twoCurrentValues = queryResult;
          displayChartTwo(queryResult.items);
        } else if (chartNumber === 'three') {
          chartThreeCache[queryParam] = queryResult;
          threeCurrentValues = queryResult;
          displayChartOneThreeFourFive(queryResult.items.slice(0, displayNumberThree), 'three');
        } else if (chartNumber === 'four') {
          chartFourCache[queryParam] = queryResult;
          fourCurrentValues = queryResult;
          displayChartOneThreeFourFive(queryResult.items.slice(0, displayNumberFour), 'four');
        } else if (chartNumber === 'five') {
          chartFiveCache[queryParam] = queryResult;
          fiveCurrentValues = queryResult;
          displayChartOneThreeFourFive(queryResult.items.slice(0, displayNumberFive), 'five');
        }
      }
    };
    requestOne.open('GET', query);
    requestOne.send();
  }

  function changeTime(value, className) {
    if (className === 'selectFirst') {
      if (value === 'month') {
        time = '>2015-09-12';
      } else if (value === 'sixMonths') {
        time = '>2015-04-12'
      } else if (value === 'year') {
        time = '>2014-10-12'
      }
      makeRequest('https://api.github.com/search/repositories?q=a+created:' + time + '&sort=stars&per_page=100', 'one', time);
    } else if (className === 'selectSecond') {
      if (value === 'month') {
        timeTwo = '>2015-09-12';
      } else if (value === 'sixMonths') {
        timeTwo = '>2015-04-12'
      } else if (value === 'year') {
        timeTwo = '>2014-10-12'
      }
      makeRequest('https://api.github.com/search/repositories?q=a+created:' + timeTwo + '&sort=stars&per_page=100', 'two', timeTwo);
    } else if (className === 'selectFifth') {
      if (value === 'month') {
        timeFive = '>2015-09-12';
      } else if (value === 'sixMonths') {
        timeFive = '>2015-04-12'
      } else if (value === 'year') {
        timeFive = '>2014-10-12'
      }
      makeRequest('https://api.github.com/search/repositories?q=created:' + timeFive + '&sort=forks&per_page=100', 'five', timeFive);
    }
  }

  function changeNumber(value, className) {
    if (className === 'firstInput') {
      displayNumberOne = value;
      displayChartOneThreeFourFive(oneCurrentValues.items.slice(0, displayNumberOne), 'one');
    } else if (className === 'thirdInput') {
      displayNumberThree = value;
      displayChartOneThreeFourFive(threeCurrentValues.items.slice(0, displayNumberThree), 'three');
    } else if (className === 'fourthInput') {
      displayNumberFour = value;
      displayChartOneThreeFourFive(fourCurrentValues.items.slice(0, displayNumberFour), 'four');
    } else if (className === 'fifthInput') {
      displayNumberFive = value;
      displayChartOneThreeFourFive(fiveCurrentValues.items.slice(0, displayNumberFive), 'five');
    }
  }

  function displayChartOneThreeFourFive(info, chartNumber) {
    if (chartOne && chartNumber === 'one') {
      chartOne.destroy();
    } else if (chartThree && chartNumber === 'three') {
      chartThree.destroy();
    } else if (chartFour && chartNumber === 'four') {
      chartFour.destroy();
    } else if (chartFive && chartNumber === 'five') {
      chartFive.destroy();
    }
    if (chartNumber === 'one') {
      var ctx = document.getElementById('chartOne').getContext('2d');
    } else if (chartNumber === 'three') {
      var ctx = document.getElementById('chartThree').getContext('2d');
    } else if (chartNumber === 'four') {
      var ctx = document.getElementById('chartFour').getContext('2d');
    } else if (chartNumber === 'five') {
      var ctx = document.getElementById('chartFive').getContext('2d');
    }
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

  function displayChartTwo(info) {
    var languages = {};
    var data = [];
    var labels = [];
    if (chartTwo) {
      chartTwo.destroy();
    }
    var ctx = document.getElementById('chartTwo').getContext('2d');
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
    chartTwo = new Chart(ctx).Bar(data, {
      scaleShowGridLines: false
    });
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
      makeRequest('https://api.github.com/search/repositories?q=a+language:' + languageThird + '&sort=stars&per_page=100&page=1', 'three', languageThird)
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

  makeRequest(queries[0], 'one', time);
  makeRequest(queries[0], 'two', timeTwo);
  makeRequest(queries[1], 'three', languageThird);
  makeRequest(queries[2], 'four', languageFourth);
  makeRequest(queries[3], 'five', timeFive);

  return { //expose methods to global scope.
    changeTime: changeTime,
    changeLanguage: changeLanguage,
    changeNumber: changeNumber
  }
}();