 /**
 * Szintlépések hozzáadása
 * 
 * @author	Sándor Preszter <preszter.sandor@gmail.com>
 * @version	1.02
 */ 
var szintlepes = {
	xml: '',
	err: 0,
	letrehozva: 0,
	kap: 0,
	ero:0, gyo:0, ugy:0, all:0, ege:0, int:0, kar:0, aka:0, asz:0, erz:0,
	ep:0, fp:0, pp:0, mp:0, kp:0, mtme:0, atme:0, ke:0, te:0, ve:0, ce:0,
	
	/**
	 * Szintlépés inicializálása
	 * @constructor
	 */	 	 	
	ini: function(){
		$('#tabs-2').on("change", "input", function(){
			szintlepes.update();   
		});
		
		// Szintlépés mentése gomb
		$("#tabs-2").on( "click", "a.save", function(){
			if($("#szintlepes_kap").text()*1 != 0){
				alert("Az összes KAP-ot el kell költened szintlépéskor!");  
			}
			else{
				if(confirm("Biztos, hogy menteni akarod a szintlépést?")){
					if(szintlepes.save()){
						alert("Szintlépés sikeresen elmentve!");
						kar.update();
						szintlepesek.update();  
					}
				}
			}
		}); 
		
		$("#tabs-2").on( "click", "a.reset", function() {
			if(confirm("Biztos, hogy újra akarod kezdeni a szintlépést?")){
				szintlepes.reset();
			}
		});
		
		// Képzettség gombok
		$("#szintlepes_kepzettsegek").on( "change", "#szintlepes_kepzettsegvalaszto", function(){ 
			szintlepes.kepzettsegek.update(); 
		});
		
		$("#szintlepes_kepzettsegek").on( "click", "#szintlepes_kepzettseghozzaado", function(){
			szintlepes.kepzettsegek.add(); szintlepes.kepzettsegek.update(); 
		});
		
		// Dinamikusan generált sorok eltávolítógombja
		$("#szintlepes_kepzettsegek").on( "click", "a.removeline", function(){
			$(this).closest("tr").remove();
			szintlepes.kepzettsegek.update();
		}); 
		
		if(this.kepzettsegek.ini()){
			if(this.ingyenesek.ini()){
				szintlepes.update();
			}
		}
		
		return true;	
	},
	
	/**
	 * Szintlépés újraszámolása
	 */	 	
	update: function(){
		this.ero = $("#szintlepes_ero").val()*1;
		this.gyo = $("#szintlepes_gyo").val()*1; 
		this.ugy = $("#szintlepes_ugy").val()*1;
		this.all = $("#szintlepes_all").val()*1;
		this.ege = $("#szintlepes_ege").val()*1;
		this.int = $("#szintlepes_int").val()*1;
		this.kar = $("#szintlepes_kar").val()*1;
		this.aka = $("#szintlepes_aka").val()*1; 
		this.asz = $("#szintlepes_asz").val()*1;
		this.erz = $("#szintlepes_erz").val()*1;
		
		this.fp = $("#szintlepes_fp").val()*1;
		this.pp = $("#szintlepes_pp").val()*1;
		this.mp = $("#szintlepes_mp").val()*1; 
		this.kp = $("#szintlepes_kp").val()*1;
		this.ke = $("#szintlepes_ke").val()*1;
		this.te = $("#szintlepes_te").val()*1;
		this.ve = $("#szintlepes_ve").val()*1;
		this.ce = $("#szintlepes_ce").val()*1;
		
		szintlepes.kepzettsegek.update();
		
		this.kap = kar.kaptsz;
		this.kap -= $(Gkonstansok).find('konstansok>kapktg>ktg[refid="ero"]').attr("kap")*(this.ero + this.gyo + this.ugy + this.all + this.ege + this.int + this.kar + this.aka + this.asz + this.erz);
		this.kap -= $(Gkonstansok).find('konstansok>kapktg>ktg[refid="fp"]').attr("kap")*this.fp;
		this.kap -= $(Gkonstansok).find('konstansok>kapktg>ktg[refid="ke"]').attr("kap")*(this.ke + this.te + this.ve + this.ce);
		this.kap -= $(Gkonstansok).find('konstansok>kapktg>ktg[refid="mp"]').attr("kap")*this.mp + $(Gkonstansok).find('konstansok>kapktg>ktg[refid="kp"]').attr("kap")*this.kp;
		this.kap -= $(Gkonstansok).find('konstansok>kapktg>ktg[refid="pp"]').attr("kap")*this.pp;
		this.kap -= $("#szintlepes_kepzp").val()*1-kar.kepzp*$(Gkonstansok).find('konstansok>kapktg>ktg[refid="kepzp"]').attr("kap")*1-this.kepzettsegek.kepzpbonus;
		
		(this.kap < 0 || ($("#szintlepes_kepzp").val()-this.kepzettsegek.kpktg) < 0) ? this.error(1) : this.error(0);
		
		$("#szintlepes_kap").html(this.kap); 
	},
	
	/**
	 * Képzettségek objektum
	 * @param	kp (int) rendelkezésre álló Képzettség Pont
	 * @param	kpktg (int) a felvitt képzettségek össz KP költsége
	 * @param	kepzbonus (int) bónusz KP-k
	 */	 	 	 	 	
	kepzettsegek: {
		kp: 0,
		kpktg: 0,
		kepzpbonus: 0,
		
		/**
		 * Inicializálás
		 * @constructor
		 */		 		 		
		ini: function(){       
			this.iniSelectors(Gkepzettsegek, "kepzettsegek>kepzettseg", "#szintlepes_kepzettsegvalaszto");
			
			$("#szintlepes_kepzp").val(kar.kepzp); 
			
			// Már meglévő képzettségek kilistázása
			n = kar.kepzettsegek.length;
			for(i=0; i<n; i++){
				// Százalékos képzettségek
				if(Gkepzettsegek.find('kepzettsegek>kepzettseg[id="'+kar.kepzettsegek[i]["id"]+'"]').attr("tipus") == "S"){
					this.kp += Math.round(kar.kepzettsegek[i]["fok"]/$(Gkonstansok).find('konstansok>kepzettsegktg>ktg[nehez="0"]').attr("kap"));
				}
				// Normál képzettségek
				else{
					this.kp += $(Gkonstansok).find('konstansok>kepzettsegktg>ktg[nehez="'+Gkepzettsegek.find('kepzettsegek>kepzettseg[id="'+kar.kepzettsegek[i]["id"]+'"]').attr("nehez")+'"][fok="'+kar.kepzettsegek[i]["fok"]+'"]').attr("kap")*1;
				}
				this.addfixed(kar.kepzettsegek[i]["uniqueid"], kar.kepzettsegek[i]["id"], kar.kepzettsegek[i]["fok"], kar.kepzettsegek[i]["spec"]); 
			}
			
			this.update();
			
			$("#szintlepes_kepzettsegek").on("change", ".spinner",function(){ szintlepes.kepzettsegek.update(); });
			$("#tabs-2").on("change", "#szintlepes_kepzp",function(){ szintlepes.kepzettsegek.update(); });  
			return true;
		},
		
		/**
		 * HTML <select> elemek kitöltése
		 */		 		
		iniSelectors: function(G, loc, selectdom){
			selecter = '';
			$(G).find(loc).each(function(){
				selecter += '<option value='+$(this).attr("id")+'>'+$(this).attr("name")+'</option>';
			});
			$(selectdom).html(selecter);        
		},
		
		/**
		 * Képzettségpontok kiszámolása
		 * @param	fok (int) új képzettség fok
		 * @param	pfok (int) a képzettség korábbi foka
		 * @param	okt (int) oktatás szintje		 		 		 
		 */		 		 
		kpcalc: function(){
			this.kpktg = 0;
			n = 0;
			id = 0; fok = 0; okt = 0;
			
			$('#szintlepes_kepzettsegek').find('.kepzettseg').each(function(){
				if(kar.kepzettsegek[n] === undefined){
					pid = 0;
					pfok = 0;             
				}
				else
				{
					pid = kar.kepzettsegek[n]["id"];
					pfok = kar.kepzettsegek[n]["fok"]*1;
				}
			
				id = $(this).find('input[type="hidden"]').val();
				fok = $(this).find('input.fokspinner').val()*1;
				okt = $(this).find('input.kepzspinnerO').val()*1;
			
				if(fok < pfok){
					$(this).find('input.fokspinner').val(pfok);
					fok = pfok;  
				}
				else if(fok > pfok){
					szintlepes.kepzettsegek.kpktg += szintlepes.kepzettsegek.ktgcalc(id, fok, pfok, okt);
				}
				n++;            
			});
		},
		
		/**
		 * Egy adott képzettség költségének kiszámolása
		 */		 		
		ktgcalc: function(id, fok, pfok, okt){
			y = 0;
			// Százalékos képzettségek
			if(Gkepzettsegek.find('kepzettsegek>kepzettseg[id="'+id+'"]').attr("tipus") == "S"){
				y += Math.ceil((fok-pfok)/($(Gkonstansok).find('konstansok>kepzettsegktg>ktg[nehez="0"]').attr("kap")*1 + $(Gkonstansok).find('konstansok>oktatasbonusz>okt[fok="'+okt+'"]>ktg[tipus="S"]').attr("kap")*1));
			}
			// Normál képzettségek
			else{
				for(i=pfok; i<fok; i++){
					x = $(Gkonstansok).find('konstansok>kepzettsegktg>ktg[nehez="'+Gkepzettsegek.find('kepzettsegek>kepzettseg[id="'+id+'"]').attr("nehez")+'"][fok="'+(i+1)+'"]').attr("kap")*1;
					x -= $(Gkonstansok).find('konstansok>oktatasbonusz>okt[fok="'+okt+'"]>ktg[tipus="N"]').attr("kap");
					y += (x>0)? x : 1;
				}
			}
			return y;    
		},
		
		/**
		 * Bónusz képzettségpontok újraszámolása
		 */
		kepzbonuscalc: function(){
			szintlepes.kepzettsegek.kepzpbonus = 0;
			$("#szintlepes_ingyenesek").find('tr').each(function(){
				if(id = $(this).find('td.refid').find("input").val()){
					// Intelligencia növekedéséből jövő KP hozzáadása
					if(id == "int"){
						szintlepes.kepzettsegek.kepzpbonus += $(this).find('td.fok').text()*1;
				} 
			}
			});
			// Intelligencia hozzáadása
			szintlepes.kepzettsegek.kepzpbonus += szintlepes.int; 
		},
		
		/**
		 * Képzettségek listájának frissítése
		 */		 		
		update: function(){
			
			this.kepzbonuscalc();
			this.kpcalc();
			
			if($("#szintlepes_kepzp").val()*1 < (kar.kepzp + szintlepes.kepzettsegek.kepzpbonus)){ 
				$("#szintlepes_kepzp").val(kar.kepzp + szintlepes.kepzettsegek.kepzpbonus); 
			} 
			
			$("#szintlepes_kepzossz").html(this.kpktg);
			$("#szintlepes_kepzmarad").html($("#szintlepes_kepzp").val() - this.kpktg);
			
			node = Gkepzettsegek.find('kepzettsegek>kepzettseg[id="'+$("#szintlepes_kepzettsegvalaszto").val()+'"]');
			if(node.attr("spec") == 0){
				$("#szintlepes_kepzettsegspec").hide();
				$("#szintlepes_kepzettsegspec").val("");
			}
			else{
				$("#szintlepes_kepzettsegspec").show(); 
			}
			
			if(node.attr("tipus") == "S"){                                                                     
				$("#szintlepes_kepzettsegvalasztofok").addClass("kepzspinnerS");
				$("#szintlepes_kepzettsegvalasztofok").removeClass("kepzspinnerN");
			}
			else{
				$("#szintlepes_kepzettsegvalasztofok").addClass("kepzspinnerN");
				$("#szintlepes_kepzettsegvalasztofok").removeClass("kepzspinnerS");  
				if($("#szintlepes_kepzettsegvalasztofok").val() > 5){
					$("#szintlepes_kepzettsegvalasztofok").val(0);
				}   
			}
			
			$( ".kepzspinnerS" ).spinner({
				min:1,
				max: 100,
				step:1,
				stop: function(event, ui) {
					$(this).change();
				}
			});
			$( ".kepzspinnerN" ).spinner({
				min:1,
				max:5,
				stop: function(event, ui) {
					$(this).change();
				}
			});  
			$( ".kepzspinnerO" ).spinner({
				min:0,
				max:5,
				stop: function(event, ui) {
					$(this).change();
				}
			});
		         
		},
		
		/**
		 * Fix képzettség sorok hozzáadása
		 */		 		
		addfixed: function(uniqueid, id, fok, spec){
			node = Gkepzettsegek.find('kepzettsegek>kepzettseg[id="'+id+'"]');
			x = '<tr class="kepzettseg" id="'+uniqueid+'">';
			x += '<td style="text-align:left;">'+node.attr("name")+'<input type="hidden" value="'+node.attr("id")+'"/></td>';
			x += '<td class="spec">'+((node.attr("spec") == 1) ? '<input type="text" value="'+spec+'"/>' : '')+'</td>';
			x += '<td class="fok"><input class="kepzspinner'+node.attr("tipus")+' spinner fokspinner" value="'+fok+'"/></td>';
			x += '<td class="okt"><input class="kepzspinnerO spinner" value="0"/></td><td></td></tr>';
			$("#szintlepes_kepzettsegek").append(x);
		},
		
		/**
		 * Eltávolítható képzettség sorok hozzáadása
		 */		 		
		add: function(){
			d = new Date();
			node = Gkepzettsegek.find('kepzettsegek>kepzettseg[id="'+$("#szintlepes_kepzettsegvalaszto").val()+'"]');
			x = '<tr class="kepzettseg" id="'+d.getTime()+'">';
			x += '<td style="text-align:left;">'+node.attr("name")+'<input type="hidden" value="'+node.attr("id")+'"/></td>';
			x += '<td class="spec">'+((node.attr("spec") == 1) ? '<input type="text" value="'+$("#szintlepes_kepzettsegspec").val()+'"/>' : '')+'</td>';
			x += '<td class="fok"><input class="kepzspinner'+node.attr("tipus")+' spinner fokspinner" value="'+$("#szintlepes_kepzettsegvalasztofok").val()+'"/></td>';
			x += '<td class="okt"><input class="kepzspinnerO spinner" value="'+$("#szintlepes_oktatasvalaszto").val()+'"/></td>';
			x += '<td><a class="removeline button"><img src="programdata/gfx/dot.gif" alt="Eltávolítás" class="icon ic_s_cancel" /></a></td></tr>';
			$("#szintlepes_kepzettsegek").append(x);
		}
	},
	
	/** 
	 * Olyan értékek, melyek nem kerülnek KAP-ba, például egyes képzettségek szintenkénti bónuszai
	 */	 	
	ingyenesek: {
		/**
		 * Inicializálás
		 * @constructor
		 */		 		 		
		ini: function(){
			$("#szintlepes_ingyenesek").on( "click", "#szintlepes_ingyeneshozzaado", function() {
				szintlepes.ingyenesek.add();
				szintlepes.kepzettsegek.update();
			});
			
			// Dinamikusan generált sorok eltávolítógombja
			$("#szintlepes_ingyenesek").on( "click", "a.removeline", function() {
				$(this).closest("tr").remove();
			}); 
			return true;   
		},
		
		/**
		 * Ingyenes érték hozzáadása
		 */		 		
		add: function(){
			x = '<tr class="ingyenes">';
			x += '<td class="refid">'+$("#szintlepes_ingyenesvalaszto").find('option[value="'+$("#szintlepes_ingyenesvalaszto").val()+'"]').text()+'<input type="hidden" value="'+$("#szintlepes_ingyenesvalaszto").val()+'"/></td>';
			x += '<td class="fok">'+$("#szintlepes_ingyenesmodosito").val()+'</td>';
			x += '<td class="komment">'+$("#szintlepes_ingyeneskomment").val()+'</td>';
			x += '<td><a class="removeline button"><img src="programdata/gfx/dot.gif" alt="Eltávolítás" class="icon ic_s_cancel" /></a></td></tr>';
			$("#szintlepes_ingyenesek").append(x);
		}
	},
	
	/**
	 * Szintlépés űrlap alaphelyzetbe hozása
	 */	 	
	reset: function(){
		$("#szintlepes_tulajdonsagok").find('input').each(function(){
			$(this).val($(this).attr("value"));
		}); 
		
		$("#szintlepes_harcertekek").find('input').each(function(){
			$(this).val($(this).attr("value"));
		});
		
		$("#szintlepes_ingyenesek").find('tr').each(function(){
			if(id = $(this).find('td.refid').find("input").val()){
				$(this).remove(); 
			}
		}); 
		
		$("#szintlepes_kepzettsegek").find('tr').each(function(){
			$(this).find("input").each(function(){
				$(this).val($(this).attr("value"));
			});
			if(id = $(this).attr("class")=="kepzettseg"){
				$(this).remove(); 
			}
		}); 
		
		this.kepzettsegek.ini();
	},
	
	/**
	 * Hibakezelés
	 */	 	
	error: function(x){
		if(this.err != x){
			if(this.err == 0){ $("#tabs-2 .save").button("option","disabled",true); }
			else{ $("#tabs-2 .save").button("option","disabled",false); }
			this.err = x;
		}
	},
	
	/**
	 * Szintlépés mentése
	 * A mentés létrehoz a szintlépésről egy XML DOM-ot amit végül hozzáad a karakter XML-hez	 
	 */	 	
	save: function(){
		d = new Date();
		szintlepes.xml = '<szintlepes letrehozva="'+d.getTime()+'">';
		
		$("#szintlepes_tulajdonsagok").find('input').each(function(){
			if(szintlepes[$(this).attr("id").substring(11)] > 0){
				szintlepes.xml += '<mod refid="'+$(this).attr("id").substring(11)+'" value="'+szintlepes[$(this).attr("id").substring(11)]+'" kap="'+szintlepes[$(this).attr("id").substring(11)]*Gkonstansok.find('konstansok>kapktg>ktg[refid="'+$(this).attr("id").substring(11)+'"]').attr("kap")+'" />';  
			}
		});
		
		$("#szintlepes_harcertekek").find('input').each(function(){
			if(szintlepes[$(this).attr("id").substring(11)] > 0){
				szintlepes.xml += '<mod refid="'+$(this).attr("id").substring(11)+'" value="'+szintlepes[$(this).attr("id").substring(11)]+'" kap="'+szintlepes[$(this).attr("id").substring(11)]*Gkonstansok.find('konstansok>kapktg>ktg[refid="'+$(this).attr("id").substring(11)+'"]').attr("kap")+'" />';  
			}
		});
		
		$("#szintlepes_ingyenesek").find('tr').each(function(){
			if(id = $(this).find('td.refid').find("input").val()){
				szintlepes.xml += '<mod refid="'+id+'" indoklas="'+((foo = $(this).find('td.komment').text())? foo : '')+'" value="'+$(this).find('td.fok').text()*1+'" kap="0" />';  
			}
		});
		
		// Vásárolt képzettség pontok
		x = $("#szintlepes_kepzp").val()-kar.kepzp-szintlepes.kepzettsegek.kepzpbonus;
		szintlepes.xml += '<mod refid="kepzp" value="'+x+'" kap="'+x+'" />';
		
		szintlepes.xml += '<kepzettsegek>';
		
		// Szintlépés képzettségek mentése
		n = 0;
		id = 0; fok = 0; okt = 0; kapktg = 0;
		
		$('#szintlepes_kepzettsegek').find('.kepzettseg').each(function(){
			if(kar.kepzettsegek[n] === undefined){
				pid = 0;
				pfok = 0;             
			}
			else{
				pid = kar.kepzettsegek[n]["id"];
				pfok = kar.kepzettsegek[n]["fok"]*1;
			}
			
			uniqueid = $(this).closest('tr').attr("id");
			id = $(this).find('input[type="hidden"]').val();
			fok = $(this).find('input.fokspinner').val()*1;
			okt = $(this).find('input.kepzspinnerO').val()*1;
			
			if(fok > pfok){
				kapktg = szintlepes.kepzettsegek.ktgcalc(id, fok, pfok, okt);
				szintlepes.xml += '<kepzettseg uniqueid="'+uniqueid+'" id="'+id+'" fok="'+(fok-pfok)+'" oktatas="'+okt+'" spec="'+((foo = $(this).find('td.spec').find('input').val())? foo : '')+'" kap="'+kapktg+'" />';
			}
			n++;            
		});
		
		szintlepes.xml += '</kepzettsegek></szintlepes>';
		return Gsave.find("karakterlap>szintlepesek").append(szintlepes.xml);    
	}
}