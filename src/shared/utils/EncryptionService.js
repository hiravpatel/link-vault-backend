const crypto = require('crypto');

/**
 * Encryption Service for field-level encryption (AES-256-CBC)
 */
class EncryptionService {
  constructor() {
    this.key = process.env.ENCRYPTION_KEY;
    this.algorithm = 'aes-256-cbc';
    
    if (!this.key || this.key.length !== 64) {
      console.warn('⚠️ ENCRYPTION_KEY is missing or invalid. Data will NOT be encrypted safely.');
    }
  }

  /**
   * Encrypts a string
   * @param {string} text - The text to encrypt
   * @returns {string} - Combined IV and ciphertext: "iv:ciphertext"
   */
  encrypt(text) {
    if (!text || !this.key) return text;

    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.key, 'hex'), iv);
      
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      return `${iv.toString('hex')}:${encrypted}`;
    } catch (error) {
      console.error('Encryption failed:', error);
      return text;
    }
  }

  /**
   * Decrypts a string
   * @param {string} encryptedText - The text to decrypt in format "iv:ciphertext"
   * @returns {string} - Decrypted text
   */
  decrypt(encryptedText) {
    if (!encryptedText || !this.key || !encryptedText.includes(':')) return encryptedText;

    try {
      const [ivHex, ciphertext] = encryptedText.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.key, 'hex'), iv);
      
      let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      // If decryption fails, it might be legacy plain text
      return encryptedText;
    }
  }
}

module.exports = new EncryptionService();
