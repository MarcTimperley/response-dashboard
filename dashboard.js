/*jslint browser: true, devel: true, node: true*/
/*global $*/
const measurements = [{
    "name": "localhost",
    "location": "board1",
    "url": "/",
    "chartType": "gauge"
}, {
    "name": "localhost",
    "location": "board0",
    "url": "/",
    "chartType": "spark",
    "data": []
}, {
    "name": "cpu",
    "location": "board2",
    "url": "../api/measurements/cpu",
    "chartType": "gauge",
    "value": "os1",
    "max": 100,
    "unit": "%"
}, {
    "name": "node heap",
    "location": "board5",
    "url": "../api/measurements/mem",
    "chartType": "gauge",
    "value": "used",
    "unit": "%",
    "max": 120
},{
    "name": "node mem",
    "location": "board6",
    "url": "../api/measurements/mem",
    "chartType": "gauge",
    "value": "osUsed",
    "unit": "%",
    "max": "120"
}, {
    "name": "cpu",
    "location": "board4",
    "url": "../api/measurements/cpu",
    "value": "os1",
    "max":100,
    "unit":"%",
    "chartType": "spark",
    "data": []
}, {
    "name": "localhost",
    "location": "board3",
    "url": "/",
    "chartType": "gauge"
},]

let gauge = {}
let graph = {}
const width = 180
const height = 160
const interval = 10000
// const cpu = require('./measurements/cpu.js')
let x
let y
let line

$(function setup() {
    setupDash()
    checkmeasurements()
    requestInterval(checkmeasurements, interval)
})

const setupDash = () => {
    measurements.forEach((i, v) => {
        $('#boards').append(`
        <div class="card-panel panel-background-${v % 4} text-white" 
        id="board${v}">
        board${v}
        </div>
  `
        )
    })
    measurements.forEach((currentServer) => {
        const { name, location, chartType, unit } = currentServer
        let { max,scale } = currentServer 
        if (!max) max = 200
        if (!scale) scale =1
        $('#' + location).html(name + `<div class="result" id="${location}Result"></div>`)
        if (chartType === 'gauge') {
            $(`#${location}Result`).addClass("gauge-container")
            gauge[location] = Gauge(
                document.getElementById(`${location}Result`), {
                max: max,
                value: 0,
                label: (value) => { return `${Math.floor(value * scale)} ${unit ? unit : 'ms'}` }
            })
        } else if (chartType === 'spark') {
            console.log(`location ${location} has max of ${max}`)
            $('#' + location).append(`<div id="${location}spark" class="aGraph"></div>`)
            graph[location] = d3.select('#' + location + 'spark').append("svg:svg").attr("width", width + "px").attr("height", height + "px")
            let data = currentServer.data
            x = d3.scaleLinear().domain([0, width / 2 - 2]).range([-2, width]) // starting point is -5 so the first value doesn't show and slides off the edge as part of the transition
            y = d3.scaleLinear().domain([-10, max]).range([height, 0])
            line = d3.line()
                .x((d, i) => x(i))
                .y((d) => y(d))
            graph[currentServer.location].append("svg:path").attr("d", line(data))
        }
    })
}

const pingServer = (server) => {
    let timer = 0
    const { chartType, location, data, url, value } = server

    $.get({
        url: url,
        //   cache: false,
        start_time: new Date().getTime(),
        complete: function (returnData) {
            timer = (new Date().getTime() - this.start_time)

            if (chartType === "gauge") {
                if (url.match(/\/api\//gi)) {
                    if (returnData.responseText) gauge[location].setValueAnimated(JSON.parse(returnData.responseText)[value], 1)
                } else {
                    gauge[location].setValueAnimated(timer, 1)
                }
            } else if (chartType === "spark") {
                if (url.match(/\/api\//gi)) {
                    data.push(JSON.parse(returnData.responseText)[value])
                    displaySpark(server, x, y, line)
                } else {
                    data.push(timer)
                    displaySpark(server, x, y, line)
                }
            }

        }
    })
}

const checkmeasurements = () => {
    measurements.forEach((currentServer) => pingServer(currentServer))
}

const displaySpark = (server, x, y, line) => {
    graph[server.location].selectAll("path")
        .data([server.data])
        .attr("transform", "translate(" + x(1) + ")")
        .attr("d", line)
    if (server.data.length > width / 2 - 2) {
        server.data.shift()
        graph[server.location].selectAll("path").transition()
            .duration(interval)
            .attr("transform", "translate(" + x(0) + ")")
    }
}

const requestInterval = (fn, delay) => {
    var requestAnimFrame = (() => {
        return window.requestAnimationFrame || function (callback, element) {
            window.setTimeout(callback, 1000 / 60)
        }
    })(),
        start = new Date(),
        handle = {}

    const loop = () => {
        handle.value = requestAnimFrame(loop)
        const delta = new Date() - start
        if (delta >= delay) {
            fn.call()
            start = new Date()
        }
    }
    handle.value = requestAnimFrame(loop)
    return handle
}

const clearRequestInterval = (handle) => {
    if (window.cancelAnimationFrame) {
        window.cancelAnimationFrame(handle.value)
    } else {
        window.clearInterval(handle)
    }
}
const requestTimeout = (fn, delay) => {
    var requestAnimFrame = (() => {
        return window.requestAnimationFrame || function (callback, element) {
            window.setTimeout(callback, 1000 / 60)
        }
    })(),
        start = new Date().getTime(),
        handle = {}

    const loop = () => {
        var current = new Date().getTime(),
            delta = current - start
        if (delta >= delay) {
            fn.call()
        } else {
            handle.value = requestAnimFrame(loop)
        }
    }
    handle.value = requestAnimFrame(loop)
    return handle
}

const clearRequestTimeout = (handle) => {
    if (window.cancelAnimationFrame) {
        window.cancelAnimationFrame(handle.value)
    } else {
        window.clearTimeout(handle)
    }

}
