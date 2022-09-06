<?php
/*
 * @version $Id: HEADER 15930 2011-10-25 10:47:55Z jmd $
 -------------------------------------------------------------------------
 GLPI - Gestionnaire Libre de Parc Informatique
 Copyright (C) 2003-2011 by the INDEPNET Development Team.

 http://indepnet.net/   http://glpi-project.org
 -------------------------------------------------------------------------

 LICENSE

 This file is part of GLPI.

 GLPI is free software; you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation; either version 2 of the License, or
 (at your option) any later version.

 GLPI is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with GLPI. If not, see <http://www.gnu.org/licenses/>.
 --------------------------------------------------------------------------
 */

// ----------------------------------------------------------------------
// Original Author of file: Javier David Marín Zafrilla
// Purpose of file:
// ----------------------------------------------------------------------

include("../../../inc/includes.php");

Session::checkLoginUser();
	global $DB, $CFG_GLPI;
		$messages = new PluginContextualMessage();
		$table = $messages->getTable();
    
		$table2 = PluginContextualMessage_User::getTable();

		$table3 = PluginContextualMessage_Profile::getTable();


		$query = "SELECT a.id, a.name, a.content, IFNULL(b.id, 0) as id_relation FROM $table a
		left join $table2 b on a.id = b.plugin_contextual_messages_id and b.users_id = ".$_SESSION['glpiID']."
		inner join $table3 c on a.id = c.plugin_contextual_messages_id and c.profiles_id = ".$_SESSION['glpiactiveprofile']['id']."
		where (a.begin_date IS NULL
		OR a.begin_date < NOW())
				AND (a.end_date IS NULL
							OR a.end_date > NOW()) and b.id IS NULL";

			//Toolbox::logInFile("procedimientos", " query: " . $query . "\r\n\r\n");
      
			$result = $DB->query($query);
      $number = $DB->numrows($result);
			$item = [];
			$table= "";
			
			if ($number > 0) {
				
				$table .= "<table class='tab_cadrehov'><thead><tr class='tab_bg_2'><th width='400px'>".__('Name')."</th><th width='150px'>".__('Message')."</th></tr></thead><tbody>";			    				
				
				while ($data = $DB->fetch_assoc($result)) {
					$rand = mt_rand();  
					$class_message = ($data["id_relation"]>0 ? "calidad_message_view": "calidad_message" );
					$table.= '<tr class="tab_bg_2"><td>'.$data["name"].'</td><td class="envelope" >';					
					$table.= '<a id="'.$data["id"].'" class="fa fa-envelope '.$class_message.'" href="#"';
					$table .= " onClick=\"".Html::jsGetElementbyID('tooltippopup'.$rand).".dialog('open'); return false;\" ></a>";
					$table.= Ajax::createIframeModalWindow('tooltippopup'.$rand, $messages::getFormURLWithID($data["id"]),
				 ['display' => false,
					'width'   => 750,
					'height'  => 700,
					//'reloadonclose' => true,
					//'title'  =>__('Message'). ": " .$data["name"],
					'title'  =>__('Message'). " de Calidad.",
					]).'</td></tr>';
					
					$table .= Html::scriptBlock("$('#tooltippopup".$rand."').css('overflow','hidden');"); // Eliminamos el doble scroll de la ventana

				}

				$table .= "</tbody></table>";
			} else {
				
				$table .= "<table class='tab_cadrehov'><thead><tr class='tab_bg_2'><th width='400px'><h3><font color='#8c036d'><span class='fa fa-comment-slash'></span> No tiene mensajes nuevos</font></h3></th></tr></thead><tbody></tbody></table>";			    				
			}

				$table .= "<div><a  class='fa fa-inbox' href='" . $CFG_GLPI['root_doc'] . "/plugins/contextual/front/message.php'></a>";
				$table .= "<a href='" . $CFG_GLPI['root_doc'] . "/plugins/contextual/front/message.php'> Ver otros mensajes</a></div>";
			
			


		//	$table .= "</tr></th>";	
			
			

			$item[0]["number"]   = $number;			
			$item[0]["name"] 		 = 'Mensajes de Calidad';
			$item[0]["tooltip"]  = PluginContextualContextual::showToolTip($table, 
																									['display' 				=> false,
																									 'autoclose' 			=> false,
																									 'awesome-class' 	=> 'fa-envelope',
																									 'mode' 					=> "message",
																									 'title' 					=> 'Mensajes de Calidad',																									 
																									 'popup' 					=> false]);	
																								 


		echo json_encode($item); 	  
	
		
		
