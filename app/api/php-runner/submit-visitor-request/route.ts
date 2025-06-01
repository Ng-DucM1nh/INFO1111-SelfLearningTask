import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { PhpWeb } = await import("php-wasm/PhpWeb")
    const php = new PhpWeb()

    const phpCode = `
<?php
session_start();

// Check if user is logged in as resident
if (!isset($_SESSION['user']) || ($_SESSION['role'] !== 'resident' && $_SESSION['role'] !== 'admin')) {
    header('Location: /api/php-runner/login');
    exit();
}

$message = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $visitor_name = trim($_POST['visitor_name']);
    $visitor_phone = trim($_POST['visitor_phone']);
    $visit_date = $_POST['visit_date'];
    $visit_time = $_POST['visit_time'];
    $purpose = trim($_POST['purpose']);
    $resident_username = $_SESSION['username'];
    
    // Validation
    if (empty($visitor_name) || empty($visitor_phone) || empty($visit_date) || empty($visit_time) || empty($purpose)) {
        $error = 'All fields are required.';
    } elseif (strtotime($visit_date) < strtotime(date('Y-m-d'))) {
        $error = 'Visit date cannot be in the past.';
    } else {
        // In a real app, this would save to database
        $message = 'Visitor request submitted successfully! Request ID: ' . rand(1000, 9999);
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Submit Visitor Request - J02 Building</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            color: #2563eb;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #374151;
        }
        input, textarea, select {
            width: 100%;
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 5px;
            font-size: 16px;
        }
        textarea {
            height: 100px;
            resize: vertical;
        }
        .btn {
            background-color: #2563eb;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin-right: 10px;
        }
        .btn:hover {
            background-color: #1d4ed8;
        }
        .btn-secondary {
            background-color: #6b7280;
        }
        .btn-secondary:hover {
            background-color: #4b5563;
        }
        .message {
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        .success {
            background-color: #d1fae5;
            color: #065f46;
            border: 1px solid #a7f3d0;
        }
        .error {
            background-color: #fee2e2;
            color: #991b1b;
            border: 1px solid #fca5a5;
        }
        .user-info {
            background-color: #eff6ff;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Submit Visitor Request</h1>
            <p>J02 Building Management System</p>
        </div>
        
        <div class="user-info">
            <strong>Logged in as:</strong> <?php echo htmlspecialchars($_SESSION['username']); ?> 
            (<?php echo ucfirst($_SESSION['role']); ?>)
        </div>
        
        <?php if ($message): ?>
            <div class="message success"><?php echo htmlspecialchars($message); ?></div>
        <?php endif; ?>
        
        <?php if ($error): ?>
            <div class="message error"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>
        
        <form method="POST" action="">
            <div class="form-group">
                <label for="visitor_name">Visitor Name *</label>
                <input type="text" id="visitor_name" name="visitor_name" required 
                       value="<?php echo isset($_POST['visitor_name']) ? htmlspecialchars($_POST['visitor_name']) : ''; ?>">
            </div>
            
            <div class="form-group">
                <label for="visitor_phone">Visitor Phone Number *</label>
                <input type="tel" id="visitor_phone" name="visitor_phone" required 
                       value="<?php echo isset($_POST['visitor_phone']) ? htmlspecialchars($_POST['visitor_phone']) : ''; ?>">
            </div>
            
            <div class="form-group">
                <label for="visit_date">Visit Date *</label>
                <input type="date" id="visit_date" name="visit_date" required 
                       min="<?php echo date('Y-m-d'); ?>"
                       value="<?php echo isset($_POST['visit_date']) ? htmlspecialchars($_POST['visit_date']) : ''; ?>">
            </div>
            
            <div class="form-group">
                <label for="visit_time">Visit Time *</label>
                <input type="time" id="visit_time" name="visit_time" required 
                       value="<?php echo isset($_POST['visit_time']) ? htmlspecialchars($_POST['visit_time']) : ''; ?>">
            </div>
            
            <div class="form-group">
                <label for="purpose">Purpose of Visit *</label>
                <textarea id="purpose" name="purpose" required 
                          placeholder="Please describe the purpose of the visit..."><?php echo isset($_POST['purpose']) ? htmlspecialchars($_POST['purpose']) : ''; ?></textarea>
            </div>
            
            <button type="submit" class="btn">Submit Request</button>
            <a href="/api/php-runner/my-requests" class="btn btn-secondary">View My Requests</a>
        </form>
    </div>
</body>
</html>
`

    // Set up PHP environment
    php.writeFile("/tmp/submit_visitor_request.php", phpCode)

    // Handle POST data if present
    if (request.method === "POST") {
      const formData = await request.formData()
      const postData: Record<string, string> = {}

      for (const [key, value] of formData.entries()) {
        postData[key] = value.toString()
      }

      php.setPhpVar("_POST", postData)
      php.setPhpVar("_SERVER", { REQUEST_METHOD: "POST" })
    } else {
      php.setPhpVar("_SERVER", { REQUEST_METHOD: "GET" })
    }

    // Mock session data (in a real app, you'd handle sessions properly)
    php.setPhpVar("_SESSION", {
      user: true,
      username: "resident",
      role: "resident",
    })

    // Execute PHP
    const result = await php.run("/tmp/submit_visitor_request.php")

    return new NextResponse(result.text, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    })
  } catch (error) {
    console.error("PHP execution error:", error)
    return new NextResponse("Error executing PHP script", { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
