<?php
	$credentials=json_decode(file_get_contents('php://input')); // get user fomr josn headers
	
	if($credentials->username=='username' &&  $credentials->password=='1234')
		print 'success';	
		
	else if($credentials->username!='username' &&  $credentials->password=='1234')
		print 'Wrong Username';
		
	else if($credentials->username=='username' &&  $credentials->password!='1234')
		print 'Wrong Password';
		
	else print 'Wrong Username & Wrong Password';
?>