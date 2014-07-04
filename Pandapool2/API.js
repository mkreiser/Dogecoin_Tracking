$(document).ready(function(){$(".loading").hide().fadeIn("slow");$(".content").hide();});

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
	$('#ltcUSD').html("<div class=\"headerThree\">LTC</div><span><span id=\"price\">$" + roundToTwo(ltcUSDprice) + "</span><span class=\"smallFont\"> - LTC/USD</span></span>");
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
	    	$('#btcUSD').html("<div class=\"headerThree\">BTC</div><span id=\"price\">$" + btcUSDprice + "</span><span class=\"smallFont\"> - BTC/USD</span>");
	    	
	    	var dogeThousand = dogeBTCrate * 1000 * btcUSDprice;
	    	$('#dogeBTC').html("<div class=\"headerThree\">DOGE</div><span><span id=\"price\">" + Math.ceil(dogeBTCrate*100000000) + "</span> <span class=\"smallFont\">Satoshi - DOGE/BTC</span></span><div><span><span id=\"price\"> $" + roundToThree(dogeThousand) + "</span><span class=\"smallFont\"> - 1000 &#272/USD</span></span></div>");
	    	$('#addressValue').html("<span id=\"price\">$" + roundToTwo(dogeBTCrate * btcUSDprice * addressBalance) + "</span>");
	    }	
	});
    }	
});

//Doge Balance
$.ajax({
	url: 'https://chain.so/api/v2/get_address_balance/DOGE/D7ALhFR4mZ4FcKL3r3vjA8BrqX9aGCut4g',
	dataType: 'jsonp',
	success: function(results){
		addressBalance = results.data.confirmed_balance;
		$('#addressInfo').html("<span id=\"price\">"+ roundToTwo(results.data.confirmed_balance) + "&#272</span>");
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
    url: 'http://multi.pandapool.info/api.php?q=userinfo&user=D7ALhFR4mZ4FcKL3r3vjA8BrqX9aGCut4g',
    dataType: 'json',
    success: function(results){
    	//Payouts
    	var payoutHTML = "<div class=\"headerTwo\">Payouts</div>";
		var payout24 = 0;
		
		for(i=0;i<10;i++)
		{
			var roundlocal = results.result.history[i].round;
    		var roundpayout = results.result.history[i].payout;
    		payoutHTML += "<div class=\"payouts\">Round " + roundlocal + ": " + roundToTwo(roundpayout) + " &#272</div>"
    		
    		if (i<6) {payout24 += roundpayout;}
		}

		$('#payouts').html(payoutHTML);
		
		//Payout Info
		$('#pay24').html("<div>Current 24 Hour Payout: " + roundToTwo(payout24) + " &#272</div>");
		round = results.result.history[0].round;
		var numberOfMiners = (results.result.workers.length);
	    
	    var url2 = 'http://multi.pandapool.info/api.php?q=roundinfo&round=' + round;
		url2 = encodeURIComponent(url2);
		url2 = 'http://jsonp.guffa.com/Proxy.ashx?url=' + url2;
	
		$.ajax({
	    url: url2,
	    dataType: 'jsonp',
	    success: function(results1){
	    	var expectedPay = results1.result.doge_mhs_day * (1300 * numberOfMiners / 1000);
	    	$('#mhReturnDoge').html("Current MH/s Return: " + roundToTwo(results1.result.doge_mhs_day) + " &#272/Day");
	    	$('#expected24pay').html("Expected 24 Hour Payout: " + roundToTwo(expectedPay) + " &#272/Day");
	    	$('#24percent').html("Percent Achieved: " + roundToTwo((payout24 / expectedPay)*100) + "%");
	    }
	 	});
		
		//Miners
		minerHTML = "<div><div class=\"default\" id=\"progressBar\" ><div></div></div><div class=\"minerHash\" id=\"totalHash\"></div><div class=\"miner\">Total Hashrate</div></div>";
    	var words = ["One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen","Twenty"];
    	
    	for(var i = 0; i<(results.result.workers.length);i++)
    	{
    		minerHTML += "<div><div class=\"default\" id=\"progressBar"+ (i+1) + "\" ><div></div></div><div class=\"minerHash\" id=\"miner" + (i+1) + "Hash\"></div><div class=\"miner\">Miner "+ words[i] +"</div></div>";
    	}

    	$('#miners').html(minerHTML);
    	
    	for(var i = 0; i<(results.result.workers.length);i++)
    	{
    		var hash = parseInt(results.result.workers[i][2]);
    		
    		if (hash > 1300) {progressBar(100, $('#progressBar' + (i+1)), hash);}

	    	else {progressBar(((hash/1300)*100), $('#progressBar' + (i+1)), hash);}
	    	
	    	$('#miner' + (i+1) + 'Hash').html(hash + " KH/S");
    	}
    	
    	var totalHash = 0;
    	
    	for (var i = 0; i < results.result.workers.length;i++) {totalHash = totalHash + parseInt(results.result.workers[i][2]);}
    	
    	if (totalHash > (results.result.workers.length)*1300){progressBar(100, $('#progressBar'), totalHash);}
    	else {progressBar(((totalHash/((results.result.workers.length)*1300))*100), $('#progressBar'), totalHash);}
    	
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