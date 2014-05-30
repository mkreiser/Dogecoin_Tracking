$(document).ready(function(){$(".content").hide();});

init();

$(window).load(function(){$(".loading").fadeOut("slow", function(){$(".content").fadeIn("slow");});});

function init()
{
var dogeBTCrate;
var btcUSDprice;
var ltcUSDprice;
var round;
var addressBalance;

var url = 'btc-e.com/api/2/ltc_usd/trades';
url = encodeURIComponent(url);
url = 'http://jsonp.guffa.com/Proxy.ashx?url=' + url;

//Litecoin-USD Price
$.ajax({
url: url,
dataType: 'jsonp',
success: function(results){
	ltcUSDprice = results[0].price;
	$('#ltcUSD').html("<div class=\"headerThree\">LTC</div><span id=\"price\">$" + roundToTwo(ltcUSDprice) + "</span> - LTC/USD");
}
});

//Doge-Bitcoin (Cryptsy) & Bitcoin-USD (Coinbase)	
url = 'http://pubapi.cryptsy.com/api.php?method=singlemarketdata&marketid=132';
url = encodeURIComponent(url);
url = 'http://jsonp.guffa.com/Proxy.ashx?url=' + url;
$.ajax({
    url: url,
    dataType: 'jsonp',
    success: function(results){
    	dogeBTCrate = results.return.markets.DOGE.lasttradeprice;
    	
	    var url = 'coinbase.com/api/v1/currencies/exchange_rates';
		url = encodeURIComponent(url);
		url = 'http://jsonp.guffa.com/Proxy.ashx?url=' + url;
	
		$.ajax({
	    url: url,
	    dataType: 'jsonp',
	    success: function(results){
	    	btcUSDprice = results.btc_to_usd;
	    	btcUSDprice = roundToTwo(btcUSDprice);
	    	$('#btcUSD').html("<div class=\"headerThree\">BTC</div><span id=\"price\">$" + btcUSDprice + "</span> - BTC/USD");
	    	
	    	var dogeThousand = dogeBTCrate * 1000 * btcUSDprice;
	    	$('#dogeBTC').html("<div class=\"headerThree\">DOGE</div><span id=\"price\">" + Math.ceil(dogeBTCrate*100000000) + "</span> Satoshi - DOGE/BTC<div><span id=\"price\"> $" + roundToThree(dogeThousand) + "</span> - 1000 DOGE/USD </div>");
	    	$('#addressValue').html("Current USD Balance: $" + roundToTwo(dogeBTCrate * btcUSDprice * addressBalance));
	    }	
	});
    }	
});

//Doge Balance
$.ajax({
	url: 'https://chain.so/api/v2/get_address_balance/DOGE/DR8AbNaQNazgn2xKKetQWxUrkG6fMeRA7B',
	dataType: 'jsonp',
	success: function(results){
		addressBalance = results.data.confirmed_balance;
		$('#addressInfo').html("<div>Current Balance: " + roundToTwo(results.data.confirmed_balance) + " DOGE</div>");
	}
});

//PandaPool Hashrate	
$.ajax({
url: "http://multi.pandapool.info/api.php?q=hashrate",
dataType: 'json',
success: function(results){
	var poolHash = results.result[47][1];
	$('#poolHash').html("Pandapool Hashrate: " + poolHash/1000 + " MH/S");
}	
});

//Miner hashrate and payouts
$.ajax({
    url: "http://multi.pandapool.info/api.php?q=userinfo&user=DR8AbNaQNazgn2xKKetQWxUrkG6fMeRA7B",
    dataType: 'json',
    success: function(results){
    	
    	var payoutHTML = "<div class=\"headerTwo\">Payouts</div>";
		var payout24 = 0;
		
		for(i=0;i<10;i++)
		{
			var roundlocal = results.result.history[i].round;
    		var roundpayout = results.result.history[i].payout;
    		payoutHTML += "<div class=\"payouts\">Round " + roundlocal + ": " + roundToTwo(roundpayout) + " DOGE</div>"
    		
    		if (i<6)
    		{
    			payout24 += roundpayout;
    		}
		}
		
		$('#pay24').html("<div>Current 24 Hour Payout: " + roundToTwo(payout24) + " DOGE</div>");
		
		round = results.result.history[0].round;
	    var url2 = 'http://multi.pandapool.info/api.php?q=roundinfo&round=' + round;
		url2 = encodeURIComponent(url2);
		url2 = 'http://jsonp.guffa.com/Proxy.ashx?url=' + url2;
	
		$.ajax({
	    url: url2,
	    dataType: 'jsonp',
	    success: function(results1){
	    	$('#cash').html("<div>Current MH/s Return: " + roundToTwo(results1.result.doge_mhs_day)+ " DOGE/Day</div>");
	    }
	 	});
		
		$('#payouts').html(payoutHTML);
    	
		minerHTML = "<div><div class=\"default\" id=\"progressBar\" ><div></div></div><div class=\"minerHash\" id=\"totalHash\"></div><div class=\"miner\">Total Hashrate</div></div>";
    	var words = ["One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen","Twenty"];
    	
    	for(var i = 0; i<(results.result.workers.length / 2);i++)
    	{
    		minerHTML += "<div><div class=\"default\" id=\"progressBar"+ (i+1) + "\" ><div></div></div><div class=\"minerHash\" id=\"miner" + (i+1) + "Hash\"></div><div class=\"miner\">Miner "+ words[i] +"</div></div>";
    	}

    	$('#miners').html(minerHTML);
    	
    	for(var i = 0; i<(results.result.workers.length / 2);i++)
    	{
    		var hash = parseInt(results.result.workers[i][2]) + parseInt(results.result.workers[i+(results.result.workers.length / 2)][2]);
    		
    		if (hash > 300) {progressBar(100, $('#progressBar' + (i+1)), hash);}
	    	
	    	else {progressBar(((hash/300)*100), $('#progressBar' + (i+1)), hash);}
	    	
	    	$('#miner' + (i+1) + 'Hash').html(hash + " KH/S");
    	}
    	
    	var totalHash = 0;
    	
    	for (var i = 0; i < results.result.workers.length;i++) {totalHash = totalHash + parseInt(results.result.workers[i][2]);}
    	
    	if (totalHash > (results.result.workers.length / 2)*300){progressBar(100, $('#progressBar'), totalHash);}
    	else {progressBar(((totalHash/((results.result.workers.length / 2)*300))*100), $('#progressBar'), totalHash);}
    	
    	$('#totalHash').html(totalHash + " KH/S");	  
    }
});

function progressBar(percent, $element, miner) {
			var progressBarWidth = percent * $element.width() / 100;
			$element.find('div').animate({ width: progressBarWidth }, 500).html();
		}
}

function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

function roundToThree(num) {    
    return +(Math.round(num + "e+3")  + "e-3");
}