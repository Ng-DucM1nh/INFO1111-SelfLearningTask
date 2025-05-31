<?php
session_start();
require_once 'config/database.php';

// Check if user is logged in as admin/committee member
if (!isset($_SESSION['user']) || $_SESSION['role'] !== 'admin') {
    header('Location: login.php');
    exit();
}

$db = new Database();
$pdo = $db->getConnection();

$message = '';
$error = '';

// Handle status updates
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_status'])) {
    $request_id = $_POST['request_id'];
    $new_status = $_POST['status'];
    $committee_notes = trim($_POST['committee_notes']);
    
    try {
        $sql = "UPDATE visitor_requests SET status = ?, committee_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$new_status, $committee_notes, $request_id]);
        
        $message = 'Request status updated successfully!';
    } catch(PDOException $e) {
        $error = 'Error updating request: ' . $e->getMessage();
    }
}

// Get all requests
$sql = "SELECT * FROM visitor_requests ORDER BY created_at DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute();
$requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get statistics
$stats_sql = "SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
    SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
    SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
    FROM visitor_requests";
$stats_stmt = $pdo->prepare($stats_sql);
$stats_stmt->execute();
$stats = $stats_stmt->fetch(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Committee Dashboard - J02 Building</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1400px;
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
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border-left: 4px solid #2563eb;
        }
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #2563eb;
        }
        .stat-label {
            color: #64748b;
            margin-top: 5px;
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
        .action-form {
            display: flex;
            gap: 10px;
            align-items: center;
        }
        .action-form select, .action-form input, .action-form button {
            padding: 5px;
            border: 1px solid #d1d5db;
            border-radius: 3px;
        }
        .action-form button {
            background-color: #2563eb;
            color: white;
            cursor: pointer;
        }
        .action-form button:hover {
            background-color: #1d4ed8;
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
            <h1>Committee Dashboard</h1>
            <p>Visitor Request Management - J02 Building</p>
        </div>
        
        <div class="user-info">
            <strong>Logged in as:</strong> <?php echo htmlspecialchars($_SESSION['username']); ?> 
            (Committee Member)
        </div>
        
        <?php if ($message): ?>
            <div class="message success"><?php echo htmlspecialchars($message); ?></div>
        <?php endif; ?>
        
        <?php if ($error): ?>
            <div class="message error"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['total']; ?></div>
                <div class="stat-label">Total Requests</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['pending']; ?></div>
                <div class="stat-label">Pending</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['approved']; ?></div>
                <div class="stat-label">Approved</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['rejected']; ?></div>
                <div class="stat-label">Rejected</div>
            </div>
        </div>
        
        <h2>All Visitor Requests</h2>
        
        <?php if (empty($requests)): ?>
            <p>No visitor requests found.</p>
        <?php else: ?>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Resident</th>
                        <th>Visitor</th>
                        <th>Phone</th>
                        <th>Visit Date/Time</th>
                        <th>Purpose</th>
                        <th>Status</th>
                        <th>Submitted</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($requests as $request): ?>
                        <tr>
                            <td>#<?php echo $request['id']; ?></td>
                            <td><?php echo htmlspecialchars($request['resident_username']); ?></td>
                            <td><?php echo htmlspecialchars($request['visitor_name']); ?></td>
                            <td><?php echo htmlspecialchars($request['visitor_phone']); ?></td>
                            <td>
                                <?php echo date('M j, Y', strtotime($request['visit_date'])); ?><br>
                                <?php echo date('g:i A', strtotime($request['visit_time'])); ?>
                            </td>
                            <td><?php echo htmlspecialchars($request['purpose']); ?></td>
                            <td>
                                <span class="status status-<?php echo $request['status']; ?>">
                                    <?php echo ucfirst($request['status']); ?>
                                </span>
                            </td>
                            <td><?php echo date('M j, Y', strtotime($request['created_at'])); ?></td>
                            <td>
                                <form method="POST" class="action-form">
                                    <input type="hidden" name="request_id" value="<?php echo $request['id']; ?>">
                                    <select name="status">
                                        <option value="pending" <?php echo $request['status'] === 'pending' ? 'selected' : ''; ?>>Pending</option>
                                        <option value="approved" <?php echo $request['status'] === 'approved' ? 'selected' : ''; ?>>Approved</option>
                                        <option value="rejected" <?php echo $request['status'] === 'rejected' ? 'selected' : ''; ?>>Rejected</option>
                                    </select>
                                    <input type="text" name="committee_notes" placeholder="Notes..." 
                                           value="<?php echo htmlspecialchars($request['committee_notes'] ?? ''); ?>">
                                    <button type="submit" name="update_status">Update</button>
                                </form>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    </div>
</body>
</html>
