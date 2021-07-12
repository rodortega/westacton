# Stock Management System for West Acton Assessment Test
This is an assessment examination for West Acton Stock Management System using PHP and MySQL

**Requirements:**
 - XAMPP(Windows) or MAMP(MacOS)
 - Browser
 - Internet Connection

**Installation**

 1. In XAMPP/MAMP, start Apache and MySQL
 2. Clone the repository and place it inside htdocs (C:/xampp/htdocs).
    You should have a folder *westacton* inside your htdocs.
 3. Go to your browser and type: http://localhost/phpmyadmin in the
    address bar.
 4. Find the *Import* in the navigation bar and click *Choose File*.
 5. Navigate to C:/xampp/htdocs/westacton and select **westacton.sql**.
    Click Go.
 6. In your browser, navigate to:  http://localhost/westacton
    *(westacton if this is the name of your folder in htdocs)*. It should display the Stock Management System

**Notes**

 - If you encountered an error about the database, make sure that you
   imported the database (.sql) without errors.
 - If your MySQL credentials are not the default (username: root, password: *empty*), please change your credentials by navigating to C:/xampp/htdocs/westacton/php/connection.php and edit the following
credentials using any text editor. Save it and open  http://localhost/westacton again.
