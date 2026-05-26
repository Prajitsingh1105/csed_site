import http from 'http';

http.get('http://localhost:5000/api/admin/no-dues', (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log("Status Code:", res.statusCode);
        console.log("Headers:", res.headers);
        console.log("Data:", data);
    });
}).on('error', (err) => {
    console.error("Error:", err.message);
});
