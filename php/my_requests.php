<?php
session_start();
require_once 'config/database.php';

// Check if user is logged in as resident
if (!isset($_SESSION['user']) || ($_SESSION['role'] !== 'resident' && $_SESSION['role'] !== 'admin')) {
    header('Location: login.php');
    exit();
}

$db = new Database();
$pdo = $db->getConnection();

// Get user's requests
$sql = "SELECT * FROM visitor_requests WHERE resident_username = ? ORDER BY created_at DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute([$_SESSION['username']]);
$requests = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Visitor Requests - J02 Building</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
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
        .btn {
            background-color: #2563eb;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin-bottom: 20px;
        }
        .btn:hover {
            background-color: #1d4ed8;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        th {
            background-color: #f9fafb;
            font-weight: bold;
            color: #374151;
        }
        .status {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-pending {
            background-color: #fef3c7;
            color: #92400e;
        }
        .status-approved {
            background-color: #d1fae5;
            color: #065f46;
        }
        .status-rejected {
            background-color: #fee2e2;
            color: #991b1b;
        }
        .no-requests {
            text-align: center;
            padding: 40px;
            color: #6b7280;
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
            <h1>My Visitor Requests</h1>
            <p>J02 Building Management System</p>
        </div>
        
        <div class="user-info">
            <strong>Logged in as:</strong> <?php echo htmlspecialchars($_SESSION['username']); ?> 
            (<?php echo ucfirst($_SESSION['role']); ?>)
        </div>
        
        <a href="submit_visitor_request.php" class="btn">Submit New Request</a>
        
        <?php if (empty($requests)): ?>
            <div class="no-requests">
                <h3>No visitor requests found</h3>
                <p>You haven't submitted any visitor requests yet.</p>
            </div>
        <?php else: ?>
            <table>
                <thead>
                    <tr>
                        <th>Request ID</th>
                        <th>Visitor Name</th>
                        <th>Phone</th>
                        <th>Visit Date</th>
                        <th>Visit Time</th>
                        <th>Purpose</th>
                        <th>Status</th>
                        <th>Committee Notes</th>
                        <th>Submitted</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($requests as $request): ?>
                        <tr>
                            <td>#<?php echo $request['id']; ?></td>
                            <td><?php echo htmlspecialchars($request['visitor_name']); ?></td>
                            <td><?php echo htmlspecialchars($request['visitor_phone']); ?></td>
                            <td><?php echo date('M j, Y', strtotime($request['visit_date'])); ?></td>
                            <td><?php echo date('g:i A', strtotime($request['visit_time'])); ?></td>
                            <td><?php echo htmlspecialchars($request['purpose']); ?></td>
                            <td>
                                <span class="status status-<?php echo $request['status']; ?>">
                                    <?php echo ucfirst($request['status']); ?>
                                </span>
                            </td>
                            <td><?php echo $request['committee_notes'] ? htmlspecialchars($request['committee_notes']) : '-'; ?></td>
                            <td><?php echo date('M j, Y g:i A', strtotime($request['created_at'])); ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    </div>
</body>
</html>
