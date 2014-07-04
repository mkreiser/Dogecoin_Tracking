$(document).ready(function(){$(".loading").hide().fadeIn("slow");$(".content").hide();});

init();

$(window).load(function(){$(".loading").fadeOut("slow", function(){$(".content").fadeIn("slow");});});

function init()
{
var dogeBTCrate;
var btcUSDprice;
var ltcUSDprice;
var round;
var dogeAddressBalance;
var btcAddressBalance;
var dogeValue;
var btcValue;
var minerHTML = "";

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
	    	
	    	//Wallet Values
	    	dogeValue = dogeBTCrate * btcUSDprice * dogeAddressBalance;
	    	btcValue = btcAddressBalance/100000000 * btcUSDprice;
	    	console.log(btcAddressBalance);
	    	console.log(results);
	    	$('#dogeAddressValue').html("<span id=\"price\">$" + roundToTwo(dogeValue) + "</span>");
	    	$('#btcAddressValue').html("<span id=\"price\">$" + roundToTwo(btcValue) + "</span>");
	    	$('#usdAddressValue').html("<span id=\"price\">$" + roundToTwo(dogeValue + btcValue) + "</span>");
	    }	
	});
    }	
});

//Doge Balance
$.ajax({
	url: 'https://chain.so/api/v2/get_address_balance/DOGE/DR8AbNaQNazgn2xKKetQWxUrkG6fMeRA7B',
	dataType: 'jsonp',
	success: function(results){
		dogeAddressBalance = results.data.confirmed_balance;
		$('#dogeAddressInfo').html("<span id=\"price\">"+ roundToTwo(results.data.confirmed_balance) + "&#272</span>");
	}
});

//Bitcoin Balance
url = 'http://blockchain.info/address/1NBk17C9cGgg5HUFRT54sQCZwr4AmkZYgn?format=json';
url = encodeURIComponent(url);
url = 'http://jsonp.guffa.com/Proxy.ashx?url=' + url;
$.ajax({
	url: url,
	dataType: 'jsonp',
	success: function(results){
		btcAddressBalance = results.final_balance;
		$('#btcAddressInfo').html("<span id=\"price\">" + roundToSix(results.final_balance/100000000) + " BTC</span>")
	}
});

//Wafflepool Miners
url = 'http://wafflepool.com/tmp_api?address=$1NBk17C9cGgg5HUFRT54sQCZwr4AmkZYgn';
url = encodeURIComponent(url);
url = 'http://jsonp.guffa.com/Proxy.ashx?url=' + url;
$.ajax({
	url: url,
	dataType:'jsonp',
	success: function(results){
		minerHTML += "<div class=\"miner\">Total Hashrate: " + roundToTwo(results.hash_rate/1000) + " KH/s</div>";
		minerHTML += "<div><span>CPU Miners: " + roundToTwo(results.worker_hashrates[0].hashrate/1000) +" KH/s</span><span>    GPU Miners: " + roundToTwo(results.worker_hashrates[1].hashrate/1000) +" KH/s</span></div>";
		$('#miners').html(minerHTML);
	}
});

//var words = ["One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen","Twenty"];
//progressBar(((hash/300)*100), $('#progressBar' + (i+1)), hash);}

function progressBar(percent, $element, miner) {
			var progressBarWidth = percent * $element.width() / 100;
			$element.find('div').animate({ width: progressBarWidth }, 500).html();
		}
}

function roundToTwo(num) { return +(Math.round(num + "e+2")  + "e-2"); }

function roundToThree(num) { return +(Math.round(num + "e+3")  + "e-3"); }

function roundToSix(num) { return +(Math.round(num + "e+6")  + "e-6"); }