/* jslint browser: true, devel: true, node: true */
/* global $, Gauge, d3 */

let gauge = {}
let graph = {}
const width = 180
const height = 140
const interval = 5000
let x
let y
let line
let alerts = []

$(function setup() {
  $.get({
    url: '/measurements.json',
    cache: false,
    complete: function(returndata) {
      const measurements = JSON.parse(returndata.responseText)
      if (measurements) {
        setupDash(measurements)
        requestInterval(checkmeasurements, interval, measurements)
      }
    }
  })
})

const setupDash = (measurements) => {
  measurements.forEach((i, v) => {
    $('#boards').append(`
        <div class="card-panel panel-background-${v % 4} text-white" 
        id="board${v}">
        board${v}
        </div>`
    )
  })
  measurements.forEach((currentServer) => {
    const { name, location, chartType, unit } = currentServer
    let { max, scale } = currentServer
    if (!max) max = 200
    if (!scale) scale = 1
    $('#' + location).html(name + `<div class="result" id="${location}Result"></div>`)
    if (chartType === 'gauge') {
      $(`#${location}Result`).addClass('gauge-container')
      gauge[location] = Gauge(
        document.getElementById(`${location}Result`), {
          max: max,
          value: 0,
          label: (value) => { return `${Math.floor(value * scale)} ${unit || 'ms'}` }
        })
    } else if (chartType === 'spark') {
      $('#' + location).append(`<div id="${location}spark" class="aGraph"></div>`)
      graph[location] = d3.select('#' + location + 'spark').append('svg:svg').attr('width', width + 'px').attr('height', height + 'px')
      let data = currentServer.data
      x = d3.scaleLinear().domain([0, width / 2 - 2]).range([-2, width]) // starting point is -5 so the first value doesn't show and slides off the edge as part of the transition
      y = d3.scaleLinear().domain([-10, max]).range([height, 0])
      line = d3.line()
        .x((d, i) => x(i))
        .y((d) => y(d))
      graph[currentServer.location].append('svg:path').attr('d', line(data))
    }
  })
}

const pingServer = (server) => {
  // let timer = 0
  const { chartType, location, data, url, value, threshold, name } = server
  let { unit } = server
  if (!unit) unit = 'ms'
  $.get({
    url: url,
    //   cache: false,
    start_time: new Date().getTime(),
    complete: function(returnData) {
      let result
      if (url.match(/\/api\//gi)) {
        result = JSON.parse(returnData.responseText)[value]
      } else {
        result = (new Date().getTime() - this.start_time)
      }
      if (threshold && result > threshold) {
        $('#' + location).addClass('panel-background-alert')
        alerts.unshift({ type: 'alert', measure: name, value: result + unit, threshold: threshold + unit })
        $('#alertsRecent').prepend(`<div class="threshold">${new Date().toLocaleString()}: ${name} - ${result + unit} (${threshold + unit})</div>`)
      } else {
        $('#' + location).removeClass('panel-background-alert')
      }
      if (chartType === 'gauge') {
        gauge[location].setValueAnimated(result, 1)
      } else if (chartType === 'spark') {
        data.push(result)
        displaySpark(server, x, y, line)
      }
    }
  })
}

const checkmeasurements = (measurements) => {
  measurements.forEach((currentServer) => pingServer(currentServer))
}

const displaySpark = (server, x, y, line) => {
  graph[server.location].selectAll('path')
    .data([server.data])
    .attr('transform', 'translate(' + x(1) + ')')
    .attr('d', line)
  if (server.data.length > width / 2 - 2) {
    server.data.shift()
    graph[server.location].selectAll('path').transition()
      .duration(interval)
      .attr('transform', 'translate(' + x(0) + ')')
  }
}

const requestInterval = (fn, delay, measurements) => {
  const requestAnimFrame = (() => {
    return window.requestAnimationFrame || function(callback, element) {
      window.setTimeout(callback, 1000 / 60)
    }
  })()
  let start = new Date()
  let handle = {}

  const loop = () => {
    handle.value = requestAnimFrame(loop)
    const delta = new Date() - start
    if (delta >= delay) {
      fn.call(measurements, measurements)
      start = new Date()
    }
  }
  handle.value = requestAnimFrame(loop)
  return handle
}
