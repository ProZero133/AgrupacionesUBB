// auth.js
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';

// Function to get the token from cookies
function getTokenFromCookies() {
    const token = Cookies.get('token'); // Adjust the cookie name as needed
    console.log('Token from cookies:', token); // Debugging statement
    return token;
}
  
// Function to decode the token and extract the payload
function decodeToken(token) {
    try {
        return jwtDecode(token); // Use the default import here
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
}
  
// Function to extract the role from the payload
function getUserRole() {
    const token = getTokenFromCookies();
    if (!token) {
        console.error('No token found in cookies');
        return null;
    }
  
    const payload = decodeToken(token);
    if (!payload) {
        console.error('Failed to decode token');
        return null;
    }
  
    return payload.role; // Adjust the key as needed based on your payload structure
}
  
// Example usage
const role = getUserRole();
if (role) {
    console.log('User Role:', role);
} else {
    console.error('No role found in token payload');
}
  
export { getTokenFromCookies, decodeToken, getUserRole };