/**
 * Tárgylista kezelése
 * 
 * @author	Sándor Preszter <preszter.sandor@gmail.com>
 * @version	1.1
 */ 
var targylista = {
	/**
	 * Ez a tömb asszociálja a módosítók kódneveit a tényleges nevükkel
	 */	 	
	modnames: {ero:"ERŐ", gyo:"GYO", ugy:"ÜGY", all:"ÁLL", ege:"EGÉ", int:"INT", kar:"KAR", aka:"AKA", asz:"ASZ", erz:"ÉRZ",
  	ep:"ÉP", fp:"FP", pp:"&psi;P", mp:"MP", kp:"KP", mtme:"MTME", atme:"ATME", mgt:"MGT", sfe:"SFÉ", ke:"KÉ", te:"TÉ", ve:"VÉ", ce:"CÉ", spb:"SP"},
  	
  	/**
  	 * Ez a tömb tartalmazza az új tárgy készítésekor hozzáadott egyedi módosítókat
  	 */	     	
	taglist: [],
	
	/**
	 * Ez készíti elő a tárgylistakezelőt és inicializálja a gombokat	
	 * @constructor
	 */	 	
	ini: function(){
		// Tárgy sablon select lista készítése
		x = '<option value="0" selected="selected">_nincs</option>';
		Gtargyak.find("targyak>targy").each(function(){
			x += '<option value="'+$(this).attr("id")+'">'+$(this).attr("name")+'</option>';	
		});
		$("#targylista_template").html(x);
		
		// Módosító select lista készítése
		x = '';
		for(var name in targylista.modnames) {
			x += '<option value="'+name+'">'+targylista.modnames[name]+'</option>';
		}
		$("#targylista_ertekselect").html(x);
		
		/**
		 * Jquery elemek inicializálása
		 */		 		
		$("#targylista_template").on("change", function(){
			targylista.updatecreator();
		});

		$("#targylista_ertekmodosito").spinner("option", "min", null);

		$("#targylista_addertekmodosito").on("click", function(){
			if(targylista.registertag($("#targylista_ertekselect").val(), $("#targylista_ertekmodosito").val())){
				targylista.updatecreator();
			}
		});

		$("#targylista_addegyebmodosito").on("click", function(){
			if(targylista.registertag(null, null, null, $("#targylista_egyebmodosito").val())){
				targylista.updatecreator();
			}
		});

		$("#targylista_tulajdonsagok").on("click", ".removetag", function(){
			if(targylista.unregistertag($(this).attr("uid"))){
				targylista.updatecreator();
			}
		});

		$("#targylista_addtargy").on("click", function(){
			if(targylista.add()){
				targylista.updatecreator();
			}
		});
		
		$("#targylista_targylista").on("click", ".removeline", function(){
			if(confirm("Biztos, hogy törölni akarod?")){
				if(targylista.del($(this).closest("tr").attr("tid"))){
					targylista.update();
				}
			}
		});
		
		$("#targylista_targylista").on("change", ".visel", function(){
			if(targylista.visel($(this).closest("tr").attr("tid"))){
				targylista.update();
				kar.update();
			}	
		});

		targylista.update();
		return true;
	},
	/**
	 * Ez adja hozzá az új módosítókat a taglist-hez
	 * 	 
	 * @returns 	array.push hozzáadás a taglisthez
	 * @param	uid = egyedi azonosító (time())
	 * @param	refid = módosító kódneve
	 * @param	value = módosító értéke
	 * @param	text = szöveges egyedi tulajdonság	 	 	 	 	 
	 */	 	
	registertag: function(refid, value, name, text){
		d = new Date();
		x = { uid: d.getTime(), refid: refid, value: value, text: text };
		if(value != 0 || text.length > 0){
			return targylista.taglist.push(x);
		}
	},
	
	/**
	 * Ez törli a módosítókat a taglist-ből
	 * 
	 * @returns	bool	 	 
	 */	 	
	unregistertag: function(uid){
		z = targylista.taglist.length;
		for(i=0; i<z; i++)
		{
			if(uid == targylista.taglist[i].uid){
				targylista.taglist.splice(i, 1);
				return true;
			}	
		}	
	},
	
	/**
	 * Tulajdonság/módosító "tag" készítése (CSS-ben "tag" classal megjelenítve)
	 * 
	 * @returns	(string) HTML kód	 	 
	 */
	addtag: function(uid, refid, value, name, text){
		if(!text){
			t = (value!=0)?'<span uid="'+uid+'" class="tag'+((uid>0)?' removetag':'')+'">'+name+': '+value+'</span> ':'';
		}
		else{
			t = (text.length>0)?'<span uid="'+uid+'" class="tag'+((uid>0)?' removetag':'')+'">'+text+'</span>':'';				
		}
		return t;
	},
	
	/**
	 * Tárgy bekategorizálása
	 * 
	 * @returns	(string) kategória	 	 
	 */
	categorize: function(t){
		z = Gtargyak.find('targyak>targy[id="'+t+'"]').attr("kateg")*1;
		if(z === undefined || t == 0){ k = "egyéb"; }
		else if(z >= 2 && z < 12){
			k = "fegyver";
		}
		else{   
			switch(z){
				case 16:
					k = "harcművészet";
					break;
				case 19:
					k = "pajzs";
					break;
				case 20:
					k = "pusztakéz";
					break;
				case 24: 
					k = "vért";
					break;
				default:
					k = "egyéb";
					break;
			}
		}
		return k; 
	},
	
	/**
	 * Tárgyhozzáadó interface frissítése
	 * 
	 * @returns	bool	 	 
	 */
	updatecreator: function(){
			y = $("#targylista_template").val();
			node = Gtargyak.find('targyak>targy[id="'+y+'"]');
			$("#targylista_targynev").val(node.attr("name"));
			$("#targylista_kategoriavalaszto").html(targylista.categorize(y));

			a = '';
			if(y > 0){
				a += targylista.addtag(0, "ke", node.attr("ke"), "KÉ");
				a += targylista.addtag(0, "te", node.attr("te"), "TÉ");
				a += targylista.addtag(0, "ve", node.attr("ve"), "VÉ");
				a += targylista.addtag(0, "ce", node.attr("ce"), "CÉ");
				a += targylista.addtag(0, "sfe", node.attr("sfe"), "SFÉ");
				a += targylista.addtag(0, "mgt", node.attr("mgt"), "MGT");
				a += targylista.addtag(0, "ido", node.attr("ido"), "Idő");
				a += targylista.addtag(0, "sp", node.attr("sp"), "SP");
			}

			z = targylista.taglist.length;
			for(i=0; i<z; i++)
			{
				a += targylista.addtag(targylista.taglist[i].uid, targylista.taglist[i].refid, targylista.taglist[i].value, targylista.modnames[targylista.taglist[i].refid], targylista.taglist[i].text);	
			}
			
			$("#targylista_tulajdonsagok").html(a);	
			
			return true;
	},
	
	/**
	 * Tárgylista interface frissítése
	 * 
	 * @returns	bool
	 * @variable	x = a teljes tárgy
	 * @variable	y = tulajdonságok listája	 	 	 	 
	 */	
	update: function(){
		$("#targylista_targylista").find(".item").remove();
		x = '';
		
		// XMLsave tárgylista feldolgozása
		Gsave.find("karakterlap>targyak>targy").each(function(){
			y = '';
			
			// Tárgysablon tulajdonságok hozzáadása
			if($(this).attr('template') > 0){
				node = Gtargyak.find('targyak>targy[id="'+$(this).attr('template')+'"]');
				y += targylista.addtag(0, "ke", node.attr("ke"), "KÉ");
				y += targylista.addtag(0, "te", node.attr("te"), "TÉ");
				y += targylista.addtag(0, "ve", node.attr("ve"), "VÉ");
				y += targylista.addtag(0, "ce", node.attr("ce"), "CÉ");
				y += targylista.addtag(0, "sfe", node.attr("sfe"), "SFÉ");
				y += targylista.addtag(0, "mgt", node.attr("mgt"), "MGT");
				y += targylista.addtag(0, "ido", node.attr("ido"), "Idő");
				y += targylista.addtag(0, "sp", node.attr("sp"), "SP");
			}
			
			// Módosítók hozzáadása
			Gsave.find('karakterlap>targyak>targy[tid="'+$(this).attr('tid')+'"]>mod').each(function(){  
				y += targylista.addtag($(this).attr('uid'), $(this).attr('refid'), $(this).attr('value'), targylista.modnames[$(this).attr('refid')], $(this).text()); 	
			});
			
			// Tárgy hozzáadása
			x += '<tr class="item" tid="'+$(this).attr('tid')+'" template="'+$(this).attr('template')+'"><td><input class="visel" type="checkbox" '+(($(this).attr('visel')==0)?'':'checked="checked"')+'/></td><td>'+targylista.categorize($(this).attr('template'))+'</td><td>'+$(this).attr('name')+'</td><td class="taglist">'+y+'</td><td><a class="removeline button"><img src="programdata/gfx/dot.gif" alt="Eltávolítás" class="icon ic_s_cancel"></a></td></tr>';	
			
		});
		
		$("#targylista_targylista").append(x);
		return true;
	},
	add: function(){
		d = new Date();
		
		// XML node generálása
		xml = '<targy tid="'+d.getTime()+'" name="'+$("#targylista_targynev").val()+'" template="'+$("#targylista_template").val()+'" visel="0">';

		y = targylista.taglist.length;
		for(i=0; i<y; i++){
			xml += '<mod uid="'+targylista.taglist[i].uid+'" refid="'+targylista.taglist[i].refid+'" value="'+targylista.taglist[i].value+'">'+((targylista.taglist[i].text === undefined)? '' : targylista.taglist[i].text)+'</mod>';	
		}
		
		xml += '</targy>';
		
		// Tárgy mentése a karakterlap XML-be		 
		if($("#targylista_targynev").val()){
			if(Gsave.find("karakterlap>targyak").append(xml)){
				targylista.update();
				return true;
			}
		}
		else{
			return false;
		}	
	},
	del: function(tid){
		if(Gsave.find('karakterlap>targyak>targy[tid="'+tid+'"]').remove()){
			return true;
		}	
	},
	
	/**
	 * Tárgy viselése
	 * A "viselt" tárgyak értékei beleszámítódnak a karakterlap által számolt értékekbe
	 * 
	 * @returns	bool
	 * @variable	(int) tid = tárgy azonosítója az XMLben
	 * @variable	(bool) state = a save XML-ben viselve van-e már a tárgy?	 
	 */	 	 	 	 	 	
	visel: function(tid){
		state = Gsave.find('karakterlap>targyak>targy[tid="'+tid+'"]').attr("visel");
		if(state == 1){
			if(Gsave.find('karakterlap>targyak>targy[tid="'+tid+'"]').attr("visel",0)){
				return true;
			}	
		}
		else{
			if(Gsave.find('karakterlap>targyak>targy[tid="'+tid+'"]').attr("visel",1)){
				return true;
			}
		}	
	}
}