/**
 * GEM MAGUS karaktergeneráló és interaktív karakterlap
 * (c)2015 Sándor Preszter - https://opensource.org/licenses/MIT 
 * 
 * @author	Sándor Preszter <preszter.sandor@gmail.com>
 * @version	1.03
 * @since	2015-10-31 
 */ 

/**
 * Felhasználó figyelmeztetése, az oldal elhagyása előtt
 */ 
window.onbeforeunload = function() {
  return "Ha frissíted, vagy bezárod az oldalt, a nem mentett módosítások elvesznek!";
}

/**
 * JQuery onload / inicializálás
 */
  
$(function(){
	/**
	 * Téma megváltoztatása
	 */ 
	var theme = 0;
	$("#menu").find(".themebutton").on("click", function(){
		if(theme == 1){
			$("body").css("filter", "invert(0%)");
			$("body").css("-webkit-filter", "invert(0%)");
			$("body").css("background-color", "#ddd");
			theme = 0;	
		}
		else{
			$("body").css("-webkit-filter", "invert(100%)");	
			$("body").css("filter", "invert(100%)");
			$("body").css("background-color", "#222");
			theme = 1;	
		}
	});

	/**
	 * Tabok inicializálása
	 */     
	var tabTitle = $( "#tab_title" ),
	tabContent = $( "#tab_content" );
	
	var tabs = $( "#tabs" ).tabs();
	var tabsKarakteralkotas = $( "#tabsKarakteralkotas" ).tabs();
	var tabsKezdooldal = $( "#tabsKezdooldal" ).tabs();
	
	/**
	 * Egyéb Jquery és Jquery-Ui elemek inicializálása
	 */
	 
	// Karakteralkotás gomb 
	$("#karakteralkotas_start").button({icons:{secondary:"ui-icon-document"}});
	
	// Tooltipek
	$( ".tooltip" ).tooltip();
	
	// Spinnerek
	$( ".spinner" ).spinner({
		min:0,
		stop: function(event, ui) {
			$(this).change();
		}
	});
	$(".spinner").bind("keydown", function (event) {
		event.preventDefault();
	});
	
	// Gombok
	$( ".button" ).button();
	
	$("#karakteralkotas_start").click(function(){
		$("#tabsKezdooldal").hide();
		$("#tabsKarakteralkotas").show();
		karalk.ini();   
	}); 
	
	$("#homebutton").click(function(){
		if(confirm("Biztos, hogy vissza akarsz térni a kezdőoldalra? Minden nem mentett módosítás el fog veszni!")){
			location.reload();
		}
	}); 
	
	// Accordionok (harmonikák)
	$( ".accordion" ).accordion({heightStyle: "content", animate: false});

	/**
	 * Karakterlap betöltő
	 * Csak HTML5 böngésző támogatja	 
	 */
	$("button").hide();	 
	$('#files').on('change', function(evt){ 
		var files = evt.target.files;
		
		f = files[0];
		// Korábban f.type.match('text/xml') ellenőrzés volt, de a Chrome nem szereti az XML fájlokat
		if (true){
			var reader = new FileReader();
			
			reader.onload = (function(theFile){
				return function(e) {
					XMLtext = e.target.result;
					Gsave = $(interpretXML(XMLtext));
					ini();
				};
			})(f);
			reader.readAsText(f);
		}
		else{ alert("Érvénytelen file!"); }
	});


	/**
	 * Modulok inicializálása
	 * @constructor	 
	 */	 	
	function ini(){
		$("#tabsKezdooldal").hide();
		if (window.File && window.FileReader && window.FileList && window.Blob){
			if(kar.ini() == true){
				if(szintlepes.ini() == true && szintlepesek.ini() == true && targylista.ini() == true){
					$("#tabs").show();
					return true; 
				}else{ return false; }  
			}else{ return false; }
		}
		else{
			alert("A karakterlap nem támogatja a böngésződet! Frissíts egy HTML5 kompatibilis böngészőre (újabb Firefox vagy Chrome verziók)");
			return false;
		}
	}  

});

/**
 * Globális változók / függvények inicializálása
 * XMLkasztok, XMLfajok stb mind javascript string változóban tárolt XML kódok 
 * Sajnos a Chrome-ban a localhostról történő AJAX lekérdezés nem működik a Chrome biztonsági beállítása miatt
 *  Ezért az XML táblázatok kódját egy javascript string tárolja. Marcerás, de más megoldás nem volt. 
 */ 
Gsave = '';
var Gkasztok = $(interpretXML(XMLkasztok));
var Gfajok = $(interpretXML(XMLfajok));
var Ghatterek = $(interpretXML(XMLhatterek));
var Gtargyak = $(interpretXML(XMLtargyak));
var Gkonstansok = $(interpretXML(XMLkonstansok));
var Gkepzettsegek = $(interpretXML(XMLkepzettsegek));

/** XML objektum készítése XML textből
 * @returns	XMLoutput (XMLobject)
 */ 
function interpretXML(XMLtext){
	XMLoutput = $.parseXML(XMLtext);
	return XMLoutput;
}

/** XML objektumból XML text készítése
 * @returns	xmlString (string)
*/ 
function xmlToString(xmlData){ 
	var xmlString;
	//IE
	if (window.ActiveXObject){
		xmlString = xmlData.xml;
	}
	// Firefox, Chrome
	else{
		xmlString = (new XMLSerializer()).serializeToString(xmlData);
	}
	return xmlString;
}


