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

    	$('#ltcUSD').html("<span id=\"price\">$" + ltcUSDprice.toFixed(2) + "</span> - LTC/USD");
    	
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
    	$('#btcUSD').html("<span id=\"price\">$" + btcUSDprice + "</span> - BTC/USD");
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
    	
    	$('#dogeBTC').html("<span id=\"price\">" + Math.ceil(dogeBTCrate*100000000) + "</span> Satoshi - DOGE/BTC");
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
    	
    	var minerHTML = "<div><div class=\"default\" id=\"progressBar\" ><div></div></div><div class=\"minerHash\" id=\"totalHash\"></div><div class=\"miner\">Total Hashrate</div></div>";
    	var words = ["One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen","Twenty"];
    	
    	for(var i = 0; i<(results.result.workers.length / 2);i++)
    	{
    		minerHTML += "<div><div class=\"default\" id=\"progressBar"+ (i+1) + "\" ><div></div></div><div class=\"minerHash\" id=\"miner" + (i+1) + "Hash\"></div><div class=\"miner\">Miner "+ words[i] +"</div></div>";
    	}
    	$('#miners').html(minerHTML);
    	
    	for(var i = 0; i<(results.result.workers.length / 2);i++)
    	{
    		var hash = parseInt(results.result.workers[i][2]) + parseInt(results.result.workers[i+(results.result.workers.length / 2)][2]);
    		
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
    	
    	for (var i = 0; i < results.result.workers.length;i++)
    	{
    		totalHash = totalHash + parseInt(results.result.workers[i][2]);
    	}
    	
    	if (totalHash > (results.result.workers.length / 2)*300)
    	{
    		progressBar(100, $('#progressBar'), totalHash);
    	}
    	
    	else
    	{
    		progressBar(((totalHash/((results.result.workers.length / 2)*300))*100), $('#progressBar'), totalHash);
    	}
    	
    	$('#totalHash').html(totalHash + " KH/S");
		
		var payoutHTML = "<div id=\"payoutsHeader\">Payouts</div>";
		var payout24 = 0;
		
		for(i=0;i<10;i++)
		{
			var round = results.result.history[i].round;
    		var roundpayout = results.result.history[i].payout;
    		payoutHTML += "<div class=\"payouts\">Round " + round+ ": " + roundpayout + " DOGE</div>"
    		
    		if (i<6)
    		{
    			payout24 += roundpayout;
    		}
		}
		
		payoutHTML += "<p></p><div class=\"payouts\">24 Hour Payout: " + payout24 + " DOGE</div>"
		
		$('#payouts').html(payoutHTML);  
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