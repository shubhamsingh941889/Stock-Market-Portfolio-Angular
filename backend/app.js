
const axios = require('axios')
const app = express()
const express = require('express')
const cors = require('cors')
app.use(cors())
const my_Token="c83f28iad3ift3bm8eq0"


app.get('/', (backend_request, backend_response)=>{ 
  backend_response.status(200).json({'status':'Server Up'})
})


app.get('/performAutoComplete', (backend_request, backend_response)=>{  
  axios.get('https://finnhub.io/api/v1/search', {
      params: { q: backend_request.query.queryName,token: my_Token }
    })
  .then(function (response) {
  const backend_data = response.backend_data.result.filter((d)=>{
    return d.type==="Common Stock" && !d.symbol.includes('.')
  })
  backend_response.send({status: "Ok", backend_data: backend_data})
  })
})

app.get('/getcompanyProfile', (backend_request, backend_response)=>{
    console.log('shubham'+backend_request.query)    
    axios.get('https://finnhub.io/api/v1/stock/profile2', {
        params: { symbol: backend_request.query.ticker.toUpperCase(), token: my_Token }
      })
    .then(function (response) {
    backend_response.send({status: "Ok", backend_data: response.backend_data})
    })
})



app.get('/getStockPrice', (backend_request, backend_response)=>{
  axios.get('https://finnhub.io/api/v1/quote', {
      params: { symbol: backend_request.query.ticker.toUpperCase(),token: my_Token }
    })
  .then(function (response) {
  backend_response.send({status: "Ok", backend_data: response.backend_data})
  })
  
})

app.get('/getDailyChartsData', (backend_request, backend_response)=>{  
  axios.get('https://finnhub.io/api/v1/stock/candle', {
      params: {
        symbol: backend_request.query.ticker.toUpperCase(),
        resolution: backend_request.query.timeInterval,
        from: backend_request.query.toTime - (6*60*60),
        to: backend_request.query.toTime,
        token: my_Token
      }
    })
  .then(function (response) {
  backend_response.send({status: "Ok", backend_data: response.backend_data})
  })
  
})

app.get('/getCompanyPeers', (backend_request, backend_response)=>{
  axios.get('https://finnhub.io/api/v1/stock/peers', {
      params: { symbol: backend_request.query.ticker.toUpperCase(), token: my_Token
      }
    })
  .then(function (response) {
  let peers = []
  let x = response.backend_data.toString()
      let y = x.split(",")
      for (let index in y){
        if (!y[index].includes(".")){
          peers.push(y[index])
        }
      }
  backend_response.send({status: "Ok", backend_data: peers})
  })
  
})


app.get('/getCompanyNews', (backend_request, backend_response)=>{
  console.log('news'+backend_request.query)
  const today = new Date()

  const endDay = String(today.getDate()).padStart(2,'0')
  const endMonth = String(today.getMonth()+1).padStart(2,'0')
  const endYear = today.getFullYear()

  const fromDate = new Date(today.setDate(today.getDate()-7))

  const startDay = String(fromDate.getDate()).padStart(2,'0')
  const startMonth = String(fromDate.getMonth()+1).padStart(2,'0')
  const startYear = fromDate.getFullYear()
   
  
  axios.get('https://finnhub.io/api/v1/company-news', {
      params: {
        symbol: backend_request.query.ticker.toUpperCase(),
        from: startYear+'-'+startMonth+'-'+startDay,
        to: endYear+'-'+endMonth+'-'+endDay,
        token: my_Token
      }
    })
  .then(function (response) {
  let limit = 0
  let filtered_news = []
    for(var i in response.backend_data) {    
        if (response.backend_data[i]["image"]!="" && limit<20){
        filtered_news.push(response.backend_data[i])
        limit+=1
        }
    }
  backend_response.send({status: "Ok", backend_data: filtered_news})
  })
  
})


app.get('/getHistoricalCharts', (backend_request, backend_response)=>{
  const timeInterval = 'D'
  let toTime = new Date().getTime()
  toTime = Math.floor(toTime/1000)
  const fromTime = toTime - (365*2*24*60*60)
  
  axios.get('https://finnhub.io/api/v1/stock/candle', {
      params: {
        symbol: backend_request.query.ticker.toUpperCase(),
        resolution: timeInterval,
        from: fromTime,
        to: toTime,
        token: my_Token
      }
    })
  .then(function (response) {
  backend_response.send({status: "Ok", backend_data: response.backend_data})
  })
  
})

app.get('/getInsightsRecommendation', (backend_request, backend_response)=>{
  
  axios.get('https://finnhub.io/api/v1/stock/recommendation', {
      params: {
        symbol: backend_request.query.ticker.toUpperCase(),
        token: my_Token
      }
    })
  .then(function (response) {
  
  backend_response.send({status: "Ok", backend_data: response.backend_data})
  })
})

app.get('/getInsightsSentiment', (backend_request, backend_response)=>{

  axios.get('https://finnhub.io/api/v1/stock/social-sentiment', {
      params: {
        symbol: backend_request.query.ticker.toUpperCase(),
        from: '2022-01-01',
        token: my_Token
      }
    })
  .then(function (response) {
  
  var finalRes = {"reddit":{"mentions":0,"positive":0,"negative":0},
    "twitter":{"mentions":0,"positive":0,"negative":0}}
    
    for(var i=0; i<response.backend_data.reddit.length;i+=1){
        finalRes.reddit.mentions = finalRes.reddit.mentions + response.backend_data.reddit[i].mention
        finalRes.reddit.positive = finalRes.reddit.positive + response.backend_data.reddit[i].positiveMention
        finalRes.reddit.negative = finalRes.reddit.negative + response.backend_data.reddit[i].negativeMention

        
    }

    for (var j = 0; j<response.backend_data.twitter.length; j+=1){
        finalRes.twitter.mentions = finalRes.twitter.mentions + response.backend_data.twitter[j].mention
        finalRes.twitter.positive = finalRes.twitter.positive + response.backend_data.twitter[j].positiveMention
        finalRes.twitter.negative = finalRes.twitter.negative + response.backend_data.twitter[j].negativeMention
    }

  backend_response.send({status: "Ok", backend_data: finalRes})
  })
  
})



app.get('/getCompanyEPSChart', (backend_request, backend_response)=>{
  axios.get('https://finnhub.io/api/v1/stock/earnings', {
      params: {
        symbol: backend_request.query.ticker.toUpperCase(),
        token: my_Token
      }
    })
  .then(function (response) {
  backend_response.send({status: "Ok", backend_data: response.backend_data})
  })
  
})

app.listen(8080)