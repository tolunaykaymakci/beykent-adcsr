class SSChart {
  constructor(id, selectable) {
    this.id = id;
    this.selectable = selectable;
    this.firstLoadDone = false;
    this.refreshing = false;

    this.chart = document.getElementById('ssChart_' + id);
    this.cursor = document.getElementById('graphCursor_' + id);

    var cursor = this.cursor;
    if (selectable) {
      var cursorItems = cursor.children;
      for (var i = 0; i !== cursorItems.length; i++) {
        var ci = cursorItems[i];

        ci.addEventListener('pointerdown', (event) => {
          event.target.classList.add('graph-ci-touch');
        });

        ci.addEventListener('pointerup', (event) => {
          event.target.classList.remove('graph-ci-touch');
        });

        ci.addEventListener('pointerleave', (event) => {
          event.target.classList.remove('graph-ci-touch');
        });

        ci.addEventListener('lostpointercapture', (event) => {
          event.target.classList.remove('graph-ci-touch');
        });

        ci.addEventListener('pointerout', (event) => {
          event.target.classList.remove('graph-ci-touch');
        });
      }
    } else {
      cursor.style.display = 'none';
    }
  }

  attachEvent(sl) {
    this.selectionListener = sl;
  }

  request(gt, type, mode, plan, date) {
    this.refreshing = true;

    fetch(window.location.origin + '/api/reports/graph/' + type, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({
        gt: gt,
        seek: date,
        mode: mode,
        plan: plan,
      }),
    }).then((response) => {
      response.json().then((data) => {
        var labelTexts = [];
        var dataValues = [];
        var acIndex = -1;

        var cursorItems = this.cursor.children;
        this.updateCursors(data.graph.length);
        data.graph.forEach((gi, index) => {
          labelTexts[index] = gi.frontText;
          dataValues[index] = gi.value;

          if (!this.selectable) {
            if (gi.selected) {
              acIndex = index;
            }
          } else {
            if (gi.selected) {
              acIndex = index;
              cursorItems[index].className = 'graph-cursor-item-selected';
              cursorItems[index].onclick = null;
            } else {
              cursorItems[index].className = 'graph-cursor-item';

              cursorItems[index].onclick = function () {
                if (this.refreshing) return;

                if (this.selectionListener != null) {
                  this.selectionListener(gi.dateind);
                }
                this.request(gt, type, mode, plan, gi.dateind);
              }.bind(this);
            }
          }
        });
        this.draw(labelTexts, dataValues, acIndex);
        this.refreshing = false;
      });
    });
  }

  load(data) {
    var labelTexts = [];
    var dataValues = [];
    var acIndex = -1;
    data.forEach((gi, index) => {
      labelTexts[index] = gi.frontText;
      dataValues[index] = gi.value;
      if (gi.selected) {
        acIndex = index;
      }
    });
    this.draw(labelTexts, dataValues, acIndex);
  }

  draw(lbls, dta, si) {
    if (si == null) si = 0;

    var largest = dta[0];
    var smallest = dta[0];

    for (var i = 0; i < dta.length; i++) {
      if (lbls[i] === '') continue;

      if (largest < dta[i]) {
        largest = dta[i];
      }

      if (smallest > dta[i]) {
        smallest = dta[i];
      }
    }
    largest += 100;

    var steps = parseInt((largest - smallest) / 4);

    var c = this.chart;
    c.setAttribute('data-selected-index', si === null ? 0 : si);

    if (this.firstLoadDone) {
      this.chartInstance.data.labels = lbls;
      this.chartInstance.data.datasets[0].data = dta;
      this.chartInstance.options = {
        legend: {
          display: false,
        },
        responsive: true,
        datasetStrokeWidth: 5,
        pointDotStrokeWidth: 6,
        animation: {
          duration: 0,
        },
        plugins: {
          datalabels: {
            align: -75,
            offset: 8,
          },
        },
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              position: 'right',
              gridLines: {
                display: false,
              },
              ticks: {
                max: largest,
                min: smallest,
                stepSize: steps,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                display: false,
              },
              offset: true,
            },
          ],
        },
        elements: {
          point: {
            radius: function (context) {
              let index = context.dataIndex;
              let value = context.dataset.data[index];

              var sib = Number(
                context.chart.canvas.getAttribute('data-selected-index'),
              );

              return index === sib ? 7 : 3;
            },
            display: true,
          },
        },
      };
      this.chartInstance.update();
      return;
    }

    this.firstLoadDone = true;
    var xyz = c.getContext('2d');

    // Create gradient
    var gradient = xyz.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(62, 116, 182, .3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, .1)');

    var ctx = this.chart;
    var graphConfig = {
      type: 'line',
      plugins: [ChartDataLabels],
      data: {
        labels: lbls,
        datasets: [
          {
            data: dta,
            backgroundColor: gradient, // Put the gradient here as a fill color
            borderColor: 'rgba(62, 116, 182, .2)',
            pointBackgroundColor: 'rgba(62, 116, 182, .9)',
            pointBorderColor: 'rgba(62, 116, 182, .2)',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(62, 116, 182, .2)',
            borderWidth: 2,
            lineTension: 0,
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        responsive: true,
        datasetStrokeWidth: 5,
        pointDotStrokeWidth: 6,
        animation: {
          duration: 0,
        },
        plugins: {
          datalabels: {
            align: -75,
            offset: 8,
          },
        },
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              position: 'right',
              gridLines: {
                display: false,
              },
              ticks: {
                max: largest,
                min: smallest,
                stepSize: steps,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                display: false,
              },
              offset: true,
            },
          ],
        },
        elements: {
          point: {
            radius: function (context) {
              let index = context.dataIndex;
              let value = context.dataset.data[index];

              var sib = Number(
                context.chart.canvas.getAttribute('data-selected-index'),
              );

              return index === sib ? 7 : 3;
            },
            display: true,
          },
        },
      },
    };
    var myChart = new Chart(ctx, graphConfig);
    myChart.selectedDatasetIndex = si;

    this.chartInstance = myChart;
  }

  updateCursors(count) {
    if (this.cursor.children.length !== count) {
      this.cursor.innerHTML = '';

      for (var i = 0; i !== count; i++) {
        var citem = document.createElement('div');
        this.cursor.append(citem);
      }
    }
  }
}

