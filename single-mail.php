<!DOCTYPE html>
<html lang="en">
    <head>
		<meta charset="utf-8">
		<?php require "../common_include.php"; ?>

        <!--Stylesheets-->
        <link rel="stylesheet" type="text/css" href="css/master.min.css">

        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js" integrity="sha512-bLT0Qm9VnAYZDflyKcBaQ2gg0hSYNQrJ8RilYldYQ1FxQYoCLtUjuuRuZo+fjqhx/qtq/1itJ0C2ejDxltZVFg==" crossorigin="anonymous"></script>

        <title> MrFriendly Dashboard </title>
    </head>
    <body>
		<!--This webpage does not work without JavaScript enabled-->
		<noscript>
            <p> This page requires JavaScript to be enabled to function.</p>
		</noscript>

		<?php
			//Check if the user is authenticated to visit this page
			$from = "https://intern.mrfriendly.nl/espogmailsync"; 
			//require "../common_login.php";
		?>
        
        <div class="root">
            <!--Navigation bar-->
            <header>
                <div class="nav-container">
                    <a href="https://mrfriendly.nl/"><img alt="logo" class="logo" src="images/logo.png"></a>
                    <ul class="navlist">
                        <li><a href="../dashboard" class="active"> Dashboard </a></li>
                        <li><a href="https://mrfriendly.nl"> Website </a></li>
                    </ul>
                </div>
            </header>
            <main>
                <div id="mailContent">

                </div>
            </main>
        </div>
        <script src="dist/main.js"></script>
        <script>
            EspoGmailSync.getSingleMail();
        </script>
    </body>
</html>