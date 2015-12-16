/**
 * Szintlépések listázása
 * 
 * @author	Sándor Preszter <preszter.sandor@gmail.com>
 * @version	1.0
 */ 
var szintlepesek = {
	/**
	 * Szintlépések listájának inicializálása
	 * @constructor
	 */	 	 	
	ini: function(){
		this.update();
		
		$("#tabs-3").on( "click", "a.removeszintlepes", function() {
			if(confirm("Biztos, hogy törölni akarod a szintlépést? A törlés csak akkor lesz végleges ha elmented a karakterlapot.")){
				$(this).closest("h3").remove();
				$(this).closest(".accord").remove();
				szintlepesek.del($(this).attr("id"));
				szintlepesek.update();
			}
		}); 
		return true;
	},

        /**
	 * Szintlépés "harmonika" frissítése
	 */
	update: function(){
		$("#tabs-3").find(".accordion").html("");
		n = 1;
		m = Gsave.find("karakterlap>szintlepesek>szintlepes").length;
		Gsave.find("karakterlap>szintlepesek>szintlepes").each(function(){
		
			d = new Date($(this).attr("letrehozva")*1);
			x = '<h3>'+n+'. TSZ (Létrehozva: '+d.getFullYear()+'.'+(d.getMonth()+1)+'.'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+')</h3>';
			x += '<div class="accord">';
			
			if(n == m){
				x += '<span><a id="'+$(this).attr("letrehozva")+'" class="removeszintlepes button ui-state-default ui-corner-all"><img src="programdata/gfx/dot.gif" alt="Szintlépés törlése" class="icon ic_s_cancel" /> Szintlépés törlése</a></span>';
			}
			
			x += '<h4>Alapértékek</h4><table><tr><th>Módosító</th><th>Érték</th><th>Megjegyzés</th><th>KAP</th>';
			$(this).find("mod").each(function(){
				x += '<tr><td>'+$(this).attr("refid")+'</td>';
				x += '<td>'+$(this).attr("value")+'</td>';
				x += '<td>'+(($(this).attr("indoklas") === undefined)? '' : $(this).attr("indoklas"))+'</td>';
				x += '<td>'+$(this).attr("kap")+'</td></tr>';
			});
			
			x += '</table>';
			x += '<h4>Képzettségek</h4><table><tr><th>Képzettség</th><th>Specializáció</th><th>Oktatás</th><th>Fok</th><th class="tooltip" title="Képzettség-pont">KEPZP</th>';
			
			$(this).find("kepzettseg").each(function(){
				x += '<tr><td>'+Gkepzettsegek.find('kepzettsegek>kepzettseg[id="'+$(this).attr("id")+'"]').attr("name")+'</td>';
				x += '<td>'+(($(this).attr("spec") === undefined)? '' : $(this).attr("spec"))+'</td>';
				x += '<td>'+$(this).attr("oktatas")+'</td>';
				x += '<td>'+$(this).attr("fok")+'</td>';
				x += '<td>'+$(this).attr("kap")+'</td></tr>';
			});
			
			x += '</table></div>';
			n++;
			$("#tabs-3").find(".accordion").append(x);	
		});
		
		$("#tabs-3").find(".accordion").accordion("refresh");
		$("#tabs-3").find(".accordion").accordion( "option", "collapsible", true );
		$("#tabs-3").find(".accordion").accordion( "option", "active", false );         
	},
	
	/**
	 * Szintlépés törlése
	 */	 	
	del: function(letrehozva){
		Gsave.find("karakterlap>szintlepesek>szintlepes[letrehozva="+letrehozva+"]").remove(); 
		this.update(); 
		kar.update();
	} 
}

