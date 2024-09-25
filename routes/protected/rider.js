// Protected route for authenticated users
app.get('/dashboard', authenticateToken, (req, res) => {
    res.json({ message: `Welcome ${req.user.role}! You are authenticated.` });
});
