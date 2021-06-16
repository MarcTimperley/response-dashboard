/**
 * main script to build the UI
 * @module dashboard
 */
/* jslint browser: true, devel: true, node: true */
/* global $, Gauge, d3 */

const gauge = {}
const graph = {}
const width = 160
const height = 140
const interval = 30000 // interval for checking in milliseconds
let x
let y
let line
const alerts = []
const alertsCurrent = {}

/**
 * setup - self-invoking function
 */
$(function setup() {
  $.get({
    url: '/measurements.json',
    cache: false,
    complete: function(returndata) {
      const measurements = JSON.parse(returndata.responseText)
      if (measurements) {
        setupDash(measurements)
        requestInterval(checkMeasurements, interval, measurements)
      }
    }
  })
})

/**
 * setupDash
 *
 * @param {object} measurements - metric for adding to the dashboard
 */
const setupDash = (measurements) => {
  measurements.forEach((i, v) => {
    $('#boards').append(`
        <div class="card-panel" id="board${v}">
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
      const data = currentServer.data
      x = d3.scaleLinear().domain([0, width / 2 - 2]).range([-2, width]) // starting point is -5 so the first value doesn't show and slides off the edge as part of the transition
      y = d3.scaleLinear().domain([-10, max]).range([height, 0])
      line = d3.line()
        .x((d, i) => x(i))
        .y((d) => y(d))
      graph[currentServer.location].append('svg:path').attr('d', line(data))
    }
  })
}

/**
 * get the measurements for each service
 *
 * @param {object} measurements - details of the service to measure
 */
const checkMeasurements = (measurements) => {
  measurements.forEach((currentServer) => pingServer(currentServer))
}

/**
 * measure the server response
 *
 * @param {object} server - details for measurement
 */
const pingServer = (server) => {
  const { chartType, location, data, url, value, name } = server
  let { unit, threshold } = server
  if (!unit) unit = 'ms'
  if (!threshold) threshold = 100
  $.get({
    url: url,
    start_time: new Date().getTime(),
    complete: function(returnData) {
      let result
      if (url.match(/\/api\//gi)) {
        result = JSON.parse(returnData.responseText)[value]
      } else {
        result = (new Date().getTime() - this.start_time)
      }
      $('#' + location).css('background-color', shadeBackground(result / threshold))
      if (result > threshold) {
        const alert = { type: 'alert', measure: name, value: result + unit, threshold: threshold + unit }
        if (!alertsCurrent[name]) alertsCurrent[name] = { startTime: new Date() }
        alerts.unshift(alert)
        $('#alertsRecent').prepend(`<div class="threshold threshold-recent">${new Date().toLocaleString()}: ${name} - ${result + unit} (>${threshold + unit})</div>`)
      } else {
        if (alertsCurrent[name]) delete alertsCurrent[name]
      }
      let alertsCurrentHTML = ''
      for (const [i, v] of Object.entries(alertsCurrent)) {
        const duration = Math.floor((new Date() - v.startTime) / 1000)
        alertsCurrentHTML += `<div class="threshold threshold-current">${i} ${duration.toLocaleString()}s</div>`
      }
      $('#alertsCurrent').html(alertsCurrentHTML)
      if (chartType === 'gauge') {
        gauge[location].setValueAnimated(result, 1)
      } else if (chartType === 'spark') {
        data.push(result)
        displaySpark(server, x, line)
      }
    }
  })
}

/**
 * display a spark line moving through the dashboard panel
 *
 * @param {object} server - service being measured
 * @param {number} x - x-axis value of the data
 * @param {number} line - y-axis value
 */
const displaySpark = (server, x, line) => {
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

/**
 * repeat calculation of values
 *
 * @param {function} fn - callback function
 * @param {integer} delay - pause duration
 * @param {object} measurements - services being measured
 * @returns {object} handle
 */
const requestInterval = (fn, delay, measurements) => {
  const requestAnimFrame = (() => {
    return window.requestAnimationFrame || function(callback, element) {
      window.setTimeout(callback, 1000 / 60)
    }
  })()
  let start = new Date()
  const handle = {}
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

/**
 * apply a background colour (green to red) depending on results
 *
 * @param {number} percent - percent of threshold
 * @returns {string} - colour to apply to background in HSL space
 */
const shadeBackground = (percent) => {
  if (percent > 1) percent = 1
  const hue = ((1 - percent) * 120).toString(10)
  return ['hsl(', hue, ',100%,65%)'].join('')
}
