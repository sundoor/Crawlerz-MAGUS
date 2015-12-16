/**
 * Karakteralkotás
 * 
 * @author	Sándor Preszter <preszter.sandor@gmail.com>
 * @version	1.1 
 */ 
var karalk = {
	xml: '<?xml version="1.0" encoding="UTF-8"?>',
	stage: 1,
	// A "kar" objektum tárolja ideiglenesen a felvitt karakter adatokat mentésig 
	kar: {
		profil: { knev: "", vnev: "", faj: 0, kaszt: 0, kulso: ""},
		tul: { ero:0, gyo:0, ugy:0, all:0, ege:0, int:0, kar:0, aka:0, asz:0, erz:0},
		kaptsz:0,
		hatterek:[],
		kepzettsegek:[]
	},
	
	// Mentés gomb megbénítása hiba esetén
	error: function(x){
		if(this.err != x)
		{
			if(this.err == 0){ 
				$("#tabsKarakteralkotas .save").button("option","disabled",true); 
			}
			else{ 
				$("#tabsKarakteralkotas .save").button("option","disabled",false); 
			}
			this.err = x;
		}
	},
	
	/**
	 * Karakteralkotó inicializálása
	 * @constructor
	 */	 	 	
	ini: function(){
		// Panelek elrejtése
		$("#karakteralkotas_2").hide();
		$("#karakteralkotas_3").hide();
		$("#karakteralkotas_4").hide();
		$("#karakteralkotas_5").hide();
		$("#karakteralkotas_6").hide();
		
		// Tovább és vissza gombok
		$("#karakteralkotas_ujra").button({icons:{primary:"ui-icon-arrowrefresh-1-w"}});
		$("#karakteralkotas_save").button({icons:{secondary:"ui-icon-disk"}});
		$("#karakteralkotas_save").hide();
		$("#karakteralkotas_tovabb").button({icons:{secondary:"ui-icon-seek-next"}});
		$("#karakteralkotas_tovabb").click(function( event ) {
		event.preventDefault();
		karalk.advance();
		});
		
		return true;
	},
	
	/**
	 * HTML <select> elemek feltöltése
	 */	 	
	iniSelectors: function(xml, loc, selectdom){
		selecter = '';
		$(xml).find(loc).each(function(){
			selecter += '<option value='+$(this).attr("id")+'>'+$(this).attr("name")+'</option>';
		});
		return $(selectdom).html(selecter);        
	},
	
	/**
	 * Negatív értékek megakadályozása
	 */
	validate: function(variable, domref){
		if(variable<0){ domref.addClass("ui-state-error"); this.error(1); return false; }
		else{ domref.removeClass("ui-state-error"); this.error(0); return true; }    
	},
	
	/**
	 * Karaktergeneráló léptetése
	 */	 	
	advance: function(){
		$("#karakteralkotas_"+this.stage).hide();
		this.stage++;
		$("#karakteralkotas_"+this.stage).show();
		
		switch(this.stage){
			case 2:
				this.alapadatok.ini();
				break;
			case 3:
				this.alapadatok.save();
				this.tulajdonsagok.ini();
				break;
			case 4:
				this.tulajdonsagok.save();
				this.hatterek.ini();
				break;
			case 5:
				this.hatterek.save();
				this.kepzettsegek.ini();
				break;
			case 6:
				this.kepzettsegek.save();
				this.osszesites.ini();
				break;  
		}
	},
	
	/**
	 * Alapadatok rögzítése objektumba, első panel
	 */	 	
	alapadatok: {
		/**
		 * Inicializálás		
		 * @constructor
		 */		 		
		ini: function(){
			karalk.iniSelectors(Gfajok, "fajok>faj", "#karakteralkotas_faj");
			karalk.iniSelectors(Gkasztok, "kasztok>kaszt", "#karakteralkotas_kaszt"); 
			karalk.error(1);
			$("#karakteralkotas_knev").val("");
			$("#karakteralkotas_vnev").val("");
			$("#karakteralkotas_knev").change(function(){
				if($(this).val().length>0){ error(0); }
				else{ karalk.error(1); }
			});
		},
		/**
		 * Alapadatok mentése
		 */		 		
		save: function(){
			karalk.kar.profil.knev = $("#karakteralkotas_knev").val();
			karalk.kar.profil.vnev = $("#karakteralkotas_vnev").val();
			karalk.kar.profil.faj = $("#karakteralkotas_faj").val();
			karalk.kar.profil.kaszt = $("#karakteralkotas_kaszt").val();
			karalk.kar.profil.kulso = $("#karakteralkotas_kulso").val();
		}
	},
	
	/**
	 * Tulajdonságok rögzítése objektumba, második panel
	 */
	tulajdonsagok: {
		/**
		 * Inicializálás		
		 * @constructor
		 */
		ini: function(){
			$('#karakteralkotas_tulajdonsagok .spinner').spinner( "option", "max", 20 );
			$('#karakteralkotas_tulajdonsagok .spinner').spinner( "option", "min", 1 );
			$('#karakteralkotas_tulajdonsagok .spinner').change(function(event){
				karalk.tulajdonsagok.update();    
			});
			this.update();    
		},
		
		/**
		 * Tulajdonságok újraszámolás
		 */		 		
		update: function(){
			elosztottpontok = 0;
			$( '#karakteralkotas_tulajdonsagok').find('input').each(function(){
				elosztottpontok = elosztottpontok + $(this).val()*1;
			});
			elosztottpontok = Gkonstansok.find("konstansok>tulajdonsagpontok").text()*1-elosztottpontok;
			karalk.validate(elosztottpontok, $("#karakteralkotas_tulajdonsagpontok").parent()); 
			$( "#karakteralkotas_tulajdonsagpontok" ).html(elosztottpontok);
		},
		
		/**
		 * Tulajdonságok mentése
		 */
		save: function(){
			karalk.kar.tul.ero = $("#karakteralkotas_ero").val();
			karalk.kar.tul.gyo = $("#karakteralkotas_gyo").val(); 
			karalk.kar.tul.ugy = $("#karakteralkotas_ugy").val();
			karalk.kar.tul.all = $("#karakteralkotas_all").val();
			karalk.kar.tul.ege = $("#karakteralkotas_ege").val();
			karalk.kar.tul.int = $("#karakteralkotas_int").val();
			karalk.kar.tul.kar = $("#karakteralkotas_kar").val();
			karalk.kar.tul.aka = $("#karakteralkotas_aka").val(); 
			karalk.kar.tul.asz = $("#karakteralkotas_asz").val();
			karalk.kar.tul.erz = $("#karakteralkotas_erz").val();  
		}            
	},
	
	/**
	 * Hátterek rögzítése objektumba, harmadik panel
	 */
	hatterek: {
		/**
		 * Inicializálás		
		 * @constructor
		 */
		ini: function(){       
			karalk.iniSelectors(Ghatterek, "hatterek>hatter", "#karakteralkotas_hattervalaszto");
			
			$("#karakteralkotas_hattervalaszto").change(function(){ 
				karalk.hatterek.update(); 
			});
			
			$("#karakteralkotas_hatterhozzaado").click(function(){ 
				karalk.hatterek.add(null, null, null); 
				karalk.hatterek.update(); 
			});
			
			// Háttér fajból                                  
			if(karalk.kar.profil.faj > 0){ karalk.hatterek.add(true, 11, 1); }
			
			// Hátterek kasztból
			Gkasztok.find('kasztok>kaszt[id="'+karalk.kar.profil.kaszt+'"]>mod').each(function(){
				karalk.hatterek.add(true, $(this).attr("refid"), $(this).attr("kap"));
			});
			
			// Dinamikusan generált sorok eltávolítógombja
			$("#karakteralkotas_hatterek").on( "click", "a.removeline", function() {
				$(this).closest("tr").remove();
				karalk.hatterek.update();
			}); 
			
			this.update();   
		},
		
		/**
		 * Hátterek frissítése (KAP/TSZ újraszámolása)
		 */		 		
		update: function(){
			node = Ghatterek.find('hatterek>hatter[id="'+$("#karakteralkotas_hattervalaszto").val()+'"]');
			$("#karakteralkotas_hatterkap").html(node.attr("kap")); 
			
			kaptsz = 0;
			$("#karakteralkotas_hatterek").find('.kap').each(function(){
				kaptsz += $(this).text()*1;  
			});
			kaptsz = Gkonstansok.find("konstansok>kap").text()*1-kaptsz;
			
			karalk.validate(kaptsz, $("#karakteralkotas_kaptsz").parent()); 
			$( "#karakteralkotas_kaptsz" ).html(kaptsz);     
		},
		
		/**
		 * Háttér hozzáadása
		 */		 		
		add: function(fixed, id, kap){
			if(id === null){ id = $("#karakteralkotas_hattervalaszto").val(); }
			node = Ghatterek.find('hatterek>hatter[id="'+id+'"]');
			x = '<tr class="add"><td style="text-align:left;">'+node.attr("name")+'<input type="hidden" value="'+node.attr("id")+'"/></td><td class="kap">'+((kap === null || kap == 1)? node.attr("kap") : kap)+'</td><td>'+((fixed === null) ? '<a class="removeline button"><img src="programdata/gfx/dot.gif" alt="Eltávolítás" class="icon ic_s_cancel" /></a>':'')+'</td></tr>';
			$("#karakteralkotas_hatterek").append(x);
		},
		
		/**
		 * Hátterek mentése
		 */
		save: function(){
			$("#karakteralkotas_hatterek").find('input[type="hidden"]').each(function(){
				karalk.kar.hatterek.push(new Array($(this).val(), (($(this).closest("tr").find('td[class="kap"]').text()*1>0)?1:0)));
			});
			karalk.kar.kaptsz = $("#karakteralkotas_kaptsz").text();
		}    
	},
	
	/**
	 * Képzettségek rögzítése objektumba, negyedik panel
	 */
	kepzettsegek: {
		/**
		 * Inicializálás		
		 * @constructor
		 */
		ini: function(){       
			karalk.iniSelectors(Gkepzettsegek, "kepzettsegek>kepzettseg", "#karakteralkotas_kepzettsegvalaszto");
			$("#karakteralkotas_kepzettsegvalaszto").change(function(){ karalk.kepzettsegek.update(); });
			$("#karakteralkotas_kepzettseghozzaado").click(function(){ karalk.kepzettsegek.add(); karalk.kepzettsegek.update(); });
			
			// Dinamikusan generált sorok eltávolítógombja
			$("#karakteralkotas_kepzettsegek").on( "click", "a.removeline", function() {
				$(this).closest("tr").remove();
				karalk.kepzettsegek.update();
			}); 
			
			this.update();   
		},
		
		/**
		 * Képzettségek frissítése
		 */
		update: function(){
			node = Gkepzettsegek.find('kepzettsegek>kepzettseg[id="'+$("#karakteralkotas_kepzettsegvalaszto").val()+'"]');
			// Szükséges-e specializáció
			if(node.attr("spec") == 0){
				$("#karakteralkotas_kepzettsegspec").hide();
				$("#karakteralkotas_kepzettsegspec").val("");
			}
			else{
				$("#karakteralkotas_kepzettsegspec").show(); 
				$("#karakteralkotas_kepzettsegspec").val(""); 
			}
			
			// Százalékos képzettség
			if(node.attr("tipus") == "S"){
				kepzettsegfok = '<input id="karakteralkotas_kepzettsegvalasztofok" class="spinner" value="0"/>';
			}
			// Egyéb képzettség
			else{
				kepzettsegfok = '<select id="karakteralkotas_kepzettsegvalasztofok"><option value="1">1</value><option value="2">2</value><option value="3">3</value><option value="4">4</value><option value="5">5</value></select>';  
			}
			$("#karakteralkotas_kepzettsegfokvalaszto").html(kepzettsegfok);     
		},
		
		/**
		 * Képzettség hozzáadása
		 */
		add: function(){
			d = new Date();
			node = Gkepzettsegek.find('kepzettsegek>kepzettseg[id="'+$("#karakteralkotas_kepzettsegvalaszto").val()+'"]');
			x = '<tr id="'+d.getTime()+'"><td style="text-align:left;">'+node.attr("name")+'<input type="hidden" value="'+node.attr("id")+'"/></td><td class="spec">'+((node.attr("spec") == 1) ? $("#karakteralkotas_kepzettsegspec").val() : '')+'</td><td class="fok">'+$("#karakteralkotas_kepzettsegvalasztofok").val()+'</td><td><a class="removeline button"><img src="programdata/gfx/dot.gif" alt="Eltávolítás" class="icon ic_s_cancel" /></a></td></tr>';
			$("#karakteralkotas_kepzettsegek").append(x);
		},
		
		/**
		 * Képzettségek mentése
		 */		 		
		save: function(){
			$("#karakteralkotas_kepzettsegek").find('input[type="hidden"]').each(function(){
				karalk.kar.kepzettsegek.push(new Array($(this).val(), $(this).closest("tr").find('td[class="fok"]').text()*1, $(this).closest("tr").find('td[class="spec"]').text(), $(this).closest("tr").attr("id")));
			});
		} 
	},
	
	/**
	 * Karakteralkotás összesítése, utolsó panel
	 */	 	
	osszesites: {
		/**
		 * Inicializálás		
		 * @constructor
		 */
		ini: function(){
			$("#karakteralkotas_osszesites").html("");
			// Alapadatok és tulajdonságok
			text = "Név: "+karalk.kar.profil.knev+" "+karalk.kar.profil.vnev+"\n";
			text += "Faj: "+Gfajok.find('fajok>faj[id="'+karalk.kar.profil.faj+'"]').attr("name")+"\n";
			text += "Kaszt: "+Gkasztok.find('kasztok>kaszt[id="'+karalk.kar.profil.kaszt+'"]').attr("name")+"\n\n";
			text += "ERŐ: "+karalk.kar.tul.ero+"\t"+"GYO: "+karalk.kar.tul.gyo+"\t"+"ÜGY: "+karalk.kar.tul.ugy+"\t"+"ÁLL: "+karalk.kar.tul.all+"\t"+"EGÉ: "+karalk.kar.tul.ege+"\n";
			text += "INT: "+karalk.kar.tul.int+"\t"+"KAR: "+karalk.kar.tul.kar+"\t"+"AKA: "+karalk.kar.tul.aka+"\t"+"ASZ: "+karalk.kar.tul.asz+"\t"+"ÉRZ: "+karalk.kar.tul.erz+"\n\n";
			
			// Hátterek
			text += "== HÁTTÉR (KAP/TSZ: "+karalk.kar.kaptsz+") ==\n";
			n = karalk.kar.hatterek.length;
			for(i=0; i<n; i++){
				text += Ghatterek.find('hatterek>hatter[id="'+karalk.kar.hatterek[i][0]+'"]').attr("name")+"\n";
			}
			
			// Képzettségek
			text += "\n== KÉPZETTSÉGEK ==\n";
			n = karalk.kar.kepzettsegek.length;
			for(i=0; i<n; i++){
				text += Gkepzettsegek.find('kepzettsegek>kepzettseg[id="'+karalk.kar.kepzettsegek[i][0]+'"]').attr("name")+" ("+karalk.kar.kepzettsegek[i][1]+")\n";
			}
			$("#karakteralkotas_osszesites").html(text); text = "";
			
			$("#karakteralkotas_tovabb").hide();
			$("#karakteralkotas_save").click(function( event ) {
				event.preventDefault();
				karalk.osszesites.save();
			});
			$("#karakteralkotas_save").show();
		},
		
		/**
		 * Karakteralkotás mentése
		 */		 		
		save: function(){
			// Alapadatok és tulajdonságok
			karalk.xml += '<karakterlap><karakter>';
			d = new Date();
			karalk.xml += '<letrehozva>'+d.getTime()+'</letrehozva>';
			karalk.xml += '<profil><knev>'+karalk.kar.profil.knev+'</knev><vnev>'+karalk.kar.profil.vnev+'</vnev><faj>'+karalk.kar.profil.faj+'</faj><kaszt>'+karalk.kar.profil.kaszt+'</kaszt><kulso><![CDATA['+karalk.kar.profil.kulso+']]></kulso></profil>';
			karalk.xml += '<tulajdonsagok><tul id="ero">'+karalk.kar.tul.ero+'</tul><tul id="gyo">'+karalk.kar.tul.gyo+'</tul><tul id="ugy">'+karalk.kar.tul.ugy+'</tul><tul id="all">'+karalk.kar.tul.all+'</tul><tul id="ege">'+karalk.kar.tul.ege+'</tul>';
			karalk.xml += '<tul id="int">'+karalk.kar.tul.int+'</tul><tul id="kar">'+karalk.kar.tul.kar+'</tul><tul id="aka">'+karalk.kar.tul.aka+'</tul><tul id="asz">'+karalk.kar.tul.asz+'</tul><tul id="erz">'+karalk.kar.tul.erz+'</tul></tulajdonsagok>';
			// Hátterek
			karalk.xml += "<hatterek>";
			n = karalk.kar.hatterek.length;
			for(i=0; i<n; i++){
				karalk.xml += '<hatter id="'+karalk.kar.hatterek[i][0]+'" kap="'+karalk.kar.hatterek[i][1]+'"/>';
			}
			// Képzettségek
			karalk.xml += "</hatterek><kepzettsegek>";
			n = karalk.kar.kepzettsegek.length;
			for(i=0; i<n; i++){
				karalk.xml += '<kepzettseg uniqueid="'+karalk.kar.kepzettsegek[i][3]+'" id="'+karalk.kar.kepzettsegek[i][0]+'" fok="'+karalk.kar.kepzettsegek[i][1]+'" spec="'+karalk.kar.kepzettsegek[i][2]+'"/>';
			}
			karalk.xml += "</kepzettsegek>";
			karalk.xml += "</karakter><szintlepesek></szintlepesek><targyak></targyak><elotortenet></elotortenet></karakterlap>";
			this.download("save.xml", karalk.xml);
		},
		
		/**
		 * Karakterlap exportálása XML file-ba
		 */		 		
		download: function(filename, text){
			var pom = document.createElement('a');
			pom.setAttribute('href', 'data:text/xml;charset=utf-8,' + encodeURIComponent(text));
			pom.setAttribute('download', filename);
			
			if (document.createEvent){
				var event = document.createEvent('MouseEvents');
				event.initEvent('click', true, true);
				pom.dispatchEvent(event);
			}
			else {
				pom.click();
			}
		}
	}
}