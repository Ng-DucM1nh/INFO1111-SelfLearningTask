<?php
class Database {
    private $db_file = 'visitor_requests.db';
    private $pdo;
    
    public function __construct() {
        try {
            $this->pdo = new PDO("sqlite:" . $this->db_file);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->createTables();
        } catch(PDOException $e) {
            die("Connection failed: " . $e->getMessage());
        }
    }
    
    private function createTables() {
        // Create visitor_requests table
        $sql = "CREATE TABLE IF NOT EXISTS visitor_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            resident_username VARCHAR(50) NOT NULL,
            visitor_name VARCHAR(100) NOT NULL,
            visitor_phone VARCHAR(20) NOT NULL,
            visit_date DATE NOT NULL,
            visit_time TIME NOT NULL,
            purpose TEXT NOT NULL,
            status VARCHAR(20) DEFAULT 'pending',
            committee_notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )";
        
        $this->pdo->exec($sql);
    }
    
    public function getConnection() {
        return $this->pdo;
    }
}
?>
