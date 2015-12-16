/**
 * Kockák plugin
 * 
 * @author	Sándor Preszter <preszter.sandor@gmail.com>
 * @version	1.0
 * @dependency	jquery-ui-min.js  
 */ 
var kockak = {
	/**
	 * Inicializálás
	 * @constructor
	 */
	ini: function(){
		// Gomb hozzáadása a főmenühöz
		$("#menu").append('<div><a class="tools"><img src="programdata/gfx/dot.gif" title="Eszközök" alt="Eszközök" class="icon tooltip" style="background-image: url(\'programdata/plugins/kockak/dice.png\') !important; background-position: 0 0 !important;" /></a></div>');
		
		// Pop-up ablak létrehozása
		$("#kockak-dialog").dialog({
			autoOpen: false,
			modal: false, 
			resizable: false,
			position: { my: "center top", at: "center top", of: window}
		});
		
		$("#menu").on("click", ".tools", function(){
			$("#kockak-dialog").dialog("open");	
		});
		
		$("#kockak_dobas").on("click", function(){
			kockak.dobas();	
		});
		
		$("#kockak_eredmenytorles").on("click", function(){
			$("#kockak_eredmenyek").html('');	
		}); 
	},
	
	/**
	 * Kockadobás, és eredmények kiírása
	 */	 	
	dobas: function(){
		$("#kockak_eredmeny").html('');
		e = 0;
		n = $("#kockak_kockakszama").val()*1;
		k = $("#kockak_kockakoldala").val()*1;
		
		for(i=1; i<=n; i++){
			x = '';
			if(k == 6){
				x = Math.round(Math.random()*(k-1))+1;
			}
			else{
				x = Math.round(Math.random()*k);
			}
			e += x;
			$("#kockak_eredmeny").append('<span>'+x+'</span>');	
		}
		// Kockaeredmények
		$("#kockak_eredmeny").append('<b style="font-size: 1.5em;">='+e+'</b>');
		
		// Eredmény history
		$("#kockak_eredmenyek").append(n+'k'+k+' &rarr; '+e+'\n');
		
		$("#kockak_eredmeny").find("span").css({
			"font-family": "Courier New, Courier",
			"font-size": "1.5em", 
			"display": "inline-block", 
			"background": "#0066aa", 
			"width": "2em", 
			"padding-top": "0.4em", 
			"padding-bottom": "0.4em", 
			"text-align": "center",
			"color": "#fff", 
			"font-weight": "bold", 
			"margin-left": "0.5em",
			"margin-bottom": "0.5em"
		});
		
		return true;
	}	 	 		
}

$(function(){
	kockak.ini();
});