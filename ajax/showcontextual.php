<?php
/*
 * @version $Id: HEADER 15930 2011-10-30 15:47:55Z tsmr $
 -------------------------------------------------------------------------
 Tasklists plugin for GLPI
 Copyright (C) 2003-2016 by the Tasklists Development Team.

 -------------------------------------------------------------------------

 LICENSE

 This file is part of Tasklists.

 Tasklists is free software; you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation; either version 2 of the License, or
 (at your option) any later version.

 Tasklists is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with Tasklists. If not, see <http://www.gnu.org/licenses/>.
 --------------------------------------------------------------------------
 */

include("../../../inc/includes.php");

Session::checkLoginUser();

Html::header_nocache();
header("Content-Type: text/html; charset=UTF-8");

unset($options);
if (isset($_GET['id'])) {
	
$id = intval(preg_replace('/[^0-9]+/', '', $_GET["id"]), 10); 	
	
   $options = [
      'from_edit_ajax' => true,
      'id'             => $id,
	  	'itemtype'       => $_GET["itemtype"], 
	 	 	'modal'          => $_GET["target"]
   ];

	$contextual = new PluginContextualContextual();  

	$params = [
	"id" => $_REQUEST["id"],
	];

	$context = $contextual->find($params);

	if (!empty($context)) {

		$item = current($context);  

		$content = $item['content'];

	}
   


         $answer = $content;

      $answer = html_entity_decode($answer);
      $answer = Toolbox::unclean_html_cross_side_scripting_deep($answer);


			echo $answer;

//echo '<div class="center-h"></div>';


//echo '<div class="left vertical ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-vertical ui-helper-clearfix ui-corner-left" style="background-color: rgba(255, 255, 288, 0.9);">'.$answer.'</div>';


    
  // $contextual->display($options);
   

   	
} 