

const symbols = ['btcusdt', 'ethusdt','solusdt','xrpusdt','linkusdt']; // Binance US uses 't' at the end of each symbol for trading pairs
const streams = symbols.map(symbol => `${symbol}@ticker`).join('/');
const wsUrl = `wss://stream.binance.us:9443/stream?streams=${streams}`;

const ws = new WebSocket(wsUrl);

let btcPriceElement = document.getElementById("btc-price");
let ethPriceElement = document.getElementById("eth-price");
let solPriceElement = document.getElementById("sol-price");
let xrpPriceElement = document.getElementById("xrp-price");
let linkPriceElement = document.getElementById("link-price");
let lastBTCPrice = 0;
let lastETHPrice = 0;
let lastSOLPrice = 0;
let lastXRPPrice = 0;
let lastLINKPrice = 0;

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log(message);
  const stream = message.stream;
  const priceData = message.data;

  // Extract the symbol from the stream name
  const symbol = stream.split('@')[0].toUpperCase(); // Convert symbol to uppercase for comparison

  // Check to identify which symbol and logs the price
  switch(symbol){
    case 'BTCUSDT':
      let btcPrice = parseFloat(priceData.c).toFixed(2);
      btcPriceElement.innerText = parseFloat(priceData.c).toFixed(2);
      btcPriceElement.style.color = !lastBTCPrice || lastBTCPrice === btcPrice ? 'black' : btcPrice > lastBTCPrice ? 'green' : 'red';
      lastBTCPrice = btcPrice;
      console.log(`Prince Update for ${symbol}: ${priceData.c}`);
      break;
    case 'ETHUSDT':
      let ethPrice = parseFloat(priceData.c).toFixed(2);
      ethPriceElement.innerText = parseFloat(priceData.c).toFixed(2);
      ethPriceElement.style.color = !lastETHPrice || lastETHPrice === ethPrice ? 'black' : ethPrice > lastETHPrice ? 'green' : 'red';
      lastETHPrice = ethPrice;
      console.log(`Prince Update for ${symbol}: ${priceData.c}`);
      break;
    case 'SOLUSDT':
      let solPrice = parseFloat(priceData.c).toFixed(2);
      solPriceElement.innerText = parseFloat(priceData.c).toFixed(2);
      solPriceElement.style.color = !lastSOLPrice || lastSOLPrice === solPrice ? 'black' : solPrice > lastSOLPrice ? 'green' : 'red';
      lastSOLPrice = solPrice;
      console.log(`Prince Update for ${symbol}: ${priceData.c}`);
      break;
    case 'XRPUSDT':
      let xrpPrice = parseFloat(priceData.c).toFixed(2);
      xrpPriceElement.innerText = parseFloat(priceData.c).toFixed(2);
      xrpPriceElement.style.color = !lastXRPPrice || lastXRPPrice === xrpPrice ? 'black' : xrpPrice > lastXRPPrice ? 'green' : 'red';
      lastXPPPrice = xrpPrice;
      console.log(`Prince Update for ${symbol}: ${priceData.c}`);
      break;
    case 'LINKUSDT':
      let linkPrice = parseFloat(priceData.c).toFixed(2);
      linkPriceElement.innerText = parseFloat(priceData.c).toFixed(2);
      linkPriceElement.style.color = !lastLINKPrice || lastLINKPrice === linkPrice ? 'black' : linkPrice > lastLINKPrice ? 'green' : 'red';
      lastLINKPrice = linkPrice;
      console.log(priceData.c+"&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
      console.log(`Prince Update for ${symbol}: ${priceData.c}`);
      break;
    default:
      console.log("Broken");
      break;
  }
};