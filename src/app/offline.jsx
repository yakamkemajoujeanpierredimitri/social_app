
import NetInfo from '@react-native-community/netinfo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

const OfflinePage = () => {
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [numberToGuess, setNumberToGuess] = useState(null);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRetry = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        router.back();
      } else {
        Alert.alert('Still Offline', 'Please check your internet connection.');
      }
    });
  };

  const handleStartGame = () => {
    const minNum = parseInt(min);
    const maxNum = parseInt(max);
    if (isNaN(minNum) || isNaN(maxNum) || minNum >= maxNum) {
      setMessage('Please enter a valid range.');
      return;
    }
    const randomNum = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    setNumberToGuess(randomNum);
    setMessage(`I'm thinking of a number between ${minNum} and ${maxNum}.`);
    setGuess('');
  };

  const handleGuess = () => {
    const userGuess = parseInt(guess);
    if (isNaN(userGuess)) {
      setMessage('Please enter a valid number.');
      return;
    }

    if (userGuess === numberToGuess) {
      setMessage('You guessed it! Congratulations!');
      setNumberToGuess(null);
    } else if (userGuess < numberToGuess) {
      setMessage('Too low! Try again.');
    } else {
      setMessage('Too high! Try again.');
    }
    setGuess('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You are offline</Text>
      <Text style={styles.subtitle}>Please check your internet connection</Text>
      <Button title="Retry" onPress={handleRetry} />

      <View style={styles.gameContainer}>
        <Text style={styles.gameTitle}>Guess the Number Game</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Min"
            keyboardType="numeric"
            value={min}
            onChangeText={setMin}
          />
          <TextInput
            style={styles.input}
            placeholder="Max"
            keyboardType="numeric"
            value={max}
            onChangeText={setMax}
          />
        </View>
        <Button title="Start Game" onPress={handleStartGame} />

        {numberToGuess !== null && (
          <View style={styles.guessContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your guess"
              keyboardType="numeric"
              value={guess}
              onChangeText={setGuess}
            />
            <Button title="Guess" onPress={handleGuess} />
          </View>
        )}
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b0727ff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
  },
  gameContainer: {
    marginTop: 30,
    alignItems: 'center',
    width: '100%',
    color:'white'
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'white'
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    textAlign: 'center',
    color:'white'
  },
  guessContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
    color:'white'
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: 'yellow',
  },
});

export default OfflinePage;
