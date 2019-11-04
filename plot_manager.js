// plot_manager.js, manages the plot and its data
const Plotly = require('plotly.js/dist/plotly')

function PlotlyWrappers(chartDiv) {
  var indexList = []
  var _this = this
  _this.plot = undefined
  _this.subplots = false
  _this.plotType = 'scatter'
  _this.xAxisLabel = 'Time units not found'

  this.setXaxisLabel = function(label){
    _this.xAxisLabel = label
  }

  this.createChart = function (createChartData, xaxis, id) {
    if (_this.plot !== undefined) {
      Plotly.purge(chartDiv)
    }
    // _this.initialiseResizeListener(chartDiv)

    var chartData = processData(createChartData, xaxis, id)

    _this.plot = Plotly.react(chartDiv, chartData, getLayout())
  }

  this.resetChart = function () {
    if (_this.plot !== undefined) {
      Plotly.purge(chartDiv)
      _this.plot = undefined
    }
    indexList = []
    
  }

  this.addDataSeriesToChart = function (newSeries, xaxis, id) {
 
    xaxis.shift() // Remove the header

    if (_this.plot === undefined){
      _this.createChart(newSeries, xaxis, id)
      return
    }
    var newData = processData(newSeries, xaxis, id)
    Plotly.addTraces(chartDiv, newData)
  }

  this.addDataSeriesFromDatGui = function (newSeries, xaxis, id, index) {
 
    xaxis.shift() // Remove the header

    if (_this.plot === undefined){
      _this.createChart(newSeries, xaxis, id)
      return
    }
    var newData = processData(newSeries, xaxis, id)
    Plotly.addTraces(chartDiv, newData)
  }

  this.removeSeries = function(index){
    traceNumber = Number(indexList.indexOf(index))
    Plotly.deleteTraces(chartDiv, traceNumber)
    indexList.slice(traceNumber, traceNumber+1)
  }

  var getLayout = function(){
    var layout = undefined
    if(_this.plotType === 'bar'){
      layout = {
        barmode: 'group',
        xaxis: {},
        margin: {
          l: 50,
          r: 20,
          b: 150,
          t: 10,
          pad: 4
        }
      };
    } else if ( !_this.subplots ){
      layout = {
        xaxis: {
          type: 'seconds',
          title: 'Seconds'
        },
        yaxis: {
          autorange: true,
          type: 'linear',
          title: 'mV'
        },
        margin: {
          l: 50,
          r: 20,
          b: 150,
          t: 10,
          pad: 4
        }
      }
    } else {
      layout = {
        grid: {
          rows:  Math.ceil(dataTraces.length/2),
          columns: 2,
          pattern: 'independent'
        },
        xaxis: {}
      }  
    }
    layout.xaxis.title = _this.xAxisLabel
    return layout
  }

  var processData = function (unprocessedData, xaxis, id) {
    var dataTrace = {
      type: _this.plotType,
      name: id,
      x: xaxis,
      y: unprocessedData,
      line: {
        color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
      }
    }
    return [dataTrace]
  }

  var processDataMatrix = function (data) {
    var times = data.map( (row) => { return row[0]})
    var dataTraces = []
    var dataTrace = {}
    var xlabel, ylabel, ydata 
    for (var i in data[0]){
      if (i == 0){
        continue
      }
      else if (i == 1){
        xlabel = 'x'
        ylabel = 'y'
        ydata = data.map( (row) => { return row[i]})
      }
      else{
        xlabel = 'x' + i
        ylabel = 'y' + i
        ydata = data.map( (row) => { return row[i]})
      }

      if (!_this.subplots){
        xlabel = 'x'
        ylabel = 'y'
      }
      
      ydata.shift()
      dataTrace = {
        type: _this.plotType,
        name: data[0][i],
        x: times,
        y: ydata,
        xaxis: xlabel,
        yaxis: ylabel,
        line: {
          color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
        }
      }
      if (_this.subplots){
        dataTrace.showlegend = false
        dataTrace.title = data[0][i]
      }
      dataTraces.push(dataTrace)
    }
    return dataTraces
  }

  this.heatMapPlot = function(data, xHeaders, yHeaders){
    _this.resetChart()
    var traces = [{
      z: data,
      x: xHeaders,
      y: yHeaders,
      type: 'heatmap'
    }];

    Plotly.newPlot(chartDiv, traces)
  }

  this.plotAll = function(data){
    var dataTraces = processDataMatrix(data)
    _this.plot = Plotly.react(chartDiv, dataTraces, getLayout())  
    _this.plot = undefined   
  }

  this.resizePlot = function( width, height ){
    if (_this.plot === undefined){
      console.log('No chart available to resize! Resize cancelled')
      return
    }
    Plotly.relayout(chartDiv, {
      width: width - 8,
      height: height
    })
  }

  this.initialiseResizeListener = function (resizeObject) {
    resizeObject.addEventListener('resize', _ => {
      Plotly.relayout(chartDiv, {
        width: resizeObject.innerWidth,
        height: resizeObject.innerHeight + 150
      })
    })
  }
}

module.exports = PlotlyWrappers 
