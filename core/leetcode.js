// Vercel Serverless Function for LeetCode API
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const response = await fetch('https://leetcode-stats-api.herokuapp.com/pranavgawai', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`LeetCode API returned status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'error') {
            console.error('LeetCode API returned error status:', data.message);
            throw new Error(data.message || 'LeetCode API error');
        }

        // The API returns submissionCalendar as an object
        const submissionCalendar = data.submissionCalendar;

        res.status(200).json(submissionCalendar);

    } catch (error) {
        console.error('Error in /api/leetcode:', error);
        res.status(500).json({ error: 'Failed to fetch LeetCode data' });
    }
}
