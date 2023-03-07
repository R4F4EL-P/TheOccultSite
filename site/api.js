const SERVERID = process.env.SERVERID;

const DISCORD_API = `http://discord.com/api/v6`

async function getUserRoles(auth_token) {
    const response = await fetch(`${DISCORD_API}/users/@me/guilds/${SERVERID}/member`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${auth_token}`
        } 
    });
    return response.json();
}

module.exports = { getUserRoles }