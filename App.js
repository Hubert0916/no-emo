import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';

const Hook = props => {
  const [isClicked, setIsClick] = useState(false);

  return (
    <View>
      <Text>
        {isClicked? 'Hi, ' + props.name: '點我看看'}
      </Text>
      <Button
        onPress={() => {
          setIsClick(true);
        }}
        disabled={isClicked}
        title={isClicked ? '快點做專題' : '這是個按鈕'}
      />
    </View>
  );
};

const App = () => {
  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
    }}>
      <Hook name="sb" />
    </View>
  );
};

export default App;