export const POST = async (request) => {
    const {username, email, password} = await request.json();
}