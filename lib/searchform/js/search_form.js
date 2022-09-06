
(function ($) {


	$(document).ready(function(){
		/*
		if ($('#c_preference ul li').length>0) {
					//$('#mail_link').effect("pulsate");	
					
					$.ajax({							
							type: 'POST',
							url: CFG_GLPI.root_doc + '/plugins/contextual/ajax/count_message.php',
							async: false,
							dataType: 'json',												
							success: function (data) {

								$.each(data, function (ind, elem) { 
								//	if (elem.number>0) { // Mientras no se apruebe plugin ocultamos sobre
										html = "<li id='mail_link'>"+
													"<stong><span class='number_message'>"+elem.tooltip+"</span>&nbsp;&nbsp;<span id='number_message'><strong><font color='yellow'>"+elem.number+"</font></strong></span></li>";
											
										$('#help_link').after(html);
								//	}
								});								
								                           							
						},
							error: function(XMLHttpRequest, textStatus, errorThrown) { 
							//alert("Status: " + textStatus); 
							//alert("Error: " + errorThrown); 
							alert("XMLHttpRequest: " + JSON.stringify(XMLHttpRequest));						
							}
				});		
				


		}*/

		$( ".envelope" ).click(function() {

			var envelope = $(this).children();

			if (envelope.hasClass('calidad_message')){
				
				envelope.removeClass('calidad_message')
				.addClass('calidad_message_view');
	
				var num_message = parseInt($("#number_message").text());
				if (num_message>0){
					$("#number_message").html('<strong><font color="yellow">'+
					(num_message-1)+
					'</font></strong>');
				}

			}

		});		

	}); 



    $.fn.contextual = function (options) {

        // defaults		
        var $this = $(this);
		
        var settings = $.extend({
            itemtype: "",
						canedit:  0,
						iframe:   '',
						items :   []
			
        		}, options)		

                $(document).ready(function () {								

                    $("#dialog_contextual").dialog({
                        autoOpen: false,
                        modal: true,
                        resizable: true,
                        draggable: false,
                        height: 'auto',
                        width: 980,
												position: "top",
                    });				

					$('#dialog_contextual').on('dialogclose', function(event) {
						$("#dialog_contextual").html("");
			    	});	

                    $("#adddialog_contextual").dialog({
                        autoOpen: false,
                        modal: true,
                        resizable: true,
                        draggable: false,
                        height: 'auto',
                        width: 900,
												position: "top",						
                    });			

					$('#adddialog_contextual').on('dialogclose', function(event) {
					 $("#adddialog_contextual").html("");
			    	});		

                    $("#showdialog_contextual_"+settings.iframe).dialog({
                        autoOpen: false,
                        modal: true,
                        resizable: true,
                        draggable: true,
                        height: 'auto',
                        width: 800,
												position: "top",
                    });			

					$("#showdialog_contextual_"+settings.iframe).on('dialogclose', function(event) {
					 $("#showdialog_contextual_"+settings.iframe).html("");
			    	});	

					countcontextual();
					//trace(settings.items);
					find_row_tables(settings.iframe);					
					//const icono = $("#"+settings.iframe+" .contextual .fa-label");
				  const icono = $(".contextual .fa-label"); //[CRI] JMZ18G QUITAMOS "#"+settings.iframe+" PORQUE LOS TABS ESTAN FUERA DEL ENCAPSULAMIENTO DEL FORMULARIO
					//const tooltip = document.querySelector('#tooltip');					
					
					icono.mouseenter(function(e) {
						$('.tooltip').each(function(ind) {
							$(this).remove('activo');											
						});
						tooltip.classList.remove('activo');
						var id = $(this).attr("id");
						//alert(settings.iframe);
						if (id>0) {
							//	var data = "pruba<br>";
							//	alert(id);
						//	alert(e.pageY);
								x = $(this).offset().left;
								y = $(this).offset().top;

								tooltip = document.querySelector('#tooltip_'+id+'_'+settings.iframe);
								anchoTooltip = tooltip.clientWidth;
								altoTooltip  = tooltip.clientHeight;
								//trace("x= "+ x + " anchoTooltip= " + anchoTooltip + " y = " + y + " altoTooltip= "+altoTooltip);
								//trace(x+ " - " + y + " - " + anchoTooltip+ " - " +altoTooltip + tooltip);
								// Calculamos donde posicionaremos el tooltip.
								const izquierda = x - (anchoTooltip / 2) + 15;
								const arriba = y - altoTooltip - 180;
								//trace("y= "+ y + " altoTooltip= " + altoTooltip);
								

								tooltip.style.left 	= `${izquierda}px`;
								tooltip.style.top 	= `${arriba}px`;
							//	
								tooltip.classList.add('activo');
						}
	
					});

					icono.mouseleave(function() {
						var id = $(this).attr("id");
						if (id>0) {
								let timer;
						
								tooltip = document.querySelector('#tooltip_'+id+'_'+settings.iframe);
							//	alert(id);
								timer = setTimeout(() => {
									tooltip.style.left = `0px`;
									tooltip.style.top = `0px`;
									tooltip.classList.remove('activo');
								}, 100);

								tooltip.addEventListener('mouseenter', () => {
									clearTimeout(timer);
								
								});
								tooltip.addEventListener('mouseleave', () => {
								//	alert($(this).attr("id"));
										tooltip.style.left = `0px`;
										tooltip.style.top = `0px`;
										tooltip.classList.remove('activo');
								});
						}
					});		
					


					$("#"+settings.iframe+" .contextual .fa-label").on("click", function(e){
						  						
						//alert(url[0]);
						//$(location).attr('href',url[0]);						
						var id       = $(this).attr("id");
						var name     = $(this).attr("name");
						var itemtype = $(this).attr("datasrc");
						//OCULTAR EL TOOLTIP DEL ELEMENTO SELECCIONADO
						var id_tip   = $(this).children().attr("aria-describedby");
						$("#"+id_tip).hide().attr({
																				"aria-expanded": "false",
																				"aria-hidden": "true"
																			});
						//	alert(id_tip);													
						//OCULTAR EL TOOLTIP DEL ELEMENTO SELECCIONADO
					
						
						// DETECTA SI LA URL CONTIENE MARCADOR Y LO ELIMINA
						var url = document.URL.split("#");
						if (url.length>1){
						document.URL = url[0];
						history.replaceState(null, null, ' ');
						}						
						
						if (id>0) {

							if (settings.canedit>0) {		
							//[INCIO] [CRI] JMZ18G SI HEMOS MODIFICADO UN TAB DEL OBJETO ELIMINAMOS DEL MARCADOR EL CARACTER $ PARA QUE EL MARCADOR FUNCIONE													
							if((name.indexOf("$") > -1) || (name.indexOf("[") > -1)){ 
								var href = CFG_GLPI.root_doc + "/plugins/contextual/ajax/seecontextual.php?id=" + id +'&update=0&itemtype='+itemtype+'&target=dialog_contextual&field='+name+'&mark='+itemtype;	
							} else {
								var href = CFG_GLPI.root_doc + "/plugins/contextual/ajax/seecontextual.php?id=" + id +'&update=0&itemtype='+itemtype+'&target=dialog_contextual&field='+name+'&mark='+itemtype+name;	
							}							
							//[FINAL] [CRI] JMZ18G SI HEMOS MODIFICADO UN TAB DEL OBJETO ELIMINAMOS DEL MARCADOR EL CARACTER $ PARA QUE EL MARCADOR FUNCIONE						
							

							$("#dialog_contextual").load(href).dialog("open");
							format_dialog("#dialog_contextual");
							
							} else {
						// Comentar en el evento click el lanzamiento de ventana emergente porque ya estal el tooltip
						/*	var href = CFG_GLPI.root_doc + "/plugins/contextual/ajax/showcontextual.php?id=" + id +'&update=0&itemtype='+itemtype+'&target=showdialog_contextual_'+settings.iframe+'&field='+name;	

							$("#showdialog_contextual_"+settings.iframe).load(href).dialog("open");
							format_dialog("#showdialog_contextual_"+settings.iframe);		*/						
								
							}
							
						
						} else {
						
							//[INCIO] [CRI] JMZ18G SI HEMOS MODIFICADO UN TAB DEL OBJETO ELIMINAMOS DEL MARCADOR EL CARACTER $ PARA QUE EL MARCADOR FUNCIONE						
							if((name.indexOf("$") > -1) || (name.indexOf("[") > -1)){ 
								var href = CFG_GLPI.root_doc + "/plugins/contextual/ajax/seecontextual.php?add=0&itemtype="+itemtype+"&target=adddialog_contextual&field="+name+'&mark='+itemtype;	
							} else {
								var href = CFG_GLPI.root_doc + "/plugins/contextual/ajax/seecontextual.php?add=0&itemtype="+itemtype+"&target=adddialog_contextual&field="+name+'&mark='+itemtype+name;	
							}														
							//[FINAL] [CRI] JMZ18G SI HEMOS MODIFICADO UN TAB DEL OBJETO ELIMINAMOS DEL MARCADOR EL CARACTER $ PARA QUE EL MARCADOR FUNCIONE						
							$("#adddialog_contextual").load(href).dialog("open");
							format_dialog("#adddialog_contextual");	
							   						
						}
										  
					}); 

                });

		function find_row_tables (iframe) {
			
			var data   	= '';
		  var $me    	= '';
			var td    	= '';
			var tipo   	= '';
			var type   	= '';
			var id     	= '';
			var name   	= '';
			var field  	= [];
			var html   	= ''; 
			var tab    	= '';	

			//[INCIO] [CRI] JMZ18G BUSCAMOS LOS TABS DEL OBJETO Y AÑADIMOS EL ICONO EN EL TAB
			//if ((settings.canedit==0) && ($('#page li a .fas').length==0)) {
			if ($('#page li a .fas').length==0) {
			// PARA NO VOLVER A CARGAR EL ICONO DE AYUDA CONTEXTUAL EN LOS TABS DEL OBJETO COMPROBAMOS SI HAY ALGUNO DIBUJADO YA.
			//$('#page li a .contextual .fa-label').length
				$('#page li a').each(function(ind) {
					
						$me    = $(this);
						id     = $me.attr("id");
						url    = $me.attr("href").split("_glpi_tab=");	
						
						//tab    = $me.parent().closest('.tabcontextual').attr('id').replace(/\d/g,"");
						if (url.length>1) { 
							$.each(settings.items, function (ind, elem) { 
								
								if((url[1].indexOf(elem.field) > -1) && (elem.field.indexOf("$") > -1)){ // si el campo contiene simbolo '$' significa que es un TAB  
																
									html = elem.tooltip+"&nbsp";

								//data += " "+ elem.tooltip +" field: "+ elem.field+ " <br><br>url: "+ url +"<br>";
									
									$me.prepend(html);
								}
									
							});
						}
					
				});
			}
		//[FINAL] [CRI] JMZ18G BUSCAMOS LOS TABS DEL OBJETO Y AÑADIMOS EL ICONO EN EL TAB
		
		//[INCIO] [CRI] JMZ18G BACK-END DE LOS TABS DEL OBJETO 
		//alert(iframe); contextual378107627
				$('#'+ iframe +' .alltab').each(function(ind) {
					$me    = $(this);
					id     = $me.attr("id");				
					tab    = $me.parent().closest('.tabcontextual').attr('id').replace(/\d/g,"");
					
					if (settings.canedit>0) {
						html =  '<span id = "'+id+'" class=\'contextual\'>'+
						'<span id="0" name="'+id+'" datasrc="'+tab+'" class=\'fa-label contextual add\'>'+
						'<i class=\'fas fa-question-circle fa-fw inactive_tab\'></i></span></span>'; 							
						} else {
						html ='';
						}				
						$.each(settings.items, function (ind, elem) { 
							if ((elem.field === id) && (elem.itemtype === tab)) {

										html = 	'<span id = "'+tab+id+'" class=\'contextual \'>'+
														'<span id="'+elem.id+'" name="'+id+'" datasrc="'+tab+'" class=\'fa-label contextual update\'>'+
														elem.tooltip+'</span></span>';
									
										return false;	
							
							}  							
						//	data += elem.field+" "+elem.itemtype+"<br>";
						});
						
						$me.prepend(html);
					
				});
				//[FINAL] [CRI] JMZ18G BACK-END DE LOS TABS DEL OBJETO

				//[INCIO] [CRI] RASTREA ELEMENTOS input, select, textarea EN LAS DISTINTAS TABLAS DE UN FORMULARIO
			  $('#'+ iframe +' table').each(function(ind) {
					$(this).find('tr').each(function() {
						$(this).find('td').each(function(i) {
							$(this).find("input, select, textarea").each(function() {
									$me    = $(this);
									tipo   = $me.prop("tagName");
									id     = $me.attr("id");				
									name   = $me.attr("name");	
									type   = $me.attr("type");	
									tab    = $me.parent().closest('.tabcontextual').attr('id').replace(/\d/g,"");
									
									//[INICIO] [CRI] JMZ18G Buscamos el <TD> previo al donde esta el campo
									// Si existe un <TD> anterior y no contiene ningun campos cogemos el anterior sino, el actual
									//Al crear el icono de ayuda contextual en la misma celda que esta el campo tenemos problemas 
									//con campos de texto enriquecido. Cambiamos la ubicación del mismo a la celda anterior siempre y cuando 
									//esta no tenga en su interior un campo de tipo input, select ó textarea.
									td 		 = $me.closest('td').prev(); 

									if (td.length > 0){
										 
										if (td.find("input, select, textarea").length > 0) {
											
											td 		 = $me.closest('td');	
										
										} else {

											td 		 = $me.closest('td').prev();

										}
										
									} else {
										
										td 		 = $me.closest('td');	
									
									}
									//[FINAL] [CRI] JMZ18G Buscamos el <TD> previo al donde esta el campo
									// Si existe un <TD> anterior y no contiene ningun campos cogemos el anterior sino, el actual	
									//Al crear el icono de ayuda contextual en la misma celda que esta el campo tenemos problemas 
									//con campos de texto enriquecido. Cambiamos la ubicación del mismo a la celda anterior siempre y cuando 
									//esta no tenga en su interior un campo de tipo input, select ó textarea.																	
														
								if ((type !== 'hidden') && (type !== 'submit'))	{
								//if ((field.includes( name ) == false) && (name.charAt(0)!= "_")){
								if((jQuery.inArray(name+tab, field) === -1) && (jQuery.inArray('_'+name+tab, field) === -1)) {
									//alert(name);
									field.push(name+tab);
									//data += name+' tab :'+tab+' '+tipo+ ' ARRAY ' + jQuery.inArray(name, field+tab) + "<BR> field "+ field + '<br>'; 
								
									if (settings.canedit>0) {
									html =  '<span id = "'+tab+name+'" class=\'contextual\'>'+
											'<span id="0" name="'+name+'" datasrc="'+tab+'" class=\'fa-label contextual add\'>'+
											'<i class=\'fas fa-question-circle fa-fw\'></i></span></span>'; 
									} else {
									html ='';
									}						
									$.each(settings.items, function (ind, elem) { 
											//data += name+' ¡tab :'+tab+' '+tipo+'<br>'; 
										if ((elem.field === name) && (elem.itemtype === tab)) {
											
											//data += name+' ¡Hola :'+elem.field+' '+tipo+'<br>'; 
											if (settings.canedit>0) {
													
											html = 	'<span id = "'+tab+name+'" class=\'contextual \'>'+
													'<span id="'+elem.id+'" name="'+name+'" datasrc="'+tab+'" class=\'fa-label contextual update\'>'+
													elem.tooltip+'&nbsp</span></span>'; // ICONO BACK - END

											} else {
												html = elem.tooltip+"&nbsp"; // ICONO FRONT - END
											}	
										
											return false;	
								
										} 

									}); 

									if (html !=='') {
										var tagName = $me.parent();		

										if (tagName.find(".contextual").length<1) {									
											td.attr("headers", "contextual");
											span = td.wrapInner("<span class='html_content'></span>"); // Encapsular contenido de la celda en un span
											span.prepend(html); // añadir antes del span creado el icono ? 
											//data += "<br>" + name +" type " + type + " iframe " + tab + " tagName " + celda;
											
											return false;
											
										}	
									}	
									
								}
							
							}
							
							});
							
						});
					
					});
			
				});
				//[FINAL] [CRI] RASTREA ELEMENTOS input, select, textarea EN LAS DISTINTAS TABLAS DE UN FORMULARIO
				
				//[INCIO] [CRI] RASTREA ELEMENTOS select EN EL DIV tab_actors PARA AÑADIR ACTORES EN TICKETS, PROBLEMAS Y CAMBIOS
				$('#'+ iframe +' div.tab_actors').each(function() {
					$('#'+ iframe +' div.actor-content').each(function() {
						$(this).find("input, select, textarea").each(function() {
							$me    = $(this);
							tipo   = $me.prop("tagName");
							id     = $me.attr("id");				
							name   = $me.attr("name");	
							type   = $me.attr("type");	
							tab    = $me.parent().closest('.tabcontextual').attr('id').replace(/\d/g,"");
							div		 = $me.closest('div');							
						
						if ((type !== 'hidden') && (type !== 'submit'))	{
							
						//if ((field.includes( name ) == false) && (name.charAt(0)!= "_")){
						if((jQuery.inArray(name+tab, field) === -1) && (jQuery.inArray('_'+name+tab, field) === -1)) {
							//alert(name);
							field.push(name+tab);
						//	data += name+' tab :'+tab+' '+tipo+ ' ARRAY ' + jQuery.inArray(name, field+tab) + "<BR> field "+ field + '<br>'; 
						
							if (settings.canedit>0) {
								html = '<span id = "'+tab+name+'" class=\'contextual\'>'+
									'<span id="0" name="'+name+'" datasrc="'+tab+'" class=\'fa-label contextual add\'>'+
									'<i class=\'fas fa-question-circle fa-fw\'></i></span></span>'; 
								//data += "1 "+ name+' tab :'+tab+'<br>'; 
							} else {
								html = '';
								//data += "2 "+name+' tab :'+tab+'<br>'; 
							}						
							$.each(settings.items, function (ind, elem) { 
									//data += name+' ¡tab :'+tab+' '+tipo+'<br>'; 
									//data += elem.field + " -  -  - " +name+'<br>';

								if ((elem.field === name) && (elem.itemtype === tab)) {
									//data += "items: "+elem.field+' tab :'+elem.itemtype+' '+tab+'<br>'; 
									//data += name+' ¡Hola :'+elem.field+' '+tipo+'<br>'; 
									if (settings.canedit>0) {
											
									html = 	'<span id = "'+tab+name+'" class=\'contextual \'>'+
											'<span id="'+elem.id+'" name="'+name+'" datasrc="'+tab+'" class=\'fa-label contextual update\'>'+
											elem.tooltip+'&nbsp</span></span>'; // ICONO BACK - END

									} else {
										html = elem.tooltip+"&nbsp"; // ICONO FRONT - END
									}	
								
									return false;	
						
								} 

							}); 
							//[INCIO] [CRI] RASTREA ELEMENTOS select EN EL DIV tab_actors PARA AÑADIR ACTORES EN TICKETS, PROBLEMAS Y CAMBIOS

							if (html !=='') {
								var tagName = $me.parent();		

								if (tagName.find(".contextual").length<1) {									
									div.attr("headers", "contextual");
									span = div.wrapInner("<span class='html_content'></span>"); // Encapsular contenido de la celda en un span
									span.prepend(html); // añadir antes del span creado el icono ? 
									//data += "<br>" + name +" type " + type + " iframe " + tab + " tagName " + celda;
									
									return false;
									
									}	
								}	
								
							}
						
						}
					
						});						
					});
				});

		trace(data);
		}
		
		function format_dialog(id) {
		
		var title = "";
		
		if (id == "#showdialog_contextual_"+settings.iframe) {
			
			title = "Ayuda Contextual.</font>";
			
		} else {
			
			if (id == "#dialog_contextual") {
				title = "Editar Ayuda Contextual.</font>";	
			} else {		
				title = "Añadir Ayuda Contextual.</font>";	
			}				
		
		}							
				var color = "";
						if (id == "#adddialog_contextual") {
						
  						 title = "<font color='#fa6d03'>"+ title;
						 color = "64, 47, 94, 0.2";						 
						 
 						} else {
						
						if (id == "#dialog_contextual") {

						 title = "<font color='green'>"+ title;	
						   color = "47, 94, 74, 0.2";
						   
						} else {	
						
						if (id == "#showdialog_contextual_"+settings.iframe) {

						 title = "<font color='#933'>"+ title;	
						 color = "181, 61, 61, 0.2";
							
						} else {						
						
						 title = "<font color='green'>Modificar  "+ title;	
						 color = "61, 144, 58, 0.2";
						
						} } }
						
						var divTag = $(id).parent();	
						divTag.find(".ui-dialog-title").html(title);	

						$(id).css({ "background-color" : "rgba("+color+")", "padding" : "20px"});
						
						var divTag = $(id).parent("div");
							divTag.css({ "background-color" : "transparent", "background-image": "none" });				

						var div_dialog = $(id).parent(); 
							div_dialog.css({ "z-index": "999999", 											 
											 "margin-top":"5%",
										  });											 
							//alert(div_dialog.attr("class"));							
							
		}
		
		function countcontextual() {
			
			var itemtype = [settings.itemtype];
			
			//tab    = $(this).parent().closest('.tabcontextual').attr('id');			
			$('#page').find('.tabcontextual').each(function() {								
				
				var id = $(this).attr("id");
				
				if (jQuery.inArray(itemtype, id) === -1) {
				
					itemtype.push(id);

				}
			});

			//trace(itemtype);
			
	                        $.ajax({
                            data: {itemtype},
                            type: 'POST',
							url: CFG_GLPI.root_doc + '/plugins/contextual/ajax/countcontextual.php',
							async: false,
							dataType: 'json',
							beforeSend: function() {
								/*var _loader = $("<div id='loadingslide'><div class='loadingindicator'>'Loading...</div></div>'");
								$('#'+settings.iframe+' .tabcontextual').html(_loader);*/
							},													
                            success: function (data) {
															// trace(data);                             
															settings.items = data;
                            },
							error: function(XMLHttpRequest, textStatus, errorThrown) { 
								//alert("Status: " + textStatus); 
								//alert("Error: " + errorThrown); 
								alert("XMLHttpRequest: " + JSON.stringify(XMLHttpRequest));
								settings.items = null;							
						}
                        });/*.always( function() {
               $('#loadingslide').remove();
            })            
			.done(function(res) {
               $('#'+settings.iframe+' .tabcontextual').html(res);
            });		*/	

		}		
				
		function trace(data){

			if ( $( '#message' ).length ==0 ) {

			var container = document.getElementById('page');

			var div = document.createElement('div');
			var Text = document.createTextNode('texto añadido al final del párrafo.');

			div.id='message';
			div.appendChild(Text);
			container.appendChild(div);

			}
			if (typeof data === 'object') {
			$('#message').text(JSON.stringify(data));
			} else {
			$('#message').html(data);
			}
		}; 	

	}		

}(jQuery));     