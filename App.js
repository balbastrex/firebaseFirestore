import { StatusBar } from 'expo-status-bar';
import { React, useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

import firestore from '@react-native-firebase/firestore';

export default function App() {

  const [data, setData] = useState('');
  const [rtData, setRTData] = useState([]);

  const [ nombre, setNombre] = useState('');
  const [ color, setColor] = useState('');
  const [ precio, setPrecio] = useState('');

  async function loadData() {
    try {

      const productos = await firestore().collection('Inventario').get()
      console.log(productos.docs[1].data());
      setData(productos.docs);

    } catch (e) {
      console.log(e);
    }
  }

  async function loadRTData() {
    try {

      const suscriber = firestore().collection('Inventario').onSnapshot(querySnapshot => {

        const productos = [];

        querySnapshot.forEach(documentSnapshot => {
          productos.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id
          })
        })

        setRTData(productos)

      })

      return () => suscriber()

    } catch (e) {
      console.log(e);
    }
  }

  function subirProducto() {
    try {
      firestore().collection('Inventario').add({
        nombre: nombre,
        color: color,
        precio: precio,
      })            
    } catch (e) {
      console.log(e);
    } finally {
      setNombre('');
      setColor('');
      setPrecio('');
    }
  }

  useEffect(() => {
    loadData();
    loadRTData();
  }, [])

  function renderItem({ item }) {
    return (
      <View>
        <Text>{item.data().nombre}</Text>
        <Text>{item.data().color}</Text>
        <Text>{item.data().precio}</Text>
      </View>
    )
  }

  function renderRTItem({ item }) {
    return (
      <View>
        <Text>{item.nombre}</Text>
        <Text>{item.color}</Text>
        <Text>{item.precio}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text>Mis productos:</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

      <Text>Mis productos:</Text>
      <FlatList
        data={rtData}
        renderItem={renderRTItem}
        keyExtractor={item => item.key}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
