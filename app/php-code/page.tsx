import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PhpCodePage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">PHP Code Examples</h1>
          <p className="text-gray-500">
            This page shows how you would implement building management features using PHP.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Authentication in PHP</CardTitle>
            <CardDescription>How to implement login functionality in PHP</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
              <code className="text-sm text-gray-800 dark:text-gray-200">{`<?php
// Start session
session_start();

// Database connection
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "building_management";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Process login form
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    // Prepare SQL statement to prevent SQL injection
    $stmt = $conn->prepare("SELECT id, username, password FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
        
        // Verify password
        if (password_verify($password, $row['password'])) {
            // Password is correct, start a new session
            $_SESSION['loggedin'] = true;
            $_SESSION['id'] = $row['id'];
            $_SESSION['username'] = $row['username'];
            
            // Redirect to welcome page
            header("location: dashboard.php");
        } else {
            // Password is not valid
            $login_err = "Invalid username or password.";
        }
    } else {
        // Username doesn't exist
        $login_err = "Invalid username or password.";
    }
    
    $stmt->close();
}

$conn->close();
?>`}</code>
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Displaying Building News in PHP</CardTitle>
            <CardDescription>How to fetch and display news items from a database</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
              <code className="text-sm text-gray-800 dark:text-gray-200">{`<?php
// Database connection
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "building_management";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch news items
$sql = "SELECT id, title, content, date, category, important FROM news ORDER BY date DESC LIMIT 10";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Output data of each row
    while($row = $result->fetch_assoc()) {
        $important_class = $row["important"] ? "important-news" : "";
        echo "<div class='news-item " . $important_class . "'>";
        echo "<h2>" . htmlspecialchars($row["title"]) . "</h2>";
        echo "<p class='date'>" . htmlspecialchars($row["date"]) . "</p>";
        echo "<p class='category'>" . htmlspecialchars($row["category"]) . "</p>";
        echo "<div class='content'>" . htmlspecialchars($row["content"]) . "</div>";
        echo "</div>";
    }
} else {
    echo "No news available";
}

$conn->close();
?>`}</code>
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Property Listings in PHP</CardTitle>
            <CardDescription>How to display properties for sale</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
              <code className="text-sm text-gray-800 dark:text-gray-200">{`<?php
// Database connection
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "building_management";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch properties for sale
$sql = "SELECT p.id, p.unit, p.price, p.bedrooms, p.bathrooms, p.sqft, p.description, p.image_url, 
        c.name as contact_name, c.phone as contact_phone, c.email as contact_email 
        FROM properties p 
        JOIN contacts c ON p.contact_id = c.id 
        WHERE p.status = 'for_sale'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Output data of each row
    while($row = $result->fetch_assoc()) {
        echo "<div class='property-card'>";
        echo "<img src='" . htmlspecialchars($row["image_url"]) . "' alt='Unit " . htmlspecialchars($row["unit"]) . "'>";
        echo "<div class='property-details'>";
        echo "<h2>Unit " . htmlspecialchars($row["unit"]) . "</h2>";
        echo "<p class='price'>" . htmlspecialchars($row["price"]) . "</p>";
        echo "<p>" . htmlspecialchars($row["bedrooms"]) . " Bedrooms | " . 
             htmlspecialchars($row["bathrooms"]) . " Bathrooms | " . 
             htmlspecialchars($row["sqft"]) . " sq ft</p>";
        echo "<p>" . htmlspecialchars($row["description"]) . "</p>";
        echo "<div class='contact-info'>";
        echo "<h3>Contact: " . htmlspecialchars($row["contact_name"]) . "</h3>";
        echo "<p>Phone: " . htmlspecialchars($row["contact_phone"]) . "</p>";
        echo "<p>Email: " . htmlspecialchars($row["contact_email"]) . "</p>";
        echo "</div>";
        echo "</div>";
        echo "</div>";
    }
} else {
    echo "No properties currently for sale";
}

$conn->close();
?>`}</code>
            </pre>
          </CardContent>
        </Card>

        <div className="rounded-lg bg-amber-50 p-4 text-amber-800">
          <h3 className="text-lg font-medium">Important Note</h3>
          <p className="mt-2">
            These are code examples for educational purposes. To actually run PHP code, you would need to:
          </p>
          <ol className="mt-2 list-decimal pl-5">
            <li>Host these PHP files on a server with PHP support (like Apache or Nginx with PHP)</li>
            <li>Set up a MySQL database for storing the data</li>
            <li>Configure proper security measures for production use</li>
          </ol>
          <p className="mt-2">
            Your Next.js application can then link to or embed these PHP pages as shown in the other examples.
          </p>
        </div>
      </div>
    </div>
  )
}
