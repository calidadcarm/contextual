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

		$contextual = new PluginContextualContextual();
	  	$params = [			
				'OR' => [
					["itemtype" => $_POST["itemtype"]],
					["field" 	 => ['LIKE', '%$%']] //[INCIO] [CRI] JMZ18G MOSTRAR LOS TABS CON AYUDA CONTEXTULA $						
		]];
	  
		$all_contextual = $contextual->find($params);
		$item = [];
		$x=0;
		foreach ($all_contextual as $contextual => $contex) {
			$item[$x]["id"]       = $contex["id"];
			$item[$x]["field"]    = $contex["field"];
			$item[$x]["itemtype"] = $contex["itemtype"];

			$out = "<table class='tab_cadre_fixe'>";	
			$out.= "<tr><td class='left' colspan='4'>";
	
			$out.= "<div id='kbanswer'>";
	
			$answer = html_entity_decode($contex["content"]);
			$answer = Toolbox::unclean_html_cross_side_scripting_deep($answer);	
	
			$callback = function ($matches) {
					//1 => tag name, 2 => existing attributes, 3 => title contents
					$tpl = '<%tag%attrs id="%slug"><a href="#%slug">%icon</a>%title</%tag>';
	
					$title = str_replace(
							 ['%tag', '%attrs', '%slug', '%title', '%icon'],
							 [
											$matches[1],
											$matches[2],
											Toolbox::slugify($matches[3]),
											$matches[3],
											'<svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"/></svg>'
							 ],
							 $tpl
					);
	
					return $title;
			};
			$pattern = '|<(h[1-6]{1})(.?[^>])?>(.+)</h[1-6]{1}>|';
			$answer = preg_replace_callback($pattern, $callback, $answer);
			 
	
			$out.= $answer;
			$out.= "</div>";
			$out.= "</td></tr>";
			$out.= "</table>";
	
			//Toolbox::logInFile("procedimientos", " contex: " . print_r($contex, TRUE) . "\r\n\r\n"); 

			//$item[$x]["tooltip"]  = Toolbox::unclean_html_cross_side_scripting_deep($contex["content"]);
			$item[$x]["tooltip"]  = PluginContextualContextual::showToolTip($out, 
																									['display' => false,
																									 'autoclose' => false,
																									 'awesome-class' => 'fa-question-circle',
																									 'title' => $contex["title"],																									 
																									 'popup' => false]);
			$x++;
		}
		
		echo json_encode($item); 
	  
		
		
		
