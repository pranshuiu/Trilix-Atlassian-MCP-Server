package crypto

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"io"

	"golang.org/x/crypto/pbkdf2"
)

const (
	saltLength = 16
	nonceLength = 12 // GCM standard nonce size
	keyLength = 32   // AES-256 key size
	iterations = 100000
)

// Encrypt encrypts plaintext using AES-256-GCM with a password-derived key
func Encrypt(plaintext, password string) (string, error) {
	// Generate salt
	salt := make([]byte, saltLength)
	if _, err := io.ReadFull(rand.Reader, salt); err != nil {
		return "", err
	}

	// Derive key from password
	key := pbkdf2.Key([]byte(password), salt, iterations, keyLength, sha256.New)

	// Create cipher
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	// Create GCM
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	// Generate nonce
	nonce := make([]byte, nonceLength)
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}

	// Encrypt
	ciphertext := gcm.Seal(nonce, nonce, []byte(plaintext), nil)

	// Combine salt + ciphertext and encode
	result := append(salt, ciphertext...)
	return base64.StdEncoding.EncodeToString(result), nil
}

// Decrypt decrypts ciphertext using AES-256-GCM
func Decrypt(ciphertext, password string) (string, error) {
	// Decode base64
	data, err := base64.StdEncoding.DecodeString(ciphertext)
	if err != nil {
		return "", err
	}

	if len(data) < saltLength+nonceLength {
		return "", errors.New("ciphertext too short")
	}

	// Extract salt and encrypted data
	salt := data[:saltLength]
	encrypted := data[saltLength:]

	// Derive key
	key := pbkdf2.Key([]byte(password), salt, iterations, keyLength, sha256.New)

	// Create cipher
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	// Create GCM
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	// Extract nonce and ciphertext
	nonce := encrypted[:nonceLength]
	ciphertextBytes := encrypted[nonceLength:]

	// Decrypt
	plaintext, err := gcm.Open(nil, nonce, ciphertextBytes, nil)
	if err != nil {
		return "", err
	}

	return string(plaintext), nil
}

