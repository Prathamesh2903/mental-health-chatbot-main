import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Encrypt data using JWT
export const encryptData = (data) => {
  try {
    return jwt.sign({ data }, JWT_SECRET, { expiresIn: '1h' });
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Data encryption failed');
  }
};

// Decrypt data using JWT
export const decryptData = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.data;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Invalid or expired token');
  }
};
