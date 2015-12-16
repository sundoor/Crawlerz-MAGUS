/**
 * Karakterlap kezelése
 * 
 * @author	Sándor Preszter <preszter.sandor@gmail.com>
 * @version	1.1
 */ 
var kar = {
	profil: {knev: "", vnev: "", faj: 0, kaszt: 0, kulso: ""},
	ero:0, gyo:0, ugy:0, all:0, ege:0, int:0, kar:0, aka:0, asz:0, erz:0,
	ep:0, fp:0, pp:0, mp:0, kp:0, mtme:0, atme:0, mgt:0, sfe:0, ke:0, te:0, ve:0, ce:0, spb:0, alapve:0,
	mod : {ero:0, gyo:0, ugy:0, all:0, ege:0, int:0, kar:0, aka:0, asz:0, erz:0,
		ep:0, fp:0, pp:0, mp:0, kp:0, mtme:0, atme:0, mgt:0, sfe:0, ke:0, te:0, ve:0, ce:0, spb:0, sp:""},
	kepzp:0,
	kaptsz:0,
	hatterek:[],
	kepzettsegek:[],
	targyak: [],
	
	/**
	 * Ez készíti elő a karakterlapot
	 * @constructor
	 */	 	 	
	ini: function(){
	
	/**
	 * Karakterlap Jquery-ui accordion
	 */	 	
	$("#tabs-1").find(".accordion").accordion( "option", "collapsible", true );
	
	/**
	 * Karakterlap mentése
	 */	 	
	$("#menu").on( "click", "a.save", function() {
		kar.save(); 
    	}); 
    
	this.update();
	
	/**
	 * Interface frissítése karakterbetöltéskor
	 */	 	
	d = new Date(Gsave.find("karakterlap>karakter>letrehozva").text()*1);
	$('#menu').append('<div><a><img src="programdata/gfx/dot.gif" title="Betöltött karakter" alt="Karakter" class="icon ic_b_usrcheck" /><span>'+this.profil.knev +' '+this.profil.vnev+' ('+d.getFullYear()+'.'+(d.getMonth()+1)+'.'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+')</span></a></div>');
	document.title = this.profil.knev +' '+this.profil.vnev;
	  
	  return true;
  	},
	
	/**
	 * Karakterlap frissítése / átszámolása
	 * A karakterlap object paraméterekkel dolgozik (lsd. fentebb) az XML-be mentéskor kerülnek be az adatok	 
	 */	 	
	update: function(){
	
		// Változók alapértékbe helyezése
		for(key in kar.mod){
			kar.mod[key] = 0;
		}
	
		this.ep = 0;
	    	this.fp = 0;
	    	this.pp = 0;
	    	this.mp = 0;
	    	this.kp = 0;
	    	this.ke = 0;
	    	this.te = 0;
	    	this.ve = 0;
	    	this.ce = 0;
	    	this.mtme = 0;
	    	this.atme = 0;
	        this.kepzp = 0; 
	
      		this.profil.knev = Gsave.find("karakterlap>karakter>profil>knev").text();
  		this.profil.vnev = Gsave.find("karakterlap>karakter>profil>vnev").text();
  		this.profil.faj = Gsave.find("karakterlap>karakter>profil>faj").text();
  		this.profil.kaszt = Gsave.find("karakterlap>karakter>profil>kaszt").text();
  		this.profil.kulso = Gsave.find("karakterlap>karakter>profil>kulso").text();
  
  		this.ero = Gsave.find('karakterlap>karakter>tulajdonsagok>tul[id="ero"]').text()*1;
	    	this.gyo = Gsave.find('karakterlap>karakter>tulajdonsagok>tul[id="gyo"]').text()*1;
	    	this.ugy = Gsave.find('karakterlap>karakter>tulajdonsagok>tul[id="ugy"]').text()*1;
	    	this.all = Gsave.find('karakterlap>karakter>tulajdonsagok>tul[id="all"]').text()*1;
	    	this.ege = Gsave.find('karakterlap>karakter>tulajdonsagok>tul[id="ege"]').text()*1;
	    	this.int = Gsave.find('karakterlap>karakter>tulajdonsagok>tul[id="int"]').text()*1;
	    	this.kar = Gsave.find('karakterlap>karakter>tulajdonsagok>tul[id="kar"]').text()*1;
	    	this.aka = Gsave.find('karakterlap>karakter>tulajdonsagok>tul[id="aka"]').text()*1;
	    	this.asz = Gsave.find('karakterlap>karakter>tulajdonsagok>tul[id="asz"]').text()*1;
	    	this.erz = Gsave.find('karakterlap>karakter>tulajdonsagok>tul[id="erz"]').text()*1;
    	
	    	this.alapve = Gkonstansok.find('konstansok>alapve').text()*1;
	  	this.kaptsz = Gkonstansok.find('konstansok>kap').text()*1;
  	  
  	  	/** 
  	  	 * Szintlépésből jövő tulajdonság és hm növelések (szintlépés node-ok feldolgozása)
  	  	 */  	  	 
  	  	Gsave.find("karakterlap>szintlepesek>szintlepes").each(function(){
	      		$(this).find("mod").each(function(){
	        		kar[$(this).attr("refid")] += $(this).attr("value")*1;
        		});    
	    	});
  	  
  	  	/** 
  	  	 * Hátterek
  	  	 */  	  	 
  	  	Gsave.find('karakterlap>karakter>hatterek>hatter').each(function(){
			kar.hatterek.push({id: $(this).attr("id"), kap: $(this).attr("kap")});
      
  			// Háttérból jövő bónuszok hozzáadása
  			Gsave.find('karakterlap>karakter>hatterek>hatter[id="'+$(this).attr("id")+'"]').each(function(){
	    			if($(this).attr("perszint") == 0){
	    				kar[$(this).attr("refid")] += $(this).attr("value");
	    			}
  			});
  			
  			// Szintenkénti KAP levonása
			if($(this).attr("kap") == 1){
  				kar.kaptsz -= Ghatterek.find('hatterek>hatter[id="'+$(this).attr("id")+'"]').attr("kap")*1;
  			}
		  });
		  
		this.ep += this.ege;
	    	this.fp += this.all + this.aka;
	    	this.pp += this.int;
	    	this.kp += this.int;
	    	this.ke += this.erz + this.gyo;
	    	this.te += this.ero + this.gyo + this.ugy;
	    	this.ve += this.alapve + this.gyo + this.ugy;
	    	this.ce += this.erz + this.ugy;
	    	this.mtme += this.aka;
	    	this.atme += this.asz;
	      	this.kepzp += this.int;
	      	// Erő 15 feletti része hozzáadódik a sebzéshez
		this.spb = ((this.ero > 15) ? (this.ero - 15) : 0); 
      
		/**
		 * Képzettségek
		 */              
		this.kepzettsegek = [];
		Gsave.find('karakterlap>karakter>kepzettsegek>kepzettseg').each(function(){
		 	kar.kepzettsegek.push({uniqueid: $(this).attr("uniqueid"), id: $(this).attr("id"), fok: $(this).attr("fok")*1, spec: $(this).attr("spec")});
		});
		  
		// Szintlépésből jövő képzettségek
		Gsave.find("karakterlap>szintlepesek>szintlepes>kepzettsegek").each(function(){
		
			$(this).find("kepzettseg").each(function(){
				x = false;
				n = kar.kepzettsegek.length;
				
			for(i=0; i<n; i++){
				if(kar.kepzettsegek[i].uniqueid == $(this).attr('uniqueid')){
					kar.kepzettsegek[i].fok += $(this).attr('fok')*1;
					 
					if(kar.kepzettsegek[i].spec != $(this).attr('spec') && $(this).attr('spec').length > 0){
						kar.kepzettsegek[i].spec = $(this).attr('spec');
					}
					
					x = true;         
					break;
				}
			}
			
			if(!x){
				kar.kepzettsegek.push({uniqueid: $(this).attr("uniqueid"), id: $(this).attr("id"), fok: $(this).attr("fok"), spec: $(this).attr("spec")});  
			}
			
			// Képzettség KP levonása
			kar.kepzp -= $(this).attr("kap");
			});    
		});
		
		/**
		 * Módosított tulajdonságok és harcértékek kiszámolása
		 */		 		
		Gsave.find('karakterlap>targyak>targy[visel="1"]').each(function(){
			$(this).find('mod').each(function(){  
				kar.mod[$(this).attr('refid')] += $(this).attr('value')*1; 	
			});
			
			if($(this).attr('template') > 0){
				node = Gtargyak.find('targyak>targy[id="'+$(this).attr('template')+'"]');
				kar.mod.ke += node.attr("ke")*1;
				kar.mod.te += node.attr("te")*1;
				kar.mod.ve += node.attr("ve")*1;
				kar.mod.ce += node.attr("ce")*1;
				kar.mod.sfe += node.attr("sfe")*1;
				kar.mod.mgt += node.attr("mgt")*1;
				if(node.attr("sp") != 0 && node.attr("kateg") != 19){
					kar.mod.sp = node.attr("sp");
				}
				
				// Tárgyhoz tartozó képzettség fokának kikeresése
				kfok = 0;
				for(key in kar.kepzettsegek){
					if(kar.kepzettsegek[key]["id"] == node.attr("kateg")){
						kfok = kar.kepzettsegek[key]["fok"]
					}
				}
				if(!kfok){ kfok = 0; }
				
				// Megfelelő képzettségmódosító hozzáadása
				// Vértviselet
				if(node.attr("kateg")*1 == 24){
					Gkonstansok.find('konstansok>vertviselet_bonusz>bonusz[fok="'+kfok+'"][meret="'+node.attr("meret")+'"]>mod').each(function(){
						// MGT módosító korrigálása, hogy csak a vért MGT-jét csökkentse a képzettség, ne a totált
						// SFÉ bónusznál ez a feltétel nem fog teljesülni soha
						kar.mod[$(this).attr("refid")] += (((node.attr("mgt")+$(this).attr("value")*1) < 0) ? node.attr("mgt")*(-1) : $(this).attr("value")*1);
					});
				}
				// Pajzshasználat
				else if(node.attr("kateg")*1 == 19){
					Gkonstansok.find('konstansok>pajzshasznalat_bonusz>bonusz[fok="'+kfok+'"]>mod').each(function(){
						// MGT módosító korrigálása, hogy csak a pajzs MGT-jét csökkentse a képzettség, ne a totált
						kar.mod[$(this).attr("refid")] += (((node.attr("mgt")+$(this).attr("value")*1) < 0) ? node.attr("mgt")*(-1) : $(this).attr("value")*1);
					});
				}
				// Fegyverhasználat, pusztakezes harc, harcművészet
				else if(node.attr("kateg")*1 > 0){
					Gkonstansok.find('konstansok>fegyverhasznalat_bonusz>bonusz[fok="'+kfok+'"]>mod').each(function(){
						kar.mod[$(this).attr("refid")] += $(this).attr("value")*1;
					});
				}
			}	
		});
		
		// Felszerelés nélküli értékek hozzáadása
		for(key in kar.mod){
			if(key != "sp"){
				kar.mod[key] += kar[key]*1;
			}
		}
		
		// MGT számolás
		// MGT 5 alá nem csökkenthet tulajdonságot (viszont nem a kar.mod-ból számoljuk, mert a mágikus tárgyak csökkenthetik tovább
		// MGT állóképesség levonás nem befolyásolja az FP-t
		x = kar.mgtcalc(kar.ugy, kar.mod.mgt, 5);
		y = kar.mgtcalc(kar.gyo, kar.mod.mgt, 5);
		z = kar.mgtcalc(kar.all, kar.mod.mgt, 5);
		kar.mod.ugy -= x;
		kar.mod.gyo -= y;
		kar.mod.all -= z;
		kar.mod.ke -= y;
		kar.mod.te -= (x+y);
		kar.mod.ve -= (x+y);
		kar.mod.ce -= x;
		delete x;
		delete y;
		delete z;
		 
	this.display();
	},
	
	/** 
	 * MGT módosítók kiszámolása és értékek módosítása
	 * @variable	limit = tulajdonság alsó határa (szabálykönyv által meghatározva)
	 * @variable	tul = tulajdonság amivel számolni kell
	 * @variable	mgt = mozgásgátló tényező értéke	 	 
	 * @returns 	(int) MGT levonás értéke
	 */
	mgtcalc: function(tul, mgt, limit){
		n = (((tul - mgt) < limit) ? (tul-limit) : mgt);
		return n;		
	},	 	 	 	
	
	/**
	 * Karakterlap értékek HTML-be írása
	 */ 	
	display: function(){
		$("#karakterlap_nev").text(kar.profil.knev+" "+kar.profil.vnev); 
		$("#karakterlap_faj").text(Gfajok.find("fajok>faj[id="+kar.profil.faj+"]").attr("name"));
		$("#karakterlap_kaszt").text(Gkasztok.find("kasztok>kaszt[id="+kar.profil.kaszt+"]").attr("name"));
		$("#karakterlap_kulso").text(kar.profil.kulso);
		$("#karakterlap_kaptsz").text(kar.kaptsz);
		$("#karakterlap_kepzp").text(kar.kepzp);
		
		Gsave.find("karakterlap>karakter>tulajdonsagok>tul").each( function(){ $("#karakterlap_"+$(this).attr("id")).text(kar.mod[$(this).attr("id")]) } );
		
		// Alap harcértékek karakterlapra írása
		$("#karakterlap_ep").text(kar.mod.ep);
		$("#karakterlap_fp").text(kar.mod.fp);
		$("#karakterlap_pp").text(kar.mod.pp);
		$("#karakterlap_mp").text(kar.mod.mp);
		$("#karakterlap_kp").text(kar.mod.kp);
		$("#karakterlap_mtme").text(kar.mod.mtme);
		$("#karakterlap_atme").text(kar.mod.atme);
		$("#karakterlap_mgt").text(kar.mgt);
		$("#karakterlap_sfe").text(kar.sfe);
		$("#karakterlap_ke").text(kar.ke);
		$("#karakterlap_te").text(kar.te);
		$("#karakterlap_ve").text(kar.ve);
		$("#karakterlap_ce").text(kar.ce);
		$("#karakterlap_sp").text("1k3");
		
		$("#karakterlap_mod_mgt").text(kar.mod.mgt);
		$("#karakterlap_mod_sfe").text(kar.mod.sfe);
		$("#karakterlap_mod_ke").text(kar.mod.ke);
		$("#karakterlap_mod_te").text(kar.mod.te);
		$("#karakterlap_mod_ve").text(kar.mod.ve);
		$("#karakterlap_mod_ce").text(kar.mod.ce);
		$("#karakterlap_mod_sp").text(kar.mod.sp+'+'+kar.mod.spb);
		
		// Hátterek karakterlapra írása
		$("#karakterlap_hatterek").html("");
		Gsave.find("karakterlap>karakter>hatterek>hatter").each( function(){     
			$("#karakterlap_hatterek").append('<span class="tag">'+Ghatterek.find("hatterek>hatter[id="+$(this).attr("id")+"]").attr("name")+'</span>'); 
		});
		
		// TSZ karakterlapra írása
		$("#karakterlap_tsz").text( Gsave.find("karakterlap>szintlepesek>szintlepes").length );
		
		// Előtörténet karakterlapra írása
		$("#elotortenet").text( Gsave.find("karakterlap>elotortenet").text());
		
		kar.kepzettseglap.update();
	},
	
	/**
	 * Képzettségek listájának kezelése
	 */	 	
	kepzettseglap: {
		update: function(){
			$("#karakterlap_kepzettseglap").html('');  
			$("#karakterlap_kepzettseglap").append('<tr><th style="width: 200px;">Képzettség</th><th style="width: 200px;">Specializáció</th><th>Fok</th></tr>');
			 
			n = kar.kepzettsegek.length;
			for(i=0; i<n; i++){
				this.addfixed(kar.kepzettsegek[i]["uniqueid"], kar.kepzettsegek[i]["id"], kar.kepzettsegek[i]["fok"], kar.kepzettsegek[i]["spec"]); 
			}
		},
		
		addfixed: function(uniqueid, id, fok, spec){
			node = Gkepzettsegek.find('kepzettsegek>kepzettseg[id="'+id+'"]');
			x = '<tr class="kepzettseg" id="'+uniqueid+'">';
			x += '<td style="text-align:left;">'+node.attr("name")+'</td>';
			x += '<td class="spec">'+((node.attr("spec") == 1) ? spec : '')+'</td>';
			x += '<td class="fok">'+fok+'</td>';
			$("#karakterlap_kepzettseglap").append(x);
		}
	},
	
	/**
	 * Karakterlap mentése
	 */	 	
	save: function(){
		Gsave.find("karakterlap>elotortenet").text($('#elotortenet').val());
		Gsave.find("karakterlap>karakter>profil>kulso").text($('#karakterlap_kulso').val());
		
		this.download("save.xml", xmlToString(Gsave[0]));  
	},
	
	/**
	 * Karakterlap kiexportálása file-ba
	 */	 	
	download: function(filename, text) {
		var pom = document.createElement('a');
		pom.setAttribute('href', 'data:text/xml;charset=utf-8,' + encodeURIComponent(text));
		pom.setAttribute('download', filename);
		
		if (document.createEvent) {
			var event = document.createEvent('MouseEvents');
			event.initEvent('click', true, true);
			pom.dispatchEvent(event);
		}
		else {
			pom.click();
		}
	}
}