import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface LoginScreenProps {
  visible: boolean;
  onLogin: (username: string, password: string) => void;
  closeLoginModal: () => void;
}

const LoginModal: React.FC<LoginScreenProps> = ({ onLogin, closeLoginModal, visible }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    closeLoginModal();
  };

  const handleLogin = () => {
    let isValid = true;

    // Reset error messages
    setUsernameError('');
    setPasswordError('');

    if (username.trim() === '') {
      setUsernameError('Username is required.');
      isValid = false;
    }

    if (password.trim() === '') {
      setPasswordError('Password is required.');
      isValid = false;
    }

    // Proceed if valid
    if (isValid) {
      onLogin(username, password);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={closeLoginModal}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>

            <Text style={styles.title}>Login & verify to enhance your experience</Text>

            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bulletNumber}>1</Text>
                </View>
                <Text style={styles.featureText}>One-click login and verify your phone number</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bulletNumber}>2</Text>
                </View>
                <Text style={styles.featureText}>Customized blocking list and report record</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.buttonFacebook} onPress={handleLogin}>
              <Text style={styles.buttonText}>Sign up with Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonGoogle}>
              <Text style={styles.buttonText}>Sign up with Google</Text>
            </TouchableOpacity>

            <Text style={{fontSize:15}}>OR</Text>

            {/* Username Input */}
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

            {/* Password Input */}
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              autoCapitalize="none"
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            {/* Login Button */}
            <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin} disabled={loading}>
                <View style={styles.buttonContent}>
                    <Text style={styles.buttonText}>Login</Text>
                    {loading && <ActivityIndicator style={styles.loadingIndicator} size="small" color="#fff" />}
                </View>
            </TouchableOpacity>

            <Text style={styles.agreementText}>
              Logging in indicates that you agree to our{' '}
              <Text style={styles.linkText}>Privacy Policy</Text> /{' '}
              <Text style={styles.linkText}>Terms of Service</Text>.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bulletPoint: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#00A500',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  bulletNumber: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 16,
    color: '#333333',
  },
  buttonFacebook: {
    backgroundColor: '#1877F2',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonGoogle: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DDDDDD',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonLogin: {
    backgroundColor: '#00A500',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 12,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  agreementText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
  linkText: {
    color: '#00A500',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },

//   buttonLogin: {
//     backgroundColor: '#007bff',
//     borderRadius: 5,
//     padding: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//   },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
  loadingIndicator: {
    marginLeft: 10,
  },
});

export default LoginModal;