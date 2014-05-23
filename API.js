$(document).ready(function() {
	
loadPandaPoolData();
loadPandaPoolHash();
loadCryptsy();
loadCoinbase();
loadLTC();


function loadLTC()
{
	var url = 'btc-e.com/api/2/ltc_usd/trades';
	url = encodeURIComponent(url);
	url = 'http://jsonp.guffa.com/Proxy.ashx?url=' + url;

	$.ajax({
    url: url,
    dataType: 'jsonp',
    success: function(results){
    	var ltcUSDprice = results[0].price;
    	var ltcMax = 0;
    	var ltcMin = 100000000;

    	for(var i = 0; i<results.length;i++)
    	{
    		if(results[i].price < ltcMin){ltcMin = results[i].price;}
    		else if(results[i].price > ltcMax) {ltcMax = results[i].price;}
    	}
    	$('#ltcUSD').html("<span id=\"Price\">$" + ltcUSDprice.toFixed(2) + "</span> - LTC/USD - High: " + ltcMax.toFixed(2) + " USD - Low: " + ltcMin.toFixed(2) + " USD");
    	
    }
 	});
}



function loadCoinbase()
{
	var url = 'coinbase.com/api/v1/currencies/exchange_rates';
	url = encodeURIComponent(url);
	url = 'http://jsonp.guffa.com/Proxy.ashx?url=' + url;

	$.ajax({
    url: url,
    dataType: 'jsonp',
    success: function(results){
    	var btcUSDprice = results.btc_to_usd;
    	btcUSDprice = roundToTwo(btcUSDprice);
    	$('#btcUSD').html("<span id=\"Price\">$" + btcUSDprice + "</span> - BTC/USD");
    	console.log(results);
    }	
});
	
}


function loadCryptsy()
{
var url = 'http://pubapi.cryptsy.com/api.php?method=singlemarketdata&marketid=132';
url = encodeURIComponent(url);
url = 'http://jsonp.guffa.com/Proxy.ashx?url=' + url;
	
$.ajax({
    url: url,
    dataType: 'jsonp',
    success: function(results){
    	var dogeBTCrate = results.return.markets.DOGE.lasttradeprice;
    	var dogeMax = 0;
    	var dogeMin = 100000000;

    	for(var i = 0; i<results.return.markets.DOGE.recenttrades.length;i++)
    	{
    		if(results.return.markets.DOGE.recenttrades[i].price < dogeMin){dogeMin = results.return.markets.DOGE.recenttrades[i].price;}
    		else if(results.return.markets.DOGE.recenttrades[i].price > dogeMax) {dogeMax = results.return.markets.DOGE.recenttrades[i].price;}
    	}
    	
    	
    	$('#dogeBTC').html("<span id=\"Price\">" + Math.ceil(dogeBTCrate*100000000) + "</span> Satoshi - DOGE/BTC - High: " + Math.ceil(dogeMax*100000000) + " Satoshi - Low: " + Math.ceil(dogeMin*100000000) + " Satoshi");
    	
    	
    	
    }	
});
}


function loadPandaPoolHash()
{
	
$.ajax({
    url: "http://multi.pandapool.info/api.php?q=hashrate",
    dataType: 'json',
    success: function(results){
    	var poolHash = results.result[47][1];
    	$('#poolHash').html("Pandapool Hashrate: " + poolHash/1000 + " MH/S");
    }
    	
});
}



function loadPandaPoolData()
{

$.ajax({
    url: "http://multi.pandapool.info/api.php?q=userinfo&user=DR8AbNaQNazgn2xKKetQWxUrkG6fMeRA7B",
    dataType: 'json',
    success: function(results){
    	for(var i = 0; i<5;i++)
    	{
    		var hash = parseInt(results.result.workers[i][2]) + parseInt(results.result.workers[i+5][2]);
    		
    		if (hash > 300)
	    	{
	    		progressBar(100, $('#progressBar' + (i+1)), hash);
	    	}
	    	
	    	else
	    	{
	    		progressBar(((hash/300)*100), $('#progressBar' + (i+1)), hash);
	    	}
	    	
	    	$('#miner' + (i+1) + 'Hash').html(hash + " KH/S");
    	}
    	
    	var totalHash = 0;
    	
    	for (var i = 0; i < results.result.history[0].workers.length;i++)
    	{
    		totalHash = totalHash + parseInt(results.result.workers[i][2]);
    	}
    	
    	if (totalHash > 1500)
    	{
    		progressBar(100, $('#progressBar'), totalHash);
    	}
    	
    	else
    	{
    		progressBar(((totalHash/1500)*100), $('#progressBar'), totalHash);
    	}
    	
    	$('#totalHash').html(totalHash + " KH/S");
    	
    	
    	var round1 = results.result.history[0].round;
    	var round1payout = results.result.history[0].payout;
    	var round2 = results.result.history[1].round;
    	var round2payout = results.result.history[1].payout;
    	var round3 = results.result.history[2].round;
    	var round3payout = results.result.history[2].payout;
    	var round4 = results.result.history[3].round;
    	var round4payout = results.result.history[3].payout;
    	var round5 = results.result.history[4].round;
    	var round5payout = results.result.history[4].payout;
    	var round6 = results.result.history[5].round;
    	var round6payout = results.result.history[5].payout;
    	var round7 = results.result.history[6].round;
    	var round7payout = results.result.history[6].payout;
    	var round8 = results.result.history[7].round;
    	var round8payout = results.result.history[7].payout;
    	var round9 = results.result.history[8].round;
    	var round9payout = results.result.history[8].payout;
    	var round10 = results.result.history[9].round;
    	var round10payout = results.result.history[9].payout;
		
		
		$('#r1').html("Round " + round1 + ": " + round1payout + " DOGE"); 
		$('#r2').html("Round " + round2 + ": " + round2payout + " DOGE"); 
		$('#r3').html("Round " + round3 + ": " + round3payout + " DOGE"); 
		$('#r4').html("Round " + round4 + ": " + round4payout + " DOGE"); 
		$('#r5').html("Round " + round5 + ": " + round5payout + " DOGE");
		$('#r6').html("Round " + round6 + ": " + round6payout + " DOGE");
		$('#r7').html("Round " + round7 + ": " + round7payout + " DOGE");
		$('#r8').html("Round " + round8 + ": " + round8payout + " DOGE");
		$('#r9').html("Round " + round9 + ": " + round9payout + " DOGE");
		$('#r10').html("Round " + round10 + ": " + round10payout + " DOGE");   
    }
});



function progressBar(percent, $element, miner) {
			var progressBarWidth = percent * $element.width() / 100;
			$element.find('div').animate({ width: progressBarWidth }, 500).html();
		}


}
});

function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}