const ServiceWorkerR = () => {
  return 'https://sorusayaci.com/';
};

const ServiceWorkerL = () => {
  return 'http://192.168.1.104:5000/';
};

class SSInputModal {
  constructor(title, confirm, cancel) {
    this.title = title;
    this.confirm = confirm;
    this.cancel = cancel;

    var template = document.getElementById('ssInputTemplate');
    var insides = template.content.cloneNode(true);

    this.modal = document.createElement('div');
    this.modal.appendChild(insides);

    this.modal.querySelector('#ssInputModal').onclick = function (e) {
      cancel();
    };

    this.modal.querySelector('#ssInputCard').onclick = function (e) {
      e.cancelBubble = false;
      e.stopPropagation();
    };

    this.modal.querySelector('#ssInputModalDismiss').onclick = function () {
      cancel();
    };
    this.modal.querySelector('#ssInputModalConfirm').onclick = function () {
      confirm();
    };
    this.modal.querySelector('#ssInputModalTitle').innerHTML = title;
  }

  get value() {
    return this.modal.querySelector('#ssInputModalValue').value;
  }

  show() {
    this.modal.style.display = 'flex';
  }

  addQuickOption(text, value) {
    var optionBox = this.modal.querySelector('#ssInputOptionsBox');
    optionBox.style.display = 'flex';

    var element = document.createElement('div');
    element.style = 'flex: 0 0 33.333333%;';

    var inner = document.createElement('div');
    inner.style =
      'border-radius: 6px; background-color: rgb(65 123 175); text-align: center; margin: 3px; font-size: 15px; padding: 7px; color: white;';
    inner.className = 'selectable-item';
    inner.innerHTML = text;

    element.append(inner);
    optionBox.append(element);

    inner.onclick = function () {
      this.modal.querySelector('#ssInputModalValue').value = value;
      this.confirm();
    }.bind(this);
  }
}

export {ServiceWorkerR, ServiceWorkerL};
